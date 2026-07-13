<script setup lang="ts">
import AffiliateDisclosure from "@/components/common/AffiliateDisclosure.vue";
import SEOHead from "@/components/common/SEOHead.vue";
import FreshBadge from "@/components/common/FreshBadge.vue";
import EsimCalculator from "@/components/travel/EsimCalculator.vue";
import CalculatorPageHeader from "@/components/travel/CalculatorPageHeader.vue";
import TravelNextActions from "@/components/travel/TravelNextActions.vue";
import { travelAffiliateItems } from "@/data/affiliateLinks";
import { TRAVEL_BADGE_MESSAGE } from "@/data/travelData";

const faqItems = [
  {
    q: "eSIM과 유심의 차이는 무엇인가요?",
    a: "eSIM은 물리적 칩 없이 QR코드로 활성화하는 디지털 SIM입니다. 유심 교체 없이 기존 번호를 유지하면서 데이터 전용 회선을 추가할 수 있어 듀얼심 지원 기기에 편리합니다.",
  },
  {
    q: "통신사 로밍과 eSIM 중 어느 쪽이 저렴한가요?",
    a: "단기(3~5일) 1인 여행이면 eSIM이 대체로 저렴합니다. 다만 동행 인원이 많으면 포켓와이파이(데이터 공유)가 1인당 비용이 가장 낮을 수 있으므로 인원수까지 함께 비교해야 합니다.",
  },
  {
    q: "포켓와이파이는 언제 유리한가요?",
    a: "2인 이상이 함께 이동하며 데이터를 공유할 때 가장 유리합니다. 1대로 여러 기기를 연결할 수 있어 인원당 비용이 크게 줄어듭니다. 다만 배터리 충전과 반납 절차가 필요합니다.",
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
    title="eSIM vs 로밍 vs 포켓와이파이 | shakilabs.com/travel"
    description="여행 일수와 동행 인원을 기준으로 eSIM, 통신사 로밍, 포켓와이파이 비용을 비교하세요."
    :json-ld="faqJsonLd"
  />
  <div class="container space-y-5 py-5">
    <CalculatorPageHeader title="eSIM·로밍·와이파이 비교" />

    <div class="retro-panel overflow-hidden">
      <div class="retro-titlebar rounded-t-2xl">
        <h2 class="retro-title">통신 조건 입력</h2>
        <FreshBadge :message="TRAVEL_BADGE_MESSAGE" />
      </div>
      <div class="retro-panel-content space-y-4">
        <p class="text-caption leading-relaxed text-muted-foreground">혼자 가는지, 여럿이 가는지에 따라 가장 싼 통신 옵션이 달라집니다. 총 데이터 사용량까지 함께 넣어 바로 비교하세요.</p>
        <EsimCalculator />
      </div>
    </div>
    <TravelNextActions current-tool="esim" />
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
