import type { ExchangeInput, EsimInput, LuggageInput } from "@/lib/validators";

export const TRAVEL_DATA_UPDATED = "2026년 7월";
export const TRAVEL_DATA_VERIFIED = "2026년 7월 10일";
export const TRAVEL_BADGE_MESSAGE = "2026-07-10 비교 가정 점검";
export const TRAVEL_ASSUMPTION_NOTE =
  "표시 금액은 견적이 아닌 예산 시나리오입니다. 노선·운임·무료 수하물·구매 시점, 통신사·판매처 프로모션, 실시간 환율은 최종 결제 전에 공식 페이지에서 확인하세요.";

export const LUGGAGE_CARRIERS = [
  { code: "budget-low", name: "낮은 예산 가정", rates: { 15: 30_000, 20: 40_000, 25: 55_000 } },
  { code: "budget-mid", name: "중간 예산 가정", rates: { 15: 35_000, 20: 45_000, 25: 60_000 } },
  { code: "budget-high", name: "높은 예산 가정", rates: { 15: 60_000, 20: 80_000, 25: 100_000 } },
] as const;

export const LUGGAGE_SOURCES = [
  { name: "진에어", url: "https://www.jinair.com/flight/baggage" },
  { name: "제주항공", url: "https://www.jejuair.net/ko/linkService/boardingProcessGuide/prePurchaseBaggage.do" },
  { name: "티웨이항공", url: "https://www.twayair.com/app/serviceInfo/luggageAmtCal" },
  { name: "에어부산", url: "https://www.airbusan.com/content/common/service/luggagePurchase" },
] as const;

export const ESIM_PLANS = [
  { name: "3GB / 5일", dataGb: 3, days: 5, price: 9_000 },
  { name: "5GB / 7일", dataGb: 5, days: 7, price: 14_000 },
  { name: "10GB / 10일", dataGb: 10, days: 10, price: 20_000 },
  { name: "15GB / 15일", dataGb: 15, days: 15, price: 28_000 },
  { name: "20GB / 30일", dataGb: 20, days: 30, price: 34_000 },
  { name: "무제한 / 30일", dataGb: 999, days: 30, price: 39_000 },
] as const;

export const ROAMING_DAILY_PRICE = 11_000;
export const POCKET_WIFI_DAILY_PRICE = 7_500;
export const POCKET_WIFI_ORDER_FEE = 8_000;
export const POCKET_WIFI_SHARE_CAPACITY = 3;

export const BASE_SPREADS = {
  USD: 0.0175,
  JPY: 0.0197,
  EUR: 0.0199,
} as const;

export const EXCHANGE_BANKS = [
  { code: "discount-90", name: "우대율 90% 조건", discountRate: 0.9 },
  { code: "discount-80", name: "우대율 80% 조건", discountRate: 0.8 },
  { code: "discount-70", name: "우대율 70% 조건", discountRate: 0.7 },
] as const;

export const luggagePresets: ReadonlyArray<{
  key: string;
  label: string;
  description: string;
  input: LuggageInput;
}> = [
  {
    key: "weekend-couple",
    label: "커플 2박",
    description: "20kg 1개씩 들고 가는 왕복 일정",
    input: { travelers: 2, bagsPerTraveler: 1, bagWeightKg: 20, tripSegments: 2 },
  },
  {
    key: "family-trip",
    label: "가족 4인",
    description: "25kg 가방 1개씩 맡기는 성수기 시나리오",
    input: { travelers: 4, bagsPerTraveler: 1, bagWeightKg: 25, tripSegments: 2 },
  },
];

export const esimPresets: ReadonlyArray<{
  key: string;
  label: string;
  description: string;
  input: EsimInput;
}> = [
  {
    key: "solo-japan",
    label: "혼자 5일",
    description: "총 6GB 정도 쓰는 일반 여행자",
    input: { tripDays: 5, totalDataGb: 6, travelers: 1 },
  },
  {
    key: "family-summer",
    label: "가족 4인 7일",
    description: "지도와 사진 업로드가 많은 여행",
    input: { tripDays: 7, totalDataGb: 64, travelers: 4 },
  },
];

export const exchangePresets: ReadonlyArray<{
  key: string;
  label: string;
  description: string;
  input: ExchangeInput;
}> = [
  {
    key: "tokyo-pocket",
    label: "도쿄 70만원",
    description: "JPY 환전이 필요한 짧은 일정",
    input: { amountKrw: 700_000, currency: "JPY" },
  },
  {
    key: "europe-long",
    label: "유럽 200만원",
    description: "EUR 환전 수수료 차이가 크게 나는 구간",
    input: { amountKrw: 2_000_000, currency: "EUR" },
  },
];
