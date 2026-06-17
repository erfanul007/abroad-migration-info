// src/lib/selectors.test.ts
import { describe, it, expect } from "vitest";
import { topN, regionsOf, byRegion, categoryScore } from "@/lib/selectors";
import type { ScoredCountry } from "@/types";

const mk = (iso: string, region: string, scores: Record<string, number | null>) =>
  ({ iso, region, categoryScores: scores }) as unknown as ScoredCountry;

const cs = [
  mk("AU", "Oceania", { "job-market": 70 }),
  mk("CA", "Americas", { "job-market": null }),
  mk("NZ", "Oceania", {}),
];

describe("selectors", () => {
  it("topN slices the first n", () => {
    expect(topN(cs, 2).map((c) => c.iso)).toEqual(["AU", "CA"]);
  });
  it("regionsOf returns unique sorted regions", () => {
    expect(regionsOf(cs)).toEqual(["Americas", "Oceania"]);
  });
  it("byRegion filters; 'all' passes through", () => {
    expect(byRegion(cs, "Oceania").map((c) => c.iso)).toEqual(["AU", "NZ"]);
    expect(byRegion(cs, "all")).toHaveLength(3);
  });
  it("categoryScore reads the derived lookup (null when non-derivable/absent)", () => {
    expect(categoryScore(cs[0], "job-market")).toBe(70);
    expect(categoryScore(cs[1], "job-market")).toBeNull();
    expect(categoryScore(cs[2], "job-market")).toBeNull();
  });
});
