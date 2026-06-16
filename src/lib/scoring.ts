// src/lib/scoring.ts
import type { Category, Country, ScoredCategory, ScoredCountry } from "@/types";

/** Weighted sum, renormalised over categories that have a numeric score.
 *  Missing categories are excluded (not treated as 0); result is 0..100. */
export function computeOverall(country: Country, categories: Category[]): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const cat of categories) {
    const cell = country.categories[cat.id];
    if (!cell || typeof cell.score !== "number") continue;
    weightedSum += (cell.score / 100) * cat.weight;
    totalWeight += cat.weight;
  }
  if (totalWeight === 0) return 0;
  return (weightedSum / totalWeight) * 100;
}

export function scoreCountry(country: Country, categories: Category[]): ScoredCountry {
  const scored: ScoredCategory[] = categories.map((category) => {
    const cell = country.categories[category.id] ?? null;
    const contribution = cell ? (cell.score / 100) * category.weight : 0;
    return { category, cell, contribution };
  });
  const present = scored.filter((s) => s.cell !== null);
  const hasPending = present.some((s) => s.cell!.status === "pending");
  const isComplete = present.length === categories.length && !hasPending;
  return {
    ...country,
    overall: computeOverall(country, categories),
    rank: 0,
    hasPending,
    isComplete,
    scored,
  };
}

export function rankCountries(countries: Country[], categories: Category[]): ScoredCountry[] {
  return countries
    .map((c) => scoreCountry(c, categories))
    .sort((a, b) => b.overall - a.overall || a.name.localeCompare(b.name))
    .map((c, i) => ({ ...c, rank: i + 1 }));
}
