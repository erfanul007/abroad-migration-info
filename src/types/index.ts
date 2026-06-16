// src/types/index.ts
export type CategoryId = string;
export type CellStatus = "scored" | "pending";

export interface ReferenceLink {
  title: string;
  url: string;
}

export interface Category {
  id: CategoryId;
  name: string;        // canonical, shown everywhere except dense table headers
  shortLabel: string;  // dense leaderboard column headers only
  weight: number;      // 0..100; all categories sum to 100
  description: string;
  factors: string[];
}

export interface CategoryScore {
  status: CellStatus;
  score: number;       // 0..100
  summary?: string;
  reasoning?: string;
  evidence?: string[];
  links?: ReferenceLink[];
  lastReviewed?: string; // ISO 8601
}

export interface Country {
  id: string;
  name: string;
  iso: string;   // ISO alpha-2 (flag, routing)
  iso3: string;  // ISO alpha-3 (retained for future use)
  flag: string;  // emoji
  region: string;
  summary: string;
  lastReviewed: string; // ISO 8601
  links: ReferenceLink[];
  categories: Record<CategoryId, CategoryScore>;
}

export interface Preferences {
  regions: string[];
  fasterCitizenship: boolean;
  dualCitizenship: string;
  professionPriority: string;
  relocateTogether: boolean; // household of two — both partners move together
}

/** A household member. Both partners are peers — either can be the primary
 *  applicant and the other the dependent, so no role hierarchy is encoded. */
export interface Person {
  name: string;
  role: string;
  company: string;
  location: string;
  links: { portfolio: string; linkedin: string };
}

export interface Profile {
  household: { people: Person[] };
  education: { degree: string; institution: string; completed: string };
  goal: string;
  pathway: string[];
  preferences: Preferences;
}

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
