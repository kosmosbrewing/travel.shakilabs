<script setup lang="ts">
import SEOHead from "@/components/common/SEOHead.vue";
import { RouterLink } from "vue-router";
import { buttonVariants } from "@/components/ui/button";
import { useConstantsStore } from "@/stores/constants";
import { CALCULATOR_SPECS, OUT_OF_SCOPE } from "@/data/serviceSpec";
import { LUGGAGE_SOURCES, TRAVEL_DATA_VERIFIED } from "@/data/travelData";
import { EXCHANGE_RATE_BASE_DATE, EXCHANGE_RATE_SUMMARY } from "@/data/exchangeRates";

const constantsStore = useConstantsStore();
</script>

<template>
  <SEOHead
    title="서비스 안내 — 계산 방식과 가정값"
    description="shakilabs.com/travel이 수하물·eSIM·환전 비용을 어떤 공식과 가정값으로 계산하는지, 어떤 입력을 받고 무엇은 다루지 않는지 밝힙니다."
  />

  <div class="container py-5 space-y-5">
    <div class="retro-panel">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">서비스 안내</h1>
      </div>

      <div class="retro-panel-content space-y-4">
        <p class="text-body text-muted-foreground">
          shakilabs.com/travel은 항공권을 끊고 난 뒤에 따라붙는 세 가지 비용 — 위탁수하물,
          현지 데이터, 환전 수수료 — 을 출국 전에 비교하는 무료 계산기입니다. 세 항목 모두
          금액 자체는 크지 않아 보이지만 인원과 일정에 곱해지는 구조라, 4인 가족 일주일
          일정에서는 합계가 수십만 원 단위로 벌어집니다. 그런데 정작 비교에 필요한 숫자는
          항공사·통신사·은행 페이지에 흩어져 있습니다. 이 도구는 그 셋을 한 화면에서
          같은 기준으로 나열하는 것만을 목표로 합니다.
        </p>
        <p class="text-body text-muted-foreground">
          아래에 세 계산기가 <strong>실제로 어떤 값을 입력받고 어떤 식으로 계산하는지</strong>를
          그대로 적었습니다. 계산 과정을 감춘 채 결과만 보여주는 도구는 그 결과가 내 상황에
          맞는지 판단할 수 없기 때문입니다. 여기 적힌 단가와 허용 범위는 계산기가 쓰는 상수를
          그대로 불러온 값이라, 요금 가정이 바뀌면 이 문서의 숫자도 함께 바뀝니다.
        </p>
      </div>
    </div>

    <section
      v-for="spec in CALCULATOR_SPECS"
      :key="spec.key"
      class="retro-panel"
      :aria-labelledby="`spec-${spec.key}`"
    >
      <div class="retro-titlebar rounded-t-2xl">
        <h2 :id="`spec-${spec.key}`" class="retro-title">{{ spec.title }}</h2>
      </div>
      <div class="retro-panel-content space-y-4">
        <p class="text-body">
          <span class="font-bold">답하는 질문:</span> {{ spec.question }}
        </p>

        <div class="space-y-2">
          <h3 class="text-body font-bold">받는 입력값</h3>
          <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
            <li v-for="input in spec.inputs" :key="input">{{ input }}</li>
          </ul>
        </div>

        <div class="space-y-2">
          <h3 class="text-body font-bold">계산 방식</h3>
          <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
            <li v-for="line in spec.formula" :key="line">{{ line }}</li>
          </ul>
        </div>

        <div class="retro-panel-muted space-y-2 p-4">
          <h3 class="text-body font-bold">이 숫자를 어떻게 읽어야 하나</h3>
          <p class="text-body text-muted-foreground">{{ spec.assumption }}</p>
        </div>

        <RouterLink :to="spec.path" class="retro-link text-body">
          {{ spec.title }} 열기
        </RouterLink>
      </div>
    </section>

    <div class="retro-panel">
      <div class="retro-titlebar rounded-t-2xl">
        <h2 class="retro-title">가정값의 출처와 갱신</h2>
      </div>
      <div class="retro-panel-content space-y-4">
        <p class="text-body text-muted-foreground">
          수하물 예산 구간은 국내 저비용항공사가 공개한 사전 구매 요금표의 분포를 참고해
          잡았고, 화면에는 확인에 쓴 항공사 공식 페이지를 그대로 링크해 둡니다
          (<a
            v-for="(source, index) in LUGGAGE_SOURCES"
            :key="source.name"
            :href="source.url"
            target="_blank"
            rel="noopener noreferrer"
            class="retro-link"
          >{{ source.name }}<span v-if="index < LUGGAGE_SOURCES.length - 1">, </span></a>).
          eSIM·로밍·포켓와이파이 단가는 공개 요금제를 데이터 용량과 기간 기준으로 단순화한
          대표값이며, 환전 스프레드는 통화별 고시 환율과 매매기준율의 통상적인 차이를
          기준으로 잡았습니다. 수하물·통신 요금 가정값의 마지막 점검일은
          {{ TRAVEL_DATA_VERIFIED }}이며, 이 날짜는 수하물·eSIM 계산기 화면 상단 배지에
          그대로 표시됩니다. 환전 계산기 배지에는 요금 점검일 대신 환율 기준일({{ EXCHANGE_RATE_BASE_DATE }})을
          적어 둡니다. 요금과 환율을 확인한 시점이 서로 달라, 한 날짜로 묶으면 둘 중 하나는
          거짓이 되기 때문입니다. 정해진 점검 주기는 없고 사람이 확인한 시점에만 값을 고칩니다.
        </p>
        <p class="text-body text-muted-foreground">
          환율은 실시간 시세가 아니라 비교용 기준값을 사용합니다. 이 계산기가 답하려는 질문이
          "지금 1달러가 몇 원인가"가 아니라 "우대율 차이가 내 환전 금액에서 얼마인가"이기
          때문입니다. 이 앱에는 환율을 자동으로 가져오는 장치가 없어,
          {{ EXCHANGE_RATE_BASE_DATE }} 기준으로 사람이 확인한 값({{ EXCHANGE_RATE_SUMMARY }})을
          고정값으로 적어 두고 그대로 씁니다. 수수료 비교의 상대적 크기는 환율이 조금 움직여도
          유지되지만, 수령 외화 금액은 실제 환전 시점의 고시 환율에 따라 달라집니다.
        </p>
      </div>
    </div>

    <div class="retro-panel">
      <div class="retro-titlebar rounded-t-2xl">
        <h2 class="retro-title">이 도구가 다루지 않는 것</h2>
      </div>
      <div class="retro-panel-content space-y-4">
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li v-for="item in OUT_OF_SCOPE" :key="item">{{ item }}</li>
        </ul>
        <p class="text-body text-muted-foreground">
          계산 결과는 예약·환전 판단을 돕는 참고 자료일 뿐이며, 여행 상품이나 금융 상품의
          중개·자문이 아닙니다. 표시 금액은 견적이 아니라 예산 시나리오이므로, 실제 결제 전에는
          항공사·통신사·은행 공식 채널에서 최종 조건을 확인해야 합니다.
        </p>
      </div>
    </div>

    <div class="retro-panel">
      <div class="retro-titlebar rounded-t-2xl">
        <h2 class="retro-title">운영자 정보와 문의</h2>
      </div>
      <div class="retro-panel-content space-y-4">
        <p class="text-body font-bold">운영: ShakiLabs · 문의: skdba1313@gmail.com</p>
        <p class="text-body text-muted-foreground">
          이 서비스는 개인 개발자가 운영하며, 항공사·통신사·은행과 제휴 관계가 없고 특정
          상품의 판매 실적에 따른 대가를 받지 않습니다. 운영 비용은 화면에 게재되는 광고로
          충당합니다. 광고는 본문과 구분되는 위치에만 두고, 오류 화면처럼 읽을 내용이 없는
          페이지에는 광고를 싣지 않습니다.
        </p>
        <p class="text-body text-muted-foreground">
          계산 결과가 실제와 다르거나 가정값이 낡았다고 판단되면
          <a :href="`mailto:${constantsStore.supportEmail}`" class="retro-link">{{ constantsStore.supportEmail }}</a>으로
          제보해 주세요. 어떤 항공사·요금제·통화에서 어떤 값이 나왔는지 함께 적어주시면
          확인 후 상수를 갱신하고 점검일을 다시 표기합니다.
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
