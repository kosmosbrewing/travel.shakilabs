<script setup lang="ts">
import SEOHead from "@/components/common/SEOHead.vue";
import { RouterLink } from "vue-router";
import { buttonVariants } from "@/components/ui/button";
import { useConstantsStore } from "@/stores/constants";

const constantsStore = useConstantsStore();
</script>

<template>
  <SEOHead
    title="서비스 안내"
    description="shakilabs.com/travel은 수하물, 데이터 로밍, 환전 비용을 빠르게 비교하는 여행 준비 계산기입니다."
  />

  <div class="container py-5 space-y-5">
    <div class="retro-panel">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">서비스 안내</h1>
      </div>

      <div class="retro-panel-content space-y-4">
        <h2 class="text-heading font-bold">여행 준비 비용 비교 도구</h2>
        <p class="text-body text-muted-foreground">
          shakilabs.com/travel은 출국 전에 자주 고민하는 3가지 비용을 빠르게 비교하는 무료 도구입니다.
          LCC 위탁수하물 요금, eSIM과 로밍/포켓와이파이 비용, 은행별 환전 수수료를 한 화면에서
          비교해 여행 예산을 더 쉽게 잡을 수 있습니다.
        </p>

        <h2 class="text-heading font-bold">주요 기능</h2>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>LCC 4개사의 위탁수하물 총비용 비교</li>
          <li>eSIM, 통신사 로밍, 포켓와이파이 3안 비교</li>
          <li>USD, JPY, EUR 기준 은행별 환전 우대율 비교</li>
          <li>마이리얼트립 제휴 전환을 고려한 여행 준비 정보 구조</li>
        </ul>

        <h2 class="text-heading font-bold">데이터 기준</h2>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>수하물 요금: {{ constantsStore.feeDataUpdated }} 기준</li>
          <li>eSIM/로밍 비교: 공개 요금제 단순화 기준</li>
          <li>환전 수수료: 은행별 우대율 가정 기준</li>
        </ul>
        <p class="text-body text-muted-foreground">
          실제 프로모션, 공항 현장 구매 가격, 카드 우대환율은 시점에 따라 달라질 수 있습니다.
          본 서비스는 빠른 의사결정을 돕기 위한 참고용 도구이며, 최종 예약 전 공식 페이지 확인이 필요합니다.
        </p>

        <h2 class="text-heading font-bold">문의</h2>
        <p class="text-body text-muted-foreground">
          오류 제보나 기능 건의는
          <a :href="`mailto:${constantsStore.supportEmail}`" class="retro-link">{{ constantsStore.supportEmail }}</a>으로
          보내주세요.
        </p>
      </div>
    </div>

    <div class="text-center">
      <RouterLink :class="buttonVariants({ variant: 'default' })" to="/luggage">
        여행비용 비교하기
      </RouterLink>
    </div>
  </div>
</template>
