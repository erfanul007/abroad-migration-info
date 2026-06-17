// src/types/index.ts
// Data-shape types are inferred from the Zod schemas (src/lib/schema.ts) so the runtime
// validation and the compile-time types share one definition and can't drift. This file
// re-exports them and adds the derived (runtime-only) types the schemas don't cover.
export type {
  ReferenceLink,
  Factor,
  Category,
  CellStatus,
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
  contribution: number;       // (score/100) * weight, 0 if missing
}

export interface ScoredCountry extends Country {
  overall: number;     // 0..100, renormalised over present categories
  rank: number;        // 1-based by overall desc
  hasPending: boolean; // any cell status === "pending"
  isComplete: boolean; // all categories present and scored
  scored: ScoredCategory[];
}
