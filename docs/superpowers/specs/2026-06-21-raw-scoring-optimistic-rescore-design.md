# Raw scoring everywhere + moderate-optimistic factor re-score

**Date:** 2026-06-21
**Branch:** `feat/factor-scoring`
**Status:** awaiting user review (do NOT execute until approved)

## Problem / intent

Two coupled changes, on the user's instruction:

1. **Remove display recalibration.** The overall is currently `recalibrate(rawOverall)` (`clamp(55 + (raw−55)·1.6)`). Drop it: the **raw** weighted-mean overall is shown and ranked everywhere. Factor and category scores are already raw, so this only un-wraps the overall.
2. **Re-score every factor of every category for every country, *a bit more optimistic*, cons still in concern.** A re-interpretation of the existing (3-day-old, gov-sourced, cited) factor evidence under a more optimistic-but-honest rubric — not a from-scratch research run.

These are coupled: recalibration existed *because* mean-of-means compressed the raw overall into a 12-point band (55.6–67.3, nothing ≥70). Removing it without lifting factors collapses the leaderboard. So the **factor optimism is now the only spread lever** — and it sets the tier ceiling.

## Decisions (locked with user)

- **Optimism = Moderate.** Reframe the default scoring stance across all factors to the *best realistic, documented pathway* for the profile; every con/blocker still caps. (Not Gentle = outliers-only; not Strong = force-reach ≥80.)
- **Source = re-interpret existing evidence.** Apply the rubric to the cited evidence already in each cell. New web research ONLY where a cell is stale/thin or a lift needs a citation it doesn't yet carry — protocol-compliant, ~10× cheaper than re-running deep-research.
- **Tier scale, weights, inclusion unchanged.** 5 tiers; category weights sum 100; `INCLUSION_MIN` 50.
- **Accepted consequence:** raw + moderate optimism tops out around **Good (mid-high 70s)**, not Excellent. Spread widens from ~12 pts to ~15–18 pts. No country expected to reach ≥80 overall (structural; would need dishonest lifts).

## Scoring rubric (Moderate) — applied per factor cell

Score the **best realistic outcome a well-prepared Dhaka-based Bangladeshi applicant-couple can document**, given the cited evidence — not the median applicant, not the worst case.

1. **Lift toward documented favourable routes** the conservative pass under-weighted: e.g. shortage-occupation Blue Card lower salary bar, EB-2 NIW self-petition, graduate job-search permit each spouse qualifies for independently, DNC-listed dual-citizenship retention, post-study stay-back rights. Score toward that route's realistic success.
2. **Cons still cap, proportional to severity.** A documented hard barrier holds the cell down regardless of optimism — e.g. a ~27-month embassy-Dhaka appointment backlog, dual-citizenship forfeiture, high student-visa refusal rate, OECD-top tax wedge, rising hostility climate. Optimism removes *excess pessimism* where evidence supports a better read; it never erases a cited weakness.
3. **Magnitude is evidence-driven, not a blanket add.** Typical per-cell lift **+0 to +10**; many cells unchanged. **No global multiplier.** A cell is lowered only if re-reading shows the prior number was too generous (rare — direction is optimistic).
4. **`severity` flags unchanged** unless evidence dictates (blockers stay blockers; highlights stay highlights).
5. **Provenance on every changed cell:** update `score`; refine `reasoning` to state the optimistic-but-honest basis in one clause; set cell `lastReviewed: "2026-06-21"`; preserve `evidence`/`links`. Add a `link` only if a genuinely new best-path claim is introduced (no uncited claims). Bump country `lastReviewed` to 2026-06-21.
6. **Self-flag, don't guess.** If a cell's evidence is too thin/stale to re-score confidently, leave it and report it for a targeted research follow-up — never invent a number.

## Code changes — recalibration removal (blast radius)

| File | Change |
|---|---|
| `src/lib/scoring.ts` | Delete `recalibrate()` + `RECALIBRATE` import; `overall: computeOverall(...)` (raw); fix comments (lines ~8, 98, 109). |
| `src/lib/config.ts` | Delete `RECALIBRATE` const + doc (lines 21–23). |
| `src/lib/scoreboard.ts` | Drop `recalibrate` header field + `overallRaw` field + `RECALIBRATE` import; `overall` = raw; fix comments. |
| `src/data/cache/scoreboard.json` | **Regenerate** via `npm run cache:scores` (drops `recalibrate`/`overallRaw`, `overall` = raw). |
| `src/pages/Methodology.tsx` | Remove the "Display recalibration" `Section`, its intro bullet, and the `RECALIBRATE`/`pivot`/`gain` usage. |
| `src/components/methodology/RecalibrationCurve.tsx` | **Delete** (only renders the curve). |
| `src/components/methodology/RecalibrationCurve.test.tsx` | **Delete.** |
| `src/pages/Methodology.test.tsx` | Drop `"Display recalibration"` from the expected-headings list. |
| `src/components/compare/FactorCompareTable.tsx` | Reword footer note (line 59): all scores are exact raw rule-based values; no recalibration. |
| `src/components/country/CategoryFactorScores.tsx` | Reword note (line 44): category score is the exact factor-weighted mean; overall is the exact weighted mean of categories (no recalibration). |
| `src/components/country/CategoryFactorScores.test.tsx` | Update assertion (line 26) off the "only the overall is recalibrated" string. |
| `src/types/index.ts` | Simplify comment (line 28): `(raw)` not `(raw, NOT recalibrated)`. |
| `src/lib/scoring.test.ts` | Remove `recalibrate` import + the `describe("recalibrate")` block; line 119–121 → `overall` equals the raw weighted mean. |

## Execution plan

1. **Recalibration removal first** (code), then `npm run test` green (minus the rescore data), so the raw pipeline is proven before data moves.
2. **Re-score, per country, in controlled waves of subagents.** Each subagent receives: the rubric above, the country JSON path, and its `docs/research/2026-06-*-<country>-factor-rescore.md` brief. It re-interprets each scored factor cell, edits the JSON in place, and returns a **change log** (`category/factor: old→new, one-line why`) plus any **self-flagged thin/stale cells**. One file per agent → no write conflicts.
3. **Targeted research follow-up** only for self-flagged cells (deep-research / direct gov search, cite).
4. **Regenerate cache** (`npm run cache:scores`); review the **before/after leaderboard** (overall + rank deltas) for inflation drift.
5. **Spot-audit** a random sample of lifted cells against their cited sources (does the source support the new number?).
6. **Quality gate:** `npm run test` (Zod gate + drift test) standalone, then `npm run lint && npm run typecheck && npm run build`.

## Validation / acceptance

- Zod gate passes (weights = 100, scores 0–100, factor membership, scored-completeness).
- Cache drift test passes (cache regenerated, no stale `recalibrate`/`overallRaw`).
- Every changed cell carries refined `reasoning` + `lastReviewed` 2026-06-21; no uncited new claims.
- Before/after leaderboard reviewed; top ≈ Good, spread ~15–18 pts, no country drops below `INCLUSION_MIN` (50).
- No `recalibrat`/`overallRaw`/`RECALIBRATE`/`pivot`/`gain` references remain in `src/` outside historical specs.

## Risks / counterarguments

- **Inflation drift** (the spec's standing risk). Mitigation: cons cap, no blanket multiplier, ≤~10/cell guidance, before/after review + source spot-audit, Zod gate. The honest substitute for the display curve is *higher real factor scores*, but only where evidence earns them.
- **Subagent inconsistency** across 20 files. Mitigation: identical rubric prompt, per-country change logs surfaced, my spot-audit, uniform `lastReviewed`.
- **Leaderboard compresses / no Excellent.** Accepted per decision; flagged so it isn't a surprise. If the user later wants Excellent reachable, that's a tier-threshold change or Strong optimism — out of scope here.
- **Methodology page loses a section.** Intended; the page now documents only raw rule-based scoring (cleaner story).

## Out of scope

Tier scale (5 tiers stay), category-weight rebalance, `INCLUSION_MIN`, the fixed-height card task, choropleth (green ramp stays). CLAUDE.md governance wording (recalibration/map-fill lines) — flagged for the maintainer, not auto-edited.

## Governance follow-up (flag, not auto-edit)

CLAUDE.md still describes recalibration as a live invariant ("Overall is computed at runtime… then `recalibrate`d for display"; "Display recalibration curve"). After this ships, that wording is stale. Flag for the maintainer to update the governance doc.
