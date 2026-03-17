<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SummaryFact {
  label: string;
  value: string;
}

defineProps<{
  title: string;
  leaderValue: string;
  leaderLabel?: string;
  deltaValue: string;
  deltaLabel: string;
  facts?: SummaryFact[];
  highlight?: boolean;
  showShare?: boolean;
  showDetail?: boolean;
  detailLabel?: string;
}>();

defineEmits<{
  share: [];
  detail: [];
}>();
</script>

<template>
  <Card class="overflow-hidden">
    <CardHeader
      :class="[
        'flex-col items-start gap-1 rounded-t-2xl border-b border-border/70 sm:flex-row sm:items-center sm:gap-3',
        highlight
          ? 'bg-[linear-gradient(135deg,rgba(249,115,22,0.96),rgba(251,146,60,0.88))]'
          : 'bg-muted/35'
      ]"
    >
      <p
        :class="[
          'text-[11px] font-bold uppercase tracking-[0.14em] sm:text-[13px]',
          highlight ? 'text-white/80' : 'text-muted-foreground'
        ]"
      >
        {{ leaderLabel ?? "가장 유리한 마켓" }}
      </p>
      <p
        :class="[
          'text-[24px] font-bold leading-none sm:text-[32px]',
          highlight ? 'text-white' : 'text-foreground'
        ]"
      >
        {{ leaderValue }}
      </p>
    </CardHeader>

    <CardContent class="p-0">
      <table class="w-full text-body">
        <tbody>
          <tr class="border-b border-border/40 bg-profit/5 dark:bg-profit/12">
            <td class="whitespace-nowrap px-4 py-3 text-caption font-semibold text-muted-foreground">
              {{ deltaLabel }}
            </td>
            <td class="px-4 py-3 text-right">
              <Badge variant="profit" class="rounded-full px-3 py-1 text-[17px] font-bold tabular-nums sm:text-[22px]">
                {{ deltaValue }}
              </Badge>
            </td>
          </tr>
          <tr
            v-for="(fact, index) in facts"
            :key="fact.label"
            :class="index < (facts?.length ?? 0) - 1 ? 'border-b border-border/40' : ''"
          >
            <td class="whitespace-nowrap px-4 py-2.5 text-caption font-semibold text-muted-foreground">
              {{ fact.label }}
            </td>
            <td class="px-4 py-2.5 text-right text-[14px] font-bold tabular-nums sm:text-[15px]">
              {{ fact.value }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="px-4 pb-1 pt-3">
        <p class="text-caption leading-relaxed text-muted-foreground">
          {{ title }}
        </p>
      </div>
    </CardContent>

    <CardFooter v-if="showDetail || showShare" class="flex-wrap gap-2.5 border-t border-border/40 py-3">
      <Button
        v-if="showDetail"
        type="button"
        variant="default"
        size="sm"
        @click="$emit('detail')"
      >
        {{ detailLabel ?? "상세 비교 보기" }}
      </Button>
      <Button
        v-if="showShare"
        type="button"
        variant="default"
        size="sm"
        @click="$emit('share')"
      >
        결과 공유하기
      </Button>
    </CardFooter>
  </Card>
</template>
