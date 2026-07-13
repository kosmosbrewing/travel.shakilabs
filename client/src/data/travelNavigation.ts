export type TravelToolKey = "luggage" | "esim" | "exchange";

export interface TravelToolLink {
  key: TravelToolKey;
  path: string;
  title: string;
  description: string;
}

export const TRAVEL_TOOLS: readonly TravelToolLink[] = [
  {
    key: "luggage",
    path: "/luggage",
    title: "수하물 예산 계산",
    description: "항공권 결제 전 위탁수하물 예산 범위를 확인합니다.",
  },
  {
    key: "esim",
    path: "/esim",
    title: "eSIM·로밍 비교",
    description: "여행 기간과 인원에 맞는 통신 옵션을 비교합니다.",
  },
  {
    key: "exchange",
    path: "/exchange",
    title: "환전 수수료 비교",
    description: "환전 우대율별 예상 수수료와 수령액을 비교합니다.",
  },
] as const;

export function getRelatedTravelTools(currentTool: TravelToolKey): TravelToolLink[] {
  return TRAVEL_TOOLS.filter((tool) => tool.key !== currentTool);
}
