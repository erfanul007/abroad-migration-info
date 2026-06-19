// src/lib/formatters.ts
import { TIER, CHOROPLETH } from "@/lib/config";

const LOCALE = "en-GB"; // org default for user-facing en (point decimal, DD/MM/YYYY)

export function formatScore(score: number): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(score);
}

/** A 0–100 score/weight rendered as a percentage (single source for the `%` suffix). */
export function formatPercent(score: number): string {
  return `${formatScore(score)}%`;
}

export function formatNumber(n: number, fractionDigits = 0): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: fractionDigits }).format(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC",
  }).format(d);
}

export type Tier = "excellent" | "good" | "fair" | "weak";

export function scoreTier(score: number): Tier {
  if (score >= TIER.excellent) return "excellent";
  if (score >= TIER.good) return "good";
  if (score >= TIER.fair) return "fair";
  return "weak";
}

/** The score tiers ordered by their lower bound (descending); `weak` floors at 0.
 *  Derived from TIER so a tier legend can never drift from scoreTier. */
export function orderedTiers(): { tier: Tier; min: number }[] {
  return [
    { tier: "excellent", min: TIER.excellent },
    { tier: "good", min: TIER.good },
    { tier: "fair", min: TIER.fair },
    { tier: "weak", min: 0 },
  ];
}

/** Tailwind classes for the score colour scale (used by ScoreBadge). */
export function scoreTierClasses(tier: Tier): string {
  switch (tier) {
    case "excellent": return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "good": return "bg-lime-500/15 text-lime-700 dark:text-lime-300";
    case "fair": return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
    case "weak": return "bg-rose-500/15 text-rose-700 dark:text-rose-300";
  }
}

/** Choropleth fill thresholds — a FIXED absolute scale (not data-relative), so a given
 *  score always maps to the same shade as the dataset grows. */
export const FILL_MIN = CHOROPLETH.min; // below this → no fill (renders as neutral default land)
export const FILL_MAX = CHOROPLETH.max; // at/above this → the single deepest green (capped)
// Ease-in exponent (>1, convex). Weights the ramp toward the deep end: equal score gaps
// produce a SMALL shade step low down and a progressively LARGER step higher up (so 76 vs
// 72 separates more than 66 vs 62). Tune this single knob to dial the effect.
const FILL_CURVE = 2;

/**
 * Absolute single-hue green ramp for the choropleth (design-system §2.2). Fixed scale:
 *   • score < 60        → `null` (no fill; the country shows as the neutral land colour)
 *   • 60 ≤ score < 80   → green, one distinct shade per whole percent (pale 60 → deep 79)
 *   • score ≥ 80        → the deepest green (capped)
 * Quantising to whole percents (`Math.round`) gives a constant "1% = one shade" mapping of
 * 21 fixed shades, stable across future data. An ease-in curve (`FILL_CURVE`) widens the
 * shade gap toward higher scores, so equal differences read more strongly at the top. Hue
 * is fixed at 150 (green); lightness/chroma carry the value. Returns `oklch()` or `null`.
 */
export function scoreToGreen(score: number): string | null {
  if (score < FILL_MIN) return null;
  const pct = Math.min(FILL_MAX, Math.round(score));
  const t = (pct - FILL_MIN) / (FILL_MAX - FILL_MIN); // 0..1, one step per percent
  const w = Math.pow(t, FILL_CURVE); // ease-in: bigger shade steps at higher scores
  const lightness = 0.9 - w * 0.54; // 0.90 (pale, 60%) → 0.36 (deep, 80%+)
  const chroma = 0.06 + w * 0.15; //   0.06 (subtle)    → 0.21 (saturated)
  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} 150)`;
}
