// Drift guard: committed cache must equal a fresh recompute from source.
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
