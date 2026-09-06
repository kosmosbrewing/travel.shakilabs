import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { EXCHANGE_RATE_BASE_DATE } from "./exchangeRates.ts";
import { TRAVEL_DATA_VERIFIED } from "./travelData.ts";

// llms.txt는 크롤러가 읽는 정적 텍스트 파일이라 빌드 시 아무것도 생성해주지 않는다.
// 여기서 실제 계산기 상수를 import해 텍스트와 직접 대조해야 한다 — llms.txt 쪽 날짜를
// 상수에서 파생시켜 버리면 상수를 바꿔도 둘이 같이 움직여 게이트가 아무것도 못 잡는다.
// .mjs로 두는 이유는 themeBootstrap.test.mjs와 같다: node:fs를 쓰는 테스트를
// tsconfig(src만 include)의 타입 체크 대상 밖에 둬서 vue-tsc가 node 타입을 요구하지 않게 한다.

const llmsTxt = readFileSync(new URL("../../public/llms.txt", import.meta.url), "utf8");

// seo-routes.mjs는 사이트맵·프리렌더가 실제로 쓰는 그 파일이다. 정적 import 대신
// 소스 텍스트에서 path 리터럴을 뽑아 대조해도 되지만, 여기서는 같은 모듈 형식(.mjs)이라
// 그냥 직접 import한다.
const { SEO_ROUTES } = await import("../../scripts/seo-routes.mjs");

describe("client/public/llms.txt", () => {
  it("링크된 경로가 seo-routes.mjs와 정확히 일치한다 (빠짐도 추가도 없이)", () => {
    const linkedPaths = [
      ...llmsTxt.matchAll(/\]\(https:\/\/shakilabs\.com\/travel([^)]*)\)/g),
    ].map((m) => m[1] || "/");

    const missing = SEO_ROUTES.filter((route) => !linkedPaths.includes(route));
    const extra = linkedPaths.filter((route) => !SEO_ROUTES.includes(route));

    expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    expect(linkedPaths.length).toBe(SEO_ROUTES.length);
  });

  it("사업자 공식 데이터를 자동 수집한다는 표현이 없다 (부정문 안 사용은 허용)", () => {
    const forbidden = ["공식 요금", "고시환율", "실시간", "자동 갱신", "매일 갱신", "매주 갱신"];
    const negationMarkers = ["않습니다", "않으며", "없으므로", "제공하지 않", "아니"];

    const offendingLines = [];
    llmsTxt.split("\n").forEach((line) => {
      forbidden.forEach((phrase) => {
        if (line.includes(phrase) && !negationMarkers.some((marker) => line.includes(marker))) {
          offendingLines.push(`[${phrase}] ${line.trim()}`);
        }
      });
    });

    expect(offendingLines).toEqual([]);
  });

  it("적힌 확인일이 계산기가 실제로 쓰는 상수와 같다", () => {
    // AboutView.vue·LuggageView.vue·환전 계산기 배지가 실제로 렌더하는 값 그대로다.
    // 상수가 바뀌었는데 이 문자열을 안 고치면 이 테스트가 그 순간 red가 되어야 한다.
    expect(llmsTxt).toContain(TRAVEL_DATA_VERIFIED);
    expect(llmsTxt).toContain(EXCHANGE_RATE_BASE_DATE);
  });
});
