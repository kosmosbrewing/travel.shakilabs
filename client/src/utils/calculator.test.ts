import { describe, expect, it } from "vitest";
import {
  calcConnectivityComparison,
  calcExchangeComparison,
  calcLuggageComparison,
} from "@/utils/calculator";
import {
  DEFAULT_ESIM_INPUT,
  DEFAULT_EXCHANGE_INPUT,
  DEFAULT_LUGGAGE_INPUT,
  sanitizeEsimInput,
  sanitizeExchangeInput,
  sanitizeLuggageInput,
} from "@/lib/validators";

describe("calcLuggageComparison", () => {
  it("왕복과 인원 수에 따라 총 수하물 개수를 계산한다", () => {
    const result = calcLuggageComparison(DEFAULT_LUGGAGE_INPUT);
    expect(result.totalCheckedBags).toBe(4);
  });

  it("기본 시나리오에서는 진에어가 가장 저렴하다", () => {
    const result = calcLuggageComparison(DEFAULT_LUGGAGE_INPUT);
    expect(result.cheapest.name).toBe("진에어");
  });

  it("가방 수가 늘어나면 총액도 비례해서 증가한다", () => {
    const base = calcLuggageComparison(DEFAULT_LUGGAGE_INPUT);
    const heavy = calcLuggageComparison({ ...DEFAULT_LUGGAGE_INPUT, bagsPerTraveler: 2 });
    expect(heavy.cheapest.totalCost).toBe(base.cheapest.totalCost * 2);
  });
});

describe("calcConnectivityComparison", () => {
  it("혼자 짧게 가는 일정은 eSIM이 가장 저렴할 수 있다", () => {
    const result = calcConnectivityComparison(DEFAULT_ESIM_INPUT);
    expect(result.cheapest.name).toBe("eSIM");
  });

  it("여러 명이 함께 가면 포켓와이파이가 유리해질 수 있다", () => {
    const result = calcConnectivityComparison({ tripDays: 7, totalDataGb: 64, travelers: 4 });
    expect(result.cheapest.name).toBe("포켓와이파이");
  });

  it("인당 데이터 계산은 총 데이터량을 인원수로 나눠 올림한다", () => {
    const result = calcConnectivityComparison({ tripDays: 5, totalDataGb: 7, travelers: 2 });
    expect(result.perTravelerDataGb).toBe(4);
  });
});

describe("calcExchangeComparison", () => {
  it("USD 기준 90% 우대 은행이 가장 유리하다", () => {
    const result = calcExchangeComparison({ amountKrw: 1_000_000, currency: "USD" });
    expect(["하나은행", "토스뱅크"]).toContain(result.best.name);
  });

  it("같은 금액이면 JPY가 USD보다 수수료가 크다", () => {
    const usd = calcExchangeComparison({ amountKrw: 1_000_000, currency: "USD" });
    const jpy = calcExchangeComparison({ amountKrw: 1_000_000, currency: "JPY" });
    expect(jpy.best.totalCost).toBeGreaterThan(usd.best.totalCost);
  });

  it("가장 비싼 옵션과 가장 싼 옵션의 차이를 계산한다", () => {
    const result = calcExchangeComparison(DEFAULT_EXCHANGE_INPUT);
    expect(result.spread).toBeGreaterThan(0);
  });
});

describe("sanitize input", () => {
  it("잘못된 수하물 입력은 기본값으로 되돌린다", () => {
    expect(sanitizeLuggageInput({ travelers: 99 })).toEqual(DEFAULT_LUGGAGE_INPUT);
  });

  it("잘못된 eSIM 입력은 기본값으로 되돌린다", () => {
    expect(sanitizeEsimInput({ totalDataGb: 0 })).toEqual(DEFAULT_ESIM_INPUT);
  });

  it("잘못된 환전 입력은 기본값으로 되돌린다", () => {
    expect(sanitizeExchangeInput({ currency: "GBP" as "USD" })).toEqual(DEFAULT_EXCHANGE_INPUT);
  });
});
