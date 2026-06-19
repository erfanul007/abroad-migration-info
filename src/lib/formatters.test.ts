// src/lib/formatters.test.ts
import { describe, it, expect } from "vitest";
import { formatScore, formatPercent, formatDate, scoreTier, scoreToGreen, orderedTiers } from "@/lib/formatters";
import { TIER } from "@/lib/config";

describe("formatScore", () => {
  it("rounds to a whole number", () => {
    expect(formatScore(67.6)).toBe("68");
    expect(formatScore(100)).toBe("100");
  });
});

describe("formatPercent", () => {
  it("appends a percent sign to the rounded score", () => {
    expect(formatPercent(67.6)).toBe("68%");
    expect(formatPercent(100)).toBe("100%");
  });
});

describe("formatDate", () => {
  it("renders ISO date as en-GB DD/MM/YYYY", () => {
    expect(formatDate("2026-06-16")).toBe("16/06/2026");
  });
});

describe("scoreTier", () => {
  it("maps score to a tier label", () => {
    expect(scoreTier(90)).toBe("excellent");
    expect(scoreTier(75)).toBe("good");
    expect(scoreTier(62)).toBe("fair");
    expect(scoreTier(30)).toBe("weak");
  });
  it("maps tier boundary values exactly", () => {
    expect(scoreTier(80)).toBe("excellent");
    expect(scoreTier(79)).toBe("good");
    expect(scoreTier(70)).toBe("good");
    expect(scoreTier(69)).toBe("fair");
    expect(scoreTier(60)).toBe("fair");
    expect(scoreTier(59)).toBe("weak");
  });
});

describe("orderedTiers", () => {
  it("lists tiers high→low with floors from TIER and weak at 0", () => {
    expect(orderedTiers()).toEqual([
      { tier: "excellent", min: TIER.excellent },
      { tier: "good", min: TIER.good },
      { tier: "fair", min: TIER.fair },
      { tier: "weak", min: 0 },
    ]);
  });
  it("is strictly descending by min", () => {
    const mins = orderedTiers().map((t) => t.min);
    expect(mins).toEqual([...mins].sort((a, b) => b - a));
  });
});

describe("scoreToGreen", () => {
  const L = (oklch: string) => Number(oklch.match(/oklch\(([\d.]+)/)![1]);
  const C = (oklch: string) => Number(oklch.match(/oklch\([\d.]+ ([\d.]+)/)![1]);

  it("returns null below the fill threshold (< 60 → no colour)", () => {
    expect(scoreToGreen(59)).toBeNull();
    expect(scoreToGreen(0)).toBeNull();
  });
  it("emits an oklch green (hue 150) at and above the threshold", () => {
    expect(scoreToGreen(60)).toMatch(/^oklch\([\d.]+ [\d.]+ 150\)$/);
    expect(scoreToGreen(80)).toMatch(/^oklch\([\d.]+ [\d.]+ 150\)$/);
  });
  it("darkens and saturates as the score rises (pale 60 → deep 80)", () => {
    expect(L(scoreToGreen(80)!)).toBeLessThan(L(scoreToGreen(60)!)); // deeper = lower lightness
    expect(C(scoreToGreen(80)!)).toBeGreaterThan(C(scoreToGreen(60)!)); // deeper = more chroma
  });
  it("caps at the single deepest green for any score >= 80", () => {
    expect(scoreToGreen(85)).toBe(scoreToGreen(80));
    expect(scoreToGreen(100)).toBe(scoreToGreen(80));
  });
  it("weights the ramp: an equal score gap steps the shade more at higher scores", () => {
    const hiGap = L(scoreToGreen(72)!) - L(scoreToGreen(76)!); // top of the range
    const loGap = L(scoreToGreen(62)!) - L(scoreToGreen(66)!); // bottom of the range
    expect(hiGap).toBeGreaterThan(loGap); // same 4-pt gap, wider shade difference up top
  });
  it("gives a constant, distinct shade per whole percent (1% = one shade)", () => {
    const shades = new Set<string>();
    for (let s = 60; s <= 80; s++) shades.add(scoreToGreen(s)!);
    expect(shades.size).toBe(21); // 60..80 inclusive, all distinct
  });
  it("quantises to whole percents so the mapping is stable (rounds)", () => {
    expect(scoreToGreen(70.4)).toBe(scoreToGreen(70));
    expect(scoreToGreen(69.5)).toBe(scoreToGreen(70));
  });
});
