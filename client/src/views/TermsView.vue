<script setup lang="ts">
import SEOHead from "@/components/common/SEOHead.vue";
import { useConstantsStore } from "@/stores/constants";

const constantsStore = useConstantsStore();
</script>

<template>
  <SEOHead
    title="이용약관"
    description="shakilabs.com/travel의 서비스 이용약관입니다."
  />

  <div class="container py-5">
    <div class="retro-panel">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">이용약관</h1>
      </div>

      <div class="retro-panel-content space-y-4">
        <p class="text-body text-muted-foreground">
          shakilabs.com/travel(이하 "본 서비스")을 이용해 주셔서 감사합니다.
          본 서비스를 이용함으로써 아래 약관에 동의하게 됩니다.
        </p>

        <h2 class="text-heading font-bold">1. 서비스 개요</h2>
        <p class="text-body text-muted-foreground">
          본 서비스는 여행 준비 과정에서 자주 비교하는 비용을 계산하는 무료 도구입니다.
          회원가입 없이 누구나 이용할 수 있으며, 위탁수하물, eSIM/로밍, 환전 수수료
          비교 기능을 제공합니다.
        </p>

        <h2 class="text-heading font-bold">2. 면책 조항</h2>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            본 서비스의 계산 결과는 참고용이며, 실제 결제 금액과 차이가 있을 수 있습니다.
          </li>
          <li>
            요금과 우대율은 각 항공사·통신사·은행의 공식 정보를 기반으로 하지만, 변경 사항이 즉시 반영되지
            않을 수 있습니다.
          </li>
          <li>
            본 서비스의 정보를 근거로 한 예약·환전·구매 결정에 대해
            서비스 운영자는 책임을 지지 않습니다.
          </li>
          <li>
            프로모션, 실시간 환율, 카드사 제휴 할인, 현장 발권 수수료 등은 계산에 포함되지 않습니다.
          </li>
        </ul>

        <h2 class="text-heading font-bold">3. 지식재산권</h2>
        <p class="text-body text-muted-foreground">
          본 서비스의 디자인, 코드, 콘텐츠에 대한 저작권은 서비스 운영자에게 있습니다.
          계산 결과의 공유·인용은 자유롭게 가능하나, 서비스 자체의 복제·재배포는 금지합니다.
        </p>

        <h2 class="text-heading font-bold">4. 광고</h2>
        <p class="text-body text-muted-foreground">
          본 서비스는 Google AdSense 등을 통해 광고를 게재할 수 있습니다.
          광고 콘텐츠는 서비스 운영자가 보증하는 것이 아닙니다.
        </p>

        <h2 class="text-heading font-bold">5. 서비스 변경 및 중단</h2>
        <p class="text-body text-muted-foreground">
          서비스 운영자는 사전 고지 없이 서비스의 기능을 변경하거나 중단할 수 있습니다.
          무료 서비스 특성상, 서비스 중단에 따른 별도 보상은 제공되지 않습니다.
        </p>

        <h2 class="text-heading font-bold">6. 약관 변경</h2>
        <p class="text-body text-muted-foreground">
          본 약관은 필요 시 변경될 수 있으며, 변경된 약관은 본 페이지에 게시하는 것으로 효력이 발생합니다.
        </p>

        <h2 class="text-heading font-bold">7. 문의</h2>
        <p class="text-body text-muted-foreground">
          이용약관 관련 문의:
          <a :href="`mailto:${constantsStore.supportEmail}`" class="retro-link">
            {{ constantsStore.supportEmail }}
          </a>
        </p>

        <p class="text-tiny text-muted-foreground mt-6">
          시행일: 2026년 3월 15일
        </p>
      </div>
    </div>
  </div>
</template>
