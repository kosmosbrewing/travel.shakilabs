<script setup lang="ts">
import AffiliateDisclosure from "@/components/common/AffiliateDisclosure.vue";
import SEOHead from "@/components/common/SEOHead.vue";
import FreshBadge from "@/components/common/FreshBadge.vue";
import ExchangeCalculator from "@/components/travel/ExchangeCalculator.vue";
import TravelNextActions from "@/components/travel/TravelNextActions.vue";
import { useTravelExchangeRates } from "@/composables/useTravelExchangeRates";
import { travelAffiliateItems } from "@/data/affiliateLinks";

const { badgeMessage } = useTravelExchangeRates();

const faqItems = [
  {
    q: "환전 우대율이란 무엇인가요?",
    a: "은행이 고시하는 매매기준율과 실제 환전 적용 환율의 차이를 줄여주는 할인입니다. 우대율 90%라면 스프레드(수수료)의 90%를 깎아주는 것이며, 우대율이 높을수록 유리합니다.",
  },
  {
    q: "현금 환전과 카드 결제 중 어느 쪽이 유리한가요?",
    a: "일반적으로 해외결제 특화 카드(수수료 0.2~1%)가 현금 환전보다 유리합니다. 다만 현지 소규모 상점·택시 등 현금만 받는 곳을 위해 일부 현금을 준비하는 것이 좋습니다.",
  },
  {
    q: "출국 당일 공항에서 환전하면 불리한가요?",
    a: "공항 환전소는 우대율이 낮은 편이므로 시내 은행 앱·인터넷뱅킹으로 미리 환전하면 0.5~1% 정도 절약할 수 있습니다. 급하지 않다면 사전 환전을 권장합니다.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};
</script>

<template>
  <SEOHead
    title="환전 수수료 비교 | shakilabs.com/travel"
    description="USD, JPY, EUR 기준으로 환전 우대율별 예상 수수료를 비교하세요."
    :json-ld="faqJsonLd"
  />
  <div class="container space-y-5 py-5">
    <div class="retro-panel overflow-hidden">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">환전 우대율별 수수료 비교</h1>
        <FreshBadge :message="badgeMessage" />
      </div>
      <div class="retro-panel-content space-y-4">
        <p class="text-caption leading-relaxed text-muted-foreground">같은 환전금액이라도 적용 우대율에 따라 예상 수수료가 달라집니다. 거래 은행 앱에서 실제 우대율을 확인한 뒤 비교하세요.</p>
        <ExchangeCalculator />
      </div>
    </div>
    <TravelNextActions current-tool="exchange" />
    <div class="retro-panel overflow-hidden">
      <div class="retro-titlebar rounded-t-2xl">
        <h2 class="retro-title">자주 묻는 질문</h2>
      </div>
      <div class="retro-panel-content space-y-3">
        <details v-for="faq in faqItems" :key="faq.q" class="retro-panel-muted p-4">
          <summary class="cursor-pointer list-none text-body font-semibold text-foreground">{{ faq.q }}</summary>
          <p class="mt-2 text-caption leading-relaxed text-muted-foreground">{{ faq.a }}</p>
        </details>
      </div>
    </div>
    <AffiliateDisclosure v-if="travelAffiliateItems.length > 0" />
  </div>
</template>
