<script setup lang="ts">
import { computed } from "vue";
import AffiliateLinkPanel from "@/components/common/AffiliateLinkPanel.vue";
import SummaryBanner from "@/components/common/SummaryBanner.vue";
import TravelMetricGrid from "@/components/travel/TravelMetricGrid.vue";
import TravelRankTable from "@/components/travel/TravelRankTable.vue";
import TravelScenarioChips from "@/components/travel/TravelScenarioChips.vue";
import { travelAffiliateItems } from "@/data/affiliateLinks";
import { TRAVEL_ASSUMPTION_NOTE, luggagePresets } from "@/data/travelData";
import { useLuggageCalculator } from "@/composables/useLuggageCalculator";
import { formatWon } from "@/lib/utils";

const { state, result, applyPreset, reset } = useLuggageCalculator();

const metrics = computed(() => [
  { label: "가장 저렴한 총액", value: formatWon(result.value.cheapest.totalCost), helper: result.value.cheapest.name },
  { label: "가장 비싼 총액", value: formatWon(result.value.priciest.totalCost), helper: result.value.priciest.name },
  { label: "옵션 간 차이", value: formatWon(result.value.spread), helper: "최저가와 최고가 차이" },
  { label: "총 맡길 가방", value: `${result.value.totalCheckedBags}개`, helper: "왕복 구간 포함" },
]);

function selectPreset(key: string): void {
  const preset = luggagePresets.find((item) => item.key === key);
  if (preset) applyPreset(preset.input);
}
</script>

<template>
  <div class="space-y-4">
    <TravelScenarioChips :items="luggagePresets" @select="selectPreset" />

    <div class="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <section class="retro-panel-muted p-4 space-y-4">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="space-y-1.5">
            <span class="text-caption font-semibold text-foreground">여행 인원</span>
            <input v-model.number="state.travelers" class="retro-input" min="1" max="8" type="number" />
          </label>
          <label class="space-y-1.5">
            <span class="text-caption font-semibold text-foreground">인당 가방 수</span>
            <input v-model.number="state.bagsPerTraveler" class="retro-input" min="1" max="3" type="number" />
          </label>
          <label class="space-y-1.5">
            <span class="text-caption font-semibold text-foreground">가방 무게</span>
            <select v-model.number="state.bagWeightKg" class="retro-input">
              <option :value="15">15kg</option>
              <option :value="20">20kg</option>
              <option :value="25">25kg</option>
            </select>
          </label>
          <label class="space-y-1.5">
            <span class="text-caption font-semibold text-foreground">구간 수</span>
            <select v-model.number="state.tripSegments" class="retro-input">
              <option :value="1">편도</option>
              <option :value="2">왕복</option>
            </select>
          </label>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="retro-panel px-3 py-2 text-caption font-semibold text-foreground" @click="reset">
            기본값으로 초기화
          </button>
          <p class="text-tiny text-muted-foreground">LCC 사전구매 기준 예시 요금으로 계산합니다.</p>
        </div>
      </section>

      <SummaryBanner
        title="동일한 가방 수라도 항공사별 총액 차이가 크게 벌어질 수 있습니다."
        :leader-value="result.cheapest.name"
        :delta-value="formatWon(result.spread)"
        delta-label="가장 비싼 옵션 대비 차이"
        :facts="[
          { label: '최저가 총액', value: formatWon(result.cheapest.totalCost) },
          { label: '총 수하물 수', value: `${result.totalCheckedBags}개` },
          { label: '적용 무게', value: `${state.bagWeightKg}kg` },
        ]"
        highlight
      />
    </div>

    <p class="text-caption leading-relaxed text-muted-foreground">{{ TRAVEL_ASSUMPTION_NOTE }}</p>
    <TravelMetricGrid :items="metrics" />
    <AffiliateLinkPanel
      title="출국 전에 같이 챙기는 여행 준비물"
      description="수하물 비용을 확인했다면 캐리어, eSIM, 보조배터리 가격도 함께 점검해 보세요."
      :items="travelAffiliateItems"
    />
    <TravelRankTable
      title="항공사별 위탁수하물 총비용"
      :rows="result.rows.map((row) => ({ name: row.name, value: formatWon(row.totalCost), helper: row.helper }))"
    />
  </div>
</template>
