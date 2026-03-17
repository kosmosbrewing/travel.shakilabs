<script setup lang="ts">
import AffiliateDisclosure from "@/components/common/AffiliateDisclosure.vue";
import SEOHead from "@/components/common/SEOHead.vue";
import FreshBadge from "@/components/common/FreshBadge.vue";
import RelatedServices from "@/components/common/RelatedServices.vue";
import LuggageCalculator from "@/components/travel/LuggageCalculator.vue";
import { travelAffiliateItems } from "@/data/affiliateLinks";
import { TRAVEL_BADGE_MESSAGE } from "@/data/travelData";

const faqItems = [
  {
    q: "수하물 요금 비교는 어떤 항공사를 지원하나요?",
    a: "현재 제주항공, 진에어, 티웨이항공, 에어부산 기준 위탁수하물 요금을 비교할 수 있습니다.",
  },
  {
    q: "왕복과 편도 요금 차이도 계산되나요?",
    a: "가능합니다. 왕복 여부를 바꾸면 구간 수에 맞춰 예상 총액이 바로 다시 계산됩니다.",
  },
  {
    q: "실제 공항 결제 금액과 차이가 날 수 있나요?",
    a: "예매 시점, 노선, 현장 결제 여부에 따라 달라질 수 있으므로 최종 결제 전 항공사 정책을 다시 확인해야 합니다.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};
</script>

<template>
  <SEOHead
    title="LCC 수하물 요금 비교 | travel.shakilabs.com"
    description="제주항공, 진에어, 티웨이, 에어부산 위탁수하물 요금을 왕복 기준으로 비교하세요."
    :json-ld="faqJsonLd"
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
    <div class="retro-panel overflow-hidden">
      <div class="retro-titlebar rounded-t-2xl">
        <h2 class="retro-title">자주 묻는 질문</h2>
      </div>
      <div class="retro-panel-content space-y-3">
        <details
          v-for="faq in faqItems"
          :key="faq.q"
          class="retro-panel-muted p-4"
        >
          <summary class="cursor-pointer list-none text-body font-semibold text-foreground">
            {{ faq.q }}
          </summary>
          <p class="mt-2 text-caption leading-relaxed text-muted-foreground">
            {{ faq.a }}
          </p>
        </details>
      </div>
    </div>
    <RelatedServices />
    <AffiliateDisclosure v-if="travelAffiliateItems.length > 0" />
  </div>
</template>
