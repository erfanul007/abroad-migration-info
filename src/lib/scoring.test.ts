// src/lib/scoring.test.ts
import { describe, it, expect } from "vitest";
import { computeOverall, scoreCountry, rankCountries, deriveCategoryScore, deriveFactorBreakdown, deriveFactorComparison } from "@/lib/scoring";
import type { Category, Country } from "@/types";

const f = (id: string, weight: number) => ({ id, label: id, description: "", weight });
const cats: Category[] = [
  { id: "a", name: "A", shortLabel: "A", weight: 60, description: "", factors: [f("a1", 50), f("f2", 50)] },
  { id: "b", name: "B", shortLabel: "B", weight: 40, description: "", factors: [f("b1", 60), f("f2", 40)] },
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
    expect(deriveCategoryScore(cell({ a1: sc(80), f2: sc(60) }), cats[0])).toBe(70);
  });
  it("is null when a factor is missing", () => {
    expect(deriveCategoryScore(cell({ a1: sc(80) }), cats[0])).toBeNull();
  });
  it("is null when a factor is pending", () => {
    expect(deriveCategoryScore(cell({ a1: { status: "pending", score: 0 }, f2: sc(60) }), cats[0])).toBeNull();
  });
  it("is null for a pending or absent cell", () => {
    expect(deriveCategoryScore(cell({}, "pending"), cats[0])).toBeNull();
    expect(deriveCategoryScore(null, cats[0])).toBeNull();
  });
});

describe("deriveFactorBreakdown", () => {
  it("returns one row per factor with points = score/100 * weight, summing to the category score", () => {
    const bd = deriveFactorBreakdown(cell({ a1: sc(80), f2: sc(60) }), cats[0]);
    expect(bd).not.toBeNull();
    expect(bd!.rows).toHaveLength(2);
    expect(bd!.rows[0]).toMatchObject({ id: "a1", label: "a1", weight: 50, score: 80, points: 40 });
    expect(bd!.rows[1]).toMatchObject({ id: "f2", weight: 50, score: 60, points: 30 });
    expect(bd!.total).toBe(70);
  });
  it("total equals deriveCategoryScore for a complete scored cell", () => {
    const c = cell({ a1: sc(72), f2: sc(58) });
    expect(deriveFactorBreakdown(c, cats[0])!.total).toBeCloseTo(deriveCategoryScore(c, cats[0])!);
  });
  it("is null when a factor is missing or pending, or the cell is pending/absent", () => {
    expect(deriveFactorBreakdown(cell({ a1: sc(80) }), cats[0])).toBeNull();
    expect(deriveFactorBreakdown(cell({ a1: { status: "pending", score: 0 }, f2: sc(60) }), cats[0])).toBeNull();
    expect(deriveFactorBreakdown(cell({}, "pending"), cats[0])).toBeNull();
    expect(deriveFactorBreakdown(null, cats[0])).toBeNull();
  });
});

describe("deriveFactorComparison", () => {
  it("one row per factor in source order, scores aligned to the cells", () => {
    const rows = deriveFactorComparison(cats[0], [cell({ a1: sc(80), f2: sc(60) }), cell({ a1: sc(40), f2: sc(20) })]);
    expect(rows.map((r) => r.id)).toEqual(["a1", "f2"]);
    expect(rows[0]).toMatchObject({ label: "a1", weight: 50, scores: [80, 40] });
    expect(rows[1].scores).toEqual([60, 20]);
  });
  it("null per country for a pending or absent cell", () => {
    const rows = deriveFactorComparison(cats[0], [cell({ a1: sc(80), f2: sc(60) }), cell({}, "pending"), null]);
    expect(rows[0].scores).toEqual([80, null, null]);
    expect(rows[1].scores).toEqual([60, null, null]);
  });
  it("null when an individual factor is missing or pending", () => {
    const rows = deriveFactorComparison(cats[0], [cell({ a1: sc(90) }), cell({ a1: { status: "pending", score: 0 }, f2: sc(50) })]);
    expect(rows[0].scores).toEqual([90, null]); // a1: scored, then pending
    expect(rows[1].scores).toEqual([null, 50]); // f2: missing in first, scored in second
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
    expect(scored.categoryScores.a).toBe(80); // category score is exact (raw)
    expect(scored.categoryScores.b).toBeNull();
    expect(scored.overall).toBeCloseTo(80); // raw weighted mean, renormalised over the one present category (b is pending)
  });
  it("derives hasBlocker from any con tagged severity:blocker", () => {
    const c = country("x", 80, 50);
    c.categories.a = { ...c.categories.a, cons: [{ text: "no dual citizenship", severity: "blocker" }] };
    expect(scoreCountry(c, cats).hasBlocker).toBe(true);
    expect(scoreCountry(country("y", 80, 50), cats).hasBlocker).toBe(false);
  });
  it("derives hasHighlight from any pro tagged severity:highlight", () => {
    const c = country("x", 80, 50);
    c.categories.a = { ...c.categories.a, pros: [{ text: "open direct work visa", severity: "highlight" }] };
    expect(scoreCountry(c, cats).hasHighlight).toBe(true);
    expect(scoreCountry(country("y", 80, 50), cats).hasHighlight).toBe(false);
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
