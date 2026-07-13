import { describe, it, expect } from "vitest";
import { categories, countries, getDatasets, getScoredCountry, profile, scoredCountries } from "@/lib/data";
import { validateCountry } from "@/lib/schema";

describe("data integrity", () => {
  it("loads 15 categories summing to 100", () => {
    expect(categories).toHaveLength(15);
    expect(categories.reduce((a, c) => a + c.weight, 0)).toBe(100);
  });
  it("loads 20 countries", () => {
    expect(countries).toHaveLength(20);
  });
  it("includes the United Kingdom with the exact Natural Earth name (for the map join) and GB iso", () => {
    const uk = getScoredCountry("GB");
    expect(uk?.id).toBe("united-kingdom");
    expect(uk?.name).toBe("United Kingdom"); // must match world-atlas feature name or map won't shade
  });
  it("every country validates against the category catalogue (known ids, factor membership, scored-completeness, in-range scores)", () => {
    for (const c of countries) {
      expect(validateCountry(c, categories)).toEqual([]);
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

describe("supplementary datasets", () => {
  it("returns {} for a country with no datasets and for an unknown code", () => {
    expect(getDatasets("france")).toEqual({});
    expect(getDatasets("ZZ")).toEqual({});
  });
  it("Germany exposes both cities and universities datasets", () => {
    const de = getDatasets("germany");
    expect(de.cities?.kind).toBe("cities");
    expect(de.cities?.scale).toBe("score");
    expect(de.universities?.kind).toBe("universities");
    expect(de.universities?.scale).toBe("rank");
    // resolvable by iso too
    expect(getDatasets("DE").cities?.countryId).toBe("germany");
  });
  it("Germany cities score-column weights sum to 100", () => {
    const cols = getDatasets("germany").cities?.columns ?? [];
    const sum = cols.filter((c) => c.kind === "score").reduce((a, c) => a + (c.weight ?? 0), 0);
    expect(sum).toBe(100);
  });
  it("every dataset countryId resolves to a real country", () => {
    const ids = new Set(countries.map((c) => c.id));
    for (const c of countries) {
      const de = getDatasets(c.id);
      if (de.cities) expect(ids.has(de.cities.countryId)).toBe(true);
      if (de.universities) expect(ids.has(de.universities.countryId)).toBe(true);
    }
  });
});
