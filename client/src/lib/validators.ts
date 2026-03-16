import { z } from "zod";

const travelerSchema = z.coerce.number().int().min(1).max(8);
const bagSchema = z.coerce.number().int().min(1).max(3);
const baggageWeightSchema = z.union([z.literal(15), z.literal(20), z.literal(25)]);
const tripSegmentSchema = z.coerce.number().int().min(1).max(2);
const tripDaySchema = z.coerce.number().int().min(1).max(30);
const dataSchema = z.coerce.number().int().min(1).max(120);
const amountSchema = z.coerce.number().int().min(100_000).max(10_000_000);
const currencySchema = z.enum(["USD", "JPY", "EUR"]);

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
