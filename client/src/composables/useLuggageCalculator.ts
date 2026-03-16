import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { buildQuery, isSameQuery, parseQueryInt } from "@/lib/routeState";
import type { LuggageInput } from "@/lib/validators";
import { DEFAULT_LUGGAGE_INPUT, sanitizeLuggageInput } from "@/lib/validators";
import { calcLuggageComparison } from "@/utils/calculator";

export function useLuggageCalculator() {
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
    result: computed(() => calcLuggageComparison(state)),
    reset: () => Object.assign(state, DEFAULT_LUGGAGE_INPUT),
    applyPreset: (input: LuggageInput) => Object.assign(state, sanitizeLuggageInput(input)),
  };
}

function fromQuery(query: Record<string, unknown>): LuggageInput {
  return sanitizeLuggageInput({
    travelers: parseQueryInt(query.v) ?? undefined,
    bagsPerTraveler: parseQueryInt(query.b) ?? undefined,
    bagWeightKg: parseQueryInt(query.w) as LuggageInput["bagWeightKg"] | undefined,
    tripSegments: parseQueryInt(query.s) ?? undefined,
  });
}

function toQuery(input: LuggageInput): Record<string, string> {
  return buildQuery({ v: input.travelers, b: input.bagsPerTraveler, w: input.bagWeightKg, s: input.tripSegments });
}
