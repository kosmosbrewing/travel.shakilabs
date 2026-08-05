<script setup lang="ts">
import SEOHead from "@/components/common/SEOHead.vue";
import { useConstantsStore } from "@/stores/constants";

const constantsStore = useConstantsStore();
</script>

<template>
  <SEOHead
    title="이용약관"
    description="shakilabs.com/travel의 서비스 이용약관입니다. 서비스 제공 범위, 정보 제공의 한계(여행 자문 아님), 광고 게재, 면책 조항과 이용자의 의무를 안내합니다."
  />

  <div class="container py-5">
    <div class="retro-panel">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">이용약관</h1>
      </div>

      <div class="retro-panel-content space-y-4">
        <p class="text-body text-muted-foreground">
          shakilabs.com/travel(이하 "본 서비스")을 이용해 주셔서 감사합니다.
          본 서비스에 접속하여 계산 기능을 이용하는 경우 아래 약관에 동의한 것으로 봅니다.
        </p>

        <h2 class="text-heading font-bold">1. 서비스 개요</h2>
        <p class="text-body text-muted-foreground">
          본 서비스는 여행 준비 과정에서 자주 비교하는 비용을 계산하는 무료 도구입니다.
          회원가입 없이 누구나 이용할 수 있으며, 위탁수하물 예산, eSIM/로밍/포켓와이파이,
          환전 수수료 비교 기능을 제공합니다. 이용자가 입력한 값은 서버에 전송되지 않고
          브라우저 안에서만 처리됩니다.
        </p>

        <h2 class="text-heading font-bold">2. 정보 제공의 한계 — 여행 자문이 아님</h2>
        <p class="text-body text-muted-foreground">
          본 서비스의 모든 계산 결과와 가이드 콘텐츠는 이용자가 입력한 값과 단순화된 공개
          기준에 따라 산출되는 참고용 추정치이며, 여행 상품·금융 상품의 판매·중개·자문이
          아닙니다. 특히 다음 정보는 시점과 조건에 따라 수시로 변동되므로, 예약·결제 전
          반드시 공식 채널에서 최신 조건을 확인해야 합니다.
        </p>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            위탁수하물 요금과 무게·크기 규정은 항공사·노선·운임 종류·구매 시점(사전/현장)에
            따라 다르며, 각 항공사 공식 페이지에서만 확정할 수 있습니다.
          </li>
          <li>
            환율과 환전 우대율은 실시간으로 변동하며, 실제 적용 환율은 각 은행·환전소의
            고시 시점에 따라 달라집니다.
          </li>
          <li>
            eSIM·로밍·포켓와이파이 요금제는 통신사·판매처 프로모션에 따라 가격과 제공량이
            수시로 바뀝니다.
          </li>
        </ul>

        <h2 class="text-heading font-bold">3. 면책 조항</h2>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            본 서비스의 계산 결과는 참고용이며, 실제 결제 금액과 차이가 있을 수 있습니다.
          </li>
          <li>
            요금과 우대율은 각 항공사·통신사·은행의 공식 정보를 기반으로 하지만, 변경 사항이
            즉시 반영되지 않을 수 있습니다.
          </li>
          <li>
            프로모션, 실시간 환율, 카드사 제휴 할인, 현장 발권 수수료 등은 계산에 포함되지
            않습니다.
          </li>
          <li>
            운영자는 계산 결과와 콘텐츠의 정확성·완전성·최신성을 유지하기 위해 노력하지만
            이를 법적으로 보증하지 않으며, 본 서비스의 정보를 근거로 한 예약·환전·구매
            결정과 그로 인한 손해에 대해 고의 또는 중대한 과실이 없는 한 책임을 지지
            않습니다.
          </li>
          <li>
            무료 서비스 특성상 시스템 점검, 장애, 불가항력으로 인한 일시적 중단에 대해서도
            같습니다.
          </li>
        </ul>

        <h2 class="text-heading font-bold">4. 지식재산권</h2>
        <p class="text-body text-muted-foreground">
          본 서비스의 디자인, 코드, 콘텐츠에 대한 저작권은 서비스 운영자에게 있습니다.
          계산 결과의 공유·인용은 자유롭게 가능하나, 서비스 자체의 복제·재배포는 금지합니다.
          본 서비스가 인용하는 공공기관·항공사 자료는 출처를 함께 표기합니다.
        </p>

        <h2 class="text-heading font-bold">5. 광고의 게재</h2>
        <p class="text-body text-muted-foreground">
          본 서비스는 무료 운영 재원을 마련하기 위해 Google AdSense 등 제3자 광고를
          게재합니다. 광고 영역은 본문 콘텐츠와 구분되어 표시되며, 광고에 소개되는
          상품·서비스는 운영자가 보증하는 것이 아닙니다. 이용자가 광고를 통해 광고주와
          거래하는 경우 그 거래의 책임은 이용자와 광고주에게 있습니다. 쿠키를 이용한
          맞춤 광고와 그 해제 방법은 개인정보 처리방침에서 안내합니다.
        </p>

        <h2 class="text-heading font-bold">6. 이용자의 의무</h2>
        <p class="text-body text-muted-foreground">
          이용자는 서비스의 안정적인 운영을 방해하는 행위를 해서는 안 됩니다. 과도한 자동화
          접근(크롤링·스크래핑), 서비스 역설계, 광고 시스템에 대한 부정 클릭 유도 등이 이에
          해당하며, 위반으로 발생한 손해에 대해서는 해당 이용자가 책임을 부담합니다.
        </p>

        <h2 class="text-heading font-bold">7. 서비스 변경 및 중단</h2>
        <p class="text-body text-muted-foreground">
          서비스 운영자는 사전 고지 없이 서비스의 기능을 변경하거나 중단할 수 있습니다.
          무료 서비스 특성상, 서비스 중단에 따른 별도 보상은 제공되지 않습니다.
        </p>

        <h2 class="text-heading font-bold">8. 약관 변경</h2>
        <p class="text-body text-muted-foreground">
          본 약관은 필요 시 변경될 수 있으며, 변경된 약관은 본 페이지에 게시하는 것으로
          효력이 발생합니다. 변경 게시 이후 서비스를 계속 이용하는 경우 변경 약관에 동의한
          것으로 봅니다.
        </p>

        <h2 class="text-heading font-bold">9. 문의</h2>
        <p class="text-body text-muted-foreground">
          운영: ShakiLabs · 문의:
          <a :href="`mailto:${constantsStore.supportEmail}`" class="retro-link">
            {{ constantsStore.supportEmail }}
          </a>
        </p>
        <p class="text-body text-muted-foreground">
          약관과 서비스 이용에 관한 문의는 위 연락처로 보내주시면 영업일 기준 24~48시간
          이내에 답변드립니다.
        </p>

        <p class="text-tiny text-muted-foreground mt-6">
          시행일: 2026년 8월 5일 (최초 시행일: 2026년 3월 15일)
        </p>
      </div>
    </div>
  </div>
</template>
