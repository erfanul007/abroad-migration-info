# Design spec — factor-level scoring redesign (2026-06-17)

**Status:** approved design; phased build. Phase 1 (taxonomy) is the immediate scope.

## 1. Problem & goal

Today a category cell holds one hand-set `score` (0–100); the category `factors` in `categories.json` are unused string labels; scoring is "too vague". We make scoring concrete and fully derived: each **factor becomes a scored sub-category**, the **category score is derived from its factors**, the **overall is derived from categories** (already true), and rank / leaderboard / top-3 are derived (already true). JSON stays the database; TypeScript owns all derivation; no hardcoded value that can be derived.

## 2. Locked decisions

1. **Per-factor weights** — each factor carries a weight; weights sum to **exactly 100** within a category (hard gate, same discipline as category weights).
2. **Cell shape** — category cell = factor-score map + a one-line `summary` (no "flag" wording) + `pros[]` + `cons[]` + `links[]` + `lastReviewed`.
3. **Blockers** — represented as a `con` with optional `severity: "blocker"`; TS derives a country-level badge. No score override; inclusion stays the <60 rule.
4. **Full re-research before shipping** — every factor of every country is researched + cited before the new model goes live.
5. **Strict everywhere** — factor weights sum to 100; a category derives a score only when **all** its factors are scored (no pending factors in shipped data); a country counts only when complete.
6. **Mandatory `other` factor** per category — a researcher-defined catch-all for out-of-scope findings; weight reflects the category's breadth/ambiguity. Flexibility comes from `other`, not from loose weights.
7. **Factor `description` = research + scoring rubric** — what to research (gov-first, Bangladeshi-applicant lens) and how to map findings to 0–100 (anchor points). This is the per-factor validation gate.

## 3. Data model

### 3.1 Category / factor taxonomy (Phase 1 — this step)
`categories.json` factor entries change from `string` to:
```ts
type Factor = { id: string; label: string; description: string; weight: number };
```
Category unchanged otherwise (`id, name, shortLabel, weight, description, factors[]`).

**Invariants (Zod, strict):** category weights sum to 100 (existing); within each category — factor `id`s unique, factor `weight`s sum to 100 (±0.001), and a factor with `id === "other"` is present.

### 3.2 Country cell (Phase 2 — deferred, documented here)
```ts
type ProCon = { text: string; severity?: "normal" | "blocker"; link?: ReferenceLink };
type FactorScore = { status: "scored" | "pending"; score: number /*int 0–100*/ };
type CategoryCell = {
  status: "scored" | "pending";
  factors: Record<string /*factorId*/, FactorScore>;
  summary: string;            // no "flag" wording
  pros: ProCon[];
  cons: ProCon[];             // a blocker is a con with severity:"blocker"
  links: ReferenceLink[];
  lastReviewed: string;
};
```
A cell's `factors` keys must ⊆ that category's known factor ids. Strict: a category is `scored` only when every one of its factors is scored.

### 3.3 Derivation (Phase 2 — `scoring.ts`)
- `categoryScore = Σ(factor.score × factor.weight) / Σ(factor.weight)` over the category's factors. Strict mode: if any factor is unscored, the category is treated as pending (excluded from overall, mirroring today's missing-category handling).
- `overall` = existing weighted sum over present/scored categories (unchanged formula; new input).
- `hasBlocker` (country-level, derived) = any con anywhere has `severity:"blocker"` → drives a UI badge. No score override.

## 4. Factor taxonomy

Full per-factor rubrics live in [`factor-taxonomy-proposal.md`](./factor-taxonomy-proposal.md) (source of truth for `description` text). ~91 factors across 14 categories; every category sums to 100 and contains `other`. Corrections applied vs the raw analyst output: culture-language rebalanced 106→100 (worklife-livability 12→8, cultural-distance-adaptation 6→4); job-market dead `remote-acceptance` removed; spouse-family `dual-career-feasibility` removed and `other` 16→8 with reallocation; msc-study `study-pathway-fit` narrowed (not removed). The reviewer's **single-owner boundaries** (dual-earner, policy-stability, sentiment, student-money, status-loss) are written into the affected rubrics so each fact is scored once.

Weight table (final, each row sums to 100): see the approved table in the design thread / proposal doc.

## 5. Validation (Zod, `schema.ts`)

- `factorSchema = { id: non-empty, label, description, weight: positive number }`.
- `categorySchema.factors = z.array(factorSchema)` + refinements: unique factor ids; weights sum to 100 (±0.001); contains an `id:"other"` factor.
- Keep `categoriesSchema` category-weights-sum-100 + unique category ids.
- Phase 2: `categoryScoreSchema` gains `factors`, `pros`, `cons`; `validateCountry` checks factor-id membership per category.

## 6. UI contract (Phase 3 — deferred)

- CountryDetail: per category, show derived score + factor breakdown (sub-bars/table using factor weights & scores), `pros`/`cons` lists, `links`, `lastReviewed`. Blocker cons styled distinctly; a country-level blocker badge derived from `hasBlocker`.
- Charts (radar/bars/choropleth), leaderboard, Compare, Dashboard top-3 consume the **derived** category score — interface unchanged, input now derived.
- Factor rubric `description` available as tooltip/help.

## 7. De-hardcoding (Phase 3 — deferred)

Centralise policy constants into `src/lib/config.ts` (single source): tier cutoffs (80/65/45), choropleth band (60/80), inclusion cutoff (60), top-N sizes (podium 3, dashboard 5, compare 2). Remove literal counts ("14 categories"/"20 countries") from non-test code; About pathway icons derive from `profile.pathway.length`.

## 8. Phased rollout

- **Phase 1 (now):** taxonomy — `categories.json` + `factorSchema` + refinements + tests. Country files untouched; no behaviour change.
- **Phase 2:** country-cell schema + `scoring.ts` derivation + strict validation; full per-country factor re-research (~1,820 cited sub-scores) under the data-change protocol; cutover.
- **Phase 3:** UI rendering of factors/pros/cons/blocker badges + threshold de-hardcoding.

## 9. Testing (TDD)

- Phase 1: schema tests — factor-weights-sum-100, unique factor ids, mandatory `other`, malformed factor rejection. `data.test.ts` stays green (still 14 categories).
- Phase 2: scoring tests — category-from-factors derivation, strict pending handling, renormalisation; blocker derivation.

## 10. Risks / out of scope

- **Scope:** ~1,820 cited factor scores to research before shipping (Phase 2) — large; deep-research workflows have hit org spend limits. Mitigate by branching: model+UI land first behind the new schema (factors pending), data backfills, then flip.
- **Cutover:** Phase 2 changes the country-cell shape and breaks old data; do it on a branch, validate via the Zod gate, merge when complete.
- Out of scope: changing category weights; adding/removing categories; new pages.
