import { TIERS, INCLUSION_MIN } from "@/lib/config";

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

export type Tier = (typeof TIERS)[number]["id"];

/** Score (0..100) → tier id (first tier whose floor it clears). Rounds to a whole percent FIRST
 *  so the tier colour matches the shown number (74.6 displays "75%", must colour as 75): without
 *  it, two badges showing the same "%" could differ in colour at a boundary. */
export function scoreTier(score: number): Tier {
  const pct = Math.round(score);
  for (const t of TIERS) if (pct >= t.min) return t.id;
  return "poor";
}

/** Tiers ordered by lower bound (descending); `poor` floors at 0. Derived from TIERS so a
 *  legend can never drift from scoreTier. */
export function orderedTiers(): { tier: Tier; min: number }[] {
  return TIERS.map((t) => ({ tier: t.id, min: t.min }));
}

/** Human label for a tier. Single source: config TIERS. */
export function tierLabel(tier: Tier): string {
  return TIERS.find((t) => t.id === tier)!.label;
}

/** Solid colour (hex) for a tier — choropleth fill and legend. */
export function tierColor(tier: Tier): string {
  return TIERS.find((t) => t.id === tier)!.color;
}

/** Tailwind tint classes per tier for ScoreBadge (subtle `bg-…/15` + coloured text); bars fill
 *  solid with the same hue (tierColor), badges use the lighter tint so dense tables stay legible.
 *  Literal strings so the Tailwind JIT keeps them. */
export function scoreTierClasses(tier: Tier): string {
  switch (tier) {
    case "excellent": return "bg-green-600/15 text-green-800 dark:text-green-300";
    case "good": return "bg-lime-500/15 text-lime-700 dark:text-lime-300";
    case "average": return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300";
    case "weak": return "bg-orange-500/15 text-orange-700 dark:text-orange-300";
    case "poor": return "bg-red-600/15 text-red-700 dark:text-red-300";
  }
}

// Choropleth green-ramp bounds — a single-hue sequential scale (not the tier palette): deepest
// green = highest. Both ABSOLUTE (a score always maps to the same shade as data grows) and policy-
// derived: FILL_MIN = INCLUSION_MIN (50, curation floor, so every included country gets ≥ palest
// green); FILL_MAX = excellent floor (80, deepest green) to align the top shade with the tiers.
export const FILL_MIN = INCLUSION_MIN;
export const FILL_MAX = TIERS[0].min;
// Ease-in exponent (>1, convex): weights the ramp toward the deep end so equal score gaps
// separate more at the top (76 vs 72 > 56 vs 52). One knob to dial the effect.
const FILL_CURVE = 2;

/**
 * Absolute single-hue green ramp for the choropleth (design-system §2.2):
 *   • score < FILL_MIN (50) → `null` (no fill, neutral land); only hit by sub-floor/non-derivable.
 *   • FILL_MIN ≤ score < FILL_MAX → green, one distinct shade per whole percent (pale → deep).
 *   • score ≥ FILL_MAX (80) → deepest green (capped).
 * Rounding to whole percents gives a stable "1% = one shade" mapping; FILL_CURVE widens gaps at
 * higher scores. Hue fixed at 150; lightness/chroma carry the value. Returns `oklch()` or `null`.
 */
export function scoreToGreen(score: number): string | null {
  const pct = Math.min(FILL_MAX, Math.round(score)); // round first, like scoreTier, so fill matches the shown %
  if (pct < FILL_MIN) return null;
  const t = (pct - FILL_MIN) / (FILL_MAX - FILL_MIN); // 0..1
  const w = Math.pow(t, FILL_CURVE); // ease-in: bigger shade steps at higher scores
  const lightness = 0.9 - w * 0.54; // 0.90 (pale floor) → 0.36 (deep ceiling)
  const chroma = 0.06 + w * 0.15; //   0.06 (subtle)     → 0.21 (saturated)
  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} 150)`;
}
