// Data-shape types are inferred from the Zod schemas (src/lib/schema.ts) so runtime
// validation and compile-time types share one definition and can't drift. Re-exports
// them plus the derived (runtime-only) types the schemas don't cover.
export type {
  ReferenceLink,
  Factor,
  Category,
  CellStatus,
  ProCon,
  FactorScore,
  CategoryScore,
  Country,
  Preferences,
  Person,
  Profile,
} from "@/lib/schema";

import type { Category, CategoryScore, Country } from "@/lib/schema";

/** Category ids are plain strings; this alias documents intent at call sites. */
export type CategoryId = string;

// Derived (runtime only)
export interface ScoredCategory {
  category: Category;
  cell: CategoryScore | null; // null = category missing for this country
  score: number | null;       // exact factor-weighted mean (raw); null = non-derivable
  contribution: number;       // (score/100) * weight, 0 if non-derivable
}

export interface ScoredCountry extends Country {
  overall: number;     // 0..100, renormalised over derivable categories
  rank: number;        // 1-based by overall desc
  hasPending: boolean; // any category non-derivable (pending/incomplete factors)
  isComplete: boolean; // all categories present and derivable
  hasBlocker: boolean; // any con tagged severity:"blocker"
  hasHighlight: boolean; // any pro tagged severity:"highlight"
  categoryScores: Record<string, number | null>; // derived per-category score lookup
  scored: ScoredCategory[];
}

// Factor-level contribution breakdown for one category cell (CountryDetail modal).
export interface FactorBreakdownRow {
  id: string;
  label: string;
  weight: number;  // factor weight within the category (sums to 100)
  score: number;   // obtained factor sub-score, 0..100
  points: number;  // (score/100) * weight — contribution to the category score
}
export interface FactorBreakdown {
  rows: FactorBreakdownRow[];
  total: number; // Σ points = raw weighted mean (0..100)
}

// Factor-level comparison across N countries for one category (Compare modal).
export interface FactorComparisonRow {
  id: string;
  label: string;
  weight: number;            // factor weight within the category (sums to 100)
  scores: (number | null)[]; // raw 0–100 per country, aligned to input order; null = pending/absent
}
