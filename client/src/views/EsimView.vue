<script setup lang="ts">
import AffiliateDisclosure from "@/components/common/AffiliateDisclosure.vue";
import SEOHead from "@/components/common/SEOHead.vue";
import FreshBadge from "@/components/common/FreshBadge.vue";
import EsimCalculator from "@/components/travel/EsimCalculator.vue";
import { travelAffiliateItems } from "@/data/affiliateLinks";
import { TRAVEL_BADGE_MESSAGE } from "@/data/travelData";
</script>

<template>
  <SEOHead
    title="eSIM vs 로밍 vs 포켓와이파이 | travel.shakilabs.com"
    description="여행 일수와 동행 인원을 기준으로 eSIM, 통신사 로밍, 포켓와이파이 비용을 비교하세요."
  />
  <div class="container space-y-5 py-5">
    <div class="retro-panel overflow-hidden">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">eSIM vs 로밍 vs 포켓와이파이</h1>
        <FreshBadge :message="TRAVEL_BADGE_MESSAGE" />
      </div>
      <div class="retro-panel-content space-y-4">
        <p class="text-caption leading-relaxed text-muted-foreground">혼자 가는지, 여럿이 가는지에 따라 가장 싼 통신 옵션이 달라집니다. 총 데이터 사용량까지 함께 넣어 바로 비교하세요.</p>
        <EsimCalculator />
      </div>
    </div>
    <AffiliateDisclosure v-if="travelAffiliateItems.length > 0" />
  </div>
</template>
