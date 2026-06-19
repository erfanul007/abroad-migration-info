# Factor-scoring recalibration — design spec

- **Date:** 2026-06-19
- **Branch:** `feat/factor-scoring`
- **Status:** awaiting user review (do NOT implement until approved)
- **Author context:** all 20 countries were re-scored under the factor model; the leaderboard compressed into 55–67 with nothing above 70 and 11 drop-candidates. This spec recalibrates so scores discriminate again.

## 1. Problem (measured, not assumed)

Distributions pulled from the live data:

| Layer | n | range | median | ≥80 |
|---|---|---|---|---|
| Raw **factor** scores | 1820 | 12–95 | 58 | 182 (38 ≥90) |
| Derived **category** scores | 280 | 29.8–79.6 | 59.2 | **0** |
| Derived **overall** scores | 20 | 55.2–66.9 | ~59 | 0 |

**Root cause = aggregation, not strictness.** The factor research already uses the full 0–100 scale honestly (182 scores ≥80). But each category is a weighted mean of ~6 factors, so a single mid/weak factor caps it — **no category reaches 80**. The overall is then a weighted mean of 14 categories — mean-of-means collapses variance a second time, squeezing all 20 countries into a 12-point band.

Two amplifiers:
- The **`other` catch-all** factor is a content-free centre-magnet: 280 cells, mean **49.4**, 81% pinned in 45–55. ~7% of every category nailed near 50.
- The **dual-citizenship-retention** factor was **force-floored ≤15** + tagged `severity:"blocker"` for Austria, Estonia, Netherlands, New Zealand, dragging those four overalls and excluding them.

## 2. Goals / non-goals

**Goals**
- Restore cross-country spread and a usable top tier (≥80 = excellent becomes reachable).
- Keep the result honest — no blanket inflation of hand-researched factor numbers.
- Dual-citizenship becomes a **flag**, not a blocker/exclusion.
- Add a **direct work-visa route** as a first-class category (weight 10, primary-path) and a **positive flag** highlighting countries hireable directly from Dhaka.
- Stop over-dropping: lower the inclusion cutoff to **<50**.
- Add a **generated score-cache artifact** (`src/data/cache/scoreboard.json`) for provenance + lightweight rank/total reads, kept fresh by a drift test.
- Every changed number traces to a cited source (data-change protocol holds).

**Non-goals**
- No re-research of all 1820 factor scores.
- Exactly **one** new category (`direct-work-route`); no other new categories, no new countries.
- No UI redesign — component changes limited to the positive-flag badge (F) and cache-read wiring (G).
- No change to the *core* factor→category→overall means; `recalibrate` is an added display transform on top, not a rewrite of the derivation.

## 3. Design

Parts A, E (structural), F (positive flag), C (curve), D (cutoff), G (cache) need **no research**. Part B (de-blocker + dual re-score), B′ (decisive-mover lifts), and the new-category fill follow the data-change protocol (gov-first, ≥2 sources, cited).

### A. Light maths fix — remove the `other` magnet (uniform, no fabrication)
- Delete the `other` factor from all 14 categories in `categories.json`; redistribute its weight **proportionally** across each category's remaining factors so each category still sums to 100 (Zod gate).
- Strip the now-orphaned `factors.other` entries from the 20 country files — **mechanical key removal, zero score changes**.
- `scoring.ts` derivation logic unchanged.

### B. Dual-citizenship: de-blocker + honest re-score (researched)
- Remove `severity:"blocker"` → `"normal"` on the dual cons for Austria, Estonia, Netherlands, New Zealand. `hasBlocker` becomes false; renders as a flag.
- Re-score `dual-citizenship-retention` off the ≤15 floor to reflect the real consultant position: a Bangladeshi can **hold PR / long-term residence indefinitely without naturalising** (retains BD passport), so the study→work→PR→settle journey is fully intact; only the *optional final* citizenship swap carries the renunciation tradeoff. Per-country value set from a cited source; tradeoff recorded as a `cons` flag. Re-verify NZ against the current Bangladesh MOHA Dual Nationality Certificate list and the residency-without-citizenship route.

### B′. Targeted optimistic lift — decisive movers only (researched, the real spread lever)
- Bounded, **not** blanket. Per country, lift only **high-weight decisive factors where a documented best-realistic-path ("loophole") exists** that the conservative pass under-scored. Candidate examples to verify:
  - US: EB-2 NIW self-petition (skips the H-1B lottery) for strong AI researchers.
  - Germany/EU: Blue Card 21-month fast-track PR; IT shortage occupation.
  - UK/Ireland/Canada/Australia: in-demand/Graduate routes, ICT salaries clearing visa floors.
- Gov-first WebSearch, ≥2 independent sources, recorded in the cell `reasoning` + `links`, `lastReviewed` bumped, plus country `lastReviewed`. **No memory edits.** Each lift framed as a known tradeoff taken with eyes open.

### C. Recalibration curve (scoring.ts logic change, tested)
- Add a pure `recalibrate(raw): number` = `clamp(P + (raw − P) · k, 0, 100)`, a monotonic contrast-stretch around fixed pivot `P` with gain `k` (constants, documented).
- Apply at the **display/rank/tier boundary** only: in `scoreCountry`, the consumed overall and per-category scores pass through `recalibrate()`. Core `deriveCategoryScore`/`computeOverall` stay raw; the curve is a thin presentation transform.
- Monotonic ⇒ ranking order is preserved; `scoreTier` and charts read the curved values; the `<50` cutoff reads the curved overall.
- Default **P=55, k=1.6** (tunable at review). Mapping:

  | raw | 45 | 50 | 55 | 60 | 65 | 70 | 75 | 80 |
  |---|---|---|---|---|---|---|---|---|
  | display | 39 | 47 | 55 | 63 | 71 | 79 | 87 | 95 |

- Honesty framing: the 0–100 tier thresholds (`≥80 excellent…`) were authored assuming full-range use; mean-of-means structurally prevents that at the aggregate level, so the curve restores the *designed* tier semantics. The transform is shown transparently (this table) and applied uniformly — strong rise, weak fall.

### D. Inclusion — lower the cutoff
- Replace the `<60 drop` curation rule in `CLAUDE.md` with **drop only <50 (on the curved overall)**; all others surface with flags. No country files deleted without explicit user approval (surface, don't delete).

### E. New category — "Direct Work-Visa Route (Bangladesh)" (weight 10; sponsorship moved in)
The alternative to study-first: can a Dhaka-based engineer be hired directly from overseas on a skilled-work visa and migrate that way. Owns the entry-route signal so it is **not** double-counted elsewhere.

- **Move** `sponsorship-work-authorisation` out of `job-market` into this category. `job-market` then owns demand/salary/AI/hireability/dual-earner only; its remaining factor weights renormalise to 100 (after also dropping its `other` per Part A):

  | job-market factor | old wt | new wt |
  |---|---|---|
  | sw-demand-depth | 22 | 31 |
  | salary-levels | 16 | 22 |
  | ai-ml-specialisation | 14 | 19 |
  | foreign-grad-bd-hireability | 12 | 17 |
  | dual-earner-depth | 8 | 11 |
  | ~~sponsorship-work-authorisation~~ | 20 | → moved |
  | ~~other~~ | 8 | → removed |

- **New category factors** (sum 100, no `other`):

  | id | label | wt | scope guard |
  |---|---|---|---|
  | work-visa-accessibility-bd | Skilled-work visa accessibility (BD national) | 24 | the visa's legal/regulatory accessibility — eligibility, salary floor, occupation list, quota (absorbs moved sponsorship substance) |
  | overseas-direct-hire | Overseas direct-hire feasibility | 22 | can a firm hire+relocate from Bangladesh with no in-country presence / local-offer rule; global-talent/employer-led routes |
  | bd-direct-work-track-record | BD direct-work migration track record | 16 | established flow of BDs who actually migrated via direct skilled-work visa (proxies allowed; mark confidence) |
  | employer-sponsorship-willingness | Employer sponsorship willingness & friction | 16 | employer *behaviour* — sponsor-licence prevalence, LMIA/labour-market-test burden, cost (distinct from regulatory accessibility above) |
  | route-onward-pr-citizenship | Route continuity to PR & citizenship | 14 | whether THIS work visa is a recognised on-ramp onward (settlement track vs dead-end permit) — **route linkage only; PR/citizenship difficulty stays in their own categories** |
  | current-openness | Current openness / policy direction (2025-26) | 8 | is the direct-work route open/expanding vs restricting/quota-capped right now |

- **Category-weight rebalance** (15 categories, sum stays 100; new=10 funded by trimming the highest-weight + entry-route-related categories; tunable at review):

  | category | old | new | | category | old | new |
  |---|---|---|---|---|---|---|
  | **direct-work-route** | — | **10** | | pr-pathway | 8 | 7 |
  | job-market | 12 | 10 | | income-cost | 7 | 6 |
  | visa-access | 10 | 9 | | healthcare | 6 | 5 |
  | citizenship | 10 | 9 | | culture-language | 6 | 6 |
  | post-study-work | 9 | 8 | | safety-law | 5 | 5 |
  | spouse-family | 9 | 8 | | politics | 4 | 4 |
  | msc-study | 8 | 7 | | tax | 3 | 3 |
  | | | | | muslim-diaspora | 3 | 3 |

- **Rollout for consistency:** add the category `pending` for **all 20** countries first (excluded from overall by `deriveCategoryScore`→null). Keep it pending until every country is researched, then it counts for all simultaneously — so mid-fill leaderboards stay comparable.

### F. Positive flag — `highlight` (mirror of the blocker, small code)
- `schema.ts`: extend `severity` enum to `["normal","blocker","highlight"]`; a **pro** carrying `severity:"highlight"` is the positive flag.
- `scoring.ts`: derive `hasHighlight = present.some(s => (s.cell.pros ?? []).some(p => p.severity === "highlight"))`; add to `ScoredCountry` (+ `types/index.ts`).
- `CountryDetail.tsx`: mirror the blocker label at lines 82–84 with an emerald positive badge on highlight pros.
- The highlight pro lives on the **direct-work-route** cell for countries with a genuinely open direct route → `hasHighlight` ≈ "hireable directly from Dhaka, route to settlement". New test mirrors the `hasBlocker` test.

### G. Score cache — generated artifact (not stored in source)
**Purpose:** provenance/audit snapshot + lightweight rank/total reads — *not* performance (the live aggregation is sub-millisecond). Reconciles the "never store overall" invariant by keeping all derived data out of the source country JSONs and in a clearly-generated file.

- **File:** `src/data/cache/scoreboard.json` — generated, never hand-edited. Deterministic output (stable key order, no timestamp, so the drift test is a clean equality check). Shape per country: `id`, `name`, `rank`, `overall` (recalibrated/display), `overallRaw` (pre-curve, for transparency), `categoryScores` (recalibrated, by id), `hasBlocker`, `hasHighlight`. Plus a header: `categoryCount`, `recalibrate: {pivot, gain}`.
- **Build script:** `scripts/build-score-cache.ts` — loads `categories.json` + all country JSONs through the existing validated `data.ts` loader, runs `rankCountries`/`scoreCountry` + `recalibrate` **imported from `scoring.ts`** (single source of logic — never re-implement the maths), writes the file. Exposed via `npm run cache:scores`. Run with the repo's TS runner (`vite-node`; add `tsx` only if needed).
- **App reads cache for lightweight paths:** a thin `cache.ts` loader imports `scoreboard.json`; consumers that need only rank/overall/flags (dashboard summary cards, nav/leaderboard score+rank, badges) read it; anything rendering category/factor detail (CountryDetail, Compare, radar/bars) still computes live via `scoreCountry`. Exact path list finalised in the plan after surveying consumers.
- **Drift guard:** `src/data/cache/scoreboard.test.ts` recomputes from source via `scoring.ts` and asserts deep-equality with the committed cache → `npm test` fails on staleness.
- **Invariant carve-out:** update CLAUDE.md's data-model section — the "never store a precomputed overall" rule governs **source country JSONs**; the generated, drift-tested cache file is the sanctioned exception.

## 4. Order of operations (avoid double-counting)
1. A + E (structural, no research): remove `other`; move sponsorship; reweight job-market factors; add the new category (pending ×20) + category-weight rebalance; strip orphan keys.
2. F (code): severity enum, `hasHighlight`, render, tests.
3. C (code): `recalibrate()` + tests.
4. B + B′ + new-category fill (researched, per-country, cited): dual re-score, decisive-mover lifts, score all 20 on direct-work-route; flip it live once all 20 done.
5. `recalibrate(raw)` applies to display/rank/tier/cutoff throughout.
6. G (code): build the cache script + drift test + cache-reading consumers **last** (scoring shape stable); regenerate `scoreboard.json` as the final step before every commit.

## 5. Validation & quality gate
- `npm run test` (Zod gate: **category weights sum 100** across all 15 categories, **each category's factor weights sum 100**, scores 0–100, every factor scored in a `scored` cell) — must pass after the job-market factor reweight, the new category, the category-weight rebalance, and the orphan-key strip.
- New co-located tests: `recalibrate()` (monotonic, clamps to [0,100], fixed point at P, known mappings); `hasHighlight` (mirror of the `hasBlocker` test); **cache drift** (`scoreboard.json` deep-equals recompute-from-source).
- `npm run cache:scores` regenerates the cache; run it before every commit (drift test enforces).
- Full gate before "done": `npm run lint && npm run typecheck && npm run test && npm run build` — report honestly.

## 6. Risks / counter-arguments
- **The curve could read as cosmetic.** Mitigation: it's a transparent, monotonic, documented transform restoring authored tier semantics; raw values remain in data; rank order unchanged.
- **Targeted lift could drift into inflation.** Mitigation: bounded to cited decisive movers; each lift carries a source + a tradeoff flag; no blanket multiplier.
- **`other` removal shifts category weights slightly**, changing some raw category scores beyond pure de-magnet effect (redistribution favours the heavier remaining factors). Acceptable and uniform; surfaced in the post-change drift report.
- **Combined lift + curve could over-lift the field.** Mitigation: pivot/gain tuned and a before/after leaderboard reviewed before commit.
- **Category-weight rebalance shifts every country's overall** (independent of any re-score). Mitigation: rebalance is uniform and surfaced in the drift report; the table is tunable at review.
- **New category could re-introduce double-counting** via the route-onward factor. Mitigation: explicit scope guards keep PR/citizenship *difficulty* in their own categories; this factor scores only route *linkage*.
- **`bd-direct-work-track-record` may lack hard per-nationality data.** Mitigation: use cited proxies (BMET outbound stats, OECD migration DB, destination work-permit-by-nationality where published) and record lower confidence in `reasoning`.
- **The cache can go stale and the UI now reads it for rank/total** (your choice). Mitigation: the drift test fails the gate on any mismatch; the script imports `scoring.ts` so logic can't diverge; regenerate before commit. Residual risk: an un-regenerated working tree shows stale numbers until `npm test` is run — acceptable given the gate.
- **Caching adds no performance benefit** (live aggregation is sub-ms); justified by provenance/decoupling only. If that value isn't worth the moving part, Part G is the most droppable piece of this plan.

## 7. Out of scope
- No new countries; no new categories beyond `direct-work-route`.
- No UI redesign or component work beyond the positive-flag badge (F) and cache-read wiring (G).
- No re-researching of non-decisive factors.

## 8. Open questions
- Final `P`, `k` after seeing the real post-A/B/E before-after leaderboard.
- Final category-weight rebalance table (§3.E) — confirm or tune the trims.
- Per-country scope of B′ (how many decisive movers per country) — sized to spend.
- NZ DNC-list confirmation against current Bangladesh MOHA list.
- Positive-flag label/badge wording in `CountryDetail` (e.g. "(direct-work route)").
- Exact list of UI paths that read the cache vs compute live (finalised after surveying consumers).
- Cache script runner: `vite-node` vs adding `tsx` devDependency.

## 9. Process notes
- Scoring-logic + batch-data change ⇒ writing-plans skill next, after spec approval.
- **No commit/push and no file deletion without explicit user approval** (CLAUDE.md overrides the skill's auto-commit step).
- CLAUDE.md edits required: (i) inclusion cutoff `<60`→`<50`; (ii) add `direct-work-route` to the category list + new weights; (iii) data-model carve-out for the generated cache; (iv) "regenerate `npm run cache:scores` before commit" rule.
