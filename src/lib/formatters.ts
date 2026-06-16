// src/lib/formatters.ts
const LOCALE = "en-GB"; // org default for user-facing en (point decimal, DD/MM/YYYY)

export function formatScore(score: number): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(score);
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
  if (score >= 80) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "fair";
  return "weak";
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

/** Hex fills for the choropleth (design-system §2.2). */
export function scoreTierFill(tier: Tier): string {
  switch (tier) {
    case "excellent": return "#16a34a";
    case "good": return "#65a30d";
    case "fair": return "#d97706";
    case "weak": return "#e11d48";
  }
}
