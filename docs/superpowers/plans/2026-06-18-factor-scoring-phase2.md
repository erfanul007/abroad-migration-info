# Factor-Scoring Phase 2 — Country Cells, Derivation & Decoupling — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-set flat category `score` with factor-level sub-scores, derive the category score from its factors, the overall from categories, and rank/leaderboard/top-3 from the overall — all in TypeScript with JSON as the only data store; decouple all derived calculation into a reusable, de-duplicated lib; then pilot one fully re-researched country (Australia) before batching the rest.

**Architecture:** Hard cutover on a branch (no legacy flat-score path). Country cell becomes `{ status, factors{}, summary, pros[], cons[], links[], lastReviewed }`. `scoring.ts` gains `deriveCategoryScore` (strict: a category scores only when every one of its factors is scored) feeding the existing `computeOverall`/`rankCountries`. Policy constants and derived selectors move to `src/lib/config.ts` + `src/lib/selectors.ts`. All 22 countries convert to **pending** new-shape in one coordinated commit (app valid, leaderboard empty — accepted), then Australia is researched factor-by-factor and flipped to `scored` as the pilot checkpoint; the remaining 21 follow in later batches (separate turns).

**Tech Stack:** React 19 · TypeScript (strict) · Vite 8 · Zod 4 · Vitest. Package manager: npm.

## Global Constraints

- Strict TS, no `any`; derive types from Zod via `z.infer`, re-export from `@/types`.
- **Hard cutover:** remove the flat `score`/`reasoning` cell fields; no dual-shape fallback in `scoring.ts`.
- **Strict derivation:** `categoryScore = Σ(factor.score × factor.weight) / Σ(factor.weight)` over the category's factors; if ANY factor is unscored/missing, the category is non-derivable (treated as pending, excluded from overall — mirrors today's missing-category handling). Overall is renormalised over derivable categories. Overall is NEVER stored.
- A cell's `factors` keys must be ⊆ that category's known factor ids. A cell with `status:"scored"` MUST carry every factor id of its category, each `status:"scored"`.
- Blocker = a `con` with `severity:"blocker"`; `hasBlocker` is derived country-level. No score override; inclusion stays the `<60` drop rule.
- No "flag"/"Flag" wording in any `summary`, `pros`, or `cons` copy.
- **Data-change protocol (Task 4+ research):** deep-research first; gov-first authentic sources (immigration authority portals, then OECD/official stats/reputable indices); confirm 2025–26 currency; ≥2 independent authoritative sources per claim; record `links`/`lastReviewed`; never write a score from memory; never fabricate sources/dates; run the Zod test gate, never bypass.
- Bangladeshi-applicant lens (nationality-specific) for every factor.
- Number/date formatting only via `src/lib/formatters.ts` (en-GB) — never hardcode separators.
- Quality gate before any task is "done": `npm run lint && npm run typecheck && npm run test && npm run build` all green. Report results honestly.
- Conventional Commits; **do not commit without explicit user approval** (auto mode never authorises git).

## File Structure

- Modify: `src/lib/schema.ts` — new `proConSchema`, `factorScoreSchema`, rebuilt `categoryScoreSchema` (factors/pros/cons, drop flat `score`/`reasoning`); extend `validateCountry` with per-cell factor-membership + all-factors-scored-when-scored rules. New inferred types `ProCon`, `FactorScore`, `CategoryScore` (reshaped).
- Modify: `src/types/index.ts` — re-export `ProCon`, `FactorScore`; reshape `ScoredCategory` to carry derived `score: number | null`; add `categoryScores` lookup to `ScoredCountry`; add `hasBlocker`.
- Modify: `src/lib/scoring.ts` — add `deriveCategoryScore(cell, category)`; rewrite `computeOverall`/`scoreCountry` to consume derived scores + `hasBlocker`.
- Create: `src/lib/config.ts` — policy constants (tier cutoffs, choropleth band, inclusion cutoff, top-N sizes).
- Create: `src/lib/selectors.ts` — reusable derived selectors (`topN`, `regionsOf`, `byRegion`, `categoryScore`).
- Modify: `src/lib/formatters.ts` — source tier cutoffs + choropleth band from `config.ts` (remove the literals).
- Modify consumers: `src/pages/Dashboard.tsx`, `src/pages/Compare.tsx`, `src/pages/Leaderboard.tsx`, `src/components/common/Podium.tsx`, `src/components/leaderboard/columns.tsx` — read derived category score + use config/selectors instead of inline magic numbers and raw `cell.score`.
- Modify: all 22 `src/data/countries/*.json` — convert to new cell shape (pending in Task 1; Australia scored in Task 4).
- Tests: `src/lib/schema.test.ts`, `src/lib/scoring.test.ts`, new `src/lib/selectors.test.ts`, `src/lib/config` covered via formatters/selectors tests; `src/lib/data.test.ts` stays green (loads real data).

---

## Task 1: Country-cell schema + convert all 22 countries to pending new-shape

Coordinated single commit: the new schema rejects old-shape cells and vice-versa, and `data.test.ts` loads real country JSON, so schema + data must change together to keep the full gate green.

**Files:**
- Modify: `src/lib/schema.ts`
- Modify: `src/types/index.ts`
- Modify: `src/lib/schema.test.ts`
- Modify: all `src/data/countries/*.json` (22 files)

**Interfaces:**
- Produces:
  - `proConSchema` → `ProCon = { text: string; severity?: "normal" | "blocker"; link?: ReferenceLink }`
  - `factorScoreSchema` → `FactorScore = { status: "scored" | "pending"; score: number /*int 0–100*/ }`
  - `categoryScoreSchema` → `CategoryScore = { status: "scored" | "pending"; factors: Record<string, FactorScore>; summary: string; pros: ProCon[]; cons: ProCon[]; links: ReferenceLink[]; lastReviewed: string }`
  - `validateCountry(country, categories)` now also returns errors for unknown factor ids per cell and for any `scored` cell missing/under-scoring its category's factors.
- Consumed by Task 2 (`scoring.ts`) and Task 3 (selectors/consumers).

- [ ] **Step 1: Write failing schema tests** in `src/lib/schema.test.ts`. Reuse the existing `cats` fixture (it already has factor ids `a1`/`other` for cat `a`, `b1`/`other` for cat `b`). Add a `country cell shape` describe block. Replace the existing `validateCountry` fixture country (old flat-`score` shape) with the new shape:

```ts
const cell = (factors: Record<string, { status: "scored" | "pending"; score: number }>, status: "scored" | "pending" = "scored") => ({
  status, factors, summary: "s", pros: [], cons: [], links: [], lastReviewed: "2026-06-18",
});

const country: Country = {
  id: "x", name: "X", iso: "XX", iso3: "XXX", flag: "", region: "R",
  summary: "", lastReviewed: "2026-06-18", links: [],
  categories: {
    a: cell({ a1: { status: "scored", score: 90 }, other: { status: "scored", score: 80 } }),
    b: cell({}, "pending"),
  },
};

describe("country cell shape", () => {
  it("passes a well-formed country (scored cell has all its factors, pending cell may be empty)", () => {
    expect(validateCountry(country, cats)).toEqual([]);
  });
  it("flags a factor id the cell uses but the category does not define", () => {
    const bad = { ...country, categories: { ...country.categories,
      a: cell({ a1: { status: "scored", score: 90 }, other: { status: "scored", score: 80 }, ghost: { status: "scored", score: 50 } }) } };
    expect(validateCountry(bad, cats)).toContainEqual(expect.stringContaining("ghost"));
  });
  it("flags a scored cell that is missing one of its category's factors", () => {
    const bad = { ...country, categories: { ...country.categories,
      a: cell({ a1: { status: "scored", score: 90 } }) } }; // missing 'other'
    expect(validateCountry(bad, cats).length).toBeGreaterThan(0);
  });
  it("flags a scored cell whose factor is itself pending", () => {
    const bad = { ...country, categories: { ...country.categories,
      a: cell({ a1: { status: "pending", score: 0 }, other: { status: "scored", score: 80 } }) } };
    expect(validateCountry(bad, cats).length).toBeGreaterThan(0);
  });
  it("rejects the old flat-score cell shape", () => {
    const bad = { ...country, categories: { ...country.categories, a: { status: "scored", score: 70 } } };
    expect(validateCountry(bad as unknown as Country, cats).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the new tests, verify they fail**

Run: `npm run test -- schema`
Expected: new cases FAIL (current `categoryScoreSchema` is flat `score`; no factor-membership rule yet).

- [ ] **Step 3: Implement the schema** in `src/lib/schema.ts`. Replace `categoryScoreSchema` and add the two helpers above it; keep `cellStatusSchema`:

```ts
export const proConSchema = z.object({
  text: z.string(),
  severity: z.enum(["normal", "blocker"]).optional(),
  link: referenceLinkSchema.optional(),
});

export const factorScoreSchema = z.object({
  status: cellStatusSchema,
  score: z.number().int().min(0).max(100),
});

export const categoryScoreSchema = z.object({
  status: cellStatusSchema,
  factors: z.record(z.string(), factorScoreSchema),
  summary: z.string(),
  pros: z.array(proConSchema),
  cons: z.array(proConSchema),
  links: z.array(referenceLinkSchema),
  lastReviewed: z.string(),
});
```

Add inferred types near the other `z.infer` exports (replace the old `CategoryScore`):

```ts
export type ProCon = z.infer<typeof proConSchema>;
export type FactorScore = z.infer<typeof factorScoreSchema>;
export type CategoryScore = z.infer<typeof categoryScoreSchema>;
```

Extend `validateCountry` — after the existing unknown-category check, add per-cell factor checks (needs the categories list, which is why it lives here, not as a self-contained refinement):

```ts
export function validateCountry(country: unknown, categories: Category[]): string[] {
  const result = countrySchema.safeParse(country);
  if (!result.success) {
    const id = (country as { id?: string })?.id ?? "country";
    return issues(result.error, `${id}: `);
  }
  const byId = new Map(categories.map((c) => [c.id, c]));
  const errors: string[] = [];
  for (const [catId, cell] of Object.entries(result.data.categories)) {
    const category = byId.get(catId);
    if (!category) {
      errors.push(`${result.data.id}: Unknown category "${catId}".`);
      continue;
    }
    const known = new Set(category.factors.map((f) => f.id));
    for (const fid of Object.keys(cell.factors)) {
      if (!known.has(fid)) errors.push(`${result.data.id}.${catId}: Unknown factor "${fid}".`);
    }
    if (cell.status === "scored") {
      for (const f of category.factors) {
        const fs = cell.factors[f.id];
        if (!fs || fs.status !== "scored") {
          errors.push(`${result.data.id}.${catId}: scored cell must score every factor ("${f.id}" missing or pending).`);
        }
      }
    }
  }
  return errors;
}
```

- [ ] **Step 4: Update the type re-exports** in `src/types/index.ts` — add `ProCon`, `FactorScore` to the `export type { ... } from "@/lib/schema"` block (`CategoryScore` already listed, now reshaped). Leave `ScoredCategory`/`ScoredCountry` for Task 2.

- [ ] **Step 5: Run schema tests, verify green**

Run: `npm run test -- schema`
Expected: all schema cases PASS. (`data.test.ts`/`scoring.test.ts` still red — real data is old-shape, scoring untouched — fixed in Steps 6–7.)

- [ ] **Step 6: Convert all 22 country JSON files to pending new-shape.** Mechanical transform per category cell (old research is discarded per the re-research decision; full history remains on `main`). For each `src/data/countries/*.json`, replace every category cell with:

```json
{
  "status": "pending",
  "factors": {},
  "summary": "",
  "pros": [],
  "cons": [],
  "links": [],
  "lastReviewed": "2026-06-18"
}
```

Keep each country's top-level `id/name/iso/iso3/flag/region/links` unchanged. Set each country's top-level `summary` to `""` and `lastReviewed` to `"2026-06-18"` (old summaries carry "flag" wording and discarded claims). Do this with a script run via the Bash tool (PowerShell/node) over the 22 files; do not hand-edit 22×14 cells. Validation in Step 7 is the gate.

- [ ] **Step 7: Run the full gate, verify green**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: all green. `data.test.ts` passes (every cell is valid pending new-shape). `scoring.test.ts` may still reference removed fields — if so it fails here; in that case STOP and complete Task 2 before claiming Task 1 done, or temporarily skip scoring-specific cases. (Cleanest: land Task 1 + Task 2 back-to-back; gate is green after Task 2.) App builds; leaderboard is empty (all pending) — accepted hard-cutover interim.

- [ ] **Step 8: Commit** (after user approval)

```bash
git commit -am "feat(data): factor-level country-cell schema; convert all countries to pending"
```

---

## Task 2: Strict factor→category→overall derivation in scoring.ts

**Files:**
- Modify: `src/lib/scoring.ts`
- Modify: `src/types/index.ts`
- Modify: `src/lib/scoring.test.ts`

**Interfaces:**
- Consumes: `CategoryScore` (factors map), `Category` (factor weights) from Task 1.
- Produces:
  - `deriveCategoryScore(cell: CategoryScore | null | undefined, category: Category): number | null` — strict weighted mean over the category's factors; `null` when any factor is unscored/missing or the cell is pending/absent.
  - `ScoredCategory = { category: Category; cell: CategoryScore | null; score: number | null; contribution: number }` (adds derived `score`).
  - `ScoredCountry` adds `categoryScores: Record<string, number | null>` and `hasBlocker: boolean`.

- [ ] **Step 1: Write failing scoring tests** in `src/lib/scoring.test.ts`. Update the fixtures to the new cell shape and add derivation cases:

```ts
import { describe, it, expect } from "vitest";
import { computeOverall, scoreCountry, rankCountries, deriveCategoryScore } from "./scoring";
import type { Category, Country } from "@/types";

const f = (id: string, weight: number) => ({ id, label: id, description: "", weight });
const cats: Category[] = [
  { id: "a", name: "A", shortLabel: "A", weight: 60, description: "", factors: [f("a1", 50), f("other", 50)] },
  { id: "b", name: "B", shortLabel: "B", weight: 40, description: "", factors: [f("b1", 60), f("other", 40)] },
];
const sc = (n: number) => ({ status: "scored" as const, score: n });
const cell = (factors: Record<string, { status: "scored" | "pending"; score: number }>, status: "scored" | "pending" = "scored") =>
  ({ status, factors, summary: "", pros: [], cons: [], links: [], lastReviewed: "2026-06-18" });

describe("deriveCategoryScore", () => {
  it("is the factor-weighted mean when all factors are scored", () => {
    // (80*50 + 60*50)/100 = 70
    expect(deriveCategoryScore(cell({ a1: sc(80), other: sc(60) }), cats[0])).toBe(70);
  });
  it("is null when a factor is missing", () => {
    expect(deriveCategoryScore(cell({ a1: sc(80) }), cats[0])).toBeNull();
  });
  it("is null when a factor is pending", () => {
    expect(deriveCategoryScore(cell({ a1: { status: "pending", score: 0 }, other: sc(60) }), cats[0])).toBeNull();
  });
  it("is null for a pending or absent cell", () => {
    expect(deriveCategoryScore(cell({}, "pending"), cats[0])).toBeNull();
    expect(deriveCategoryScore(null, cats[0])).toBeNull();
  });
});

describe("computeOverall (derived)", () => {
  const country: Country = {
    id: "x", name: "X", iso: "XX", iso3: "XXX", flag: "", region: "R", summary: "", lastReviewed: "2026-06-18", links: [],
    categories: { a: cell({ a1: sc(80), other: sc(60) }), b: cell({}, "pending") },
  };
  it("renormalises over derivable categories only (b pending → excluded)", () => {
    // only 'a' derivable at 70 → overall 70
    expect(computeOverall(country, cats)).toBe(70);
  });
  it("returns 0 when nothing is derivable", () => {
    const allPending = { ...country, categories: { a: cell({}, "pending"), b: cell({}, "pending") } };
    expect(computeOverall(allPending, cats)).toBe(0);
  });
});

describe("hasBlocker", () => {
  it("is true when any con carries severity blocker", () => {
    const country: Country = {
      id: "x", name: "X", iso: "XX", iso3: "XXX", flag: "", region: "R", summary: "", lastReviewed: "2026-06-18", links: [],
      categories: {
        a: { ...cell({ a1: sc(80), other: sc(60) }), cons: [{ text: "no dual citizenship", severity: "blocker" }] },
        b: cell({}, "pending"),
      },
    };
    expect(scoreCountry(country, cats).hasBlocker).toBe(true);
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npm run test -- scoring`
Expected: FAIL — `deriveCategoryScore` not exported; `computeOverall` still reads `cell.score`.

- [ ] **Step 3: Implement derivation** in `src/lib/scoring.ts`:

```ts
import type { Category, CategoryScore, Country, ScoredCategory, ScoredCountry } from "@/types";

/** Strict factor-weighted mean over a category's factors; null if the cell is pending/absent
 *  or any factor is missing/pending. Result is 0..100. */
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

/** Weighted sum of derived category scores, renormalised over derivable categories. 0..100. */
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
  const hasBlocker = present.some((s) =>
    (s.cell!.cons ?? []).some((c) => c.severity === "blocker"),
  );
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
```

- [ ] **Step 4: Reshape derived types** in `src/types/index.ts`:

```ts
export interface ScoredCategory {
  category: Category;
  cell: CategoryScore | null;     // null = category missing for this country
  score: number | null;          // derived; null = non-derivable (pending/incomplete)
  contribution: number;          // (score/100) * weight, 0 if non-derivable
}

export interface ScoredCountry extends Country {
  overall: number;
  rank: number;
  hasPending: boolean;
  isComplete: boolean;
  hasBlocker: boolean;                          // any con severity:"blocker"
  categoryScores: Record<string, number | null>; // derived per-category score lookup
  scored: ScoredCategory[];
}
```

- [ ] **Step 5: Run the full gate, verify green**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: all green. Consumers that read `cell.score` (Compare, columns) currently still typecheck only if untouched — if the removed field breaks them, fix in Task 3; if it breaks the build now, do Task 3's consumer edits before claiming green. (Land Task 2 + Task 3 back-to-back.)

- [ ] **Step 6: Commit** (after approval)

```bash
git commit -am "feat(scoring): derive category score from factor sub-scores (strict)"
```

---

## Task 3: Centralise policy constants + reusable selectors; decouple consumers

**Files:**
- Create: `src/lib/config.ts`
- Create: `src/lib/selectors.ts`, `src/lib/selectors.test.ts`
- Modify: `src/lib/formatters.ts`
- Modify: `src/pages/Dashboard.tsx`, `src/pages/Compare.tsx`, `src/pages/Leaderboard.tsx`, `src/components/common/Podium.tsx`, `src/components/leaderboard/columns.tsx`

**Interfaces:**
- Produces:
  - `config`: `TIER = { excellent: 80, good: 65, fair: 45 }`, `CHOROPLETH = { min: 60, max: 80 }`, `INCLUSION_MIN = 60`, `TOP_N = { podium: 3, dashboard: 5, compare: 2 }`.
  - `selectors`: `topN<T>(xs, n)`, `regionsOf(countries)`, `byRegion(countries, region)`, `categoryScore(country, categoryId): number | null`.

- [ ] **Step 1: Write failing selector tests** in `src/lib/selectors.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { topN, regionsOf, byRegion, categoryScore } from "./selectors";
import type { ScoredCountry } from "@/types";

const mk = (iso: string, region: string, scores: Record<string, number | null>) =>
  ({ iso, region, categoryScores: scores } as unknown as ScoredCountry);

const cs = [mk("AU", "Oceania", { "job-market": 70 }), mk("CA", "Americas", { "job-market": null }), mk("NZ", "Oceania", {})];

describe("selectors", () => {
  it("topN slices the first n", () => { expect(topN(cs, 2).map((c) => c.iso)).toEqual(["AU", "CA"]); });
  it("regionsOf returns unique sorted regions", () => { expect(regionsOf(cs)).toEqual(["Americas", "Oceania"]); });
  it("byRegion filters; 'all' passes through", () => {
    expect(byRegion(cs, "Oceania").map((c) => c.iso)).toEqual(["AU", "NZ"]);
    expect(byRegion(cs, "all")).toHaveLength(3);
  });
  it("categoryScore reads the derived lookup (null when non-derivable/absent)", () => {
    expect(categoryScore(cs[0], "job-market")).toBe(70);
    expect(categoryScore(cs[1], "job-market")).toBeNull();
    expect(categoryScore(cs[2], "job-market")).toBeNull();
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npm run test -- selectors`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** `src/lib/config.ts`:

```ts
// Single source of truth for scoring/layout policy constants (no magic numbers in components).
export const TIER = { excellent: 80, good: 65, fair: 45 } as const;
export const CHOROPLETH = { min: 60, max: 80 } as const;
export const INCLUSION_MIN = 60;
export const TOP_N = { podium: 3, dashboard: 5, compare: 2 } as const;
```

`src/lib/selectors.ts`:

```ts
import type { ScoredCountry } from "@/types";

export const topN = <T>(xs: readonly T[], n: number): T[] => xs.slice(0, n);

export const regionsOf = (countries: readonly ScoredCountry[]): string[] =>
  [...new Set(countries.map((c) => c.region))].sort((a, b) => a.localeCompare(b));

export const byRegion = (countries: readonly ScoredCountry[], region: string): ScoredCountry[] =>
  region === "all" ? [...countries] : countries.filter((c) => c.region === region);

export const categoryScore = (country: ScoredCountry, categoryId: string): number | null =>
  country.categoryScores[categoryId] ?? null;
```

- [ ] **Step 4: Source the constants in `formatters.ts`** — replace the literal tier cutoffs (`>= 80/65/45`) with `TIER.excellent/good/fair` and the choropleth `FILL_MIN`/`FILL_MAX` with `CHOROPLETH.min`/`CHOROPLETH.max` (import from `@/lib/config`). Keep behaviour identical; `formatters.test.ts` must stay green.

- [ ] **Step 5: Decouple consumers** (replace inline magic + raw cell-score reads):
  - `src/pages/Dashboard.tsx:40` → `topN(countries, TOP_N.dashboard)`.
  - `src/components/common/Podium.tsx:9` → `topN(countries, TOP_N.podium)` (keep the `[1,0,2]` visual order — presentation, not policy).
  - `src/pages/Compare.tsx:15` → `topN(countries, TOP_N.compare).map((c) => c.iso)`; line 64–65 `chosen.map((c) => categoryScore(c, cat.id))` instead of `c.categories[cat.id]?.score` (which no longer exists).
  - `src/pages/Leaderboard.tsx:15-19` → `regionsOf(countries)` and `byRegion(filtered, region)`.
  - `src/components/leaderboard/columns.tsx:39` → `categoryScore(row, cat.id)` (via the row's `ScoredCountry`) instead of `c.categories[cat.id]?.score`.

- [ ] **Step 6: Run the full gate, verify green**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: all green; UI compiles; no remaining reads of the removed flat `cell.score`.

- [ ] **Step 7: Commit** (after approval)

```bash
git commit -am "refactor: centralise policy constants + reusable derived selectors; decouple consumers"
```

---

## Task 4: Pilot — re-research Australia factor-by-factor, flip to scored, validate (CHECKPOINT)

This is the spend-heavy pilot. **Stop for user sign-off at the end before batching the other 21.**

**Files:**
- Modify: `src/data/countries/australia.json`
- Create: `docs/research/2026-06-18-australia-factor-rescore.md` (research brief: per-factor source + score rationale)

**Process (per the data-change protocol):**

- [ ] **Step 1: Research** every factor of all 14 categories for Australia through the Bangladeshi-applicant lens. Use the `deep-research` skill; gov-first sources (Home Affairs, Study Australia, ATO, ABS, WJP, OECD), ≥2 independent authoritative sources per claim, confirm 2025–26 currency. For each factor, map findings to 0–100 using that factor's `description` rubric in `categories.json`. Record everything in the research brief.
- [ ] **Step 2: Author** `australia.json` cells in the new shape: for each category, a `factors` map scoring every factor id of that category (`status:"scored"`, integer 0–100), a one-line `summary` (no "flag" wording), `pros[]`/`cons[]` (a real blocker → `severity:"blocker"`, e.g. the Bangladesh Evidence-Level-3 / dual-citizenship realities expressed as cons with links), `links[]`, `lastReviewed:"2026-06-18"`. Set the country `summary` + `lastReviewed`. Set `status:"scored"` on each cell only when all its factors are scored.
- [ ] **Step 3: Validate** — `npm run test` (Zod gate: factor membership, all-factors-scored, weights). Then compute the derived overall (a throwaway node script or a temporary test) and **sanity-check**: does each derived category score and the derived overall read sensibly versus the old hand-set values (job-market was 62, citizenship 80, overall mid-50s/60)? Large unexplained drift = a rubric or sub-score to revisit, not to paper over.
- [ ] **Step 4: Full gate** — `npm run lint && npm run typecheck && npm run test && npm run build` green. Australia now shows scored; the other 21 remain pending.
- [ ] **Step 5: CHECKPOINT** — report to the user: per-category derived scores, derived overall, any blocker badge, notable drift vs old, and the source quality. Get explicit sign-off on the model + rubric before Phase 2c. **Do not commit or proceed to the other countries without approval.**

---

## Phase 2c (separate turns, after sign-off)

Batch the remaining 21 countries (same per-factor protocol, flip pending→scored), a few per turn to stay within spend limits; re-apply the `<60` inclusion drop on the new derived overall; surface any country that now falls below 60 or gains a blocker. Each batch ends with the full green gate and a commit (after approval). **Out of scope here.**

## Phase 3 (deferred — separate plan)

UI rendering of factor breakdown (sub-bars/table), `pros`/`cons` lists, blocker badge from `hasBlocker`, rubric tooltips; remaining de-hardcoding (choropleth pixel/zoom constants, About pathway icons from `profile.pathway.length`).

---

## Self-review

- **Spec coverage:** §3.2 cell shape → Task 1. §3.3 derivation (category-from-factors, strict pending, overall renorm, hasBlocker) → Task 2. §5 Phase-2 validation (factor membership) → Task 1 Step 3. "decouple/reusable/strip repetition/no hardcoded-derivable" (user ask) → Task 3. §8 Phase-2 research + cutover → Tasks 1 (cutover) + 4/2c (research). Decisions: pilot-first → Task 4 checkpoint; re-research-from-scratch → Task 1 discards old cells + Task 4 fresh research; hard-cutover-on-branch → Task 1 single coordinated commit, no legacy path in Task 2. Phase 3 UI/de-hardcode-rest explicitly deferred.
- **Placeholder scan:** schema, derivation, selector, config code is concrete; the only "fill-in" is Task 4 research output, which is gated by the data-change protocol (sources required, not invented).
- **Type consistency:** `CategoryScore`{status,factors,summary,pros,cons,links,lastReviewed}, `FactorScore`{status,score}, `ProCon`{text,severity?,link?}, `deriveCategoryScore(cell,category)→number|null`, `ScoredCategory`{category,cell,score,contribution}, `ScoredCountry` adds {hasBlocker,categoryScores}; `categoryScore` selector reads `categoryScores`. Names match across schema/types/scoring/selectors/consumers.
- **Branch:** all of Phase 2 lands on a branch off `main` (hard cutover); merge only when enough countries are researched to be presentable (or keep the pilot on the branch for review). Branch creation precedes Task 1.
```