<script setup lang="ts">
import { computed } from "vue";
import AffiliateLinkPanel from "@/components/common/AffiliateLinkPanel.vue";
import TravelMetricGrid from "@/components/travel/TravelMetricGrid.vue";
import TravelCostBars from "@/components/travel/TravelCostBars.vue";
import TravelRankTable from "@/components/travel/TravelRankTable.vue";
import TravelScenarioChips from "@/components/travel/TravelScenarioChips.vue";
import TravelSummaryCard from "@/components/travel/TravelSummaryCard.vue";
import { travelAffiliateItems } from "@/data/affiliateLinks";
import { TRAVEL_ASSUMPTION_NOTE, esimPresets } from "@/data/travelData";
import { useEsimCalculator } from "@/composables/useEsimCalculator";
import { formatWon } from "@/lib/utils";

const { state, result, applyPreset, reset } = useEsimCalculator();

const metrics = computed(() => [
  { label: "가장 저렴한 옵션", value: result.value.cheapest.name, helper: formatWon(result.value.cheapest.totalCost) },
  { label: "가장 비싼 옵션", value: result.value.priciest.name, helper: formatWon(result.value.priciest.totalCost) },
  { label: "옵션 간 차이", value: formatWon(result.value.spread), helper: "통신비 예산 차이" },
  { label: "인당 예상 데이터", value: `${result.value.perTravelerDataGb}GB`, helper: "총 데이터 ÷ 인원수" },
]);

function selectPreset(key: string): void {
  const preset = esimPresets.find((item) => item.key === key);
  if (preset) applyPreset(preset.input);
}
</script>

<template>
  <div class="space-y-4">
    <TravelScenarioChips :items="esimPresets" @select="selectPreset" />

    <div class="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <section class="retro-panel-muted p-4 space-y-4">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="space-y-1.5">
            <span class="text-caption font-semibold text-foreground">여행 일수</span>
            <input v-model.number="state.tripDays" class="retro-input" min="1" max="30" type="number" />
          </label>
          <label class="space-y-1.5">
            <span class="text-caption font-semibold text-foreground">총 데이터량</span>
            <input v-model.number="state.totalDataGb" class="retro-input" min="1" max="120" type="number" />
          </label>
          <label class="space-y-1.5 sm:col-span-2">
            <span class="text-caption font-semibold text-foreground">동행 인원</span>
            <input v-model.number="state.travelers" class="retro-input" min="1" max="8" type="number" />
          </label>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="retro-panel px-3 py-2 text-caption font-semibold text-foreground" @click="reset">
            기본값으로 초기화
          </button>
          <p class="text-tiny text-muted-foreground">포켓와이파이는 최대 3명 공유, 로밍은 인원별 과금으로 가정합니다.</p>
        </div>
      </section>

      <TravelSummaryCard
        headline="인원 수가 늘면 포켓와이파이, 혼자면 eSIM이 유리한 구간이 자주 나옵니다."
        :leader-value="result.cheapest.name"
        leader-label="이번 조건 최저가 옵션"
        :leader-hint="`${state.tripDays}일 · ${state.travelers}명 여행 기준`"
        :delta-value="formatWon(result.spread)"
        delta-label="최저가와 최고가 차이"
        :facts="[
          { label: '최저가 총액', value: formatWon(result.cheapest.totalCost) },
          { label: '총 여행일', value: `${state.tripDays}일` },
          { label: '인당 데이터', value: `${result.perTravelerDataGb}GB` },
        ]"
      />
    </div>

    <p class="text-caption leading-relaxed text-muted-foreground">{{ TRAVEL_ASSUMPTION_NOTE }}</p>
    <TravelMetricGrid :items="metrics" />
    <TravelCostBars title="통신 옵션 총비용 그래프" :rows="result.rows" />
    <AffiliateLinkPanel
      title="통신비 비교 후 같이 보는 준비물"
      description="eSIM 비용을 계산했다면 캐리어와 보조배터리 같은 출국 준비물도 함께 확인해 보세요."
      :items="travelAffiliateItems"
    />
    <TravelRankTable
      title="통신 옵션별 총비용"
      :rows="result.rows.map((row) => ({ name: row.name, value: formatWon(row.totalCost), helper: row.helper }))"
    />
  </div>
</template>
