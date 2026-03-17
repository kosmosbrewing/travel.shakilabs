import { apiRequest } from "@/lib/api";

export interface ExchangeRateApiSnapshot {
  fetchedAt: string;
  source?: string;
  rates: Record<string, number>;
}

export async function fetchExchangeRateSnapshot(): Promise<ExchangeRateApiSnapshot> {
  return apiRequest<ExchangeRateApiSnapshot>("/api/common/rates/latest", {
    cachePolicy: "constants",
  });
}
