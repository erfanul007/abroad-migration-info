# Methodology Page — Design Spec

**Date:** 2026-06-19
**Status:** Approved (design)
**Topic:** Extract scoring methodology from About into a dedicated, data-driven `Methodology` page that explains the full factor → category → overall pipeline and exposes every category's factor breakdown.

## Problem

The scoring model now has two weight levels — category weights *and* per-factor weights, each factor carrying its own description. The current "Scoring methodology" section on the About page only shows a flat category-weight table; it has no room to explain the derivation (factor-weighted mean → category-weighted mean → display recalibration → tiers) or to expose the ~75 factors. About is also already carrying household, goal, preferences, and feedback, so the methodology can't grow there.

## Outcome

A standalone `Methodology` page that:
- fully explains how a score is built, end to end, with **no hardcoded numbers** — every weight, cutoff, pivot/gain, and tier threshold is read from `categories.json` / `src/lib/config.ts`;
- keeps the existing category-weight table as a **summary table**;
- exposes each category's factors (label · weight · description) as **stacked cards**;
- removes the methodology section from About and repoints the Dashboard link;
- introduces reusable components (tier legend, severity flag badge, weight bar, factor/weight tables).

## Users

Same single audience as the rest of the app: the two-person applicant household reviewing *how* the ranking is computed, plus anyone auditing the transparency of the model.

## Functional requirements

| # | Requirement |
|---|-------------|
| FR1 | New route `/methodology` rendering a `Methodology` page; added to the React Router config. |
| FR2 | Nav gains a "Methodology" link (single `links` array → desktop + mobile), ordered Dashboard · Leaderboard · Compare · Methodology · About. |
| FR3 | Dashboard's "About the method →" link repoints to `/methodology`. |
| FR4 | The "Scoring methodology" `Section` is removed from About, along with now-unused imports/derivations (`Table*`, `Calculator`, `categories`, `sortedCategories`). About's other sections are unchanged. |
| FR5 | Page §1 Lead: prose describing the 0–100 factor → category → overall model. |
| FR6 | Page §2 "How the score is built": the derivation as a short step list + formula. Recalibration pivot/gain and the inclusion cutoff are interpolated from `RECALIBRATE` and `INCLUSION_MIN`, not typed as literals. States that pending categories are excluded (not zeroed) and remaining weights renormalised. |
| FR7 | Page §3 Display recalibration: a compact Recharts line plotting shown-vs-raw across 0..100 by calling `recalibrate()` (single source of truth — no duplicated maths), pivot marked, with a one-line plain-English caption. |
| FR8 | Page §4 Score tiers: a colour-band legend derived from `TIER` via a new pure `orderedTiers()` helper + existing `scoreTier`/`scoreTierClasses`. |
| FR9 | Page §5 Flags: explains `severity:"blocker"` (dual-citizenship) and `severity:"highlight"` (direct-work route) using the shared `SeverityBadge`. |
| FR10 | Page §6 Category weights: the summary table (Category · Weight · What it measures), sorted by weight desc, each row showing a proportional `WeightBar`. Rendered by reusable `CategoryWeightTable`, driven entirely by `categories`. |
| FR11 | Page §7 Factor breakdown: one stacked `CategoryFactorCard` per category (sorted by weight desc) — header = name + weight chip + description; body = `FactorTable` of that category's factors (Factor · Weight · What it measures), each with a `WeightBar`. Factor weights and descriptions come from `category.factors`. |
| FR12 | All user-facing numbers route through `formatPercent` (en-GB). No hardcoded separators or `%` literals in JSX. |

## Components

**New reusable (cross-page) — `src/components/common/`:**
- `TierLegend.tsx` — renders bands from `orderedTiers()`; usable on Leaderboard later.
- `SeverityBadge.tsx` — `{ severity: "blocker" | "highlight" }` → the rose/emerald chip + label. **CountryDetail is refactored to consume it**, removing its inline blocker/highlight markup.
- `WeightBar.tsx` — `{ weight, max }` → a slim proportional bar (width = weight/max), decorative (`aria-hidden`), value already shown as text alongside.

**New page-specific — `src/components/methodology/`:**
- `CategoryWeightTable.tsx` — the summary table over `categories`.
- `FactorTable.tsx` — `{ factors: Factor[] }` → factor sub-table.
- `CategoryFactorCard.tsx` — `{ category: Category }` → card header + `FactorTable`.
- `RecalibrationCurve.tsx` — Recharts line over sampled `recalibrate()` values.

**New page — `src/pages/Methodology.tsx`** — composes the seven sections via the existing `Section` component and the above.

## Lib changes

- `src/lib/formatters.ts`: add pure `orderedTiers(): { tier: Tier; min: number }[]` — the tiers ordered by threshold desc, derived from `TIER` (weak's floor is 0). Co-located test.
- No change to `scoring.ts` / `config.ts` values. `recalibrate`, `scoreTier`, `scoreTierClasses` are reused as-is.

## Data model changes

None. No JSON edits, no score changes. **`npm run cache:scores` is not required** (the score cache is untouched). Schema unchanged.

## Out of scope

- Any change to weights, factor scores, evidence, or country data.
- A jump/anchor nav or per-category deep links (can follow later).
- Localisation beyond the existing en-GB formatting.
- Reusing `TierLegend` on other pages now (component is built reusable; wiring it elsewhere is later work).

## Testing

- `orderedTiers` unit test (order + floors derived from `TIER`).
- Render test: `CategoryWeightTable` shows every category with its weight from data.
- Render test: `Methodology` renders all category names and the seven section headings.
- Gate: `npm run lint && npm run typecheck && npm run test && npm run build` all green.

## Open questions

None — the four design axes (page name `Methodology`, stacked-card factor layout, full explainer depth, move-out-of-About-fully) are decided.
