import { computed, reactive } from "vue";
import { fetchExchangeRateSnapshot, type ExchangeRateApiSnapshot } from "@/lib/publicDataApi";
import { isRemoteConstantsEnabled } from "@/lib/api";

export type TravelCurrency = "USD" | "JPY" | "EUR";

export const BASE_EXCHANGE_RATES = reactive<Record<TravelCurrency, number>>({
  USD: 1_370,
  JPY: 9.1,
  EUR: 1_490,
});

export const EXCHANGE_RATE_STATUS = reactive({
  lastUpdated: "실시간 환율 연동 전 · 2026년 3월 수동 가정값",
  source: "API 응답 실패 시 사용하는 비교용 기본값",
});

const rateUnits: Record<TravelCurrency, number> = {
  USD: 1,
  JPY: 1,
  EUR: 1,
};

let exchangeRatesPromise: Promise<void> | null = null;

function toKrwPerUnit(snapshot: ExchangeRateApiSnapshot, currency: TravelCurrency): number | null {
  const krwRate = snapshot.rates.KRW;
  const currencyRate = snapshot.rates[currency];
  if (!krwRate || !currencyRate) return null;
  return Number(((krwRate / currencyRate) * rateUnits[currency]).toFixed(2));
}

function applyExchangeRateSnapshot(snapshot: ExchangeRateApiSnapshot): void {
  const usd = toKrwPerUnit(snapshot, "USD");
  const jpy = toKrwPerUnit(snapshot, "JPY");
  const eur = toKrwPerUnit(snapshot, "EUR");
  if (usd) BASE_EXCHANGE_RATES.USD = usd;
  if (jpy) BASE_EXCHANGE_RATES.JPY = jpy;
  if (eur) BASE_EXCHANGE_RATES.EUR = eur;
  EXCHANGE_RATE_STATUS.lastUpdated = `${snapshot.fetchedAt} 환율 기준`;
  EXCHANGE_RATE_STATUS.source = snapshot.source ?? "환율 자동 수집";
}

export async function loadTravelExchangeRates(forceRefresh = false): Promise<void> {
  if (!isRemoteConstantsEnabled()) return;

  if (exchangeRatesPromise && !forceRefresh) return exchangeRatesPromise;

  exchangeRatesPromise = (async () => {
    try {
      applyExchangeRateSnapshot(await fetchExchangeRateSnapshot());
    } catch {
      return;
    }
  })();

  await exchangeRatesPromise;
}

export function useExchangeBadgeMessage() {
  return computed(() => EXCHANGE_RATE_STATUS.lastUpdated);
}
