// src/data/cache/scoreboard.test.ts
// Drift guard: the committed cache must equal a fresh recompute from the source factor data.
// If this fails, the cache is stale — run `npm run cache:scores` and recommit.
import { describe, it, expect } from "vitest";
import board from "@/data/cache/scoreboard.json";
import { countries, categories } from "@/lib/data";
import { buildScoreboard } from "@/lib/scoreboard";

describe("scoreboard cache", () => {
  it("matches a fresh recompute from source — run `npm run cache:scores` if this fails", () => {
    const fresh = buildScoreboard(countries, categories);
    expect(board).toEqual(fresh);
  });
});
