import { describe, expect, it } from "vitest";
import { positiveBarWidth } from "./chartMath";

describe("positiveBarWidth", () => {
  it("uses a zero baseline for travel costs", () => {
    expect(positiveBarWidth(0, 100)).toBe(0);
    expect(positiveBarWidth(25, 100)).toBe(25);
    expect(positiveBarWidth(120, 100)).toBe(100);
  });
});
