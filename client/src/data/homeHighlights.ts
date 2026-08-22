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

export interface HomeMechanism {
  key: string;
  title: string;
  body: string;
}

/**
 * 홈에서만 다루는 각도: 세 비용이 "어디에 숨어 있는지"를 구조로 설명한다.
 * /all의 가이드는 계산기가 무엇을 계산하는지(입력·출력)를 설명하므로 층이 다르다.
 */
export const HOME_MECHANISMS: readonly HomeMechanism[] = [
  {
    key: "luggage",
    title: "수하물 — 운임에 안 들어 있어서",
    body: "LCC 특가 운임은 좌석 값만 받는 구조라 위탁수하물이 별도 상품입니다. 문제는 같은 무게라도 언제 사느냐에 따라 값이 달라진다는 점입니다. 사전 구매 창구가 닫히면 공항 카운터 요금만 남고, 그 시점에는 선택지가 없습니다. 가방 두 개를 각각 15kg로 부칠지 하나를 25kg로 올릴지도 요금표의 구간 폭에 따라 답이 달라져서, 무게를 재기 전에 금액대부터 확인해 두는 편이 낫습니다.",
  },
  {
    key: "esim",
    title: "통신 — 하루 단위로 새어서",
    body: "로밍은 데이터를 얼마나 쓰든 하루치가 붙고, 그게 인원수만큼 곱해집니다. eSIM은 반대로 용량을 먼저 사두는 방식이라 남으면 버리는 돈이 됩니다. 포켓와이파이는 여러 명이 한 기기를 나눠 쓸 수 있어 인원이 늘수록 1인당 단가가 떨어지지만, 기기를 들고 다녀야 하고 주문 수수료가 따로 붙습니다. 세 방식은 일수·용량·인원 중 어느 축이 큰지에 따라 순위가 뒤집힙니다.",
  },
  {
    key: "exchange",
    title: "환전 — 환율 안에 섞여 있어서",
    body: "환전 수수료는 별도 항목으로 청구되지 않고 적용 환율에 스프레드로 얹혀 옵니다. 영수증에 '수수료'라는 줄이 없으니 얼마를 냈는지 체감되지 않는 구조입니다. 우대율은 이 스프레드를 깎아 주는 비율이라 90% 우대여도 수수료가 0이 되지는 않습니다. 통화마다 기본 스프레드가 다르고 금액이 커질수록 차이가 비례해 벌어지므로, 퍼센트가 아니라 금액으로 환산해 봐야 판단이 섭니다.",
  },
  {
    key: "timing",
    title: "공통 — 손댈 수 있는 시기가 정해져 있어서",
    body: "세 항목 모두 출국이 가까워질수록 선택지가 줄어듭니다. 수하물은 사전 구매 마감이 있고, eSIM은 기기가 지원하는지 확인할 시간이 필요하며, 환전 우대는 은행 이벤트 일정에 걸립니다. 반대로 말하면 항공권을 끊은 직후가 세 가지를 한 번에 정리하기 가장 좋은 시점입니다. 계산 결과는 주소에 남으므로 동행자에게 링크로 넘겨 같은 조건에서 이야기할 수 있습니다.",
  },
];
