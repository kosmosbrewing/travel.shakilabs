import type { SiteFooterLink, SiteFooterSection } from "@shakilabs/ui";

/** 푸터 계산기 목록 — 라우터의 실제 경로만 담는다(리다이렉트 별칭 제외) */
export const FOOTER_SECTIONS: readonly SiteFooterSection[] = [
  {
    title: "여행 준비",
    links: [
    { to: "/luggage", label: "수하물 예산" },
    { to: "/esim", label: "eSIM·로밍 비교" },
    { to: "/exchange", label: "환전 수수료" },
    ],
  },
];

export const FOOTER_ALL_LINK: SiteFooterLink = {
  to: "/all",
  label: "전체 도구 보기 →",
};
