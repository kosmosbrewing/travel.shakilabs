import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { buildQuery, isSameQuery, parseQueryInt, queryFirst } from "@/lib/routeState";
import type { ExchangeInput } from "@/lib/validators";
import { DEFAULT_EXCHANGE_INPUT, sanitizeExchangeInput } from "@/lib/validators";
import { calcExchangeComparison } from "@/utils/calculator";

export function useExchangeCalculator() {
  const route = useRoute();
  const router = useRouter();
  const state = reactive(fromQuery(route.query));
  let syncingFromRoute = false;

  watch(() => route.query, (query) => {
    const next = fromQuery(query);
    if (isSameQuery(toQuery(state), toQuery(next))) return;
    syncingFromRoute = true;
    Object.assign(state, next);
    syncingFromRoute = false;
  });

  watch(state, () => {
    if (typeof window === "undefined" || syncingFromRoute) return;
    const nextQuery = toQuery(state);
    if (isSameQuery(route.query, nextQuery)) return;
    void router.replace({ query: nextQuery });
  }, { deep: true });

  return {
    state,
    result: computed(() => calcExchangeComparison(state)),
    reset: () => Object.assign(state, DEFAULT_EXCHANGE_INPUT),
    applyPreset: (input: ExchangeInput) => Object.assign(state, sanitizeExchangeInput(input)),
  };
}

function fromQuery(query: Record<string, unknown>): ExchangeInput {
  return sanitizeExchangeInput({
    amountKrw: parseQueryInt(query.a) ?? undefined,
    currency: queryFirst(query.c) as ExchangeInput["currency"] | undefined,
  });
}

function toQuery(input: ExchangeInput): Record<string, string> {
  return buildQuery({ a: input.amountKrw, c: input.currency });
}
