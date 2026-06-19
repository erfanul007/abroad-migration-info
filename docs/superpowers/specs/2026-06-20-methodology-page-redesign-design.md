# Methodology Page Redesign — Design Spec

**Date:** 2026-06-20
**Status:** Approved (design)
**Topic:** Redesign the Methodology page's category area into a compact, drill-down layout: a category-weight pie plus one compact tile per category, with full factor tables gated behind a "View factor details" modal.

## Problem

The current Methodology "Category weights" summary table and "Factor breakdown" stacked cards show every factor table inline, making the page long and dense. The full factor detail is rarely needed at a glance.

## Outcome

The category area becomes:
- a **pie chart** of the 15 category weights (distribution, sums to 100%), and
- a **grid of compact tiles** (one per category) showing name, what it measures, weight, and factor *names* only,
- with the **full factor table available on demand** via a per-tile modal.

The page is compact and clean by default; detail is one click away. The old summary table and stacked factor cards are retired.

## Users

Same audience: the applicant household and anyone auditing the model's transparency.

## Decisions (from brainstorming)

- Distribution viz = **multi-colour pie** (user choice over single-hue/stacked-bar). Made purposeful: a shared **category identity palette** colours both the pie slices and a matching dot on each tile, so the tiles act as the legend and colour is always backed by a visible name (never the sole signal — a11y-safe, design-system §2.3 documented exception to the ≤3-series guideline).
- The old **summary weight table is dropped** (pie + tiles cover name/meaning/weight).
- Tiles show **factor names only** (weights + descriptions live in the modal).

## Functional requirements

| # | Requirement |
|---|-------------|
| FR1 | Add `categoryColor(index: number, total: number): string` to `src/lib/palette.ts` — evenly-spaced OKLCH hues at fixed mid lightness/chroma, deterministic, legible in light + dark. Co-located test. |
| FR2 | Add `src/components/ui/dialog.tsx` — shadcn-style wrapper over radix `Dialog` (Root/Trigger/Close + Portal+Overlay+Content with a close button, Header/Title/Description), mirroring the existing `popover.tsx` wrapper and its `data-open`/`data-closed` animation classes. |
| FR3 | Add `CategoryWeightPie` (`src/components/methodology/CategoryWeightPie.tsx`): Recharts `PieChart` over `{ categories, colorById }`; one `Cell` per category filled from `colorById`; tooltip shows category name + weight via `formatPercent`; wrapped in a `figure` with `role="img"` + descriptive `aria-label`. No chart `<Legend>` (tiles are the legend). |
| FR4 | Add `CategoryTile` (`src/components/methodology/CategoryTile.tsx`): props `{ category, color }`. Compact card — colour dot + name + weight `Badge`; description; factor labels as `text-xs` outline `Badge` chips (names only); a full-width "View factor details" `Button` (outline, sm) that opens a `Dialog` whose content is `DialogHeader` (dot + name + weight title, description) + the reused `FactorTable`. Owns its own `open` state. |
| FR5 | Rework `Methodology.tsx`: build `colorById = { [id]: categoryColor(i, n) }` over `categories` (data order, stable). The "Category weights" section now renders `CategoryWeightPie` then a responsive grid of `CategoryTile` (sorted by weight desc). Remove the separate "Factor breakdown" section (folded in). Sections: Lead · How the score is built · Display recalibration · Score tiers · Flags · Category weights. |
| FR6 | Remove `CategoryWeightTable.tsx` + `CategoryFactorCard.tsx` and their test files (replaced). Keep `FactorTable`, `WeightBar`, `TierLegend`, `SeverityBadge`. |
| FR7 | All numbers via `formatPercent`; colours only from `palette.ts`; no hardcoded separators/hex in components. |
| FR8 | Document the categorical identity palette in design-system §2.3 as a deliberate exception (identity, redundant with text, capped use to this one chart). |

## Components & data flow

```
Methodology
  ├─ colorById = Object.fromEntries(categories.map((c,i) => [c.id, categoryColor(i, categories.length)]))
  ├─ <CategoryWeightPie categories colorById />     // slices coloured by colorById[c.id]
  └─ grid: sortedByWeight.map(c => <CategoryTile category={c} color={colorById[c.id]} />)
                                        └─ <Dialog> … <FactorTable factors={c.factors} /> </Dialog>
```

`categoryColor` is the single source of slice/dot colour; both pie and tile read it through `colorById`, keyed by `category.id`, so a category's slice and its tile dot always match regardless of tile sort order.

## Out of scope

- Any data/score/weight change (no JSON edits; `npm run cache:scores` not run).
- Changing the other sections (lead, how-built, recalibration, tiers, flags) beyond removing the standalone factor-breakdown section.
- A chart legend, slice labels, or donut centre label (tiles are the legend; tooltip carries values).
- Reusing `Dialog`/`categoryColor` elsewhere now (built reusable; wiring elsewhere is later work).

## Testing

- `categoryColor`: returns an `oklch(...)` string; distinct per index; deterministic; spaced by `360/total`.
- `CategoryWeightPie`: renders a labelled `figure` (role `img`).
- `CategoryTile`: renders name, weight, every factor *label*, and the "View factor details" button; the factor *descriptions* are NOT present until the button is clicked, after which a factor description appears (proves the table is gated behind the modal).
- `Methodology` page test updated: section headings set (now 6, no "Factor breakdown"); every category name present.
- Gate: `npm run lint && npm run typecheck && npm run test && npm run build` all green.

## Open questions

None — chart type (multi-colour pie), table removal, and factor-names-only are decided.
