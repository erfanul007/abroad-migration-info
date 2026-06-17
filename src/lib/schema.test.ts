// src/lib/schema.test.ts
// Tests cover ONLY the cross-field rules we own — category weights summing to 100, unique
// category ids, factor weights summing to 100, unique factor ids, a mandatory "other" factor,
// and a country referencing only known category ids. Full-shape checking (required fields,
// status enum, integer 0..100 scores, link {title,url}) is Zod's job and is not re-tested here.
import { describe, it, expect } from "vitest";
import { validateCategories, validateCountry } from "@/lib/schema";
import type { Category, Country, Factor } from "@/types";

const f = (id: string, weight: number): Factor => ({ id, label: id, description: "", weight });

const cats: Category[] = [
  { id: "a", name: "A", shortLabel: "A", weight: 60, description: "", factors: [f("a1", 50), f("other", 50)] },
  { id: "b", name: "B", shortLabel: "B", weight: 40, description: "", factors: [f("b1", 60), f("other", 40)] },
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
    const bad = [{ ...cats[0], factors: [f("a1", 50), f("other", 40)] }, cats[1]];
    expect(validateCategories(bad).length).toBeGreaterThan(0);
  });
  it("flags duplicate factor ids within a category", () => {
    const bad = [{ ...cats[0], factors: [f("a1", 50), f("a1", 30), f("other", 20)] }, cats[1]];
    expect(validateCategories(bad).length).toBeGreaterThan(0);
  });
  it("flags a category with no 'other' factor", () => {
    const bad = [{ ...cats[0], factors: [f("a1", 50), f("a2", 50)] }, cats[1]];
    expect(validateCategories(bad).length).toBeGreaterThan(0);
  });
  it("rejects string factors (old shape)", () => {
    const bad = [{ ...cats[0], factors: ["a1", "other"] }, cats[1]];
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
      a: cell({ a1: { status: "scored", score: 90 }, other: { status: "scored", score: 80 } }),
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
      a: cell({ a1: { status: "scored", score: 90 }, other: { status: "scored", score: 80 }, ghost: { status: "scored", score: 50 } }) } };
    expect(validateCountry(bad, cats)).toContainEqual(expect.stringContaining("ghost"));
  });
  it("flags a scored cell missing one of its category's factors", () => {
    const bad = { ...country, categories: { ...country.categories, a: cell({ a1: { status: "scored", score: 90 } }) } };
    expect(validateCountry(bad, cats).length).toBeGreaterThan(0);
  });
  it("flags a scored cell whose factor is itself pending", () => {
    const bad = { ...country, categories: { ...country.categories,
      a: cell({ a1: { status: "pending", score: 0 }, other: { status: "scored", score: 80 } }) } };
    expect(validateCountry(bad, cats).length).toBeGreaterThan(0);
  });
  it("rejects the old flat-score cell shape", () => {
    const bad = { ...country, categories: { ...country.categories, a: { status: "scored", score: 70 } } };
    expect(validateCountry(bad as unknown as Country, cats).length).toBeGreaterThan(0);
  });
});
