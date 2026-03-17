<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingDown } from "lucide-vue-next";

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
    <CardContent class="p-0">
      <section class="border-b border-border/60 bg-muted/20 px-4 py-4 sm:px-5">
        <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div class="min-w-0">
            <Badge variant="secondary" class="rounded-full px-3 py-1 text-[11px] tracking-[0.08em]">
              {{ leaderLabel }}
            </Badge>
            <div class="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
              <p class="text-[24px] font-bold leading-none tracking-tight text-foreground sm:text-[30px]">
                {{ leaderValue }}
              </p>
              <p v-if="leaderHint" class="text-caption leading-relaxed text-muted-foreground">
                {{ leaderHint }}
              </p>
            </div>
          </div>

          <div class="rounded-xl border border-profit/20 bg-profit/5 px-4 py-3 lg:min-w-[220px]">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-caption font-semibold text-muted-foreground">
                  {{ deltaLabel }}
                </p>
                <p class="mt-1.5 text-[22px] font-bold tracking-tight text-foreground sm:text-[26px]">
                  {{ deltaValue }}
                </p>
              </div>
              <Badge variant="profit" class="rounded-full px-3 py-1">
                절감 폭
              </Badge>
            </div>
          </div>
        </div>

        <div class="mt-3 flex items-start gap-2 rounded-xl border border-border/50 bg-background/80 px-3 py-2.5">
          <Sparkles class="mt-0.5 size-4 shrink-0 text-primary" />
          <p class="text-caption leading-relaxed text-muted-foreground">
            {{ headline }}
          </p>
        </div>
      </section>

      <section class="px-4 py-3 sm:px-5 sm:py-4">
        <div class="flex items-center gap-2 text-caption font-semibold text-muted-foreground">
          <TrendingDown class="size-4 text-primary" />
          입력 기준 요약
        </div>
        <div class="mt-3 grid gap-2 sm:grid-cols-3">
          <article
            v-for="fact in facts"
            :key="fact.label"
            class="rounded-xl border border-border/60 bg-muted/25 p-3"
          >
            <p class="text-caption font-semibold text-muted-foreground">
              {{ fact.label }}
            </p>
            <p class="mt-1.5 text-[16px] font-bold leading-snug text-foreground tabular-nums">
              {{ fact.value }}
            </p>
          </article>
        </div>
      </section>
    </CardContent>
  </Card>
</template>
