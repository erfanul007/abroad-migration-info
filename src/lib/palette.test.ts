import { describe, it, expect } from "vitest";
import { categoryColor } from "@/lib/palette";

const hue = (s: string) => Number(s.match(/oklch\([\d.]+ [\d.]+ ([\d.]+)\)/)![1]);

describe("categoryColor", () => {
  it("returns an oklch identity colour", () => {
    expect(categoryColor(0, 15)).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
  });
  it("is deterministic for the same index/total", () => {
    expect(categoryColor(3, 15)).toBe(categoryColor(3, 15));
  });
  it("spaces hues evenly by 360/total", () => {
    expect(hue(categoryColor(1, 15))).toBeCloseTo(360 / 15, 1);
    expect(hue(categoryColor(2, 15))).toBeCloseTo((360 / 15) * 2, 1);
  });
  it("gives distinct colours across the set", () => {
    const set = new Set(Array.from({ length: 15 }, (_, i) => categoryColor(i, 15)));
    expect(set.size).toBe(15);
  });
  it("handles total=0 without NaN", () => {
    expect(categoryColor(0, 0)).toMatch(/^oklch\([\d.]+ [\d.]+ 0\.0\)$/);
  });
});
