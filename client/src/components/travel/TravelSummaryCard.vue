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
    <CardContent class="p-0">
      <div class="grid lg:grid-cols-[1.05fr_0.95fr]">
        <section class="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/15 via-background to-primary/5 lg:border-b-0 lg:border-r">
          <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/55 to-transparent" />
          <div class="relative space-y-4 p-5 sm:p-6">
            <div class="flex items-start justify-between gap-3">
              <div>
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

            <div class="rounded-[1.4rem] border border-border/60 bg-card/90 p-4 shadow-sm backdrop-blur">
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

            <div class="flex items-start gap-3 rounded-[1.4rem] border border-border/60 bg-background/72 p-4">
              <Sparkles class="mt-0.5 size-4 shrink-0 text-primary" />
              <p class="text-caption leading-relaxed text-muted-foreground">
                {{ headline }}
              </p>
            </div>
          </div>
        </section>

        <section class="bg-card/70 p-5 sm:p-6">
          <div class="flex items-center gap-2 text-caption font-semibold text-muted-foreground">
            <TrendingDown class="size-4 text-primary" />
            입력 기준 요약
          </div>
          <div class="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <article
              v-for="fact in facts"
              :key="fact.label"
              class="rounded-[1.25rem] border border-border/60 bg-muted/30 p-4"
            >
              <p class="text-caption font-semibold text-muted-foreground">
                {{ fact.label }}
              </p>
              <p class="mt-2 text-[18px] font-bold leading-snug text-foreground tabular-nums">
                {{ fact.value }}
              </p>
            </article>
          </div>
        </section>
      </div>
    </CardContent>
  </Card>
</template>
