<script setup lang="ts">
import { computed, useId } from "vue";
import { formatWon } from "@/lib/utils";
// 막대 폭 계산은 @shakilabs/ui 공용 차트 수학으로 일원화 (로컬 chartMath 중복 제거)
import { positiveBarWidth } from "@shakilabs/ui";
import type { RankedCostRow } from "@/utils/calculator";

const props = defineProps<{
  title: string;
  rows: readonly RankedCostRow[];
}>();
const titleId = `travel-cost-${useId()}`;
const maximum = computed(() => Math.max(...props.rows.map((row) => row.totalCost), 0));
const cheapest = computed(() => Math.min(...props.rows.map((row) => row.totalCost)));
</script>

<template>
  <section class="retro-panel overflow-hidden" :aria-labelledby="titleId">
    <div class="retro-titlebar rounded-t-2xl">
      <h2 :id="titleId" class="retro-title">{{ title }}</h2>
    </div>
    <div class="retro-panel-content space-y-3">
      <p class="text-tiny leading-relaxed text-muted-foreground">
        모든 옵션을 0원 기준으로 비교합니다. 강조된 막대가 현재 입력 조건의 최저 비용입니다.
      </p>
      <div v-for="row in rows" :key="row.name" class="space-y-1.5">
        <div class="flex items-baseline justify-between gap-3 text-caption">
          <span class="font-semibold" :class="row.totalCost === cheapest ? 'text-profit' : 'text-foreground'">{{ row.name }}</span>
          <strong class="tabular-nums" :class="row.totalCost === cheapest ? 'text-profit' : 'text-foreground'">{{ formatWon(row.totalCost) }}</strong>
        </div>
        <div class="h-3 overflow-hidden rounded-full bg-muted/55">
          <!-- preserveAspectRatio="none" 라 rect 의 rx 는 가로로만 늘어난다(폭 784px 기준 rx=4 -> 33.8px, 세로는 4px).
               코너 반경은 래퍼의 rounded-full + overflow-hidden 에 맡긴다 — @shakilabs/ui 0.3.11 과 동일한 처리. -->
          <svg viewBox="0 0 100 12" preserveAspectRatio="none" class="block h-full w-full" aria-hidden="true">
            <rect :width="positiveBarWidth(row.totalCost, maximum)" height="12" :class="row.totalCost === cheapest ? 'fill-profit' : 'fill-muted-foreground/45'" />
          </svg>
        </div>
        <p class="text-tiny text-muted-foreground">{{ row.helper }}</p>
      </div>
    </div>
  </section>
</template>
