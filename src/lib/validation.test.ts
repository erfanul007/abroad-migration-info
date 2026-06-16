// src/lib/validation.test.ts
import { describe, it, expect } from "vitest";
import { validateCategories, validateCountry } from "@/lib/validation";
import type { Category, Country } from "@/types";

const cats: Category[] = [
  { id: "a", name: "A", shortLabel: "A", weight: 60, description: "", factors: [] },
  { id: "b", name: "B", shortLabel: "B", weight: 40, description: "", factors: [] },
];

describe("validateCategories", () => {
  it("passes when weights sum to 100 and ids are unique", () => {
    expect(validateCategories(cats)).toEqual([]);
  });
  it("flags when weights do not sum to 100", () => {
    const bad = [{ ...cats[0], weight: 50 }, cats[1]];
    expect(validateCategories(bad)).toContainEqual(expect.stringContaining("sum to 100"));
  });
  it("flags duplicate ids", () => {
    const dup = [cats[0], { ...cats[1], id: "a" }];
    expect(validateCategories(dup)).toContainEqual(expect.stringContaining("Duplicate"));
  });
});

describe("validateCountry", () => {
  const country: Country = {
    id: "x", name: "X", iso: "XX", iso3: "XXX", flag: "", region: "R",
    summary: "", lastReviewed: "2026-06-16", links: [],
    categories: { a: { status: "scored", score: 90 }, b: { status: "pending", score: 60 } },
  };
  it("passes a well-formed country", () => {
    expect(validateCountry(country, cats)).toEqual([]);
  });
  it("flags scores out of range", () => {
    const bad = { ...country, categories: { ...country.categories, a: { status: "scored" as const, score: 150 } } };
    expect(validateCountry(bad, cats)).toContainEqual(expect.stringContaining("0..100"));
  });
  it("flags unknown category ids", () => {
    const bad = { ...country, categories: { ...country.categories, zzz: { status: "scored" as const, score: 10 } } };
    expect(validateCountry(bad, cats)).toContainEqual(expect.stringContaining("Unknown category"));
  });
});
