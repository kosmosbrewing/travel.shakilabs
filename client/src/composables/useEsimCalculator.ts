import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { buildQuery, isSameQuery, parseQueryInt } from "@/lib/routeState";
import type { EsimInput } from "@/lib/validators";
import { DEFAULT_ESIM_INPUT, sanitizeEsimInput } from "@/lib/validators";
import { calcConnectivityComparison } from "@/utils/calculator";

export function useEsimCalculator() {
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
    result: computed(() => calcConnectivityComparison(state)),
    reset: () => Object.assign(state, DEFAULT_ESIM_INPUT),
    applyPreset: (input: EsimInput) => Object.assign(state, sanitizeEsimInput(input)),
  };
}

function fromQuery(query: Record<string, unknown>): EsimInput {
  return sanitizeEsimInput({
    tripDays: parseQueryInt(query.d) ?? undefined,
    totalDataGb: parseQueryInt(query.g) ?? undefined,
    travelers: parseQueryInt(query.t) ?? undefined,
  });
}

function toQuery(input: EsimInput): Record<string, string> {
  return buildQuery({ d: input.tripDays, g: input.totalDataGb, t: input.travelers });
}
