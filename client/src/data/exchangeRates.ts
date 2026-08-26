// 환전 계산기가 쓰는 환율. 이 앱은 환율을 자동으로 가져오지 않는다.
//
// 예전에는 여기에 원격 환율 로더(loadTravelExchangeRates)가 있었지만 프로덕션에서
// 단 한 번도 실행된 적이 없다. VITE_ENABLE_REMOTE_CONSTANTS가 꺼져 있어 번들러가
// 함수 본문을 통째로 지웠고(배포된 청크에 `async function f(e=!1){}`만 남아 있었다),
// 백엔드도 배포돼 있지 않아 /api/common/rates/latest는 404였다. 그런데도 화면은
// "실시간 환율 연동을 시도한다"·"API 응답 실패 시 기본값"이라고 말하고 있었다.
// 호출 자체가 없으므로 둘 다 거짓이었다.
//
// 죽은 코드가 남아 있는 한 문구가 다시 그쪽으로 끌려간다. 그래서 지운다.
// 되살리려면 백엔드 배포 + VITE_API_URL/VITE_ENABLE_REMOTE_CONSTANTS 설정 +
// 아래 문구 교체가 한 번에 필요하다(이전 구현은 git 이력에 남아 있다).

export type TravelCurrency = "USD" | "JPY" | "EUR";

/**
 * 환율 기준일 — 아래 BASE_EXCHANGE_RATES를 사람이 확인해 적어 넣은 시점.
 * 값과 날짜는 반드시 같이 고쳐야 한다. 한쪽만 바꾸면 화면의 날짜가 그 순간 거짓이 된다.
 */
export const EXCHANGE_RATE_BASE_DATE = "2026년 3월";

/**
 * 비교용 고정 환율. 자동 수집 수단이 없어 갱신은 전부 수동이다.
 * 우대율 비교가 목적이라 절대값보다 세 통화의 상대 크기가 중요하다.
 */
export const BASE_EXCHANGE_RATES: Record<TravelCurrency, number> = {
  USD: 1_370,
  JPY: 9.1,
  EUR: 1_490,
};

const won = (value: number) => `${Math.round(value).toLocaleString("ko-KR")}원`;

// 화면 문구가 상수와 어긋나지 못하게 값에서 파생시킨다 — 환율을 고치면 문구도 같이 바뀐다.
export const EXCHANGE_RATE_SUMMARY = `1달러 ${won(BASE_EXCHANGE_RATES.USD)} · 100엔 ${won(
  BASE_EXCHANGE_RATES.JPY * 100
)} · 1유로 ${won(BASE_EXCHANGE_RATES.EUR)}`;

export const EXCHANGE_RATE_STATUS = {
  // 상단 배지. 다른 계산기 배지는 "요금 가정 점검일"이지만 이 배지만 "환율 기준일"이다.
  // 두 날짜는 확인 시점이 달라 하나로 묶을 수 없다(/about에도 그렇게 적어 두었다).
  lastUpdated: `환율 기준일 ${EXCHANGE_RATE_BASE_DATE} · 고정 가정값`,
  source: `${EXCHANGE_RATE_BASE_DATE}에 사람이 확인해 이 앱에 적어 둔 비교용 고정 환율입니다 (${EXCHANGE_RATE_SUMMARY}). 실시간 환율은 제공하지 않으며, 이 값은 자동으로 갱신되지 않습니다.`,
} as const;
