// 7단계 검증을 상시 게이트로 고정한다.
//
// document.fonts.check()는 쓰지 않는다 — 이 환경의 Chromium은 무엇을 물어도 true를
// 반환해(docs/BRAND_FONT_SUBSET.md §6) 실패할 수 없는 가짜 게이트가 된다. 대신
// fontTools cmap 전수 대조로만 판정한다: manifest.charset(렌더 수집 결과, 소스 grep
// 아님)의 모든 코드포인트가 실제로 배포되는 폰트의 cmap에 있는지 확인한다.
//
// cmap은 python fontTools가 아니라 순수 Node로 읽는다 — 이 게이트는 `npm run build`에
// 얹혀 Vercel에서도 도는데 그쪽 빌드 이미지에 fontTools(pip 패키지)가 없다.
// python을 부르면 게이트가 아니라 배포 장애가 된다.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fontJobs, manifestPath } from "./font-subset-config.mjs";
import { woff2CodePoints } from "./woff2-cmap.mjs";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const clientRoot = resolve(scriptRoot, "..");
const distRoot = resolve(clientRoot, "dist");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hash(content) {
  return createHash("sha256").update(content).digest("hex");
}

assert(existsSync(manifestPath), "font-subset-manifest.json이 없다. npm run fonts:collect && npm run fonts:subset을 먼저 실행해라.");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
assert(manifest.charset, "manifest에 charset이 없다.");
assert(
  manifest.characterSha256 === hash(manifest.charset),
  "manifest.charset과 characterSha256이 어긋난다 — manifest가 손상됐다."
);

const manifestFonts = new Map((manifest.fonts ?? []).map((font) => [font.publicName, font]));

const cssRoot = resolve(distRoot, "assets");
const css = readdirSync(cssRoot)
  .filter((file) => file.endsWith(".css"))
  .map((file) => readFileSync(resolve(cssRoot, file), "utf8"))
  .join("\n");

for (const fontJob of fontJobs) {
  const fontPath = resolve(distRoot, "fonts", fontJob.publicName);
  assert(existsSync(fontPath), `Missing shipped font: ${fontJob.publicName}`);

  const font = readFileSync(fontPath);
  assert(font.subarray(0, 4).toString("ascii") === "wOF2", `${fontJob.publicName} must be WOFF2`);
  assert(
    font.byteLength <= fontJob.maxBytes,
    `${fontJob.publicName} is ${font.byteLength}B, exceeds its ${fontJob.maxBytes}B budget`
  );

  const manifestFont = manifestFonts.get(fontJob.publicName);
  assert(manifestFont, `manifest에 ${fontJob.publicName} 기록이 없다 — npm run fonts:subset을 먼저 실행해라.`);
  assert(manifestFont.bytes === font.byteLength, `${fontJob.publicName} manifest bytes가 낡았다`);
  assert(manifestFont.sha256 === hash(font), `${fontJob.publicName} manifest sha256이 낡았다`);

  // base가 "/travel/"이므로 참조는 그 접두어를 포함해야 한다(vite.config.ts base).
  assert(
    css.includes(`/travel/fonts/${fontJob.publicName}`),
    `Built CSS misses /travel/fonts/${fontJob.publicName}`
  );

  // 구 숫자 전용 서브셋이 더 이상 참조되지 않는지 역방향으로 확인
  assert(
    !css.includes("GmarketSansBold-num-v1"),
    "구 숫자 전용 서브셋(GmarketSansBold-num-v1.woff2)이 여전히 CSS에서 참조된다"
  );

  // cmap 전수 대조 — §6: document.fonts.check() 금지, 산출물 직접 파싱만 유효하다.
  const codePoints = woff2CodePoints(font);
  // charset이 아니라 renderedTexts(실측 원본)를 대조한다 — charset은 서브셋을 만든
  // 입력이라 그걸로 재면 "요청한 글자가 들어갔나"만 보는 항등식에 가까워진다.
  // 렌더 실측과 대조해야 수집 누락까지 잡힌다.
  const renderedCharacters = new Set(
    [...(manifest.renderedTexts ?? []), manifest.numeralCharacters ?? ""].flatMap((text) => [...text])
  );
  const missing = [...renderedCharacters]
    .filter((character) => !codePoints.has(character.codePointAt(0)))
    .sort();
  assert(
    missing.length === 0,
    `${fontJob.publicName}에 누락된 문자가 있다 (서체 혼합 위험): ${JSON.stringify(missing)}`
  );
}

console.log(`Validated ${fontJobs.length} subset font(s): cmap coverage 0 missing, byte budgets OK, CSS wiring OK.`);
