<script setup lang="ts">
import AffiliateDisclosure from "@/components/common/AffiliateDisclosure.vue";
import SEOHead from "@/components/common/SEOHead.vue";
import FreshBadge from "@/components/common/FreshBadge.vue";
import ExchangeCalculator from "@/components/travel/ExchangeCalculator.vue";
import { travelAffiliateItems } from "@/data/affiliateLinks";
import { TRAVEL_BADGE_MESSAGE } from "@/data/travelData";
</script>

<template>
  <SEOHead
    title="환전 수수료 비교 | travel.shakilabs.com"
    description="USD, JPY, EUR 기준으로 은행별 환전 우대율과 예상 수수료를 비교하세요."
  />
  <div class="container space-y-5 py-5">
    <div class="retro-panel overflow-hidden">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">은행별 환전 수수료 비교</h1>
        <FreshBadge :message="TRAVEL_BADGE_MESSAGE" />
      </div>
      <div class="retro-panel-content space-y-4">
        <p class="text-caption leading-relaxed text-muted-foreground">같은 환전금액이라도 우대율 차이로 실제 수수료가 벌어집니다. 출국 전에 어떤 은행이 가장 유리한지 확인해 보세요.</p>
        <ExchangeCalculator />
      </div>
    </div>
    <AffiliateDisclosure v-if="travelAffiliateItems.length > 0" />
  </div>
</template>
