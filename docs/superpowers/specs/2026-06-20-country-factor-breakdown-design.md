# Country Detail — Category factor breakdown & pros/cons labels

**Date:** 2026-06-20
**Status:** Approved
**Area:** `src/pages/CountryDetail.tsx` "Category detail" tab; `src/lib/scoring.ts`; new `src/components/country/`

## Problem

The "Category detail" cards on a country page have two UX gaps:

1. **Pros and cons are distinguished only by colour** — emerald bullets vs muted bullets,
   no textual label. Colour-only signalling is weak (accessibility, scannability) and the
   muted cons text is low-contrast.
2. **No factor-level visibility.** A category score is the weighted mean of its factor
   sub-scores, but the country page never exposes that breakdown — the user cannot see
   *which* factors earned or lost the points. The Methodology page shows factor
   *definitions* (weight, share, description); the country page should show this country's
   *obtained* factor scores.

## Outcome

- Each card labels its lists with a coloured **Pros** (emerald) / **Cons** (rose) subheading;
  bullets render in legible foreground text. Empty list ⇒ no label.
- Each *scored* card gains a **"View factor details"** button (mirrors the Methodology tile)
  opening a modal with a per-factor **weighted-contribution** table:
  `Factor · Weight · Score · Points (score×weight ÷ 100, out of weight)`, footer total =
  raw weighted mean, with a note tying it to the recalibrated display score.

## Functional requirements

| # | Requirement |
|---|-------------|
| F1 | `deriveFactorBreakdown(cell, category)` returns `{ rows, total }` or `null`. One row per category factor: `{ id, label, weight, score, points }`, `points = (score/100)×weight`. `total = Σ points`. |
| F2 | Returns `null` when the cell is pending/absent or any factor is missing/pending — same non-derivability rule as `deriveCategoryScore`. |
| F3 | For a complete scored cell, `total === deriveCategoryScore(cell, category)` (factor weights sum to 100, so the points sum is the raw weighted mean). |
| F4 | `CategoryFactorScores` renders the breakdown: factor label, weight `formatPercent`, score as a `ScoreBadge` (tier-coloured), points `formatNumber(points,1) / weight`. Footer row = `formatNumber(total,1) / 100`. |
| F5 | A note states the total is the **raw** weighted mean and shows the **recalibrated** display score (`displayScore`), referencing Methodology — resolving the "numbers don't match the badge" gap. |
| F6 | `CategoryFactorDialog` renders the trigger button + Dialog (reusing `ui/dialog.tsx`); header = category name + obtained `ScoreBadge` + description; body = `CategoryFactorScores`. Renders `null` if breakdown is null (defensive). |
| F7 | CountryDetail: scored cards show **Pros**/**Cons** labels above each non-empty list (bullets in foreground; severity badges retained) and the `CategoryFactorDialog` button. Pending/absent cards unchanged ("Not yet assessed", no button). |

## Data model changes

None. No country/category JSON, score, or weight changes. No `scoreboard.json` regen
(no data/scoring-value change — `deriveFactorBreakdown` is a new pure read over existing data).

## Components (mirrors the Methodology split, keeps the pure math testable)

- `src/lib/scoring.ts` — `deriveFactorBreakdown` (pure, TDD). Types `FactorBreakdownRow`,
  `FactorBreakdown` added to `src/types/index.ts` (derived runtime types).
- `src/components/country/CategoryFactorScores.tsx` — presentational table (props: `breakdown`, `displayScore`).
- `src/components/country/CategoryFactorDialog.tsx` — button + Dialog wrapper (props: `category`, `cell`, `score`).

## Out of scope

- Methodology page (already shipped); the factor *definition* table there is unchanged.
- Any change to how category/overall scores are computed or recalibrated.
- Per-factor evidence/links (factor scores carry only `status` + `score` in the schema).

## Risk / counterargument

The footer total is the **raw** weighted mean (e.g. 68.4) while every category badge shows
the **recalibrated** display score (e.g. 70). Surfacing two numbers risks a "these don't
match" reaction. Mitigation: state both explicitly and point to Methodology — turning the
gap into a teaching moment rather than hiding the raw figure (which would misrepresent how
points sum). Alternative considered — recalibrate the total — rejected: points would no
longer sum to the displayed total, breaking the table's internal arithmetic.

## Open questions

None.
