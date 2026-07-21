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
  it("models a job-first city board with pathway-neutral conversion evidence", () => {
    const cities = getDatasets("germany").cities!;
    const scored = cities.columns.filter((column) => column.kind === "score");
    expect(scored.reduce((sum, column) => sum + (column.weight ?? 0), 0)).toBe(100);
    expect(scored.map((column) => [column.id, column.weight])).toEqual([
      ["jobs", 22], ["conv", 18], ["scale-pay", 12], ["comp", 9], ["rent", 9],
      ["cost", 7], ["pt", 6], ["eng", 6], ["safe", 5], ["conn", 3], ["comm", 3],
    ]);
    expect(cities.columns.find((column) => column.id === "anm")).toBeUndefined();
    expect(cities.columns.find((column) => column.id === "natTime")).toBeUndefined();
    for (const row of cities.rows) {
      expect(row.values.anm).toBeUndefined();
      expect(row.values.natTime).toBeUndefined();
      expect(row.detail?.immigration).toMatchObject({
        publishedTime: expect.any(String), timeScope: expect.any(String),
        applicationChannel: expect.any(String), workStart: expect.any(String),
        confidence: expect.stringMatching(/^(high|medium|low)$/),
        asOf: expect.stringMatching(/^2026-/),
      });
      expect("naturalisation" in (row.detail?.immigration ?? {})).toBe(false);
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

  it("includes the researched English-taught Berlin-region university candidates", () => {
    const universities = getDatasets("germany").universities!;
    const rows = new Map(universities.rows.map((row) => [row.id, row]));
    const candidateIds = [
      "bht-berlin", "btu-cottbus", "htw-berlin",
    ];

    for (const id of candidateIds) {
      const row = rows.get(id);
      expect(row, `${id} is present`).toBeTruthy();
      expect(typeof row?.values.programs, `${id} lists its qualifying programmes`).toBe("string");
      expect(row?.location?.sourceUrl, `${id} has a sourced map location`).toMatch(/^https:\/\//);
      expect(row?.tags?.length ?? 0, `${id} has a current admission-status chip`).toBeGreaterThan(0);
      expect(row?.detail?.links?.length ?? 0, `${id} has evidence links`).toBeGreaterThanOrEqual(2);
    }
  });

  it("includes the approved formal-city Berlin commuter alternatives with complete scored evidence", () => {
    const cities = getDatasets("germany").cities!;
    const requiredIds = [
      "brandenburg-an-der-havel", "cottbus", "frankfurt-oder", "oranienburg",
      "falkensee", "bernau-bei-berlin", "eberswalde",
    ];
    const scoreIds = cities.columns.filter((column) => column.kind === "score").map((column) => column.id);

    for (const id of requiredIds) {
      const row = cities.rows.find((candidate) => candidate.id === id);
      expect(row, `${id} is present`).toBeTruthy();
      if (!row) continue;
      expect(row.location, `${id} has a map location`).toBeTruthy();
      expect(row.detail?.links?.length ?? 0, `${id} has official evidence links`).toBeGreaterThanOrEqual(2);
      expect(row.detail?.immigration, `${id} documents its responsible authority`).toBeTruthy();
      for (const scoreId of scoreIds) {
        const score = row.values[scoreId];
        expect(typeof score, `${id}.${scoreId} is numeric`).toBe("number");
        expect(score, `${id}.${scoreId} is within the absolute score scale`).toBeGreaterThanOrEqual(0);
        expect(score, `${id}.${scoreId} is within the absolute score scale`).toBeLessThanOrEqual(100);
      }
    }
  });
  it("Germany cities score-column weights sum to 100", () => {
    const cols = getDatasets("germany").cities?.columns ?? [];
    const sum = cols.filter((c) => c.kind === "score").reduce((a, c) => a + (c.weight ?? 0), 0);
    expect(sum).toBe(100);
  });
  it("prioritises jobs over conversion and exposes score columns in descending-weight order", () => {
    const scored = getDatasets("germany").cities?.columns.filter((column) => column.kind === "score") ?? [];
    expect(scored.map((column) => [column.id, column.weight])).toEqual([
      ["jobs", 22], ["conv", 18], ["scale-pay", 12], ["comp", 9], ["rent", 9],
      ["cost", 7], ["pt", 6], ["eng", 6], ["safe", 5], ["conn", 3], ["comm", 3],
    ]);
  });
  it("uses concise one-word labels for every city-table column", () => {
    const columns = getDatasets("germany").cities?.columns ?? [];
    for (const column of columns) {
      expect(column.label, `${column.id}.label`).toMatch(/^\S+$/);
      expect(column.shortLabel ?? column.label, `${column.id}.shortLabel`).toMatch(/^\S+$/);
    }
  });
  it("keeps city and university datasets independently scoped", () => {
    const de = getDatasets("germany");
    const locations = (de.universities?.rows ?? []).map((row) => row.sublabel?.toLocaleLowerCase("de") ?? "");
    const commuterOnly = (de.cities?.rows ?? [])
      .map((row) => row.label)
      .filter((city) => ["Brandenburg an der Havel", "Falkensee", "Oranienburg"].includes(city))
      .filter((city) => !locations.some((location) => location.includes(city.toLocaleLowerCase("de"))));

    expect(commuterOnly.sort()).toEqual(["Brandenburg an der Havel", "Falkensee", "Oranienburg"]);
  });
  it("provides an overall rank for every university and documents unavailable subject ranks", () => {
    const universities = getDatasets("germany").universities?.rows ?? [];
    expect(
      universities.filter((row) => typeof row.values.overallRank !== "number").map((row) => row.id),
    ).toEqual([]);

    const rankIds = ["cse", "ai", "ml", "ds", "swe"];
    const missing = universities.flatMap((row) =>
      rankIds
        .filter((rankId) => typeof row.values[rankId] !== "number")
        .map((rankId) => `${row.id}.${rankId}`),
    );

    const incompleteRows = [...new Set(missing.map((item) => item.split(".")[0]))];
    for (const id of incompleteRows) {
      const row = universities.find((candidate) => candidate.id === id);
      expect(row?.detail?.note, `${id} explains incomplete rankings`).toMatch(/EduRank.*(not|no matching|partial|six-field)/i);
    }
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
  it("classifies researched university ownership and intake-tag states", () => {
    const rows = getDatasets("germany").universities?.rows ?? [];
    const idsWith = (tag: string) => rows.filter((row) => row.tags?.includes(tag)).map((row) => row.id).sort();
    const ownershipTags = new Set(["Public", "Private"]);
    const admissionTags = new Set([
      "Winter ’26 open", "Summer ’27 open", "Winter ’27 open",
      "Summer ’27", "Winter ’27", "No CS intake ’27",
    ]);

    expect(rows.filter((row) => (row.tags ?? []).filter((tag) => ownershipTags.has(tag)).length !== 1).map((row) => row.id)).toEqual([]);
    expect(rows.flatMap((row) => row.tags ?? []).filter((tag) => !ownershipTags.has(tag) && !admissionTags.has(tag))).toEqual([]);
    expect(rows.filter((row) => row.tags?.includes("Summer ’27") && row.tags.includes("Summer ’27 open")).map((row) => row.id)).toEqual([]);
    expect(rows.filter((row) => row.tags?.includes("Winter ’27") && row.tags.includes("Winter ’27 open")).map((row) => row.id)).toEqual([]);

    expect(idsWith("Winter ’27")).toEqual([
      "bonn", "fau", "freiburg", "fu-berlin", "goettingen", "hamburg", "heidelberg", "hhu-duesseldorf",
      "bht-berlin", "btu-cottbus", "htw-berlin", "kit", "leibniz-hannover",
      "potsdam-hpi", "ruhr-bochum", "rwth-aachen", "stuttgart", "th-koeln",
      "tu-berlin", "tu-darmstadt", "tu-dortmund", "tu-dresden", "tuebingen",
    ].sort());
    expect(idsWith("Winter ’26 open")).toEqual([]);
    expect(idsWith("Summer ’27 open")).toEqual([
      "htw-berlin",
    ].sort());
    expect(idsWith("Winter ’27 open")).toEqual([]);
    expect(idsWith("No CS intake ’27")).toEqual([
      "charite-berlin", "goethe-frankfurt", "humboldt-berlin", "lmu",
    ].sort());
    expect(rows.flatMap((row) => row.tags ?? []).some((tag) => tag.includes("upcoming"))).toBe(false);
  });
  it("marks every German university as exactly public or private", () => {
    const rows = getDatasets("germany").universities?.rows ?? [];
    expect(rows.filter((row) => row.tags?.includes("Public")).map((row) => row.id).sort()).toEqual([
      "bht-berlin", "bonn", "btu-cottbus", "charite-berlin", "fau", "freiburg", "fu-berlin",
      "goethe-frankfurt", "goettingen", "hamburg", "heidelberg", "hhu-duesseldorf", "htw-berlin",
      "humboldt-berlin", "kit", "leibniz-hannover", "lmu", "potsdam-hpi", "ruhr-bochum",
      "rwth-aachen", "stuttgart", "th-koeln", "tu-berlin", "tu-darmstadt",
      "tu-dortmund", "tu-dresden", "tuebingen",
    ].sort());
    expect(rows.filter((row) => row.tags?.includes("Private")).map((row) => row.id).sort()).toEqual([]);
  });
  it("keeps only universities within both the rank and tuition limits", () => {
    const rows = getDatasets("germany").universities?.rows ?? [];
    expect(rows).toHaveLength(27);
    expect(rows.filter((row) => typeof row.values.overallRank !== "number" || row.values.overallRank > 3200).map((row) => row.id)).toEqual([]);
    expect(rows.filter((row) => typeof row.values.nonEuTuition !== "number" || row.values.nonEuTuition > 5000).map((row) => row.id)).toEqual([]);
  });
  it("provides a numeric non-EU tuition amount for every university", () => {
    const rows = getDatasets("germany").universities?.rows ?? [];
    expect(rows.filter((row) => typeof row.values.nonEuTuition !== "number").map((row) => row.id)).toEqual([]);
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
