<script setup lang="ts">
import { computed, useId } from "vue";
import { formatWon } from "@/lib/utils";
import { positiveBarWidth } from "@/utils/chartMath";
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
          <svg viewBox="0 0 100 12" preserveAspectRatio="none" class="block h-full w-full" aria-hidden="true">
            <rect :width="positiveBarWidth(row.totalCost, maximum)" height="12" rx="4" :class="row.totalCost === cheapest ? 'fill-profit' : 'fill-muted-foreground/45'" />
          </svg>
        </div>
        <p class="text-tiny text-muted-foreground">{{ row.helper }}</p>
      </div>
    </div>
  </section>
</template>
