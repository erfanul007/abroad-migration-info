// src/lib/formatters.ts
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

/** Map a 0..100 score to its tier id — the first tier whose floor it clears. Rounds to a whole
 *  percent FIRST so the tier matches the number actually shown (`formatPercent` rounds too): a
 *  74.6 score displays as "75%" and must colour as the 75 tier, not 74. Without this, two badges
 *  showing the same "%" could differ in colour at a boundary. TIERS is descending, `poor`
 *  floors at 0, so every score resolves. */
export function scoreTier(score: number): Tier {
  const pct = Math.round(score);
  for (const t of TIERS) if (pct >= t.min) return t.id;
  return "poor";
}

/** The tiers ordered by their lower bound (descending); `poor` floors at 0. Derived from
 *  TIERS so a legend can never drift from scoreTier. */
export function orderedTiers(): { tier: Tier; min: number }[] {
  return TIERS.map((t) => ({ tier: t.id, min: t.min }));
}

/** Human label for a tier (e.g. "Average"). Single source: config TIERS. */
export function tierLabel(tier: Tier): string {
  return TIERS.find((t) => t.id === tier)!.label;
}

/** Representative solid colour (hex) for a tier — used for the choropleth fill and legend. */
export function tierColor(tier: Tier): string {
  return TIERS.find((t) => t.id === tier)!.color;
}

/** Tailwind TINT classes per tier for ScoreBadge (subtle `bg-…/15` + coloured text). The
 *  contribution bars fill SOLID with the same tier hue (tierColor); badges use the lighter
 *  tint so dense tables/cards stay legible. (The choropleth is the one exception — it uses a
 *  continuous green ramp, `scoreToGreen`, not the tier scale.) Literal strings so the Tailwind
 *  JIT keeps them. */
export function scoreTierClasses(tier: Tier): string {
  switch (tier) {
    case "excellent": return "bg-green-600/15 text-green-800 dark:text-green-300";
    case "good": return "bg-lime-500/15 text-lime-700 dark:text-lime-300";
    case "average": return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300";
    case "weak": return "bg-orange-500/15 text-orange-700 dark:text-orange-300";
    case "poor": return "bg-red-600/15 text-red-700 dark:text-red-300";
  }
}

// Choropleth green-ramp bounds. The map (unlike badges/bars) is a single-hue sequential scale,
// not the tier palette: deepest green = highest, faintest = lowest. Both are ABSOLUTE (a given
// score always maps to the same shade as the dataset grows) and derived from policy, not magic:
//   • FILL_MIN = INCLUSION_MIN (50) — the curation floor; every *included* country is ≥50, so
//     every country on the map gets at least the palest green (nothing surfaced renders unfilled).
//   • FILL_MAX = excellent floor (80) — the deepest green is reserved for "excellent", aligning
//     the map's top shade with the tier scale used everywhere else.
export const FILL_MIN = INCLUSION_MIN; // ramp floor: pale green
export const FILL_MAX = TIERS[0].min; //  ramp ceiling (80, "excellent"): deepest green; capped
// Ease-in exponent (>1, convex). Weights the ramp toward the deep end: equal score gaps produce
// a SMALL shade step low down and a progressively LARGER one higher up (so 76 vs 72 separates
// more than 56 vs 52). One knob to dial the effect.
const FILL_CURVE = 2;

/**
 * Absolute single-hue green ramp for the choropleth (design-system §2.2). Fixed scale:
 *   • score < FILL_MIN (50) → `null` (no fill; country shows the neutral land colour). Included
 *     countries are all ≥50, so this only ever hits genuinely sub-floor / non-derivable values.
 *   • FILL_MIN ≤ score < FILL_MAX → green, one distinct shade per whole percent (pale → deep).
 *   • score ≥ FILL_MAX (80) → the deepest green (capped).
 * Quantising to whole percents (`Math.round`) gives a stable "1% = one shade" mapping across
 * future data. The ease-in curve (`FILL_CURVE`) widens shade gaps toward higher scores. Hue is
 * fixed at 150 (green); lightness/chroma carry the value. Returns `oklch()` or `null`.
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
