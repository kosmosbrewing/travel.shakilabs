// 1단계: 실제 렌더 텍스트 전수 수집 (docs/BRAND_FONT_SUBSET.md §3).
//
// 소스(.vue)를 grep하지 않는다 — 예: .retro-title 은 @apply로 font-brand를 물려받는데
// 템플릿에 "font-brand" 리터럴이 없어 소스 grep으로는 못 찾는다. 대신 빌드된 정적
// 페이지를 브라우저로 열어, 실제 computed font-family가 GmarketSans로 해석되는
// "리프" 요소(자식 element가 없는 요소)만 전수 스캔한다.
//
// 사용법:
//   npm run build                      # dist/ 생성 (base가 /travel/ 이므로 그대로 둔다)
//   node scripts/collect-rendered-charset.mjs [baseUrl]
//     baseUrl 기본값: http://localhost:4173/travel (vite preview 기준)
//
// 결과는 font-subset-manifest.json에 renderedTexts/charset으로 반영구 저장된다.
// 이 스크립트는 playwright-core에 의존하지만, 그 결과(manifest)만 있으면 이후
// subset-fonts.mjs / verify-fonts.mjs는 playwright 없이도 그대로 동작한다 —
// 즉 이 스크립트는 UI 문구가 바뀔 때만 수동으로 다시 돌리는 유지보수 도구다.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { manifestPath, NUMERAL_CHARACTERS } from "./font-subset-config.mjs";
import { SEO_ROUTES } from "./seo-routes.mjs";

const baseUrl = (process.argv[2] || "http://localhost:4173/travel").replace(/\/$/, "");

function hash(content) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright-core"));
  } catch {
    throw new Error(
      "playwright-core가 없다. `npm install --no-save playwright-core`로 설치하고 다시 실행해라 " +
        "(Chromium 바이너리는 ~/Library/Caches/ms-playwright/ 등에 이미 있다면 재다운로드 불필요)."
    );
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const renderedTexts = new Set();

  try {
    for (const route of SEO_ROUTES) {
      const url = `${baseUrl}${route}`;
      await page.goto(url, { waitUntil: "networkidle" });

      const hits = await page.evaluate(() => {
        function isLeaf(el) {
          for (const _child of el.children) return false;
          return true;
        }

        const found = [];
        for (const el of document.body.querySelectorAll("*")) {
          if (!isLeaf(el)) continue;
          const text = (el.textContent || "").trim();
          if (!text) continue;

          const family = getComputedStyle(el).fontFamily || "";
          const first = family.split(",")[0].trim().replace(/^["']|["']$/g, "");
          if (first === "GmarketSans") found.push(text);
        }
        return found;
      });

      for (const text of hits) renderedTexts.add(text);
    }
  } finally {
    await browser.close();
  }

  const sortedTexts = [...renderedTexts].sort();
  const charset = new Set(NUMERAL_CHARACTERS);
  for (const text of sortedTexts) {
    for (const char of text) charset.add(char);
  }
  const sortedCharset = [...charset].sort().join("");

  // 기존 manifest가 있으면 fonts[](서브셋 산출물 통계)는 보존한다 — subset-fonts.mjs가
  // 그 필드만 다시 채운다. 없으면 빈 배열로 시작.
  const existing = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : { fonts: [] };

  const manifest = {
    schemaVersion: 1,
    // §3: "실제로 GmarketSans로 렌더되는 문자만" — 렌더 수집한 텍스트 원문을 그대로
    // 남겨 재현·감사 가능하게 한다.
    renderedTexts: sortedTexts,
    numeralCharacters: NUMERAL_CHARACTERS,
    charset: sortedCharset,
    characterCount: sortedCharset.length,
    characterSha256: hash(sortedCharset),
    collectedAt: new Date().toISOString().slice(0, 10),
    collectedRoutes: SEO_ROUTES,
    fonts: existing.fonts ?? [],
  };

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `Collected ${sortedTexts.length} rendered texts across ${SEO_ROUTES.length} routes -> ${sortedCharset.length} unique characters.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
