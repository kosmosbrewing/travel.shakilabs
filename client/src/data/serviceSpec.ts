// /about 화면이 쓰는 서비스 사양(계산 공식·입력 항목·가정값).
//
// 문구에 나오는 숫자를 여기서 직접 적지 않고 계산기가 실제로 쓰는 상수
// (travelData.ts)와 입력 검증 경계(validators.ts INPUT_BOUNDS)에서 가져온다.
// 소개 글은 "우리가 이렇게 계산합니다"라고 주장하는 문서라, 요금 가정이 바뀌었는데
// 설명만 옛날 숫자로 남으면 그 자체가 허위 고지가 된다. 한쪽만 고칠 수 없게 묶어둔다.
import {
  BASE_SPREADS,
  ESIM_PLANS,
  EXCHANGE_BANKS,
  LUGGAGE_CARRIERS,
  POCKET_WIFI_DAILY_PRICE,
  POCKET_WIFI_ORDER_FEE,
  POCKET_WIFI_SHARE_CAPACITY,
  ROAMING_DAILY_PRICE,
} from "@/data/travelData";
import { BASE_EXCHANGE_RATES } from "@/data/exchangeRates";
import { INPUT_BOUNDS } from "@/lib/validators";
import type { TravelToolKey } from "@/data/travelNavigation";

const won = (value: number) => `${value.toLocaleString("ko-KR")}원`;
const percent = (rate: number) => `${(rate * 100).toFixed(2)}%`;

export interface CalculatorSpec {
  key: TravelToolKey;
  path: string;
  title: string;
  question: string;
  inputs: string[];
  formula: string[];
  assumption: string;
}

export const CALCULATOR_SPECS: readonly CalculatorSpec[] = [
  {
    key: "luggage",
    path: "/luggage",
    title: "수하물 예산 계산기",
    question: "위탁수하물 값으로 얼마를 떼어놓아야 하나?",
    inputs: [
      `여행 인원 ${INPUT_BOUNDS.travelers.min}~${INPUT_BOUNDS.travelers.max}명`,
      `1인당 위탁 가방 ${INPUT_BOUNDS.bagsPerTraveler.min}~${INPUT_BOUNDS.bagsPerTraveler.max}개`,
      `가방 무게 ${INPUT_BOUNDS.bagWeightKg.join("·")}kg 중 선택`,
      `구간 수 ${INPUT_BOUNDS.tripSegments.min}(편도)~${INPUT_BOUNDS.tripSegments.max}(왕복)`,
    ],
    formula: [
      "총 위탁 개수 = 인원 × 1인당 가방 개수 × 구간 수",
      `가정별 총액 = 무게 구간 단가 × 총 위탁 개수 (${LUGGAGE_CARRIERS.map((carrier) => carrier.name).join(" / ")})`,
      `20kg 기준 단가 예: ${LUGGAGE_CARRIERS.map((carrier) => `${carrier.name} ${won(carrier.rates[20])}`).join(", ")}`,
    ],
    assumption:
      "특정 항공사의 확정 요금표가 아니라 낮음·중간·높음 세 가지 예산 가정입니다. 같은 무게라도 노선·운임·사전 구매 여부에 따라 실제 요금이 갈리기 때문에, 하나의 숫자를 제시하는 대신 범위를 보여주고 항공사 공식 요금 페이지로 연결합니다.",
  },
  {
    key: "esim",
    path: "/esim",
    title: "eSIM·로밍·포켓와이파이 비교기",
    question: "현지에서 데이터를 쓰는 가장 싼 방법은 무엇인가?",
    inputs: [
      `여행 일수 ${INPUT_BOUNDS.tripDays.min}~${INPUT_BOUNDS.tripDays.max}일`,
      `일행 전체 데이터 사용량 ${INPUT_BOUNDS.totalDataGb.min}~${INPUT_BOUNDS.totalDataGb.max}GB`,
      `동행 인원 ${INPUT_BOUNDS.travelers.min}~${INPUT_BOUNDS.travelers.max}명`,
    ],
    formula: [
      "1인당 데이터 = 올림(전체 데이터 ÷ 인원)",
      `eSIM = 일수와 1인당 데이터를 모두 충족하는 가장 작은 요금제 × 인원 (요금제 ${ESIM_PLANS.length}종, ${ESIM_PLANS[0]!.name} ${won(ESIM_PLANS[0]!.price)} ~ ${ESIM_PLANS.at(-1)!.name} ${won(ESIM_PLANS.at(-1)!.price)})`,
      `통신사 로밍 = 1일 ${won(ROAMING_DAILY_PRICE)} × 일수 × 인원`,
      `포켓와이파이 = 1일 ${won(POCKET_WIFI_DAILY_PRICE)} × 대수 × 일수 + 왕복 배송비 ${won(POCKET_WIFI_ORDER_FEE)} (1대를 ${POCKET_WIFI_SHARE_CAPACITY}명까지 공유)`,
    ],
    assumption:
      "인원수에 따라 순위가 뒤집히는 것이 이 비교의 핵심입니다. 로밍은 인원에 정비례해 늘어나지만 포켓와이파이는 대수 단위로만 늘어나므로, 혼자면 eSIM이, 여럿이면 포켓와이파이가 앞서는 구간이 생깁니다. 요금은 이 앱이 관리하는 대표 가정값이며 판매처 프로모션은 반영하지 않습니다.",
  },
  {
    key: "exchange",
    path: "/exchange",
    title: "환전 수수료 비교기",
    question: "환전 우대율 10%포인트 차이가 실제로 얼마인가?",
    inputs: [
      `환전할 원화 금액 ${won(INPUT_BOUNDS.amountKrw.min)}~${won(INPUT_BOUNDS.amountKrw.max)}`,
      `통화 ${INPUT_BOUNDS.currencies.join("·")} 중 선택`,
    ],
    formula: [
      "예상 수수료 = 환전 금액 × 기본 스프레드 × (1 − 우대율)",
      `기본 스프레드: ${(Object.keys(BASE_SPREADS) as Array<keyof typeof BASE_SPREADS>).map((code) => `${code} ${percent(BASE_SPREADS[code])}`).join(", ")}`,
      `비교 조건: ${EXCHANGE_BANKS.map((bank) => `${(bank.discountRate * 100).toFixed(0)}%`).join(" / ")} 우대율`,
      `수령 외화 = (환전 금액 − 수수료) ÷ 기준 환율 (비교용 기준값 1달러 ${won(BASE_EXCHANGE_RATES.USD)}, 100엔 ${won(Math.round(BASE_EXCHANGE_RATES.JPY * 100))}, 1유로 ${won(BASE_EXCHANGE_RATES.EUR)})`,
    ],
    assumption:
      "환전 수수료는 별도 항목으로 청구되지 않고 적용 환율 안에 스프레드로 숨어 있습니다. 이 계산기는 그 숨은 비용을 금액으로 드러내는 데 목적이 있으며, 은행별 실제 고시 환율이 아니라 통화별 대표 스프레드와 우대율 조건을 사용합니다.",
  },
] as const;

// 이 앱이 답하지 않는 질문. 범위를 먼저 밝혀야 계산 결과를 오해하지 않는다.
export const OUT_OF_SCOPE = [
  "항공권·숙소 최저가 검색과 예약",
  "여행자보험 보장 범위 비교와 가입",
  "비자·입국 요건, 검역·통관 규정 안내",
  "특정 항공사·통신사·은행 상품의 추천이나 중개",
] as const;
