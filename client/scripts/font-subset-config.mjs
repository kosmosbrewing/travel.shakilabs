// GmarketSans 서브셋 파이프라인 공통 설정 (BL-020 개정판, docs/BRAND_FONT_SUBSET.md).
//
// finance(02.finance/client/scripts/font-subset-config.mjs)와 파일 분리·manifest
// 스키마 "구조"는 같지만, 문자 수집 방식은 의도적으로 다르다 — finance의
// collectFontCharacters()는 .vue 소스를 grep해 과대 수집한다(주석 속 한글까지 포함).
// 이 앱은 "실제로 GmarketSans로 렌더되는 문자만" 담아야 하므로(§3), 문자셋은 소스에서
// 유도하지 않고 scripts/collect-rendered-charset.mjs가 빌드 산출물을 Playwright로
// 크롤링해 만든 결과를 font-subset-manifest.json에 반영구 저장한 값을 그대로 쓴다.
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
export const clientRoot = resolve(scriptRoot, "..");
export const manifestPath = resolve(scriptRoot, "font-subset-manifest.json");

// 히어로 수치(카운트업 포함)가 만들어낼 수 있는 모든 문자. 렌더 수집은 최종 프레임의
// 텍스트만 잡으므로, 애니메이션 중간 프레임에서만 나타나는 자리수·콤마 변화는 이 상수가
// 커버한다. docs/BRAND_FONT_SUBSET.md §3 원문 그대로 — 임의로 고치지 마라.
export const NUMERAL_CHARACTERS =
  "0123456789,.%+-~/()· 원억만천조년월일개회건세명점배급시간분초";

// GmarketSans는 제목(h1, .retro-title)과 히어로 절감액(TravelSummaryCard)에만 쓰인다.
// Pretendard는 별도로 수동 관리되는 서브셋이라 이 파이프라인 대상이 아니다.
export const fontJobs = [
  {
    source: resolve(clientRoot, "public/fonts/GmarketSansBold.woff"),
    output: resolve(clientRoot, "public/fonts/GmarketSansBold-brand-v1.woff2"),
    publicName: "GmarketSansBold-brand-v1.woff2",
    // 실측 7,984B(2026-09-15). 룩앤필 변경 없이 제목을 유지하는 비용은 8KB 내외라는
    // BL-020 근거(§2, 채택안 10,892B)에 맞춰 여유를 둔 예산이다.
    maxBytes: 24 * 1024,
  },
];
