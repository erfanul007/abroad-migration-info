// Reusable pure selectors over already-scored countries — keeps ranking/top-N/region/category
// logic out of components so it's derived once and shared, not duplicated inline.
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

/** Comparator: heavier weight first. Relies on sort's stability so equal-weight categories keep
 *  source order. Works on any `{ weight }`-bearing item (Category, or a ScoredCategory's `.category`). */
export const byWeightDesc = (a: { weight: number }, b: { weight: number }): number => b.weight - a.weight;
