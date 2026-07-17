<script setup lang="ts">
import { ShSurface, ShText } from "@shakilabs/ui";
import AffiliateDisclosure from "@/components/common/AffiliateDisclosure.vue";
import FaqAccordionPanel from "@/components/common/FaqAccordionPanel.vue";
import SEOHead from "@/components/common/SEOHead.vue";
import SeoRichGuide from "@/components/common/SeoRichGuide.vue";
import FreshBadge from "@/components/common/FreshBadge.vue";
import LuggageCalculator from "@/components/travel/LuggageCalculator.vue";
import CalculatorPageHeader from "@/components/travel/CalculatorPageHeader.vue";
import TravelNextActions from "@/components/travel/TravelNextActions.vue";
import { travelAffiliateItems } from "@/data/affiliateLinks";
import { LUGGAGE_SOURCES, TRAVEL_BADGE_MESSAGE } from "@/data/travelData";
import { LUGGAGE_GUIDE } from "@/data/seoGuides";

const faqItems = [
  {
    q: "수하물 요금 비교는 어떤 항공사를 지원하나요?",
    a: "노선과 운임 종류가 없으면 항공사 요금을 정확히 비교할 수 없어 낮음·중간·높음 예산 시나리오를 제공합니다. 실제 금액은 각 항공사 공식 페이지에서 확인하세요.",
  },
  {
    q: "왕복과 편도 요금 차이도 계산되나요?",
    a: "가능합니다. 왕복 여부를 바꾸면 구간 수에 맞춰 예상 총액이 바로 다시 계산됩니다.",
  },
  {
    q: "실제 공항 결제 금액과 차이가 날 수 있나요?",
    a: "예매 시점, 노선, 운임에 포함된 무료 수하물, 사전·현장 결제 여부에 따라 크게 달라집니다. 이 페이지의 금액은 견적이 아닌 예산 시나리오입니다.",
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
    title="LCC 수하물 요금 비교 | shakilabs.com/travel"
    description="여행 인원과 가방 무게를 기준으로 위탁수하물 예산 범위를 계산하고 항공사 공식 요금표를 확인하세요."
    :json-ld="faqJsonLd"
  />
  <div class="text-resize-layout container space-y-5 py-5">
    <CalculatorPageHeader title="LCC 수하물 예산 계산기" />

    <ShSurface padding="none" class="overflow-hidden">
      <div class="retro-titlebar rounded-t-2xl">
        <ShText as="h2" variant="heading">수하물 조건 입력</ShText>
        <FreshBadge :message="TRAVEL_BADGE_MESSAGE" />
      </div>
      <div class="retro-panel-content space-y-4">
        <p class="text-caption leading-relaxed text-muted-foreground">여행 인원, 가방 개수, 왕복 여부에 따른 예산 범위를 계산합니다. 실제 요금은 노선과 운임 종류를 선택한 뒤 항공사에서 확인하세요.</p>
        <LuggageCalculator />
        <div class="flex flex-wrap gap-x-3 gap-y-1 text-tiny text-muted-foreground">
          <span>공식 요금 확인:</span>
          <a
            v-for="source in LUGGAGE_SOURCES"
            :key="source.name"
            :href="source.url"
            target="_blank"
            rel="noopener noreferrer"
            class="retro-link"
          >{{ source.name }}</a>
        </div>
      </div>
    </ShSurface>
    <TravelNextActions current-tool="luggage" />
    <FaqAccordionPanel :items="faqItems" />
    <SeoRichGuide
      :title="LUGGAGE_GUIDE.title"
      :intro="LUGGAGE_GUIDE.intro"
      :sections="LUGGAGE_GUIDE.sections"
      :faqs="LUGGAGE_GUIDE.faqs"
      :disclaimer="LUGGAGE_GUIDE.disclaimer"
    />
    <AffiliateDisclosure v-if="travelAffiliateItems.length > 0" />
  </div>
</template>
