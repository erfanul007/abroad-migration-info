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
  it("models German city administration around conversion and Anmeldung, not naturalisation", () => {
    const cities = getDatasets("germany").cities!;
    const scored = cities.columns.filter((column) => column.kind === "score");
    expect(scored.reduce((sum, column) => sum + (column.weight ?? 0), 0)).toBe(100);
    expect(scored.find((column) => column.id === "settle")).toBeUndefined();
    expect(scored.find((column) => column.id === "conv")?.weight).toBe(22);
    expect(scored.find((column) => column.id === "anm")?.weight).toBe(12);
    for (const row of cities.rows) {
      expect(row.values.settle).toBeUndefined();
      expect(row.detail?.immigration).toMatchObject({
        publishedTime: expect.any(String), timeScope: expect.any(String),
        applicationChannel: expect.any(String), workStart: expect.any(String),
        confidence: expect.stringMatching(/^(high|medium|low)$/),
        asOf: expect.stringMatching(/^2026-/), naturalisation: expect.any(String),
      });
    }
  });
  it("encodes the audited Chancenkarte→Blue Card conversion evidence discipline for every German city", () => {
    const cities = getDatasets("germany").cities!;
    for (const row of cities.rows) {
      const imm = row.detail?.immigration;
      expect(imm, `${row.id} carries immigration evidence`).toBeTruthy();
      if (!imm) continue;
      // §81(4) lawful residence must be distinguished from §81(5a) permission to exceed the 20h limit
      expect(imm.workStart, `${row.id} workStart cites §81(4)`).toContain("§81(4)");
      expect(imm.workStart, `${row.id} workStart cites §81(5a)`).toContain("§81(5a)");
      // no false precision: an unpublished decision time cannot be labelled high confidence
      if (/^not published/i.test(imm.publishedTime)) {
        expect(imm.confidence, `${row.id} unpublished ⇒ not high confidence`).not.toBe("high");
      }
      // high confidence must rest on a concrete published time, never "Not published"
      if (imm.confidence === "high") {
        expect(
          /^not published/i.test(imm.publishedTime),
          `${row.id} high confidence needs a concrete published time`,
        ).toBe(false);
      }
      // eAT card production must never be presented as the total/decision time
      if (/eAT|Bundesdruckerei|card production/i.test(imm.timeScope)) {
        expect(
          imm.timeScope,
          `${row.id} eAT/card production flagged as production, not total`,
        ).toMatch(/excludes|additional|\bextra\b|on top|card production|production step|not (the )?(total|processing|decision|substantive)/i);
      }
    }
  });
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
  it("covers every listed German city with at least one university location", () => {
    const de = getDatasets("germany");
    const locations = (de.universities?.rows ?? []).map((row) => row.sublabel?.toLocaleLowerCase("de") ?? "");
    const uncovered = (de.cities?.rows ?? [])
      .map((row) => row.label)
      .filter((city) => !locations.some((location) => location.includes(city.toLocaleLowerCase("de"))));

    expect(uncovered).toEqual([]);
  });
  it("provides every displayed global and specialization rank for German universities", () => {
    const universities = getDatasets("germany").universities?.rows ?? [];
    const rankIds = ["overallRank", "cse", "ai", "ml", "ds", "swe"];
    const missing = universities.flatMap((row) =>
      rankIds
        .filter((rankId) => typeof row.values[rankId] !== "number")
        .map((rankId) => `${row.id}.${rankId}`),
    );

    expect(missing).toEqual([]);
  });
  it("provides a reviewed Germany-area map location for every German university", () => {
    const universities = getDatasets("germany").universities?.rows ?? [];
    const invalid = universities
      .filter((row) => !row.location
        || row.location.lat < 47 || row.location.lat > 55.2
        || row.location.lng < 5.5 || row.location.lng > 15.6
        || !row.location.sourceUrl.startsWith("https://"))
      .map((row) => row.id);

    expect(invalid).toEqual([]);
  });

  it("provides a reviewed Germany-area map location for every German city", () => {
    const rows = getDatasets("germany").cities?.rows ?? [];
    const invalid = rows
      .filter((row) => !row.location
        || row.location.lat < 47 || row.location.lat > 55.2
        || row.location.lng < 5.5 || row.location.lng > 15.6
        || !row.location.sourceUrl.startsWith("https://"))
      .map((row) => row.id);
    expect(invalid).toEqual([]);
  });
  it("classifies researched 2027 university intake-chip states", () => {
    const rows = getDatasets("germany").universities?.rows ?? [];
    const idsWith = (tag: string) => rows.filter((row) => row.tags?.includes(tag)).map((row) => row.id).sort();

    expect(idsWith("Winter ’27 upcoming")).toEqual([
      "bonn", "fau", "freiburg", "fu-berlin", "goettingen", "hamburg", "heidelberg", "hhu-duesseldorf",
      "kit", "leibniz-hannover", "potsdam-hpi", "ruhr-bochum", "rwth-aachen", "stuttgart", "th-koeln",
      "tu-berlin", "tu-darmstadt", "tu-dortmund", "tu-dresden", "tuebingen", "tum",
    ].sort());
    expect(idsWith("No CS intake ’27")).toEqual([
      "charite-berlin", "goethe-frankfurt", "humboldt-berlin", "lmu",
    ].sort());
  });
  it("provides an application fee for every university with a suitable 2027 CS intake", () => {
    const rows = getDatasets("germany").universities?.rows ?? [];
    const missing = rows
      .filter((row) => !row.tags?.includes("No CS intake ’27"))
      .filter((row) => typeof row.values.applicationFee !== "number")
      .map((row) => row.id);

    expect(missing).toEqual([]);
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
