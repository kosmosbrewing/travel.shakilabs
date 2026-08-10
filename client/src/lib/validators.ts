import { z } from "zod";

// 허용 범위를 스키마 바깥에 두는 이유: /about이 "이 계산기가 실제로 받는 입력"을
// 문장으로 설명하는데, 숫자를 그쪽에 따로 적으면 스키마와 조용히 어긋난다.
// 소개 글과 검증 규칙이 같은 상수를 보게 해서 한쪽만 바뀌는 사고를 막는다.
export const INPUT_BOUNDS = {
  travelers: { min: 1, max: 8 },
  bagsPerTraveler: { min: 1, max: 3 },
  bagWeightKg: [15, 20, 25],
  tripSegments: { min: 1, max: 2 },
  tripDays: { min: 1, max: 30 },
  totalDataGb: { min: 1, max: 120 },
  amountKrw: { min: 100_000, max: 10_000_000 },
  currencies: ["USD", "JPY", "EUR"],
} as const;

const travelerSchema = z.coerce
  .number()
  .int()
  .min(INPUT_BOUNDS.travelers.min)
  .max(INPUT_BOUNDS.travelers.max);
const bagSchema = z.coerce
  .number()
  .int()
  .min(INPUT_BOUNDS.bagsPerTraveler.min)
  .max(INPUT_BOUNDS.bagsPerTraveler.max);
const baggageWeightSchema = z.union([
  z.literal(INPUT_BOUNDS.bagWeightKg[0]),
  z.literal(INPUT_BOUNDS.bagWeightKg[1]),
  z.literal(INPUT_BOUNDS.bagWeightKg[2]),
]);
const tripSegmentSchema = z.coerce
  .number()
  .int()
  .min(INPUT_BOUNDS.tripSegments.min)
  .max(INPUT_BOUNDS.tripSegments.max);
const tripDaySchema = z.coerce
  .number()
  .int()
  .min(INPUT_BOUNDS.tripDays.min)
  .max(INPUT_BOUNDS.tripDays.max);
const dataSchema = z.coerce
  .number()
  .int()
  .min(INPUT_BOUNDS.totalDataGb.min)
  .max(INPUT_BOUNDS.totalDataGb.max);
const amountSchema = z.coerce
  .number()
  .int()
  .min(INPUT_BOUNDS.amountKrw.min)
  .max(INPUT_BOUNDS.amountKrw.max);
const currencySchema = z.enum(INPUT_BOUNDS.currencies);

export const luggageInputSchema = z.object({
  travelers: travelerSchema,
  bagsPerTraveler: bagSchema,
  bagWeightKg: baggageWeightSchema,
  tripSegments: tripSegmentSchema,
});

export const esimInputSchema = z.object({
  tripDays: tripDaySchema,
  totalDataGb: dataSchema,
  travelers: travelerSchema,
});

export const exchangeInputSchema = z.object({
  amountKrw: amountSchema,
  currency: currencySchema,
});

export type LuggageInput = z.infer<typeof luggageInputSchema>;
export type EsimInput = z.infer<typeof esimInputSchema>;
export type ExchangeInput = z.infer<typeof exchangeInputSchema>;

export const DEFAULT_LUGGAGE_INPUT: LuggageInput = {
  travelers: 2,
  bagsPerTraveler: 1,
  bagWeightKg: 20,
  tripSegments: 2,
};

export const DEFAULT_ESIM_INPUT: EsimInput = {
  tripDays: 5,
  totalDataGb: 6,
  travelers: 1,
};

export const DEFAULT_EXCHANGE_INPUT: ExchangeInput = {
  amountKrw: 700_000,
  currency: "JPY",
};

function readField<T>(schema: z.ZodType<T>, value: unknown, fallback: T): T {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : fallback;
}

export function sanitizeLuggageInput(input?: Partial<LuggageInput>): LuggageInput {
  return {
    travelers: readField(travelerSchema, input?.travelers, DEFAULT_LUGGAGE_INPUT.travelers),
    bagsPerTraveler: readField(bagSchema, input?.bagsPerTraveler, DEFAULT_LUGGAGE_INPUT.bagsPerTraveler),
    bagWeightKg: readField(baggageWeightSchema, input?.bagWeightKg, DEFAULT_LUGGAGE_INPUT.bagWeightKg),
    tripSegments: readField(tripSegmentSchema, input?.tripSegments, DEFAULT_LUGGAGE_INPUT.tripSegments),
  };
}

export function sanitizeEsimInput(input?: Partial<EsimInput>): EsimInput {
  return {
    tripDays: readField(tripDaySchema, input?.tripDays, DEFAULT_ESIM_INPUT.tripDays),
    totalDataGb: readField(dataSchema, input?.totalDataGb, DEFAULT_ESIM_INPUT.totalDataGb),
    travelers: readField(travelerSchema, input?.travelers, DEFAULT_ESIM_INPUT.travelers),
  };
}

export function sanitizeExchangeInput(input?: Partial<ExchangeInput>): ExchangeInput {
  return {
    amountKrw: readField(amountSchema, input?.amountKrw, DEFAULT_EXCHANGE_INPUT.amountKrw),
    currency: readField(currencySchema, input?.currency, DEFAULT_EXCHANGE_INPUT.currency),
  };
}
