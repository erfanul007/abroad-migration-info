// Covers only the cross-field rules we own (category/factor weight sums, unique ids,
// known category refs); full-shape checks are Zod's job and not re-tested here.
import { describe, it, expect } from "vitest";
import { validateCategories, validateCountry, validateDataset, datasetRowSchema } from "@/lib/schema";
import type { Category, Country, Factor } from "@/types";

const f = (id: string, weight: number): Factor => ({ id, label: id, description: "", weight });

const cats: Category[] = [
  { id: "a", name: "A", shortLabel: "A", weight: 60, description: "", factors: [f("a1", 50), f("f2", 50)] },
  { id: "b", name: "B", shortLabel: "B", weight: 40, description: "", factors: [f("b1", 60), f("f2", 40)] },
];

describe("validateCategories", () => {
  it("passes when category weights sum to 100, ids unique, and factors are valid", () => {
    expect(validateCategories(cats)).toEqual([]);
  });
  it("flags when category weights do not sum to 100", () => {
    const bad = [{ ...cats[0], weight: 50 }, cats[1]];
    expect(validateCategories(bad)).toContainEqual(expect.stringContaining("sum to 100"));
  });
  it("flags duplicate category ids", () => {
    const dup = [cats[0], { ...cats[1], id: "a" }];
    expect(validateCategories(dup)).toContainEqual(expect.stringContaining("Duplicate"));
  });
});

describe("factor validation", () => {
  it("flags factor weights that do not sum to 100", () => {
    const bad = [{ ...cats[0], factors: [f("a1", 50), f("f2", 40)] }, cats[1]];
    expect(validateCategories(bad).length).toBeGreaterThan(0);
  });
  it("flags duplicate factor ids within a category", () => {
    const bad = [{ ...cats[0], factors: [f("a1", 50), f("a1", 30), f("f2", 20)] }, cats[1]];
    expect(validateCategories(bad).length).toBeGreaterThan(0);
  });
  it("rejects string factors (old shape)", () => {
    const bad = [{ ...cats[0], factors: ["a1", "f2"] }, cats[1]];
    expect(validateCategories(bad as unknown as Category[]).length).toBeGreaterThan(0);
  });
});

const cell = (
  factors: Record<string, { status: "scored" | "pending"; score: number }>,
  status: "scored" | "pending" = "scored",
): Country["categories"][string] => ({
  status, factors, summary: "s", pros: [], cons: [], links: [], lastReviewed: "2026-06-18",
});

describe("validateCountry", () => {
  const country: Country = {
    id: "x", name: "X", iso: "XX", iso3: "XXX", flag: "", region: "R",
    summary: "", lastReviewed: "2026-06-18", links: [],
    categories: {
      a: cell({ a1: { status: "scored", score: 90 }, f2: { status: "scored", score: 80 } }),
      b: cell({}, "pending"),
    },
  };
  it("passes a well-formed country (scored cell scores all its factors; pending cell may be empty)", () => {
    expect(validateCountry(country, cats)).toEqual([]);
  });
  it("flags category ids the country references but the catalogue does not define", () => {
    const bad = { ...country, categories: { ...country.categories, zzz: cell({ z1: { status: "scored", score: 10 } }) } };
    expect(validateCountry(bad, cats)).toContainEqual(expect.stringContaining('Unknown category "zzz"'));
  });
  it("flags a factor id the cell uses but the category does not define", () => {
    const bad = { ...country, categories: { ...country.categories,
      a: cell({ a1: { status: "scored", score: 90 }, f2: { status: "scored", score: 80 }, ghost: { status: "scored", score: 50 } }) } };
    expect(validateCountry(bad, cats)).toContainEqual(expect.stringContaining("ghost"));
  });
  it("flags a scored cell missing one of its category's factors", () => {
    const bad = { ...country, categories: { ...country.categories, a: cell({ a1: { status: "scored", score: 90 } }) } };
    expect(validateCountry(bad, cats).length).toBeGreaterThan(0);
  });
  it("flags a scored cell whose factor is itself pending", () => {
    const bad = { ...country, categories: { ...country.categories,
      a: cell({ a1: { status: "pending", score: 0 }, f2: { status: "scored", score: 80 } }) } };
    expect(validateCountry(bad, cats).length).toBeGreaterThan(0);
  });
  it("rejects the old flat-score cell shape", () => {
    const bad = { ...country, categories: { ...country.categories, a: { status: "scored", score: 70 } } };
    expect(validateCountry(bad as unknown as Country, cats).length).toBeGreaterThan(0);
  });
});

describe("validateDataset", () => {
  const validCities = {
    kind: "cities",
    countryId: "germany",
    title: "Germany cities",
    scale: "score",
    lastReviewed: "2026-07-13",
    columns: [
      { id: "conv", label: "Conv", kind: "score", weight: 60, betterWhen: "high" },
      { id: "jobs", label: "Jobs", kind: "score", weight: 40, betterWhen: "high" },
      { id: "pop", label: "Population", kind: "number", betterWhen: "high" },
      { id: "note", label: "Note", kind: "text" },
    ],
    rows: [
      { id: "munich", label: "Munich", values: { conv: 68, jobs: 92, pop: 1510000, note: "hub" } },
    ],
  };

  it("accepts a well-formed cities dataset", () => {
    expect(validateDataset(validCities, ["germany"])).toEqual([]);
  });
  it("rejects score-column weights that do not sum to 100", () => {
    const bad = {
      ...validCities,
      columns: [{ id: "conv", label: "C", kind: "score", weight: 10, betterWhen: "high" }],
      rows: [{ id: "m", label: "M", values: { conv: 50 } }],
    };
    expect(validateDataset(bad, ["germany"]).join()).toMatch(/weight/i);
  });
  it("rejects a row value referencing an unknown column", () => {
    const bad = { ...validCities, rows: [{ id: "m", label: "M", values: { nope: 1 } }] };
    expect(validateDataset(bad, ["germany"]).join()).toMatch(/unknown column/i);
  });
  it("rejects an unknown countryId", () => {
    expect(validateDataset(validCities, ["france"]).join()).toMatch(/countryId/i);
  });
  it("rejects a numeric column carrying a string value", () => {
    const bad = { ...validCities, rows: [{ id: "m", label: "M", values: { conv: "x", jobs: 1 } }] };
    expect(validateDataset(bad, ["germany"]).join()).toMatch(/number/i);
  });
  it("rejects duplicate column ids", () => {
    const bad = {
      ...validCities,
      columns: [
        { id: "conv", label: "C", kind: "score", weight: 50, betterWhen: "high" },
        { id: "conv", label: "C2", kind: "score", weight: 50, betterWhen: "high" },
      ],
      rows: [{ id: "m", label: "M", values: { conv: 50 } }],
    };
    expect(validateDataset(bad, ["germany"]).join()).toMatch(/duplicate column/i);
  });
  it("enforces cities => score scale and universities => rank scale", () => {
    const bad = { ...validCities, scale: "rank" };
    expect(validateDataset(bad, ["germany"]).join()).toMatch(/scale/i);
  });
  it("accepts a well-formed universities (rank) dataset", () => {
    const uni = {
      kind: "universities",
      countryId: "germany",
      title: "Germany universities",
      scale: "rank",
      lastReviewed: "2026-07-13",
      columns: [
        { id: "cse", label: "CSE", kind: "rank", betterWhen: "low" },
        { id: "city", label: "City", kind: "text" },
      ],
      rows: [{
        id: "tum",
        label: "TUM",
        location: { lat: 48.262, lng: 11.668, label: "Garching campus", sourceUrl: "https://www.openstreetmap.org/" },
        values: { cse: 71, city: "Munich" },
      }],
    };
    expect(validateDataset(uni, ["germany"])).toEqual([]);
  });
  it("requires reviewed locations for German university rows", () => {
    const uni = {
      kind: "universities", countryId: "germany", title: "Germany universities", scale: "rank", lastReviewed: "2026-07-14",
      columns: [{ id: "cse", label: "CSE", kind: "rank", betterWhen: "low" }],
      rows: [{ id: "tum", label: "TUM", values: { cse: 71 } }],
    };
    expect(validateDataset(uni, ["germany"]).join()).toMatch(/location/i);
  });
  it("rejects German university coordinates outside the supported map bounds", () => {
    const uni = {
      kind: "universities", countryId: "germany", title: "Germany universities", scale: "rank", lastReviewed: "2026-07-14",
      columns: [{ id: "cse", label: "CSE", kind: "rank", betterWhen: "low" }],
      rows: [{ id: "tum", label: "TUM", location: { lat: 40, lng: 20, label: "Wrong campus", sourceUrl: "https://www.openstreetmap.org/" }, values: { cse: 71 } }],
    };
    expect(validateDataset(uni, ["germany"]).join()).toMatch(/Germany map bounds/i);
  });
});

describe("datasetRowSchema abbr", () => {
  it("accepts an optional abbr on a dataset row", () => {
    const base = { id: "tum", label: "Technical University of Munich (TUM)", values: {} };
    expect(datasetRowSchema.parse({ ...base, abbr: "TUM" }).abbr).toBe("TUM");
    expect(datasetRowSchema.parse(base).abbr).toBeUndefined();
  });
});
