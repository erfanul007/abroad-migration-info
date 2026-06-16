// src/lib/formatters.test.ts
import { describe, it, expect } from "vitest";
import { formatScore, formatDate, scoreTier } from "@/lib/formatters";

describe("formatScore", () => {
  it("rounds to a whole number", () => {
    expect(formatScore(67.6)).toBe("68");
    expect(formatScore(100)).toBe("100");
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
    expect(scoreTier(70)).toBe("good");
    expect(scoreTier(50)).toBe("fair");
    expect(scoreTier(30)).toBe("weak");
  });
});
