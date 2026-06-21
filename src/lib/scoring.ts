// src/lib/scoring.ts
import type { Category, CategoryScore, Country, FactorBreakdown, FactorBreakdownRow, FactorComparisonRow, ScoredCategory, ScoredCountry } from "@/types";

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

/** Per-factor contribution breakdown for one category cell: each factor's obtained score and
 *  its points (= score/100 × weight). Returns null on the same non-derivability rule as
 *  deriveCategoryScore (pending/absent cell or any missing/pending factor). total = Σ points,
 *  which equals deriveCategoryScore when the category's factor weights sum to 100. */
export function deriveFactorBreakdown(
  cell: CategoryScore | null | undefined,
  category: Category,
): FactorBreakdown | null {
  if (!cell || cell.status !== "scored") return null;
  const rows: FactorBreakdownRow[] = [];
  let total = 0;
  for (const factor of category.factors) {
    const fs = cell.factors[factor.id];
    if (!fs || fs.status !== "scored") return null;
    const points = (fs.score / 100) * factor.weight;
    rows.push({ id: factor.id, label: factor.label, weight: factor.weight, score: fs.score, points });
    total += points;
  }
  if (rows.length === 0) return null;
  return { rows, total };
}

/** Per-factor scores for one category across N countries (cells aligned to the caller's
 *  country order). One row per factor in category source order; scores[i] is cells[i]'s raw
 *  factor sub-score (0..100) or null when that cell is pending/absent or the factor is
 *  missing/pending. Pure — max-per-row highlighting is the caller's concern. */
export function deriveFactorComparison(
  category: Category,
  cells: (CategoryScore | null | undefined)[],
): FactorComparisonRow[] {
  return category.factors.map((factor) => ({
    id: factor.id,
    label: factor.label,
    weight: factor.weight,
    scores: cells.map((cell) => {
      if (!cell || cell.status !== "scored") return null;
      const fs = cell.factors[factor.id];
      return fs && fs.status === "scored" ? fs.score : null;
    }),
  }));
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
    const raw = deriveCategoryScore(cell, category);
    const contribution = raw === null ? 0 : (raw / 100) * category.weight; // raw weighted contribution
    const score = raw; // exact rule-based category score (raw)
    return { category, cell, score, contribution };
  });
  const present = scored.filter((s) => s.cell !== null);
  const hasPending = scored.some((s) => s.score === null);
  const isComplete = present.length === categories.length && !hasPending;
  const categoryScores = Object.fromEntries(scored.map((s) => [s.category.id, s.score]));
  const hasBlocker = present.some((s) => (s.cell!.cons ?? []).some((c) => c.severity === "blocker"));
  const hasHighlight = present.some((s) => (s.cell!.pros ?? []).some((p) => p.severity === "highlight"));
  return {
    ...country,
    overall: computeOverall(country, categories), // raw weighted mean over present categories
    rank: 0,
    hasPending,
    isComplete,
    hasBlocker,
    hasHighlight,
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
