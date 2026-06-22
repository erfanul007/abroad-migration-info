import { describe, it, expect } from "vitest";
import { formatScore, formatPercent, formatDate, scoreTier, orderedTiers, tierLabel, tierColor, scoreToGreen, FILL_MIN, FILL_MAX } from "@/lib/formatters";
import { TIERS, INCLUSION_MIN } from "@/lib/config";

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
  it("maps scores across the 5-tier scale", () => {
    expect(scoreTier(90)).toBe("excellent");
    expect(scoreTier(72)).toBe("good");
    expect(scoreTier(62)).toBe("average");
    expect(scoreTier(55)).toBe("weak");
    expect(scoreTier(20)).toBe("poor");
  });
  it("maps boundary values exactly (>= floor wins the higher tier)", () => {
    expect(scoreTier(80)).toBe("excellent");
    expect(scoreTier(79)).toBe("good");
    expect(scoreTier(70)).toBe("good");
    expect(scoreTier(69)).toBe("average");
    expect(scoreTier(60)).toBe("average");
    expect(scoreTier(59)).toBe("weak");
    expect(scoreTier(50)).toBe("weak");
    expect(scoreTier(49)).toBe("poor");
    expect(scoreTier(0)).toBe("poor");
  });
  it("tiers on the ROUNDED percent so colour matches the shown number", () => {
    expect(scoreTier(79.6)).toBe("excellent"); // rounds to 80
    expect(scoreTier(79.4)).toBe("good"); // rounds to 79
    expect(scoreTier(69.6)).toBe("good"); // rounds to 70
    expect(scoreTier(49.6)).toBe("weak"); // rounds to 50
    expect(scoreTier(49.4)).toBe("poor"); // rounds to 49
  });
});

describe("orderedTiers", () => {
  it("lists all 5 tiers high→low, mirroring config TIERS", () => {
    expect(orderedTiers()).toEqual(TIERS.map((t) => ({ tier: t.id, min: t.min })));
    expect(orderedTiers()).toHaveLength(5);
    expect(orderedTiers()[0]).toEqual({ tier: "excellent", min: 80 });
    expect(orderedTiers().at(-1)).toEqual({ tier: "poor", min: 0 });
  });
  it("is strictly descending by min", () => {
    const mins = orderedTiers().map((t) => t.min);
    expect(mins).toEqual([...mins].sort((a, b) => b - a));
  });
});

describe("tierLabel & tierColor", () => {
  it("returns the configured label and colour per tier", () => {
    expect(tierLabel("good")).toBe("Good");
    expect(tierLabel("average")).toBe("Average");
    expect(tierLabel("poor")).toBe("Poor");
    expect(tierColor("excellent")).toBe("#15803D");
    expect(tierColor("weak")).toBe("#F97316");
    expect(tierColor("poor")).toBe("#DC2626");
  });
});

describe("scoreToGreen (choropleth ramp)", () => {
  it("anchors the ramp to policy: floor = INCLUSION_MIN, ceiling = excellent tier", () => {
    expect(FILL_MIN).toBe(INCLUSION_MIN);
    expect(FILL_MAX).toBe(TIERS[0].min); // = excellent-tier floor
  });
  it("returns null below the fill floor (renders as neutral land, not green)", () => {
    expect(scoreToGreen(FILL_MIN - 1)).toBeNull();
    expect(scoreToGreen(0)).toBeNull();
  });
  it("greens every included country — the floor itself gets the palest green, not null", () => {
    const palest = scoreToGreen(FILL_MIN);
    expect(palest).not.toBeNull();
    expect(palest).toMatch(/^oklch\([\d.]+ [\d.]+ 150\)$/); // fixed hue 150
  });
  it("caps at the ceiling: scores at and above FILL_MAX share the single deepest green", () => {
    expect(scoreToGreen(FILL_MAX)).toBe(scoreToGreen(FILL_MAX + 25));
    expect(scoreToGreen(FILL_MAX)).toBe(scoreToGreen(100));
  });
  it("darkens monotonically with score (lightness falls as the score rises)", () => {
    const lightness = (s: number) => Number(/oklch\(([\d.]+)/.exec(scoreToGreen(s)!)![1]);
    expect(lightness(FILL_MIN)).toBeGreaterThan(lightness(65));
    expect(lightness(65)).toBeGreaterThan(lightness(FILL_MAX));
  });
});
