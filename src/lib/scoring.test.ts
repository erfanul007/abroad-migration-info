// src/lib/scoring.test.ts
import { describe, it, expect } from "vitest";
import { computeOverall, scoreCountry, rankCountries, deriveCategoryScore, recalibrate } from "@/lib/scoring";
import type { Category, Country } from "@/types";

const f = (id: string, weight: number) => ({ id, label: id, description: "", weight });
const cats: Category[] = [
  { id: "a", name: "A", shortLabel: "A", weight: 60, description: "", factors: [f("a1", 50), f("other", 50)] },
  { id: "b", name: "B", shortLabel: "B", weight: 40, description: "", factors: [f("b1", 60), f("other", 40)] },
];

const sc = (n: number) => ({ status: "scored" as const, score: n });
const cell = (
  factors: Record<string, { status: "scored" | "pending"; score: number }>,
  status: "scored" | "pending" = "scored",
): Country["categories"][string] => ({
  status, factors, summary: "", pros: [], cons: [], links: [], lastReviewed: "2026-06-18",
});

// A cell whose every factor scores `n`, so the derived category score is exactly `n`.
const flat = (catId: string, n: number) => {
  const cat = cats.find((c) => c.id === catId)!;
  return cell(Object.fromEntries(cat.factors.map((fc) => [fc.id, sc(n)])));
};

function country(id: string, a: number, b: number): Country {
  return {
    id, name: id, iso: id.toUpperCase(), iso3: id.toUpperCase() + "X", flag: "", region: "R",
    summary: "", lastReviewed: "2026-06-18", links: [],
    categories: { a: flat("a", a), b: flat("b", b) },
  };
}

describe("deriveCategoryScore", () => {
  it("is the factor-weighted mean when all factors are scored", () => {
    // (80*50 + 60*50) / 100 = 70
    expect(deriveCategoryScore(cell({ a1: sc(80), other: sc(60) }), cats[0])).toBe(70);
  });
  it("is null when a factor is missing", () => {
    expect(deriveCategoryScore(cell({ a1: sc(80) }), cats[0])).toBeNull();
  });
  it("is null when a factor is pending", () => {
    expect(deriveCategoryScore(cell({ a1: { status: "pending", score: 0 }, other: sc(60) }), cats[0])).toBeNull();
  });
  it("is null for a pending or absent cell", () => {
    expect(deriveCategoryScore(cell({}, "pending"), cats[0])).toBeNull();
    expect(deriveCategoryScore(null, cats[0])).toBeNull();
  });
});

describe("computeOverall (derived)", () => {
  it("computes the category-weighted percentage when all categories derive", () => {
    expect(computeOverall(country("x", 80, 50), cats)).toBeCloseTo(68); // 0.6*80 + 0.4*50
  });
  it("returns 100 for all-100 and 0 for all-0", () => {
    expect(computeOverall(country("x", 100, 100), cats)).toBeCloseTo(100);
    expect(computeOverall(country("x", 0, 0), cats)).toBeCloseTo(0);
  });
  it("renormalises over derivable categories when one is non-derivable", () => {
    const partial = country("x", 80, 0);
    partial.categories.b = cell({}, "pending"); // b non-derivable → excluded
    expect(computeOverall(partial, cats)).toBeCloseTo(80); // (80*0.6)/0.6
  });
  it("returns 0 when nothing is derivable", () => {
    const empty = country("x", 0, 0);
    empty.categories = { a: cell({}, "pending"), b: cell({}, "pending") };
    expect(computeOverall(empty, cats)).toBe(0);
  });
});

describe("scoreCountry", () => {
  it("derives per-category score, marks hasPending/isComplete, exposes categoryScores", () => {
    const c = country("x", 80, 50);
    c.categories.b = cell({}, "pending");
    const scored = scoreCountry(c, cats);
    expect(scored.hasPending).toBe(true);
    expect(scored.isComplete).toBe(false);
    expect(scored.scored).toHaveLength(2);
    expect(scored.categoryScores.a).toBe(recalibrate(80));
    expect(scored.categoryScores.b).toBeNull();
  });
  it("derives hasBlocker from any con tagged severity:blocker", () => {
    const c = country("x", 80, 50);
    c.categories.a = { ...c.categories.a, cons: [{ text: "no dual citizenship", severity: "blocker" }] };
    expect(scoreCountry(c, cats).hasBlocker).toBe(true);
    expect(scoreCountry(country("y", 80, 50), cats).hasBlocker).toBe(false);
  });
});

describe("recalibrate", () => {
  it("is the identity at the pivot", () => {
    expect(recalibrate(55)).toBe(55);
  });
  it("stretches above and below the pivot", () => {
    expect(recalibrate(65)).toBeCloseTo(71); // 55 + 10*1.6
    expect(recalibrate(45)).toBeCloseTo(39); // 55 - 10*1.6
  });
  it("clamps to [0,100]", () => {
    expect(recalibrate(95)).toBe(100); // 55 + 40*1.6 = 119 -> 100
    expect(recalibrate(5)).toBe(0); //   55 - 50*1.6 = -25 -> 0
  });
  it("is monotonic", () => {
    expect(recalibrate(60)).toBeLessThan(recalibrate(61));
  });
});

describe("rankCountries", () => {
  it("ranks by overall descending, stable on ties by name", () => {
    const ranked = rankCountries([country("low", 10, 10), country("high", 90, 90)], cats);
    expect(ranked.map((c) => c.id)).toEqual(["high", "low"]);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
  });
  it("breaks exact ties alphabetically by name", () => {
    const tied = rankCountries([country("zebra", 80, 80), country("alpha", 80, 80)], cats);
    expect(tied.map((c) => c.id)).toEqual(["alpha", "zebra"]);
    expect(tied[0].rank).toBe(1);
    expect(tied[1].rank).toBe(2);
  });
});
