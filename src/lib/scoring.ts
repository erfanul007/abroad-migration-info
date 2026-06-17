// src/lib/scoring.ts
import type { Category, CategoryScore, Country, ScoredCategory, ScoredCountry } from "@/types";

/** Strict factor-weighted mean over a category's factors. Returns null (non-derivable)
 *  when the cell is pending/absent or any one of the category's factors is missing or
 *  pending — mirroring how a missing category is excluded from the overall. Result is 0..100. */
export function deriveCategoryScore(
  cell: CategoryScore | null | undefined,
  category: Category,
): number | null {
  if (!cell || cell.status !== "scored") return null;
  let weightedSum = 0;
  let totalWeight = 0;
  for (const factor of category.factors) {
    const fs = cell.factors[factor.id];
    if (!fs || fs.status !== "scored") return null;
    weightedSum += (fs.score / 100) * factor.weight;
    totalWeight += factor.weight;
  }
  if (totalWeight === 0) return null;
  return (weightedSum / totalWeight) * 100;
}

/** Weighted sum of derived category scores, renormalised over categories that derive.
 *  Non-derivable categories are excluded (not treated as 0); result is 0..100. */
export function computeOverall(country: Country, categories: Category[]): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const category of categories) {
    const score = deriveCategoryScore(country.categories[category.id], category);
    if (score === null) continue;
    weightedSum += (score / 100) * category.weight;
    totalWeight += category.weight;
  }
  if (totalWeight === 0) return 0;
  return (weightedSum / totalWeight) * 100;
}

export function scoreCountry(country: Country, categories: Category[]): ScoredCountry {
  const scored: ScoredCategory[] = categories.map((category) => {
    const cell = country.categories[category.id] ?? null;
    const score = deriveCategoryScore(cell, category);
    const contribution = score === null ? 0 : (score / 100) * category.weight;
    return { category, cell, score, contribution };
  });
  const present = scored.filter((s) => s.cell !== null);
  const hasPending = scored.some((s) => s.score === null);
  const isComplete = present.length === categories.length && !hasPending;
  const categoryScores = Object.fromEntries(scored.map((s) => [s.category.id, s.score]));
  const hasBlocker = present.some((s) => (s.cell!.cons ?? []).some((c) => c.severity === "blocker"));
  return {
    ...country,
    overall: computeOverall(country, categories),
    rank: 0,
    hasPending,
    isComplete,
    hasBlocker,
    categoryScores,
    scored,
  };
}

export function rankCountries(countries: Country[], categories: Category[]): ScoredCountry[] {
  return countries
    .map((c) => scoreCountry(c, categories))
    .sort((a, b) => b.overall - a.overall || a.name.localeCompare(b.name))
    .map((c, i) => ({ ...c, rank: i + 1 }));
}
