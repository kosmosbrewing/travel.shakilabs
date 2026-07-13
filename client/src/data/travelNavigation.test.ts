import { describe, expect, it } from "vitest";
import { getRelatedTravelTools } from "./travelNavigation";

describe("travel navigation", () => {
  it("returns the other two travel decisions", () => {
    const related = getRelatedTravelTools("esim");

    expect(related.map((tool) => tool.key)).toEqual(["luggage", "exchange"]);
  });
});
