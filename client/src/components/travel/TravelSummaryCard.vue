<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Compass, Sparkles, TrendingDown } from "lucide-vue-next";

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
  <Card class="overflow-hidden border-border/60 shadow-sm">
    <CardContent class="relative overflow-hidden bg-gradient-to-br from-primary/15 via-background to-primary/5 p-5 sm:p-6">
      <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/55 to-transparent" />
      <div class="relative">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <Badge variant="secondary" class="rounded-full px-3 py-1 text-[11px] tracking-[0.08em]">
              {{ leaderLabel }}
            </Badge>
            <p class="mt-3 text-[28px] font-bold leading-none tracking-tight text-foreground sm:text-[34px]">
              {{ leaderValue }}
            </p>
            <p v-if="leaderHint" class="mt-2 text-caption leading-relaxed text-muted-foreground">
              {{ leaderHint }}
            </p>
          </div>
          <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <Compass class="size-5" />
          </div>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-stretch">
          <div class="flex items-start gap-3 rounded-[1.2rem] border border-border/60 bg-background/72 p-4">
            <Sparkles class="mt-0.5 size-4 shrink-0 text-primary" />
            <p class="text-caption leading-relaxed text-muted-foreground">
              {{ headline }}
            </p>
          </div>

          <div class="rounded-[1.2rem] border border-border/60 bg-card/90 p-4 shadow-sm backdrop-blur sm:min-w-[188px]">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-caption font-semibold text-muted-foreground">
                  {{ deltaLabel }}
                </p>
                <p class="mt-2 text-[24px] font-bold tracking-tight text-foreground sm:text-[28px]">
                  {{ deltaValue }}
                </p>
              </div>
              <Badge variant="profit" class="rounded-full px-3 py-1">
                절감 폭
              </Badge>
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-2 text-caption font-semibold text-muted-foreground">
          <TrendingDown class="size-4 text-primary" />
          입력 기준 요약
        </div>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <article
            v-for="(fact, index) in facts"
            :key="fact.label"
            :class="[
              'rounded-[1rem] border border-border/60 bg-muted/35 p-3',
              index === facts.length - 1 ? 'sm:col-span-2' : ''
            ]"
          >
            <p class="text-caption font-semibold text-muted-foreground">
              {{ fact.label }}
            </p>
            <p class="mt-1.5 text-[16px] font-bold leading-snug text-foreground tabular-nums">
              {{ fact.value }}
            </p>
          </article>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
