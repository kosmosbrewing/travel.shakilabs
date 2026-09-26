<script setup lang="ts">
import { computed } from "vue";
import { ShCalculatorSplit } from "@shakilabs/ui";
import AffiliateLinkPanel from "@/components/common/AffiliateLinkPanel.vue";
import FreshBadge from "@/components/common/FreshBadge.vue";
import TravelMetricGrid from "@/components/travel/TravelMetricGrid.vue";
import TravelCostBars from "@/components/travel/TravelCostBars.vue";
import TravelRankTable from "@/components/travel/TravelRankTable.vue";
import TravelScenarioChips from "@/components/travel/TravelScenarioChips.vue";
import TravelSummaryCard from "@/components/travel/TravelSummaryCard.vue";
import { travelAffiliateItems } from "@/data/affiliateLinks";
import { EXCHANGE_RATE_STATUS } from "@/data/exchangeRates";
import { exchangePresets } from "@/data/travelData";
import { useExchangeCalculator } from "@/composables/useExchangeCalculator";
import { formatNumber, formatWon } from "@/lib/utils";

const { state, result, applyPreset, reset } = useExchangeCalculator();

const metrics = computed(() => [
  { label: "최저 수수료", value: formatWon(result.value.best.totalCost), helper: result.value.best.name },
  { label: "최고 수수료", value: formatWon(result.value.worst.totalCost), helper: result.value.worst.name },
  { label: "우대 조건 간 차이", value: formatWon(result.value.spread), helper: "같은 환전금액 기준" },
  { label: "최저가 수령액", value: formatNumber(result.value.best.foreignAmount), helper: `${state.currency} 기준` },
]);

function selectPreset(key: string): void {
  const preset = exchangePresets.find((item) => item.key === key);
  if (preset) applyPreset(preset.input);
}
</script>

<template>
  <div class="space-y-5">
    <!-- 입력 카드 | 결과 카드 1×2(64rem부터 1:1). 예전 큰 카드 안 xl 중첩 격자는 1024~1279px에서 한 줄로 쌓여 결과가 첫 화면 밖으로 밀렸다. -->
    <!-- 틀과 그 조상에는 overflow를 걸지 않는다 — 결과 칸 붙임(sticky) 판정이 죽는다. -->
    <ShCalculatorSplit>
      <template #input>
        <section class="retro-panel overflow-hidden" aria-labelledby="exchange-input-title">
          <div class="retro-titlebar rounded-t-2xl">
            <h2 id="exchange-input-title" class="retro-title">환전 조건 입력</h2>
            <!-- 이 배지만 요금 점검일이 아니라 환율 기준일을 말한다 (/about에 이유를 적어 두었다) -->
            <FreshBadge :message="EXCHANGE_RATE_STATUS.lastUpdated" />
          </div>
          <div class="retro-panel-content space-y-4">
            <!-- 반폭 칸 안에서 셀렉트는 전체 폭 1열 — 2열은 짧은 숫자 쌍에만 쓴다 -->
            <div class="grid gap-3">
              <label class="space-y-1.5">
                <span class="text-caption font-semibold text-foreground">환전 금액</span>
                <input v-model.number="state.amountKrw" class="retro-input" min="100000" step="100000" type="number" />
              </label>
              <label class="space-y-1.5">
                <span class="text-caption font-semibold text-foreground">통화</span>
                <select v-model="state.currency" class="retro-input">
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
            </div>

            <!-- 시나리오 프리셋은 칸 아래 한 줄(넘치면 줄바꿈) — 틀 위에 두면 결과 칸까지 같이 밀린다 -->
            <TravelScenarioChips :items="exchangePresets" @select="selectPreset" />

            <div class="flex flex-wrap items-center gap-2">
              <button type="button" class="retro-panel px-3 py-2 text-caption font-semibold text-foreground" @click="reset">
                입력 초기화
              </button>
              <p class="text-tiny text-muted-foreground">현찰 살 때 우대율만 반영한 단순 수수료 비교입니다.</p>
            </div>
          </div>
        </section>
      </template>

      <template #result>
        <TravelSummaryCard
          headline="환전금액이 커질수록 적용 우대율 차이가 체감 비용으로 이어집니다."
          :leader-value="result.best.name"
          leader-label="가장 유리한 우대 조건"
          :leader-hint="`${state.currency} 현찰 환전 기준`"
          :delta-value="formatWon(result.spread)"
          delta-label="최저 수수료와 최고 수수료 차이"
          :facts="[
            { label: '최저 수수료', value: formatWon(result.best.totalCost) },
            { label: '환전 금액', value: formatWon(state.amountKrw) },
            { label: '통화', value: state.currency },
          ]"
        />
      </template>

      <!-- 환율 출처는 입력(통화)이 쓰는 고정 환율 설명이라 입력 아래 왼쪽 칸에 둔다(모바일은 결과 뒤). 틀 위에 두면 1024×768 첫 화면에서 결과가 잘린다. -->
      <template #below-input>
        <p class="max-w-[65ch] rounded-lg border border-border bg-muted/30 px-3 py-2 text-caption leading-relaxed text-muted-foreground">
          환율 출처: {{ EXCHANGE_RATE_STATUS.source }}
        </p>
      </template>
    </ShCalculatorSplit>

    <TravelMetricGrid :items="metrics" />
    <TravelCostBars title="환전 수수료 그래프" :rows="result.rows" />
    <AffiliateLinkPanel
      title="환전 전에 같이 확인해 볼 여행 용품"
      description="환전 수수료를 줄였다면 캐리어, eSIM, 보조배터리 가격도 함께 체크해 보세요."
      :items="travelAffiliateItems"
    />
    <TravelRankTable
      title="우대율별 환전 수수료 비교"
      :rows="result.rows.map((row) => ({ name: row.name, value: formatWon(row.totalCost), helper: `${row.helper} · 수령액 ${formatNumber(row.foreignAmount)}` }))"
    />
  </div>
</template>
