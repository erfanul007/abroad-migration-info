// src/lib/data.test.ts
import { describe, it, expect } from "vitest";
import { categories, countries, getScoredCountry, profile, scoredCountries } from "@/lib/data";

describe("data integrity", () => {
  it("loads 14 categories summing to 100", () => {
    expect(categories).toHaveLength(14);
    expect(categories.reduce((a, c) => a + c.weight, 0)).toBe(100);
  });
  it("loads 14 countries", () => {
    expect(countries).toHaveLength(14);
  });
  it("includes the United Kingdom with the exact Natural Earth name (for the map join) and GB iso", () => {
    const uk = getScoredCountry("GB");
    expect(uk?.id).toBe("united-kingdom");
    expect(uk?.name).toBe("United Kingdom"); // must match world-atlas feature name or it won't shade
  });
  it("every country references known category ids with in-range scores", () => {
    const known = new Set(categories.map((c) => c.id));
    for (const c of countries) {
      for (const [id, cell] of Object.entries(c.categories)) {
        expect(known.has(id)).toBe(true);
        expect(cell.score).toBeGreaterThanOrEqual(0);
        expect(cell.score).toBeLessThanOrEqual(100);
      }
    }
  });
  it("exposes ranked, scored countries with 1-based ranks", () => {
    expect(scoredCountries[0].rank).toBe(1);
    expect(scoredCountries.every((c) => c.overall >= 0 && c.overall <= 100)).toBe(true);
  });
  it("has a profile with a pathway", () => {
    expect(profile.pathway.length).toBeGreaterThan(0);
  });
  it("getScoredCountry finds by iso and by id, undefined otherwise", () => {
    expect(getScoredCountry("DE")?.id).toBe("germany");
    expect(getScoredCountry("germany")?.id).toBe("germany");
    expect(getScoredCountry("ZZ")).toBeUndefined();
  });
});
