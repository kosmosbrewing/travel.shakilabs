import type { ExchangeInput, EsimInput, LuggageInput } from "@/lib/validators";

export const TRAVEL_DATA_UPDATED = "2026년 3월";
export const TRAVEL_DATA_VERIFIED = "2026년 3월 15일";
export const TRAVEL_BADGE_MESSAGE = "2026년 3월 요금표 가정 기준";
export const TRAVEL_ASSUMPTION_NOTE =
  "항공사 이벤트 운임, 통신사 프로모션, 실시간 환율과 카드 우대율은 반영하지 않은 단순 비교용 계산입니다.";

export const LUGGAGE_CARRIERS = [
  { code: "jinair", name: "진에어", rates: { 15: 30_000, 20: 40_000, 25: 55_000 } },
  { code: "jejuair", name: "제주항공", rates: { 15: 35_000, 20: 45_000, 25: 60_000 } },
  { code: "tway", name: "티웨이", rates: { 15: 32_000, 20: 42_000, 25: 57_000 } },
  { code: "airbusan", name: "에어부산", rates: { 15: 34_000, 20: 44_000, 25: 59_000 } },
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

export const BASE_EXCHANGE_RATES = {
  USD: 1_370,
  JPY: 9.1,
  EUR: 1_490,
} as const;

export const BASE_SPREADS = {
  USD: 0.0175,
  JPY: 0.0197,
  EUR: 0.0199,
} as const;

export const EXCHANGE_BANKS = [
  { code: "hana", name: "하나은행", discountRate: 0.9 },
  { code: "kb", name: "KB국민", discountRate: 0.8 },
  { code: "shinhan", name: "신한은행", discountRate: 0.8 },
  { code: "woori", name: "우리은행", discountRate: 0.7 },
  { code: "toss", name: "토스뱅크", discountRate: 0.9 },
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
