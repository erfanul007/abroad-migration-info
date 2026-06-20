# Score tier scale (5 tiers) + green-ramp choropleth

**Date:** 2026-06-20
**Status:** implemented

## Problem

The score scale needed an **optimistic, top-heavy** shape (80 already "Excellent") with a
smooth decline, AND tier colours that are **clearly separable to the eye**. An interim
8-tier scale (Excellent / Very Good / Good / Fair / Average / Weak / Poor / Critical) packed
four green-ish tiers together that were indistinguishable as colour — so it was refined to
**five** tiers with one clearly-separable colour each.

## Final scale (authoritative)

| id | label | min (≥) | colour (solid: map + bar fill) | badge tint |
|----|-------|--------:|--------------------------------|------------|
| `excellent` | Excellent | 80 | `#15803D` green  | `bg-green-600/15 text-green-800 dark:text-green-300` |
| `good` | Good | 70 | `#84CC16` lime   | `bg-lime-500/15 text-lime-700 dark:text-lime-300` |
| `average` | Average | 60 | `#EAB308` yellow | `bg-yellow-500/15 text-yellow-700 dark:text-yellow-300` |
| `weak` | Weak | 50 | `#F97316` orange | `bg-orange-500/15 text-orange-700 dark:text-orange-300` |
| `poor` | Poor | 0 | `#DC2626` red    | `bg-red-600/15 text-red-700 dark:text-red-300` |

Bands: ≥80, 70–79, 60–69, 50–59, <50. Colour traffic-gradient green→lime→yellow→orange→red.

## Decisions (locked)

- **Five tiers**, not finer — micro-tiers were visually inseparable.
- **Badge style:** subtle **tint** of the tier colour (`bg-…/15` + coloured text) — solid
  badges read too heavy in dense tables/cards. The **contribution bars fill solid** with the
  same tier hue (`tierColor`). Same tier scale, different rendering intensity.
- **Choropleth:** **NOT the tier palette** — a continuous single-hue green ramp (`scoreToGreen`):
  deepest green = highest overall, faintest = lowest, so the map reads as one "more green = better"
  gradient. Absolute scale, policy-anchored: floor `FILL_MIN = INCLUSION_MIN` (50, so every
  included country greens — none render unfilled), ceiling `FILL_MAX` = excellent floor (80,
  capped). `MAP_LAND` for unscored / rest of world (and any `< 50`). Legend = land swatch +
  `< 50` cutoff + 50→80+ gradient bar.
- **`scoreTier` rounds the score to a whole percent before tiering**, so the colour always
  matches the displayed `%` (a 79.6 shows "80%" and colours as Excellent, not Good) — two
  badges showing the same number can never differ in colour.
- `INCLUSION_MIN` stays 50 (= Weak floor). Recalibration unchanged (overall only). Ranking
  unchanged. Tiers are display-derived (not stored) → no cache regen.

## Architecture (single source)

- **`src/lib/config.ts`** — ordered `TIERS` array `{ id, label, min, color }[]` (descending;
  `poor` floors at 0).
- **`src/lib/formatters.ts`** — `Tier = typeof TIERS[number]["id"]`; `scoreTier` (rounds,
  then first floor cleared); `scoreTierClasses` (5-case tint switch, literal for Tailwind JIT);
  `tierLabel`/`tierColor` lookups; `orderedTiers`. Plus the **separate** choropleth ramp:
  `scoreToGreen` + `FILL_MIN`(=`INCLUSION_MIN`)/`FILL_MAX`(=`TIERS[0].min`) — green only, no tier deps.
- **`ScoreBadge`** (tint), **`TierLegend`** (`tierLabel` + tint tiles) and **`ContributionBars`**
  (each bar `tierColor(scoreTier(categoryScore))`) derive from the tier scale. **`Choropleth`**
  is the exception — `scoreToGreen(overall)` fill + land-swatch/gradient-bar legend.

## Testing

- `formatters.test.ts` — `scoreTier` 5 tiers + boundaries (80/79/70/69/60/59/50/49/0) + rounding
  (79.6→excellent, 49.6→weak, 49.4→poor); `orderedTiers` 5 entries descending; `tierLabel`/
  `tierColor` lookups.
- `TierLegend.test.tsx` — all 5 labels + `≥ 80%` / `< 50%`.
- `formatters.test.ts` (ramp) — `FILL_MIN===INCLUSION_MIN`, `FILL_MAX===TIERS[0].min`; `null`
  below floor; palest green at floor (fixed hue 150); cap at/above `FILL_MAX`; monotonic darkening.

## History

8-tier interim → **5-tier** (separability). Solid badges tried for badge↔map parity → reverted
to tint (too heavy). The choropleth was briefly switched to discrete tier fills alongside the
5-tier work, then **reverted to the continuous green ramp** (`scoreToGreen`) on request — the map
should read as one "more green = better" gradient, not five bands; only the ramp's floor moved
60→50 (= `INCLUSION_MIN`) so every included country greens. Supersedes the badge/colour details
in the 2026-06-19 recalibration spec.

## Out of scope

Card fixed-height work (separate). Changing factor/category/overall scores or recalibration.
CLAUDE.md tier/map-fill wording (governance) — flagged for the maintainer, not auto-edited.
