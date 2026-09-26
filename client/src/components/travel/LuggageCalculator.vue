<script setup lang="ts">
import { ShBulletProgress, ShCalculatorSplit, ShSurface, ShText } from "@shakilabs/ui";
import AffiliateLinkPanel from "@/components/common/AffiliateLinkPanel.vue";
import FreshBadge from "@/components/common/FreshBadge.vue";
import TravelCostBars from "@/components/travel/TravelCostBars.vue";
import TravelRankTable from "@/components/travel/TravelRankTable.vue";
import TravelScenarioChips from "@/components/travel/TravelScenarioChips.vue";
import TravelSummaryCard from "@/components/travel/TravelSummaryCard.vue";
import { travelAffiliateItems } from "@/data/affiliateLinks";
import { TRAVEL_ASSUMPTION_NOTE, TRAVEL_BADGE_MESSAGE, luggagePresets } from "@/data/travelData";
import { useLuggageCalculator } from "@/composables/useLuggageCalculator";
import { formatWon } from "@/lib/utils";

const { state, result, applyPreset, reset } = useLuggageCalculator();

// 지표 그리드는 두지 않는다 — 남아 있던 1칸(가장 비싼 총액·시나리오 이름)은 요약 카드 '입력 기준 요약'·비중 막대·
// 총비용 그래프·시나리오 표(priciest = rows 마지막 행)에 이미 있어 중복이었고, 4열 격자에 1칸만 한 줄로 떠 있었다.

function selectPreset(key: string): void {
  const preset = luggagePresets.find((item) => item.key === key);
  if (preset) applyPreset(preset.input);
}
</script>

<template>
  <div class="space-y-5">
    <!-- 입력 카드 | 결과 카드 1×2(64rem부터 1:1). 예전 큰 카드 안 xl 중첩 격자는 1024~1279px에서 한 줄로 쌓여 결과가 첫 화면 밖으로 밀렸다. -->
    <!-- 틀과 그 조상에는 overflow를 걸지 않는다 — 결과 칸 붙임(sticky) 판정이 죽는다. -->
    <ShCalculatorSplit>
      <template #input>
        <ShSurface as="section" padding="none" class="overflow-hidden" aria-labelledby="luggage-input-title">
          <div class="retro-titlebar rounded-t-2xl">
            <ShText id="luggage-input-title" as="h2" variant="heading">수하물 조건 입력</ShText>
            <FreshBadge :message="TRAVEL_BADGE_MESSAGE" />
          </div>
          <div class="luggage-input-panel retro-panel-content space-y-4">
            <!-- 반폭 칸 안이라 2열은 짧은 숫자 쌍(인원·가방 수)만, 셀렉트는 선택값이 잘리지 않게 전체 폭 -->
            <div class="grid gap-3 sm:grid-cols-2">
              <label class="space-y-1.5">
                <span class="text-caption font-semibold text-foreground">여행 인원</span>
                <input v-model.number="state.travelers" class="retro-input" min="1" max="8" type="number" />
              </label>
              <label class="space-y-1.5">
                <span class="text-caption font-semibold text-foreground">인당 가방 수</span>
                <input v-model.number="state.bagsPerTraveler" class="retro-input" min="1" max="3" type="number" />
              </label>
              <label class="space-y-1.5 sm:col-span-2">
                <span class="text-caption font-semibold text-foreground">가방 무게</span>
                <select v-model.number="state.bagWeightKg" class="retro-input">
                  <option :value="15">15kg</option>
                  <option :value="20">20kg</option>
                  <option :value="25">25kg</option>
                </select>
              </label>
              <label class="space-y-1.5 sm:col-span-2">
                <span class="text-caption font-semibold text-foreground">구간 수</span>
                <select v-model.number="state.tripSegments" class="retro-input">
                  <option :value="1">편도</option>
                  <option :value="2">왕복</option>
                </select>
              </label>
            </div>

            <!-- 시나리오 프리셋은 칸 아래 한 줄(넘치면 줄바꿈) — 틀 위에 두면 결과 칸까지 같이 밀린다 -->
            <TravelScenarioChips :items="luggagePresets" @select="selectPreset" />

            <div class="flex flex-wrap items-center gap-2">
              <button type="button" class="retro-panel px-3 py-2 text-caption font-semibold text-foreground" @click="reset">
                기본값으로 초기화
              </button>
              <p class="text-tiny text-muted-foreground">노선별 공식 견적이 아닌 낮음·중간·높음 예산 시나리오입니다.</p>
            </div>
          </div>
        </ShSurface>
      </template>

      <template #result>
        <TravelSummaryCard
          headline="노선과 운임 종류에 따라 실제 수하물 총액은 예산 범위를 벗어날 수 있습니다."
          :leader-value="result.cheapest.name"
          leader-label="낮은 예산 시나리오"
          :leader-hint="`${state.tripSegments === 2 ? '왕복' : '편도'} · ${state.travelers}명 기준`"
          :delta-value="formatWon(result.spread)"
          delta-label="가장 비싼 옵션 대비 차이"
          :facts="[
            { label: '최저가 총액', value: formatWon(result.cheapest.totalCost) },
            { label: '가장 비싼 총액', value: formatWon(result.priciest.totalCost) },
            { label: '총 수하물 수', value: `${result.totalCheckedBags}개` },
          ]"
        />
      </template>
    </ShCalculatorSplit>

    <p class="max-w-[65ch] text-caption leading-relaxed text-muted-foreground">{{ TRAVEL_ASSUMPTION_NOTE }}</p>
    <ShBulletProgress
      label="가장 비싼 시나리오 대비 최저가 비중"
      :value="result.cheapest.totalCost"
      :limit="result.priciest.totalCost"
      :format-value="formatWon"
      limit-label="가장 비싼 옵션"
      note="막대 전체는 가장 비싼 예산 시나리오 총액이며, 채워진 구간이 가장 낮은 예산 시나리오가 차지하는 비중입니다."
    />
    <TravelCostBars title="위탁수하물 총비용 그래프" :rows="result.rows" />

    <AffiliateLinkPanel
      title="출국 전에 같이 챙기는 여행 준비물"
      description="수하물 비용을 확인했다면 캐리어, eSIM, 보조배터리 가격도 함께 점검해 보세요."
      :items="travelAffiliateItems"
    />
    <TravelRankTable
      title="위탁수하물 예산 시나리오"
      :rows="result.rows.map((row) => ({ name: row.name, value: formatWon(row.totalCost), helper: row.helper }))"
    />
  </div>
</template>
