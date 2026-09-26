<script setup lang="ts">
// 결과 다음에 볼 여행 비용 — 패키지 ShNextActions(0.3.40)가 그린다(전폭이면 3열, 좁으면 목록).
// 이 컴포넌트에는 항목과 분석 이벤트만 남긴다: 이벤트 이름·파라미터(placement "after_result")를
// 그대로 둬야 기존 related_tool 집계가 끊기지 않는다.
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import { ShNextActions, type NextActionItem } from "@shakilabs/ui";
import { getRelatedTravelTools, type TravelToolKey } from "@/data/travelNavigation";
import { trackEvent } from "@/lib/analytics";

const props = defineProps<{ currentTool: TravelToolKey }>();

// 카드 조건 한 줄 — 여행 허브(TravelToolsView)가 쓰는 description 문장을 짧게 줄인 것
const NOTES: Record<TravelToolKey, string> = {
  luggage: "항공권 결제 전 위탁수하물 예산 범위",
  esim: "여행 기간·인원에 맞는 통신 옵션",
  exchange: "우대율별 수수료와 수령액",
};

const items: NextActionItem[] = [
  ...getRelatedTravelTools(props.currentTool).map((tool) => ({
    key: tool.key,
    title: tool.title,
    to: tool.path,
    note: NOTES[tool.key],
  })),
  // card 앱 화면이라 라우터 밖 절대 경로(href)로 보낸다
  { key: "overseas_payment", title: "해외결제 카드 수수료", href: "/card/overseas-payment", note: "DCC·카드사 수수료까지" },
];

onMounted(() => {
  items.forEach((item) => trackEvent("related_tool_impression", {
    app_id: "travel",
    from_tool: props.currentTool,
    to_tool: item.key,
    placement: "after_result",
  }));
});

function trackRelatedClick(item: NextActionItem): void {
  trackEvent("related_tool_click", {
    app_id: "travel",
    from_tool: props.currentTool,
    to_tool: item.key,
    placement: "after_result",
  });
}
</script>

<template>
  <ShNextActions :items="items" :link-component="RouterLink" @select="trackRelatedClick" />
</template>
