// src/lib/scoreboard.ts
// Pure projection of the ranked countries into the cached scoreboard shape. Uses RELATIVE
// imports (not @/) so this module loads identically under Vite (app/tests) and under tsx
// (the cache build script), which does not resolve the @/ alias at runtime.
import type { Category, Country } from "./schema";
import { rankCountries, computeOverall } from "./scoring";
import { RECALIBRATE } from "./config";

const round2 = (n: number): number => Math.round(n * 100) / 100;

export interface ScoreboardEntry {
  id: string;
  name: string;
  iso: string;
  flag: string;
  rank: number;
  overall: number; // recalibrated (display)
  overallRaw: number; // pre-curve, for transparency
  categoryScores: Record<string, number | null>; // raw exact rule-based score (not recalibrated; only `overall` is)
  hasBlocker: boolean;
  hasHighlight: boolean;
}

export interface Scoreboard {
  categoryCount: number;
  recalibrate: { pivot: number; gain: number };
  countries: ScoreboardEntry[];
}

/** Project ranked countries into the cache shape. Deterministic (round to 2dp, stable order). */
export function buildScoreboard(countries: Country[], categories: Category[]): Scoreboard {
  const ranked = rankCountries(countries, categories);
  return {
    categoryCount: categories.length,
    recalibrate: { pivot: RECALIBRATE.pivot, gain: RECALIBRATE.gain },
    countries: ranked.map((c) => ({
      id: c.id,
      name: c.name,
      iso: c.iso,
      flag: c.flag,
      rank: c.rank,
      overall: round2(c.overall),
      overallRaw: round2(computeOverall(c, categories)),
      categoryScores: Object.fromEntries(
        categories.map((cat) => {
          const s = c.categoryScores[cat.id];
          return [cat.id, s === null || s === undefined ? null : round2(s)];
        }),
      ),
      hasBlocker: c.hasBlocker,
      hasHighlight: c.hasHighlight,
    })),
  };
}
