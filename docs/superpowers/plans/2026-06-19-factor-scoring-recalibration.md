# Factor-Scoring Recalibration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De-compress the country leaderboard (restore spread + a usable ≥80 tier), add a first-class "Direct Work-Visa Route" category + a positive flag, lower the inclusion cutoff, and add a generated, drift-tested score cache — without fabricating any score.

**Architecture:** Phase 1 is deterministic code + data-structure migration (no research): schema, a categories/country migration via two one-off node scripts, a display-only recalibration curve in `scoring.ts`, a `hasHighlight` flag mirroring `hasBlocker`, a constant + doc change, and a generated `scoreboard.json` cache with a drift test. Phase 2 is the research-driven fill (dual re-score, decisive-mover lifts, scoring all 20 countries on the new category) following the data-change protocol; it is paced to spend and is NOT codeable as TDD steps.

**Tech Stack:** React 19, TypeScript (strict), Vite 8, Zod 4, Vitest, Recharts, Leaflet. Package manager: npm. New devDependency: `tsx` (TS script runner for the cache build).

## Global Constraints

- **Source of truth = factors.** Never store a derived `overall`/category score in a source country JSON. The only sanctioned derived artifact is the generated `src/data/cache/scoreboard.json`.
- **Zod gate is sacred.** Category weights sum 100 (±0.001); each category's factor weights sum 100; scores integer 0–100; a `scored` cell scores every factor of its category. `npm test` enforces it via `data.test.ts`. Never bypass.
- **No commit/push without explicit user approval** (CLAUDE.md overrides the TDD "commit" steps below — stage and propose; await go-ahead). No country file deleted without approval (surface, don't delete).
- **Phase 2 numbers need citations.** Gov-first, ≥2 independent sources per decisive claim; record `evidence`/`links`/`lastReviewed`. No edits from memory.
- **Quality gate before "done":** `npm run lint && npm run typecheck && npm run test && npm run build` — report honestly.
- **Recalibration constants:** `P = 55`, `k = 1.6` (in `config.ts` as `RECALIBRATE`). `recalibrate(x) = clamp(P + (x − P)·k, 0, 100)`.
- **New category weights (15, sum 100):** job-market 10, visa-access 9, citizenship 9, post-study-work 8, spouse-family 8, msc-study 7, pr-pathway 7, income-cost 6, healthcare 5, culture-language 6, safety-law 5, politics 4, tax 3, muslim-diaspora 3, **direct-work-route 10**.

## File Structure

**Phase 1 (this plan, executable now)**
- `src/lib/schema.ts` — drop the "must contain `other`" refinement; add `"highlight"` to the `severity` enum. (Task 1)
- `src/lib/schema.test.ts` — delete the now-invalid "no `other`" test. (Task 1)
- `src/data/categories.json` — 15 categories, rebalanced weights, job-market sponsorship moved out, new `direct-work-route`, every `other` removed + factor weights renormalised. (Task 2)
- `src/data/countries/*.json` ×20 — strip `other` + job-market `sponsorship-work-authorisation`; add a `pending` `direct-work-route` cell. (Task 2, via script)
- `scripts/normalize-factor-weights.mjs` — one-off: remove `other`, Hamilton-renormalise each category's factor weights to integers summing 100. (Task 2)
- `scripts/migrate-country-cells.mjs` — one-off: migrate the 20 country files. (Task 2)
- `src/lib/config.ts` — add `RECALIBRATE`; `INCLUSION_MIN` 60→50. (Tasks 3, 5)
- `src/lib/scoring.ts` — add `recalibrate()`; apply to display overall/category scores; add `hasHighlight`. (Tasks 3, 4)
- `src/lib/scoring.test.ts` — update one assertion; add recalibrate + hasHighlight tests. (Tasks 3, 4)
- `src/types/index.ts` — add `hasHighlight` to `ScoredCountry`. (Task 4)
- `src/pages/CountryDetail.tsx` — render a positive badge on `severity:"highlight"` pros. (Task 4)
- `CLAUDE.md` — category list/weights, cutoff, cache carve-out, cache-before-commit rule. (Task 5)
- `src/lib/scoreboard.ts` — pure `buildScoreboard(countries, categories)` projection (relative imports for dual runtime). (Task 6)
- `scripts/build-score-cache.ts` — fs-load + `buildScoreboard` + write `scoreboard.json`. (Task 6)
- `src/data/cache/scoreboard.json` — generated artifact. (Task 6)
- `src/data/cache/scoreboard.test.ts` — drift test. (Task 6)
- `package.json` — `tsx` devDep + `cache:scores` script. (Task 6)
- `src/hooks/useScoreboard.ts` + `src/pages/Dashboard.tsx` — lightweight cache reads. (Task 7)

**Phase 2 (research-fill, separate execution, paced to spend)** — see the Phase 2 section at the end.

---

## Task 1: Schema — drop mandatory `other`, add `highlight` severity

**Files:**
- Modify: `src/lib/schema.ts` (lines 26-28 comment, 45-47 refinement, 51-56 proConSchema)
- Modify: `src/lib/schema.test.ts` (delete lines 40-43)

**Interfaces:**
- Produces: `proConSchema.severity ∈ {"normal","blocker","highlight"}`; categories no longer required to contain an `other` factor.

- [ ] **Step 1: Update the failing test expectation first — delete the obsolete rule test**

In `src/lib/schema.test.ts`, delete this block (lines 40-43):

```typescript
  it("flags a category with no 'other' factor", () => {
    const bad = [{ ...cats[0], factors: [f("a1", 50), f("a2", 50)] }, cats[1]];
    expect(validateCategories(bad).length).toBeGreaterThan(0);
  });
```

Also update the header comment (line 2-3) — remove `a mandatory "other" factor,` from the sentence.

- [ ] **Step 2: Run tests to confirm the suite still references the rule (RED)**

Run: `npm test -- src/lib/schema.test.ts`
Expected: PASS for the remaining tests (the deleted test is gone). If any test still asserts the `other` rule, it fails — fix by removing that assertion.

- [ ] **Step 3: Edit `src/lib/schema.ts` — remove the refinement and widen the enum**

Remove the third `.refine` on `categorySchema` (lines 45-47):

```typescript
  .refine((c) => c.factors.some((f) => f.id === "other"), {
    message: "Category must contain an 'other' factor.",
  });
```

So `categorySchema` ends after the duplicate-id refine. Update the comment at lines 26-28 to drop `and every category has an "other" catch-all factor`.

Widen the severity enum (line 54):

```typescript
export const proConSchema = z.object({
  text: z.string(),
  severity: z.enum(["normal", "blocker", "highlight"]).optional(),
  link: referenceLinkSchema.optional(),
});
```

Update the line 51 comment to: `// A pro or con bullet; severity:"blocker" marks a con as a blocker, severity:"highlight" marks a pro as a positive flag.`

- [ ] **Step 4: Run tests to confirm GREEN**

Run: `npm test -- src/lib/schema.test.ts`
Expected: PASS. (Existing data still validates: real categories.json still has `other` factors — allowed, just no longer required.)

- [ ] **Step 5: Commit** (propose; await approval per Global Constraints)

```bash
git add src/lib/schema.ts src/lib/schema.test.ts
git commit -m "refactor(schema): drop mandatory 'other' factor; add highlight severity"
```

---

## Task 2: Migrate categories + country data (structure)

**Files:**
- Modify: `src/data/categories.json`
- Create: `scripts/normalize-factor-weights.mjs`
- Create: `scripts/migrate-country-cells.mjs`
- Modify: `src/data/countries/*.json` (×20, via script)

**Interfaces:**
- Produces: 15 categories (sum 100); job-market without `sponsorship-work-authorisation`/`other`; a `direct-work-route` category with 6 factors; every country has a `pending` `direct-work-route` cell and no `other`/job-market-sponsorship factor keys.

- [ ] **Step 1: Hand-edit `src/data/categories.json` — category weights**

Set each category's `weight` to the value in Global Constraints (job-market 10, visa-access 9, citizenship 9, post-study-work 8, spouse-family 8, msc-study 7, pr-pathway 7, income-cost 6, healthcare 5, culture-language 6, safety-law 5, politics 4, tax 3, muslim-diaspora 3). Do NOT touch factor weights yet.

- [ ] **Step 2: Hand-edit `src/data/categories.json` — remove the job-market sponsorship factor**

Delete the entire `sponsorship-work-authorisation` factor object from `job-market.factors` (the one with `"weight": 20`). Leave the other job-market factors as-is for now (the normalise script fixes their weights).

- [ ] **Step 3: Hand-edit `src/data/categories.json` — append the new category**

Add this object as the LAST element of the categories array:

```json
{
  "id": "direct-work-route",
  "name": "Direct Work-Visa Route (Bangladesh)",
  "shortLabel": "Direct Work",
  "weight": 10,
  "description": "Bangladeshi lens: can a Dhaka-based engineer be hired directly from overseas on a skilled-work visa and migrate that way — the alternative to the study-first route. Owns the entry-route / employer-sponsorship signal (moved out of job-market).",
  "factors": [
    {
      "id": "work-visa-accessibility-bd",
      "label": "Skilled-work visa accessibility (BD national)",
      "description": "Legal/regulatory accessibility of the main skilled-work visa (EU Blue Card, UK Skilled Worker, Canada Express Entry/PGWP-to-work, Australia skilled streams, Ireland Critical Skills) for a Bangladeshi software/AI engineer: eligibility, salary floor, occupation/shortage-list status, quotas. Owns the regulatory route only (employer behaviour lives in employer-sponsorship-willingness). Anchors: ~90 = open, low salary floor, IT on shortage list, no quota; ~50 = available with salary/quota friction; ~20 = high floors, quota-locked, or no realistic direct route.",
      "weight": 24
    },
    {
      "id": "overseas-direct-hire",
      "label": "Overseas direct-hire feasibility",
      "description": "Can a firm hire and relocate a candidate directly from Bangladesh with no in-country presence / local-job-offer precondition (global-talent, employer-led, intra-company routes; recognition of remote-built experience). Anchors: ~90 = routine overseas hiring + relocation from Dhaka; ~50 = possible but employer must take extra steps; ~20 = effectively requires in-country presence first.",
      "weight": 22
    },
    {
      "id": "bd-direct-work-track-record",
      "label": "BD direct-work migration track record",
      "description": "Established flow of Bangladeshis who actually migrated via a direct skilled-work visa (proof the route works for this nationality). Proxies allowed (BMET outbound stats, OECD migration database, destination work-permit-by-nationality where published); mark confidence in reasoning. Anchors: ~90 = large, established BD skilled-work inflow; ~50 = modest/emerging; ~20 = negligible.",
      "weight": 16
    },
    {
      "id": "employer-sponsorship-willingness",
      "label": "Employer sponsorship willingness & friction",
      "description": "Employer behaviour (distinct from regulatory accessibility above): prevalence of sponsor licences, labour-market-test / LMIA burden, sponsorship cost and willingness to sponsor non-resident hires. Anchors: ~90 = employers routinely sponsor, low friction; ~50 = sponsorship with cost/test friction; ~20 = few sponsors, heavy test, high cost.",
      "weight": 16
    },
    {
      "id": "route-onward-pr-citizenship",
      "label": "Route continuity to PR & citizenship",
      "description": "Whether THIS work visa is a recognised on-ramp onward to settlement (counts toward PR, leads to citizenship) versus a dead-end temporary permit. ROUTE LINKAGE ONLY — the difficulty/timeline of PR lives in pr-pathway and of citizenship in citizenship; do not re-score those here. Anchors: ~90 = work visa is a clear settlement track; ~50 = onward route exists with switches/conditions; ~20 = temporary/dead-end, no settlement linkage.",
      "weight": 14
    },
    {
      "id": "current-openness",
      "label": "Current openness / policy direction (2025-26)",
      "description": "Is the direct skilled-work route currently open/expanding versus restricting/quota-capped right now (2025-26). Anchors: ~90 = open/expanding, actively recruiting skilled non-EU; ~50 = stable/neutral; ~20 = tightening, new caps/fees, route shrinking.",
      "weight": 8
    }
  ]
}
```

- [ ] **Step 4: Create `scripts/normalize-factor-weights.mjs`**

```javascript
// scripts/normalize-factor-weights.mjs
// One-off: in src/data/categories.json, remove any `other` factor from every category
// and renormalise the remaining factor weights to INTEGER values summing exactly 100
// (largest-remainder / Hamilton rounding, deterministic by factor order).
// Run: node scripts/normalize-factor-weights.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const path = join(here, "..", "src", "data", "categories.json");
const cats = JSON.parse(readFileSync(path, "utf8"));

function hamilton(weights) {
  const total = weights.reduce((a, w) => a + w, 0);
  const scaled = weights.map((w) => (w / total) * 100);
  const floors = scaled.map((s) => Math.floor(s));
  let remainder = 100 - floors.reduce((a, f) => a + f, 0);
  const order = scaled
    .map((s, i) => ({ i, frac: s - Math.floor(s) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  const result = [...floors];
  for (let k = 0; k < remainder; k++) result[order[k].i] += 1;
  return result;
}

for (const cat of cats) {
  cat.factors = cat.factors.filter((f) => f.id !== "other");
  const newWeights = hamilton(cat.factors.map((f) => f.weight));
  cat.factors.forEach((f, i) => (f.weight = newWeights[i]));
}

writeFileSync(path, JSON.stringify(cats, null, 2) + "\n");
console.log("Normalised", cats.length, "categories; factor weights sum:",
  cats.map((c) => c.factors.reduce((a, f) => a + f.weight, 0)).join(","));
```

- [ ] **Step 5: Run the normalise script**

Run: `node scripts/normalize-factor-weights.mjs`
Expected: prints `Normalised 15 categories; factor weights sum: 100,100,...` (fifteen 100s). job-market becomes `sw-demand-depth 31, salary-levels 22, ai-ml-specialisation 19, foreign-grad-bd-hireability 17, dual-earner-depth 11`.

- [ ] **Step 6: Create `scripts/migrate-country-cells.mjs`**

```javascript
// scripts/migrate-country-cells.mjs
// One-off: for every src/data/countries/*.json — delete `other` from every cell's factors,
// delete `sponsorship-work-authorisation` from the job-market cell, and add a pending
// `direct-work-route` cell. Run: node scripts/migrate-country-cells.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "src", "data", "countries");
const REVIEWED = "2026-06-19";
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const path = join(dir, file);
  const country = JSON.parse(readFileSync(path, "utf8"));
  for (const [catId, cell] of Object.entries(country.categories)) {
    if (cell.factors && "other" in cell.factors) delete cell.factors.other;
    if (catId === "job-market" && cell.factors && "sponsorship-work-authorisation" in cell.factors) {
      delete cell.factors["sponsorship-work-authorisation"];
    }
  }
  country.categories["direct-work-route"] = {
    status: "pending", factors: {}, summary: "", pros: [], cons: [], links: [], lastReviewed: REVIEWED,
  };
  writeFileSync(path, JSON.stringify(country, null, 2) + "\n");
}
console.log("Migrated", files.length, "country files");
```

- [ ] **Step 7: Run the country migration script**

Run: `node scripts/migrate-country-cells.mjs`
Expected: `Migrated 20 country files`.

- [ ] **Step 8: Run the data gate**

Run: `npm test -- src/lib/data.test.ts src/lib/schema.test.ts`
Expected: PASS (categories valid: 15 weights sum 100, each category's factor weights sum 100; every country valid: no unknown factor keys, scored cells complete, pending `direct-work-route` accepted).
If it fails, read the error — most likely a category whose factor weights don't sum 100 (re-run Step 5) or a stray `other` key (re-run Step 7).

- [ ] **Step 9: Commit** (propose; await approval)

```bash
git add src/data/categories.json src/data/countries/ scripts/normalize-factor-weights.mjs scripts/migrate-country-cells.mjs
git commit -m "data: 15-category factor model — drop 'other', add direct-work-route (pending), move sponsorship"
```

---

## Task 3: Recalibration curve (`recalibrate`)

**Files:**
- Modify: `src/lib/config.ts` (add `RECALIBRATE`)
- Modify: `src/lib/scoring.ts` (add `recalibrate`; apply in `scoreCountry`)
- Modify: `src/lib/scoring.test.ts` (add recalibrate tests; update one assertion)

**Interfaces:**
- Produces: `recalibrate(raw: number): number` (exported from `scoring.ts`); `scoreCountry().overall` and `.categoryScores`/`.scored[].score` are now recalibrated (display) values; `.scored[].contribution` stays raw-weighted.
- Consumes: `RECALIBRATE = { pivot: 55, gain: 1.6 }` from `config.ts`.

- [ ] **Step 1: Add the constant to `src/lib/config.ts`**

```typescript
/** Display recalibration curve: contrast-stretch derived scores around a fixed pivot so
 *  the aggregate scale uses the full tier range. display = clamp(pivot + (raw-pivot)*gain). */
export const RECALIBRATE = { pivot: 55, gain: 1.6 } as const;
```

- [ ] **Step 2: Write the failing test in `src/lib/scoring.test.ts`**

Add `recalibrate` to the import on line 3, and append this describe block:

```typescript
import { computeOverall, scoreCountry, rankCountries, deriveCategoryScore, recalibrate } from "@/lib/scoring";

describe("recalibrate", () => {
  it("is the identity at the pivot", () => {
    expect(recalibrate(55)).toBe(55);
  });
  it("stretches above and below the pivot", () => {
    expect(recalibrate(65)).toBeCloseTo(71); // 55 + 10*1.6
    expect(recalibrate(45)).toBeCloseTo(39); // 55 - 10*1.6
  });
  it("clamps to [0,100]", () => {
    expect(recalibrate(95)).toBe(100); // 55 + 40*1.6 = 119 -> 100
    expect(recalibrate(5)).toBe(0);    // 55 - 50*1.6 = -25 -> 0
  });
  it("is monotonic", () => {
    expect(recalibrate(60)).toBeLessThan(recalibrate(61));
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/lib/scoring.test.ts`
Expected: FAIL — `recalibrate is not exported` / not a function.

- [ ] **Step 4: Implement `recalibrate` and apply it in `scoring.ts`**

Add the import and the function near the top of `src/lib/scoring.ts`. Use a RELATIVE import for the runtime `config` value — `scoring.ts` is loaded by the `tsx` cache-build script (Task 6) via `scoreboard.ts`, and `tsx` does not resolve the `@/` alias for runtime imports (the existing `import type { … } from "@/types"` is fine because type-only imports are erased):

```typescript
import { RECALIBRATE } from "./config";

/** Display-only contrast stretch around a fixed pivot (see config.RECALIBRATE). Monotonic,
 *  clamped to 0..100. Applied to the values the UI shows/ranks; the raw factor→category→overall
 *  means in deriveCategoryScore/computeOverall are left untouched. */
export function recalibrate(raw: number): number {
  const { pivot, gain } = RECALIBRATE;
  return Math.max(0, Math.min(100, pivot + (raw - pivot) * gain));
}
```

Rewrite `scoreCountry` so display values are recalibrated (keep `contribution` raw):

```typescript
export function scoreCountry(country: Country, categories: Category[]): ScoredCountry {
  const scored: ScoredCategory[] = categories.map((category) => {
    const cell = country.categories[category.id] ?? null;
    const raw = deriveCategoryScore(cell, category);
    const contribution = raw === null ? 0 : (raw / 100) * category.weight; // raw weighted contribution
    const score = raw === null ? null : recalibrate(raw);                  // display (curved)
    return { category, cell, score, contribution };
  });
  const present = scored.filter((s) => s.cell !== null);
  const hasPending = scored.some((s) => s.score === null);
  const isComplete = present.length === categories.length && !hasPending;
  const categoryScores = Object.fromEntries(scored.map((s) => [s.category.id, s.score]));
  const hasBlocker = present.some((s) => (s.cell!.cons ?? []).some((c) => c.severity === "blocker"));
  return {
    ...country,
    overall: recalibrate(computeOverall(country, categories)),
    rank: 0,
    hasPending,
    isComplete,
    hasBlocker,
    categoryScores,
    scored,
  };
}
```

- [ ] **Step 5: Update the affected existing assertion**

In `src/lib/scoring.test.ts`, the `scoreCountry` test asserts `categoryScores.a`. Category `a` derives raw 80; it is now recalibrated. Change line 79 from `expect(scored.categoryScores.a).toBe(80);` to:

```typescript
    expect(scored.categoryScores.a).toBe(recalibrate(80));
```

(The `rankCountries` and `computeOverall`/`deriveCategoryScore` tests are unaffected — ranking is order-preserving and those call the raw functions directly.)

- [ ] **Step 6: Run the test to verify GREEN**

Run: `npm test -- src/lib/scoring.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit** (propose; await approval)

```bash
git add src/lib/config.ts src/lib/scoring.ts src/lib/scoring.test.ts
git commit -m "feat(scoring): display recalibration curve (contrast-stretch around pivot)"
```

---

## Task 4: Positive flag — `hasHighlight`

**Files:**
- Modify: `src/lib/scoring.ts` (derive `hasHighlight`)
- Modify: `src/types/index.ts` (add `hasHighlight`)
- Modify: `src/lib/scoring.test.ts` (add test)
- Modify: `src/pages/CountryDetail.tsx` (render badge on highlight pros)

**Interfaces:**
- Consumes: `ProCon.severity === "highlight"` (from Task 1).
- Produces: `ScoredCountry.hasHighlight: boolean`.

- [ ] **Step 1: Write the failing test in `src/lib/scoring.test.ts`**

Append to the `scoreCountry` describe block:

```typescript
  it("derives hasHighlight from any pro tagged severity:highlight", () => {
    const c = country("x", 80, 50);
    c.categories.a = { ...c.categories.a, pros: [{ text: "open direct work visa", severity: "highlight" }] };
    expect(scoreCountry(c, cats).hasHighlight).toBe(true);
    expect(scoreCountry(country("y", 80, 50), cats).hasHighlight).toBe(false);
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/scoring.test.ts`
Expected: FAIL — `hasHighlight` is undefined / type error.

- [ ] **Step 3: Add `hasHighlight` to `src/types/index.ts`**

In the `ScoredCountry` interface, after the `hasBlocker` line:

```typescript
  hasBlocker: boolean; // any con tagged severity:"blocker"
  hasHighlight: boolean; // any pro tagged severity:"highlight"
```

- [ ] **Step 4: Derive `hasHighlight` in `scoring.ts`**

In `scoreCountry`, after the `hasBlocker` line, add:

```typescript
  const hasHighlight = present.some((s) => (s.cell!.pros ?? []).some((p) => p.severity === "highlight"));
```

And add `hasHighlight,` to the returned object (next to `hasBlocker,`).

- [ ] **Step 5: Run the test to verify GREEN**

Run: `npm test -- src/lib/scoring.test.ts`
Expected: PASS.

- [ ] **Step 6: Render the positive badge in `src/pages/CountryDetail.tsx`**

The pros list currently renders plain bullets (around lines 72-76). Replace the pros `<li>` to mirror the blocker label used for cons:

```tsx
                    {cell.pros.length > 0 && (
                      <ul className="list-inside list-disc text-emerald-700 dark:text-emerald-300">
                        {cell.pros.map((p) => (
                          <li key={p.text}>
                            {p.text}
                            {p.severity === "highlight" && (
                              <span className="ml-1 font-semibold text-emerald-600 dark:text-emerald-400">(direct-work route)</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
```

- [ ] **Step 7: Verify typecheck + full test**

Run: `npm run typecheck && npm test`
Expected: PASS (no consumer constructs `ScoredCountry` literally except via `scoreCountry`, so adding the field is safe).

- [ ] **Step 8: Commit** (propose; await approval)

```bash
git add src/lib/scoring.ts src/types/index.ts src/lib/scoring.test.ts src/pages/CountryDetail.tsx
git commit -m "feat(scoring): hasHighlight positive flag + CountryDetail badge"
```

---

## Task 5: Lower cutoff + CLAUDE.md updates

**Files:**
- Modify: `src/lib/config.ts` (`INCLUSION_MIN`)
- Modify: `CLAUDE.md`

**Interfaces:** none (constant is documentation-only; grep confirms `INCLUSION_MIN` has no code consumers).

- [ ] **Step 1: Lower the cutoff in `src/lib/config.ts`**

```typescript
/** Curation policy: countries scoring below this overall are dropped (surfaced, not auto-deleted). */
export const INCLUSION_MIN = 50;
```

- [ ] **Step 2: Update `CLAUDE.md`**

Make these exact edits:
- "scored 0–100 across 14 weighted categories" → "15 weighted categories".
- The Categories line: replace with the 15-weight set (job-market 12→10, visa-access 10→9, citizenship 10→9, post-study-work 9→8, spouse-family 9→8, msc-study 8→7, pr-pathway 8→7, income-cost 7→6, healthcare 6→5, culture-language 6, safety-law 5, politics 4, tax 3, muslim-diaspora 3) and add `direct-work-route` 10 (BD direct skilled-work entry route). Drop the "(includes an 'other' catch-all = 91 factors total)" note.
- "Inclusion: drop countries scoring <60% overall" → "<50% overall".
- Data model "Overall is computed at runtime, never stored ... Do not add a precomputed `overall` field." → append: "The sole sanctioned derived artifact is the generated, drift-tested `src/data/cache/scoreboard.json` (never hand-edited)."
- Add to the data-change protocol / quality gate: "Run `npm run cache:scores` to regenerate `src/data/cache/scoreboard.json` before every commit; the drift test fails the gate if it is stale."
- Remove the "every category has an 'other' catch-all" wording where it appears.

- [ ] **Step 3: Verify nothing references the old value**

Run: `npm run lint && npm run typecheck && npm test`
Expected: PASS.

- [ ] **Step 4: Commit** (propose; await approval)

```bash
git add src/lib/config.ts CLAUDE.md
git commit -m "docs: lower inclusion cutoff to 50; 15-category model + cache policy in CLAUDE.md"
```

---

## Task 6: Generated score cache + drift test

**Files:**
- Create: `src/lib/scoreboard.ts`
- Create: `scripts/build-score-cache.ts`
- Create: `src/data/cache/scoreboard.json` (generated)
- Create: `src/data/cache/scoreboard.test.ts`
- Modify: `package.json` (add `tsx` devDep + `cache:scores` script)

**Interfaces:**
- Produces: `buildScoreboard(countries: Country[], categories: Category[]): Scoreboard`; the `Scoreboard`/`ScoreboardEntry` types; `npm run cache:scores`; the committed `scoreboard.json`.

- [ ] **Step 1: Create the pure projection `src/lib/scoreboard.ts`**

Uses RELATIVE imports so the same module runs under both Vite (app/tests) and `tsx` (the build script) without alias resolution.

```typescript
// src/lib/scoreboard.ts
// Pure projection of the ranked countries into the cached scoreboard shape. Relative imports
// (not @/) so this module loads identically under Vite and under tsx (the build script).
import type { Category, Country } from "./schema";
import { rankCountries, computeOverall } from "./scoring";
import { RECALIBRATE } from "./config";

const round2 = (n: number): number => Math.round(n * 100) / 100;

export interface ScoreboardEntry {
  id: string;
  name: string;
  iso: string;
  flag: string;
  rank: number;
  overall: number;
  overallRaw: number;
  categoryScores: Record<string, number | null>;
  hasBlocker: boolean;
  hasHighlight: boolean;
}

export interface Scoreboard {
  categoryCount: number;
  recalibrate: { pivot: number; gain: number };
  countries: ScoreboardEntry[];
}

export function buildScoreboard(countries: Country[], categories: Category[]): Scoreboard {
  const ranked = rankCountries(countries, categories);
  return {
    categoryCount: categories.length,
    recalibrate: { pivot: RECALIBRATE.pivot, gain: RECALIBRATE.gain },
    countries: ranked.map((c) => ({
      id: c.id,
      name: c.name,
      iso: c.iso,
      flag: c.flag,
      rank: c.rank,
      overall: round2(c.overall),
      overallRaw: round2(computeOverall(c, categories)),
      categoryScores: Object.fromEntries(
        categories.map((cat) => {
          const s = c.categoryScores[cat.id];
          return [cat.id, s === null || s === undefined ? null : round2(s)];
        }),
      ),
      hasBlocker: c.hasBlocker,
      hasHighlight: c.hasHighlight,
    })),
  };
}
```

- [ ] **Step 2: Add `tsx` and the npm script to `package.json`**

Run: `npm install -D tsx`
Then add to `"scripts"`:

```json
    "cache:scores": "tsx scripts/build-score-cache.ts",
```

- [ ] **Step 3: Create the build script `scripts/build-score-cache.ts`**

```typescript
// scripts/build-score-cache.ts
// Regenerates src/data/cache/scoreboard.json from the factor data. Run: npm run cache:scores
// fs-loads JSON (NOT the Vite import.meta.glob loader in data.ts) but reuses the pure
// buildScoreboard projection so the cache can never diverge from runtime.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildScoreboard } from "../src/lib/scoreboard";
import { validateCategories, validateCountry } from "../src/lib/schema";
import type { Category, Country } from "../src/lib/schema";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const categories = JSON.parse(readFileSync(join(root, "src/data/categories.json"), "utf8")) as Category[];
const dir = join(root, "src/data/countries");
const countries = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as Country)
  .sort((a, b) => a.name.localeCompare(b.name));

const errors = [
  ...validateCategories(categories),
  ...countries.flatMap((c) => validateCountry(c, categories)),
];
if (errors.length) {
  console.error("Refusing to build cache — data invalid:\n- " + errors.join("\n- "));
  process.exit(1);
}

const board = buildScoreboard(countries, categories);
mkdirSync(join(root, "src/data/cache"), { recursive: true });
writeFileSync(join(root, "src/data/cache/scoreboard.json"), JSON.stringify(board, null, 2) + "\n");
console.log(`Wrote scoreboard.json (${board.countries.length} countries, ${board.categoryCount} categories)`);
```

- [ ] **Step 4: Generate the cache**

Run: `npm run cache:scores`
Expected: `Wrote scoreboard.json (20 countries, 15 categories)`. Open `src/data/cache/scoreboard.json` and sanity-check: countries ranked, `overall` recalibrated (top should now exceed 70), `direct-work-route` present in `categoryScores` as `null` (still pending).

- [ ] **Step 5: Write the drift test `src/data/cache/scoreboard.test.ts`**

```typescript
// src/data/cache/scoreboard.test.ts
import { describe, it, expect } from "vitest";
import board from "@/data/cache/scoreboard.json";
import { countries, categories } from "@/lib/data";
import { buildScoreboard } from "@/lib/scoreboard";

describe("scoreboard cache", () => {
  it("matches a fresh recompute from source — run `npm run cache:scores` if this fails", () => {
    const fresh = buildScoreboard(countries, categories);
    expect(board).toEqual(fresh);
  });
});
```

- [ ] **Step 6: Run the drift test**

Run: `npm test -- src/data/cache/scoreboard.test.ts`
Expected: PASS (committed cache equals recompute).

- [ ] **Step 7: Full gate**

Run: `npm run lint && npm run typecheck && npm test && npm run build`
Expected: all PASS.

- [ ] **Step 8: Commit** (propose; await approval)

```bash
git add src/lib/scoreboard.ts scripts/build-score-cache.ts src/data/cache/ package.json package-lock.json
git commit -m "feat(cache): generated scoreboard.json + drift test (npm run cache:scores)"
```

---

## Task 7: Dashboard reads the cache (lightweight paths)

**Files:**
- Create: `src/hooks/useScoreboard.ts`
- Modify: `src/pages/Dashboard.tsx`

**Interfaces:**
- Consumes: `Scoreboard` (Task 6), `src/data/cache/scoreboard.json`.
- Produces: `useScoreboard(): Scoreboard`.

- [ ] **Step 1: Create the hook `src/hooks/useScoreboard.ts`**

```typescript
// src/hooks/useScoreboard.ts
import { useMemo } from "react";
import board from "@/data/cache/scoreboard.json";
import type { Scoreboard } from "@/lib/scoreboard";

/** Read-only lightweight access to the generated scoreboard (rank/overall/flags) without
 *  recomputing. Drift-guarded by src/data/cache/scoreboard.test.ts. */
export function useScoreboard(): Scoreboard {
  return useMemo(() => board as Scoreboard, []);
}
```

- [ ] **Step 2: Wire `src/pages/Dashboard.tsx` to read rank + overall from the cache**

Add the import: `import { useScoreboard } from "@/hooks/useScoreboard";`
After `const { countries, categories, profile } = useData();` add:

```tsx
  const board = useScoreboard();
```

Change the "Top score" StatCard (line 34) to read the cache:

```tsx
        <StatCard label="Top score" badge={<ScoreBadge score={board.countries[0]?.overall ?? 0} />} hint={board.countries[0]?.name} icon={Trophy} />
```

Change the Leaderboard preview (lines 42-47) to map the cache (drop the `topN(countries, ...)`/selector use here):

```tsx
          {board.countries.slice(0, TOP_N.dashboard).map((c) => (
            <Link key={c.id} to={`/country/${c.iso}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted">
              <span className="flex items-center gap-2"><span className="w-6 tabular-nums text-muted-foreground">{c.rank}</span><span aria-hidden>{c.flag}</span><span className="font-medium">{c.name}</span></span>
              <ScoreBadge score={c.overall} />
            </Link>
          ))}
```

Leave `Podium`, `Choropleth`, `countries.length`, `categories.length`, and `reviewedDates` on `useData()` (they need full `ScoredCountry` fields). If `topN` is now unused in this file, remove its import to satisfy lint.

- [ ] **Step 3: Verify build + lint (no runtime test for this presentational change)**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: PASS. Optionally `npm run dev` and confirm the Dashboard top score + preview render identically (cache == compute, guaranteed by the drift test).

- [ ] **Step 4: Commit** (propose; await approval)

```bash
git add src/hooks/useScoreboard.ts src/pages/Dashboard.tsx
git commit -m "feat(dashboard): read rank/overall from generated scoreboard cache"
```

---

## Phase 1 closeout

- [ ] Run the full gate: `npm run lint && npm run typecheck && npm test && npm run build` — all green.
- [ ] Produce a before/after leaderboard (raw vs recalibrated overall, old vs new rank) from `scoreboard.json` for review.
- [ ] **Decision point:** confirm `P`/`k` (default 55 / 1.6) and the category-weight rebalance against the real before/after board; adjust `RECALIBRATE` and re-run `npm run cache:scores` if tuning. Then proceed to Phase 2.

---

## Phase 2: Research-fill (paced to spend, NOT TDD)

This phase changes scores and therefore follows the **data-change protocol**: gov-first sources, ≥2 independent authoritative sources per decisive claim, 2025-26 currency, reason as a senior immigration consultant through the Bangladeshi-applicant lens, record `evidence`/`links`/`lastReviewed`. One country at a time. No commit without approval. Each country ends with `npm test` green; cache regenerated.

**Per-country task template (repeat for all 20; the new `direct-work-route` cell starts `pending`):**

1. **Dual-citizenship (the 4 only — Austria, Estonia, Netherlands, New Zealand):** change the dual con `severity:"blocker"` → `"normal"`; re-score `dual-citizenship-retention` off the ≤15 floor to the real position (PR/long-term residence held indefinitely without naturalising; citizenship optional). Cite. Re-verify NZ against the current Bangladesh MOHA Dual Nationality Certificate list.
2. **Decisive-mover lifts (where a cited best-realistic-path exists):** e.g. US EB-2 NIW (skips H-1B lottery); EU Blue Card 21-month PR; in-demand/Graduate routes; ICT salaries clearing visa floors. Lift only high-weight decisive factors; record the source + a tradeoff flag. No blanket lifts.
3. **Score the `direct-work-route` cell** — all 6 factors (work-visa-accessibility-bd, overseas-direct-hire, bd-direct-work-track-record, employer-sponsorship-willingness, route-onward-pr-citizenship, current-openness), with `summary`, `pros`/`cons`, `links`, `lastReviewed`; set `status:"scored"`. Add a `severity:"highlight"` pro for countries with a genuinely open direct route. `bd-direct-work-track-record` may use cited proxies (BMET, OECD) — note confidence.
4. Update the country `summary` + `lastReviewed`. Write a research brief to `docs/research/2026-06-…-<country>-directwork.md`.
5. Run `npm test` (Zod gate). The `direct-work-route` cell only counts toward the overall once **all 20** are `scored` (until then it derives null and is excluded — keeps mid-fill leaderboards comparable).

**Phase 2 closeout:**
- [ ] All 20 `direct-work-route` cells `scored`; dual re-scores + lifts done.
- [ ] `npm run cache:scores`; review the final before/after board; re-confirm `P`/`k`.
- [ ] Full gate green.
- [ ] Curation decision (drop <50 / blocked) — surface to user; do not delete files without approval.
- [ ] Report per-category derived scores, derived overall, flags, drift; flag any country still <50.
