<script setup lang="ts">
import SEOHead from "@/components/common/SEOHead.vue";
import FreshBadge from "@/components/common/FreshBadge.vue";
import LuggageCalculator from "@/components/travel/LuggageCalculator.vue";
import { TRAVEL_BADGE_MESSAGE } from "@/data/travelData";
</script>

<template>
  <SEOHead
    title="LCC 수하물 요금 비교 | travel.shakilabs.com"
    description="제주항공, 진에어, 티웨이, 에어부산 위탁수하물 요금을 왕복 기준으로 비교하세요."
  />
  <div class="container space-y-5 py-5">
    <div class="retro-panel overflow-hidden">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">LCC 위탁수하물 요금 비교</h1>
        <FreshBadge :message="TRAVEL_BADGE_MESSAGE" />
      </div>
      <div class="retro-panel-content space-y-4">
        <p class="text-caption leading-relaxed text-muted-foreground">여행 인원, 가방 개수, 왕복 여부만 바꿔도 총액이 크게 달라집니다. 출국 전에 가장 싼 조합을 먼저 확인하세요.</p>
        <LuggageCalculator />
      </div>
    </div>
  </div>
</template>
