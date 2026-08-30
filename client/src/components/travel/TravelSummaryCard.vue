<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowDown, BarChart3 } from "lucide-vue-next";

interface SummaryFact {
  label: string;
  value: string;
}

const props = defineProps<{
  headline: string;
  leaderValue: string;
  leaderLabel: string;
  leaderHint?: string;
  deltaValue: string;
  deltaLabel: string;
  facts: ReadonlyArray<SummaryFact>;
}>();

// 카운트업 정책(2026-08 복원): 히어로 금액(절감액)만 애니메이션한다.
// 리더는 텍스트(옵션 이름)라 대상이 아니고, 보조 스탯은 정적 유지.
// - SSR/SSG 산출물에는 항상 최종값이 정적으로 남는다(초기 ref = props.deltaValue,
//   애니메이션은 onMounted 이후에만 → 하이드레이션 불일치 없음).
// - 마운트 시 0→값, props 변경 시 현재 표시값→새 값으로 보간.
// - prefers-reduced-motion 이면 즉시 최종값.
const DURATION_MS = 750;
const NUM_RE = /-?\d[\d,]*(?:\.\d+)?/;

const displayDelta = ref(props.deltaValue);
let rafId = 0;

function parseNum(text: string): { num: number; decimals: number } | null {
  const m = text.match(NUM_RE);
  if (!m) return null;
  const raw = m[0].replace(/,/g, "");
  const num = Number(raw);
  if (!Number.isFinite(num)) return null;
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return { num, decimals };
}

function formatLike(template: string, n: number, decimals: number): string {
  const grouped = template.match(NUM_RE)?.[0].includes(",") ?? false;
  const formatted = n.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
  return template.replace(NUM_RE, formatted);
}

function animateTo(from: number, target: string) {
  cancelAnimationFrame(rafId);
  const parsed = parseNum(target);
  if (
    !parsed ||
    parsed.num === from ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    displayDelta.value = target;
    return;
  }
  const start = performance.now();
  const delta = parsed.num - from;
  const tick = (now: number) => {
    const t = Math.min((now - start) / DURATION_MS, 1);
    if (t >= 1) {
      displayDelta.value = target;
      return;
    }
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    displayDelta.value = formatLike(target, from + delta * eased, parsed.decimals);
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  animateTo(0, props.deltaValue);
  watch(
    () => props.deltaValue,
    (next) => {
      const current = parseNum(displayDelta.value)?.num ?? 0;
      animateTo(current, next);
    },
  );
});

onBeforeUnmount(() => cancelAnimationFrame(rafId));
</script>

<template>
  <Card class="summary-card overflow-hidden border-border/60 shadow-sm">
    <CardContent class="p-0">
      <!-- 히어로: 최적 결과 -->
      <section class="travel-summary-hero px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
        <p class="text-tiny font-semibold uppercase tracking-widest text-primary">
          {{ leaderLabel }}
        </p>
        <p class="travel-result-leader mt-1.5 font-bold tracking-tight text-foreground">
          {{ leaderValue }}
        </p>
        <p v-if="leaderHint" class="mt-1 text-caption text-muted-foreground">
          {{ leaderHint }}
        </p>
      </section>

      <!-- 절감폭 배너 -->
      <!-- 알파는 Tailwind opacity 스케일(0,5,10,…,100) 값만 쓴다. /8은 스케일 밖이라
           클래스 자체가 생성되지 않아 틴트가 아예 칠해지지 않았다(픽셀 실측 배경 #ffffff). -->
      <div class="travel-summary-delta mx-4 rounded-xl bg-profit/10 px-4 py-3 sm:mx-5">
        <div class="flex items-center gap-2">
          <ArrowDown class="size-4 shrink-0 text-profit" :stroke-width="2.5" />
          <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <!-- 금액 자체는 중립색으로 읽는다. 의미는 아이콘·"절감" 라벨·배경 틴트가 이미
                 전달하므로, 큰 숫자까지 의미색으로 칠하면 색이 유일한 정보 전달 수단이 된다.
                 (text-profit 3.85:1 -> text-foreground 16.3:1) -->
            <!-- 22px 임의 스케일 → 전 앱 공통 결과 금액 스케일 text-display(26px/700) -->
            <span class="text-display font-bold tabular-nums text-foreground">
              {{ displayDelta }}
            </span>
            <!-- /70 알파는 2.48:1로 하드 미달이었다. 알파를 걷어 7.20:1 -->
            <span class="text-caption font-medium text-profit">절감</span>
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
        <div class="travel-summary-fact-grid mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
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
