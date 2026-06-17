// src/lib/selectors.ts
// Reusable, pure derived selectors over already-scored countries. These keep
// ranking/top-N/region/category-score logic out of page & component code so it is
// derived once and shared (no duplicated slices or inline `.categories[id].score`).
import type { ScoredCountry } from "@/types";

/** First `n` items (countries are already ranked, so this is the top N). */
export const topN = <T>(xs: readonly T[], n: number): T[] => xs.slice(0, n);

/** Unique regions present, alphabetically sorted. */
export const regionsOf = (countries: readonly ScoredCountry[]): string[] =>
  [...new Set(countries.map((c) => c.region))].sort((a, b) => a.localeCompare(b));

/** Filter by region; the sentinel `"all"` passes everything through. */
export const byRegion = (countries: readonly ScoredCountry[], region: string): ScoredCountry[] =>
  region === "all" ? [...countries] : countries.filter((c) => c.region === region);

/** Derived category score for a country (null when non-derivable / category absent). */
export const categoryScore = (country: ScoredCountry, categoryId: string): number | null =>
  country.categoryScores[categoryId] ?? null;
