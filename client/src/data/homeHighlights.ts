// 홈(/) 전용 데이터.
//
// 왜 별도 파일인가: /all(TravelToolsView)은 TRAVEL_HOME_GUIDE로 "각 계산기가 무엇을
// 계산하는지"를 서술한다. 홈은 그 설명을 반복하지 않고 "질문 → 계산기" 진입과 요금
// 가정값 요약을 맡는다. 두 화면이 같은 문장을 쓰면 중복 블록 감사에 걸린다.
//
// 수치는 literal로 적지 않고 계산기가 쓰는 상수에서 파생시킨다 — 요금 가정을 갱신했을 때
// 홈 요약표만 옛 숫자로 남는 사고를 원천 차단한다.
import {
  BASE_SPREADS,
  ESIM_PLANS,
  EXCHANGE_BANKS,
  LUGGAGE_CARRIERS,
  POCKET_WIFI_DAILY_PRICE,
  POCKET_WIFI_ORDER_FEE,
  POCKET_WIFI_SHARE_CAPACITY,
  ROAMING_DAILY_PRICE,
  TRAVEL_DATA_VERIFIED,
} from "@/data/travelData";
import type { TravelToolKey } from "@/data/travelNavigation";

export const TRAVEL_HOME_UPDATED = TRAVEL_DATA_VERIFIED;

export interface HomeIntent {
  key: TravelToolKey;
  question: string;
  path: string;
  action: string;
}

/** "지금 궁금한 질문"에서 계산기로 진입시키는 목록 (3개 계산기 전부 연결) */
export const HOME_INTENTS: readonly HomeIntent[] = [
  {
    key: "luggage",
    question: "위탁수하물, 지금 미리 사는 게 정말 싼가요?",
    path: "/luggage",
    action: "수하물 예산 계산",
  },
  {
    key: "esim",
    question: "현지 데이터, eSIM·로밍·포켓와이파이 중 뭘 골라야 하나요?",
    path: "/esim",
    action: "통신 옵션 비교",
  },
  {
    key: "exchange",
    question: "우대율 90%면 실제로 얼마를 아끼는 건가요?",
    path: "/exchange",
    action: "환전 수수료 비교",
  },
];

export interface HomeCostRow {
  item: string;
  value: string;
  note: string;
}

const won = (value: number): string => `${value.toLocaleString("ko-KR")}원`;
const percent = (rate: number): string => `${Number((rate * 100).toFixed(2))}%`;

/** 무게 구간별 위탁수하물 예산 범위를 요금표에서 직접 뽑는다 */
function luggageRange(weight: 15 | 20 | 25): string {
  const prices = LUGGAGE_CARRIERS.map((carrier) => carrier.rates[weight]);
  return `${won(Math.min(...prices))} ~ ${won(Math.max(...prices))}`;
}

function esimPrice(name: string): number {
  const plan = ESIM_PLANS.find((candidate) => candidate.name === name);
  // 요금제 이름이 바뀌면 표에 undefined가 실리는 대신 빌드가 멈추는 편이 낫다
  if (!plan) throw new Error(`Unknown eSIM plan: ${name}`);
  return plan.price;
}

/**
 * 홈에만 있는 요금 가정 요약표.
 * 계산기별 화면에 흩어진 기준값을 한 화면에서 훑을 수 있게 모은 것으로,
 * 값은 전부 계산 로직이 쓰는 상수에서 파생된다.
 */
export const HOME_COST_TABLE: readonly HomeCostRow[] = [
  {
    item: "위탁수하물 15kg (1개·편도)",
    value: luggageRange(15),
    note: "낮음·중간·높음 예산 가정의 범위입니다",
  },
  {
    item: "위탁수하물 20kg (1개·편도)",
    value: luggageRange(20),
    note: "무게 구간이 하나 올라갈 때마다 금액대가 함께 올라갑니다",
  },
  {
    item: "위탁수하물 25kg (1개·편도)",
    value: luggageRange(25),
    note: "가방을 나누는 것과 무게를 올리는 것 중 유리한 쪽이 갈립니다",
  },
  {
    item: "eSIM 5GB / 7일",
    value: won(esimPrice("5GB / 7일")),
    note: "일주일 내외 단독 여행에서 기준선이 되는 요금대입니다",
  },
  {
    item: "eSIM 무제한 / 30일",
    value: won(esimPrice("무제한 / 30일")),
    note: "장기 체류에서는 용량제보다 무제한이 뒤집는 지점이 생깁니다",
  },
  {
    item: "통신사 로밍 (1일)",
    value: won(ROAMING_DAILY_PRICE),
    note: "일수와 인원에 그대로 곱해집니다",
  },
  {
    item: "포켓와이파이 (1일)",
    value: won(POCKET_WIFI_DAILY_PRICE),
    note: `주문 수수료 ${won(POCKET_WIFI_ORDER_FEE)} 별도, 최대 ${POCKET_WIFI_SHARE_CAPACITY}인 공유`,
  },
  {
    item: "환전 스프레드 (USD / JPY / EUR)",
    value: `${percent(BASE_SPREADS.USD)} / ${percent(BASE_SPREADS.JPY)} / ${percent(BASE_SPREADS.EUR)}`,
    note: "우대율을 적용하기 전의 기본 수수료율입니다",
  },
  {
    item: "비교 대상 우대율",
    value: EXCHANGE_BANKS.map((bank) => percent(bank.discountRate)).join(" / "),
    note: "우대율은 스프레드를 깎는 비율이지 수수료가 0이 되는 것은 아닙니다",
  },
];

/**
 * 홈에서만 다루는 각도: 세 비용이 "어디에 숨어 있는지"를 구조로 설명한다.
 * /all의 가이드는 계산기가 무엇을 계산하는지(입력·출력)를 설명하므로 층이 다르다.
 */
