<script setup lang="ts">
import { computed } from "vue";
import AffiliateLinkPanel from "@/components/common/AffiliateLinkPanel.vue";
import SummaryBanner from "@/components/common/SummaryBanner.vue";
import TravelMetricGrid from "@/components/travel/TravelMetricGrid.vue";
import TravelRankTable from "@/components/travel/TravelRankTable.vue";
import TravelScenarioChips from "@/components/travel/TravelScenarioChips.vue";
import { travelAffiliateItems } from "@/data/affiliateLinks";
import { exchangePresets } from "@/data/travelData";
import { useExchangeCalculator } from "@/composables/useExchangeCalculator";
import { formatNumber, formatWon } from "@/lib/utils";

const { state, result, applyPreset, reset } = useExchangeCalculator();

const metrics = computed(() => [
  { label: "최저 수수료", value: formatWon(result.value.best.totalCost), helper: result.value.best.name },
  { label: "최고 수수료", value: formatWon(result.value.worst.totalCost), helper: result.value.worst.name },
  { label: "은행 간 차이", value: formatWon(result.value.spread), helper: "같은 환전금액 기준" },
  { label: "최저가 수령액", value: formatNumber(result.value.best.foreignAmount), helper: `${state.currency} 기준` },
]);

function selectPreset(key: string): void {
  const preset = exchangePresets.find((item) => item.key === key);
  if (preset) applyPreset(preset.input);
}
</script>

<template>
  <div class="space-y-4">
    <TravelScenarioChips :items="exchangePresets" @select="selectPreset" />

    <div class="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <section class="retro-panel-muted p-4 space-y-4">
        <div class="grid gap-3 sm:grid-cols-2">
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

        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="retro-panel px-3 py-2 text-caption font-semibold text-foreground" @click="reset">
            기본값으로 초기화
          </button>
          <p class="text-tiny text-muted-foreground">현찰 살 때 우대율만 반영한 단순 수수료 비교입니다.</p>
        </div>
      </section>

      <SummaryBanner
        title="환전금액이 커질수록 은행별 우대율 차이가 체감 비용으로 이어집니다."
        :leader-value="result.best.name"
        :delta-value="formatWon(result.spread)"
        delta-label="최저 수수료와 최고 수수료 차이"
        :facts="[
          { label: '최저 수수료', value: formatWon(result.best.totalCost) },
          { label: '환전 금액', value: formatWon(state.amountKrw) },
          { label: '통화', value: state.currency },
        ]"
        highlight
      />
    </div>

    <TravelMetricGrid :items="metrics" />
    <AffiliateLinkPanel
      title="환전 전에 같이 확인해 볼 여행 용품"
      description="환전 수수료를 줄였다면 캐리어, eSIM, 보조배터리 가격도 함께 체크해 보세요."
      :items="travelAffiliateItems"
    />
    <TravelRankTable
      title="은행별 환전 수수료 비교"
      :rows="result.rows.map((row) => ({ name: row.name, value: formatWon(row.totalCost), helper: `${row.helper} · 수령액 ${formatNumber(row.foreignAmount)}` }))"
    />
  </div>
</template>
