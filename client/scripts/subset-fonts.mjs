// 2~4단계: font-subset-manifest.json에 저장된 문자셋(collect-rendered-charset.mjs가
// 렌더 수집한 결과)으로 GmarketSans 서브셋을 재생성한다.
//
// docs/BRAND_FONT_SUBSET.md §4: `--no-hinting`만 쓴다. `--layout-features=''`는
// 쓰지 마라 — 커널링(GPOS)이 날아간다. 다른 플래그를 추가하지 않는다.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fontJobs, manifestPath } from "./font-subset-config.mjs";

function hash(content) {
  return createHash("sha256").update(content).digest("hex");
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (!manifest.charset) {
  throw new Error(
    "manifest에 charset이 없다. 먼저 `node scripts/collect-rendered-charset.mjs`로 렌더 텍스트를 수집해라."
  );
}

const temporaryRoot = mkdtempSync(join(tmpdir(), "travel-fonts-"));
const characterFile = resolve(temporaryRoot, "characters.txt");

try {
  writeFileSync(characterFile, manifest.charset);

  const fonts = fontJobs.map((fontJob) => {
    const result = spawnSync("python3", [
      "-m",
      "fontTools.subset",
      fontJob.source,
      `--text-file=${characterFile}`,
      "--flavor=woff2",
      `--output-file=${fontJob.output}`,
      "--no-hinting",
    ], { encoding: "utf8" });

    if (result.error || result.status !== 0) {
      const detail = result.error?.message ?? result.stderr.trim();
      throw new Error(`Font subsetting failed for ${fontJob.publicName}: ${detail}`);
    }

    const content = readFileSync(fontJob.output);
    if (content.byteLength > fontJob.maxBytes) {
      throw new Error(
        `${fontJob.publicName} is ${content.byteLength}B, exceeds its ${fontJob.maxBytes}B budget`
      );
    }

    return {
      publicName: fontJob.publicName,
      bytes: content.byteLength,
      sha256: hash(content),
    };
  });

  const nextManifest = { ...manifest, fonts };
  writeFileSync(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`);
  console.log(`Generated ${fonts.length} font(s) for ${manifest.characterCount} characters.`);
  for (const font of fonts) {
    console.log(`  ${font.publicName}: ${font.bytes}B`);
  }
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
