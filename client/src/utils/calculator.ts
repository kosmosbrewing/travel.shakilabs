import {
  BASE_EXCHANGE_RATES,
  BASE_SPREADS,
  ESIM_PLANS,
  EXCHANGE_BANKS,
  LUGGAGE_CARRIERS,
  POCKET_WIFI_DAILY_PRICE,
  POCKET_WIFI_ORDER_FEE,
  POCKET_WIFI_SHARE_CAPACITY,
  ROAMING_DAILY_PRICE,
} from "@/data/travelData";
import type { ExchangeInput, EsimInput, LuggageInput } from "@/lib/validators";
import {
  sanitizeExchangeInput,
  sanitizeEsimInput,
  sanitizeLuggageInput,
} from "@/lib/validators";

export interface RankedCostRow {
  name: string;
  totalCost: number;
  helper: string;
}

export interface ExchangeRow extends RankedCostRow {
  foreignAmount: number;
}

export interface LuggageResult {
  rows: RankedCostRow[];
  cheapest: RankedCostRow;
  priciest: RankedCostRow;
  spread: number;
  totalCheckedBags: number;
}

export interface ConnectivityResult {
  rows: RankedCostRow[];
  cheapest: RankedCostRow;
  priciest: RankedCostRow;
  spread: number;
  perTravelerDataGb: number;
}

export interface ExchangeResult {
  rows: ExchangeRow[];
  best: ExchangeRow;
  worst: ExchangeRow;
  spread: number;
}

function roundWon(value: number): number {
  return Math.round(value);
}

function sortByCost<T extends RankedCostRow>(rows: T[]): T[] {
  return [...rows].sort((left, right) => left.totalCost - right.totalCost);
}

function pickEsimPlan(days: number, dataGb: number) {
  return ESIM_PLANS.find((plan) => plan.days >= days && plan.dataGb >= dataGb) ?? ESIM_PLANS.at(-1)!;
}

export function calcLuggageComparison(input: LuggageInput): LuggageResult {
  const normalized = sanitizeLuggageInput(input);
  const totalCheckedBags = normalized.travelers * normalized.bagsPerTraveler * normalized.tripSegments;
  const rows = sortByCost(
    LUGGAGE_CARRIERS.map((carrier) => ({
      name: carrier.name,
      totalCost: carrier.rates[normalized.bagWeightKg] * totalCheckedBags,
      helper: `${normalized.bagWeightKg}kg × ${totalCheckedBags}개 기준`,
    })),
  );

  return {
    rows,
    cheapest: rows[0]!,
    priciest: rows.at(-1)!,
    spread: rows.at(-1)!.totalCost - rows[0]!.totalCost,
    totalCheckedBags,
  };
}

export function calcConnectivityComparison(input: EsimInput): ConnectivityResult {
  const normalized = sanitizeEsimInput(input);
  const perTravelerDataGb = Math.ceil(normalized.totalDataGb / normalized.travelers);
  const esimPlan = pickEsimPlan(normalized.tripDays, perTravelerDataGb);
  const pocketWifiUnits = Math.ceil(normalized.travelers / POCKET_WIFI_SHARE_CAPACITY);
  const rows = sortByCost([
    {
      name: "eSIM",
      totalCost: esimPlan.price * normalized.travelers,
      helper: `${esimPlan.name} × ${normalized.travelers}명`,
    },
    {
      name: "통신사 로밍",
      totalCost: ROAMING_DAILY_PRICE * normalized.tripDays * normalized.travelers,
      helper: `1일 ${ROAMING_DAILY_PRICE.toLocaleString("ko-KR")}원 × ${normalized.travelers}명`,
    },
    {
      name: "포켓와이파이",
      totalCost:
        POCKET_WIFI_DAILY_PRICE * normalized.tripDays * pocketWifiUnits + POCKET_WIFI_ORDER_FEE,
      helper: `${pocketWifiUnits}대 공유 + 왕복 배송비`,
    },
  ]);

  return {
    rows,
    cheapest: rows[0]!,
    priciest: rows.at(-1)!,
    spread: rows.at(-1)!.totalCost - rows[0]!.totalCost,
    perTravelerDataGb,
  };
}

export function calcExchangeComparison(input: ExchangeInput): ExchangeResult {
  const normalized = sanitizeExchangeInput(input);
  const baseRate = BASE_EXCHANGE_RATES[normalized.currency];
  const baseSpread = BASE_SPREADS[normalized.currency];
  const rows = sortByCost(
    EXCHANGE_BANKS.map((bank) => {
      const effectiveRate = baseSpread * (1 - bank.discountRate);
      const totalCost = roundWon(normalized.amountKrw * effectiveRate);
      return {
        name: bank.name,
        totalCost,
        foreignAmount: (normalized.amountKrw - totalCost) / baseRate,
        helper: `환전 우대 ${(bank.discountRate * 100).toFixed(0)}%`,
      };
    }),
  );

  return {
    rows,
    best: rows[0]!,
    worst: rows.at(-1)!,
    spread: rows.at(-1)!.totalCost - rows[0]!.totalCost,
  };
}
