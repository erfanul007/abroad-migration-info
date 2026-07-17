import { describe, it, expect } from "vitest";
import { rowOverall, rowTier, bestValue, scoreColumns, deriveFacets, filterDatasetRows, markerLabel } from "@/lib/datasets";
import type { ComparativeDataset, DatasetRow } from "@/types";

// The 11 real cities criteria + weights (sum 100), with two context columns.
const cities: ComparativeDataset = {
  kind: "cities",
  countryId: "germany",
  title: "T",
  scale: "score",
  lastReviewed: "2026-07-13",
  columns: [
    { id: "conv", label: "Conv", kind: "score", weight: 16, betterWhen: "high" },
    { id: "jobs", label: "Jobs", kind: "score", weight: 14, betterWhen: "high" },
    { id: "rent", label: "Rent", kind: "score", weight: 13, betterWhen: "high" },
    { id: "anm", label: "Anm", kind: "score", weight: 10, betterWhen: "high" },
    { id: "eng", label: "Eng", kind: "score", weight: 9, betterWhen: "high" },
    { id: "comp", label: "Comp", kind: "score", weight: 8, betterWhen: "high" },
    { id: "safe", label: "Safe", kind: "score", weight: 8, betterWhen: "high" },
    { id: "cost", label: "Cost", kind: "score", weight: 6, betterWhen: "high" },
    { id: "pt", label: "PT", kind: "score", weight: 6, betterWhen: "high" },
    { id: "conn", label: "Conn", kind: "score", weight: 6, betterWhen: "high" },
    { id: "comm", label: "Comm", kind: "score", weight: 4, betterWhen: "high" },
    { id: "rentM2", label: "€/m²", kind: "number", betterWhen: "low" },
  ],
  rows: [
    { id: "hamburg", label: "Hamburg", values: { conv: 76, jobs: 74, rent: 66, anm: 62, eng: 72, comp: 60, safe: 78, cost: 60, pt: 70, conn: 70, comm: 82, rentM2: 14 } },
    { id: "munich", label: "Munich", values: { conv: 68, jobs: 92, rent: 34, anm: 68, eng: 74, comp: 66, safe: 78, cost: 44, pt: 70, conn: 80, comm: 74, rentM2: 22 } },
  ],
};

describe("scoreColumns", () => {
  it("returns only score-kind columns", () => {
    expect(scoreColumns(cities).map((c) => c.id)).not.toContain("rentM2");
    expect(scoreColumns(cities)).toHaveLength(11);
  });
});

describe("rowOverall", () => {
  it("reproduces the verified Hamburg overall (70.1)", () => {
    expect(rowOverall(cities, cities.rows[0])).toBeCloseTo(70.1, 1);
  });
  it("reproduces the verified Munich overall (67.8)", () => {
    expect(rowOverall(cities, cities.rows[1])).toBeCloseTo(67.76, 1);
  });
  it("renormalises over present score columns when some are missing", () => {
    // only two score cols present → weighted mean of those two by their weights (16, 14)
    const row = { id: "x", label: "X", values: { conv: 100, jobs: 0 } };
    expect(rowOverall(cities, row)).toBeCloseTo((100 * 16 + 0 * 14) / 30, 3);
  });
  it("returns null when no score values present", () => {
    expect(rowOverall(cities, { id: "y", label: "Y", values: { rentM2: 10 } })).toBeNull();
  });
});

describe("rowTier", () => {
  it("tiers Hamburg as good (>=70)", () => {
    expect(rowTier(cities, cities.rows[0])).toBe("good");
  });
});

describe("bestValue", () => {
  it("takes the max for a high-is-better score column", () => {
    expect(bestValue(cities, "jobs")).toBe(92);
  });
  it("takes the min for a low-is-better column", () => {
    expect(bestValue(cities, "rentM2")).toBe(14);
  });
  it("returns null for a column with no numeric values", () => {
    const ds = { ...cities, rows: [{ id: "z", label: "Z", values: {} }] };
    expect(bestValue(ds, "jobs")).toBeNull();
  });
});

// A minimal universities dataset (rank scale): city lives in sublabel "City, State",
// intake status in tags[]. Munich appears twice; Aachen carries two tags.
const universities: ComparativeDataset = {
  kind: "universities",
  countryId: "germany",
  title: "U",
  scale: "rank",
  lastReviewed: "2026-07-13",
  columns: [{ id: "overallRank", label: "Rank", kind: "rank", betterWhen: "low" }],
  rows: [
    { id: "tum", label: "Technical University of Munich (TUM)", sublabel: "Munich, Bavaria", tags: ["Summer ’27"], values: { overallRank: 1 } },
    { id: "lmu", label: "University of Munich (LMU)", sublabel: "Munich, Bavaria", tags: ["No CS intake ’27"], values: { overallRank: 3 } },
    { id: "rwth", label: "RWTH Aachen University", sublabel: "Aachen, North Rhine-Westphalia", tags: ["Winter ’27 upcoming", "Summer ’27"], values: { overallRank: 2 } },
  ],
};

describe("deriveFacets", () => {
  it("derives a City facet from sublabel (segment before first comma), distinct in first-appearance order", () => {
    const city = deriveFacets(universities).find((f) => f.id === "city");
    expect(city?.options).toEqual(["Munich", "Aachen"]);
  });
  it("derives an Intake facet from tags, distinct in first-appearance order", () => {
    const intake = deriveFacets(universities).find((f) => f.id === "intake");
    expect(intake?.options).toEqual(["Summer ’27", "No CS intake ’27", "Winter ’27 upcoming"]);
  });
  it("getValues returns the row's city and tags", () => {
    const facets = deriveFacets(universities);
    const city = facets.find((f) => f.id === "city")!;
    const intake = facets.find((f) => f.id === "intake")!;
    expect(city.getValues(universities.rows[2])).toEqual(["Aachen"]);
    expect(intake.getValues(universities.rows[2])).toEqual(["Winter ’27 upcoming", "Summer ’27"]);
  });
  it("suppresses a facet with fewer than 2 distinct values", () => {
    const oneCity: ComparativeDataset = {
      ...universities,
      rows: universities.rows.map((r) => ({ ...r, sublabel: "Munich, Bavaria" })),
    };
    expect(deriveFacets(oneCity).some((f) => f.id === "city")).toBe(false);
  });
  it("returns no facets for a cities dataset (no sublabel, no tags)", () => {
    expect(deriveFacets(cities)).toEqual([]);
  });
});

describe("filterDatasetRows", () => {
  const ids = (rows: { id: string }[]) => rows.map((r) => r.id);

  it("returns all rows for an empty filter", () => {
    expect(ids(filterDatasetRows(universities, { query: "", facets: {} }))).toEqual(["tum", "lmu", "rwth"]);
  });
  it("matches the query against the name (case-insensitive)", () => {
    expect(ids(filterDatasetRows(universities, { query: "technical", facets: {} }))).toEqual(["tum"]);
  });
  it("matches the query against the city in sublabel", () => {
    expect(ids(filterDatasetRows(universities, { query: "munich", facets: {} }))).toEqual(["tum", "lmu"]);
  });
  it("filters by the city facet", () => {
    expect(ids(filterDatasetRows(universities, { query: "", facets: { city: "Munich" } }))).toEqual(["tum", "lmu"]);
  });
  it("filters by the intake facet (membership in tags)", () => {
    expect(ids(filterDatasetRows(universities, { query: "", facets: { intake: "Summer ’27" } }))).toEqual(["tum", "rwth"]);
  });
  it("ANDs query and facets together", () => {
    expect(ids(filterDatasetRows(universities, { query: "", facets: { city: "Munich", intake: "Summer ’27" } }))).toEqual(["tum"]);
  });
  it("treats an empty facet value as no constraint", () => {
    expect(ids(filterDatasetRows(universities, { query: "", facets: { city: "" } }))).toEqual(["tum", "lmu", "rwth"]);
  });
  it("returns [] when nothing matches", () => {
    expect(filterDatasetRows(universities, { query: "zzz", facets: {} })).toEqual([]);
  });
});

describe("markerLabel", () => {
  const uni = (label: string, abbr?: string): DatasetRow => ({ id: "x", label, abbr, values: {} });
  it("returns the city name for cities (always short)", () => {
    expect(markerLabel({ id: "c", label: "Munich", values: {} }, "cities")).toBe("Munich");
  });
  it("returns the full name when a university name is short enough", () => {
    expect(markerLabel(uni("TU Berlin", "TUB"), "universities")).toBe("TU Berlin");
  });
  it("returns abbr when a university name is too long", () => {
    expect(markerLabel(uni("Technical University of Munich (TUM)", "TUM"), "universities")).toBe("TUM");
  });
  it("falls back to the full name when a long university has no abbr", () => {
    const label = "Technical University of Munich (TUM)";
    expect(markerLabel(uni(label), "universities")).toBe(label);
  });
});
