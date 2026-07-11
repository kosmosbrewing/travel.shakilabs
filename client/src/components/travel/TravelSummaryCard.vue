<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowDown, BarChart3 } from "lucide-vue-next";

interface SummaryFact {
  label: string;
  value: string;
}

defineProps<{
  headline: string;
  leaderValue: string;
  leaderLabel: string;
  leaderHint?: string;
  deltaValue: string;
  deltaLabel: string;
  facts: ReadonlyArray<SummaryFact>;
}>();
</script>

<template>
  <Card class="summary-card overflow-hidden border-border/60 shadow-sm">
    <CardContent class="p-0">
      <!-- 히어로: 최적 결과 -->
      <section class="travel-summary-hero px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
        <p class="text-tiny font-semibold uppercase tracking-widest text-primary">
          {{ leaderLabel }}
        </p>
        <p class="mt-1.5 text-[1.75rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2.125rem]">
          {{ leaderValue }}
        </p>
        <p v-if="leaderHint" class="mt-1 text-caption text-muted-foreground">
          {{ leaderHint }}
        </p>
      </section>

      <!-- 절감폭 배너 -->
      <div class="travel-summary-delta mx-4 rounded-xl bg-profit/8 px-4 py-3 sm:mx-5">
        <div class="flex items-center gap-2">
          <ArrowDown class="size-4 shrink-0 text-profit" :stroke-width="2.5" />
          <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span class="text-[1.25rem] font-bold tabular-nums text-profit sm:text-[1.375rem]">
              {{ deltaValue }}
            </span>
            <span class="text-caption font-medium text-profit/70">절감</span>
          </div>
        </div>
        <p class="mt-1 pl-6 text-tiny text-muted-foreground">
          {{ deltaLabel }}
        </p>
      </div>

      <!-- 인사이트 -->
      <div class="travel-summary-insight mx-4 mt-3 flex items-start gap-2 rounded-xl border border-border/40 bg-muted/15 px-3.5 py-2.5 sm:mx-5">
        <Sparkles class="mt-0.5 size-3.5 shrink-0 text-primary/70" />
        <p class="text-tiny leading-relaxed text-muted-foreground">
          {{ headline }}
        </p>
      </div>

      <!-- 구분선 -->
      <hr class="mx-4 mt-4 border-border/40 sm:mx-5" />

      <!-- 입력 기준 요약 -->
      <section class="travel-summary-facts px-5 pb-5 pt-3.5 sm:px-6 sm:pb-6">
        <div class="flex items-center gap-1.5 text-tiny font-semibold uppercase tracking-widest text-muted-foreground">
          <BarChart3 class="size-3.5" />
          입력 기준 요약
        </div>
        <div class="travel-summary-fact-grid mt-2.5 grid grid-cols-3 gap-2">
          <article
            v-for="fact in facts"
            :key="fact.label"
            class="rounded-lg bg-muted/30 px-3 py-2.5"
          >
            <p class="text-tiny font-medium text-muted-foreground">
              {{ fact.label }}
            </p>
            <p class="mt-1 text-body font-bold leading-snug text-foreground tabular-nums">
              {{ fact.value }}
            </p>
          </article>
        </div>
      </section>
    </CardContent>
  </Card>
</template>

<style scoped>
.summary-card {
  background: linear-gradient(
    to bottom,
    hsl(var(--card)) 0%,
    hsl(var(--muted) / 0.15) 100%
  );
}
</style>
