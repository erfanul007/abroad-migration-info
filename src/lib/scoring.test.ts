// src/lib/scoring.test.ts
import { describe, it, expect } from "vitest";
import { computeOverall, scoreCountry, rankCountries } from "@/lib/scoring";
import type { Category, Country } from "@/types";

const cats: Category[] = [
  { id: "a", name: "A", shortLabel: "A", weight: 60, description: "", factors: [] },
  { id: "b", name: "B", shortLabel: "B", weight: 40, description: "", factors: [] },
];

function country(id: string, a: number, b: number): Country {
  return {
    id, name: id, iso: id.toUpperCase(), iso3: id.toUpperCase() + "X", flag: "", region: "R",
    summary: "", lastReviewed: "2026-06-16", links: [],
    categories: { a: { status: "scored", score: a }, b: { status: "scored", score: b } },
  };
}

describe("computeOverall", () => {
  it("computes weighted sum as a direct percentage when all present (weights sum 100)", () => {
    expect(computeOverall(country("x", 80, 50), cats)).toBeCloseTo(68); // 48 + 20
  });
  it("returns 100 for all-100 and 0 for all-0", () => {
    expect(computeOverall(country("x", 100, 100), cats)).toBeCloseTo(100);
    expect(computeOverall(country("x", 0, 0), cats)).toBeCloseTo(0);
  });
  it("renormalises over present categories when one is missing (not treated as 0)", () => {
    const partial = country("x", 80, 0);
    delete (partial.categories as Record<string, unknown>).b;
    expect(computeOverall(partial, cats)).toBeCloseTo(80); // (80*0.6)/0.6
  });
  it("returns 0 when no categories present", () => {
    const empty = country("x", 0, 0);
    empty.categories = {};
    expect(computeOverall(empty, cats)).toBe(0);
  });
});

describe("scoreCountry", () => {
  it("marks hasPending and isComplete correctly", () => {
    const c = country("x", 80, 50);
    c.categories.b = { status: "pending", score: 50 };
    const scored = scoreCountry(c, cats);
    expect(scored.hasPending).toBe(true);
    expect(scored.isComplete).toBe(false);
    expect(scored.scored).toHaveLength(2);
  });
});

describe("rankCountries", () => {
  it("ranks by overall descending, stable on ties by name", () => {
    const ranked = rankCountries([country("low", 10, 10), country("high", 90, 90)], cats);
    expect(ranked.map((c) => c.id)).toEqual(["high", "low"]);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
  });
});
