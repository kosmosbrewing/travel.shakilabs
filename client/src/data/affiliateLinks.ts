export type AffiliateItem = {
  label: string;
  href: string;
  description: string;
};

export const AFFILIATE_DISCLOSURE_TEXT =
  "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

function buildAffiliateItem(label: string, rawHref: string | undefined, description: string): AffiliateItem | null {
  const href = rawHref?.trim();
  if (!href) return null;

  return { label, href, description };
}

const maybeTravelAffiliateItems = [
  buildAffiliateItem(
    "캐리어",
    import.meta.env.VITE_COUPANG_LUGGAGE_URL,
    "수하물 계산 결과와 함께 실제 구매 가격을 확인하세요."
  ),
  buildAffiliateItem(
    "eSIM",
    import.meta.env.VITE_COUPANG_ESIM_URL,
    "통신비 비교 후 바로 확인할 수 있는 준비물입니다."
  ),
  buildAffiliateItem(
    "보조배터리",
    import.meta.env.VITE_COUPANG_POWERBANK_URL,
    "출국 전에 많이 함께 구매하는 필수 여행 용품입니다."
  ),
];

export const travelAffiliateItems = maybeTravelAffiliateItems.filter((item): item is AffiliateItem => item !== null);
