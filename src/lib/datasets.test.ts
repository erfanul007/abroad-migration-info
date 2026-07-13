import { describe, it, expect } from "vitest";
import { rowOverall, rowTier, bestValue, scoreColumns } from "@/lib/datasets";
import type { ComparativeDataset } from "@/types";

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
