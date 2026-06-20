# Compare — factor-level comparison modal + dynamic country slots

**Date:** 2026-06-20
**Page:** `src/pages/Compare.tsx`
**Status:** approved (design), pending implementation

## Problem

The Compare page compares **category** scores side by side, but offers no way to see
*why* a category score differs between countries — the per-factor sub-scores that roll
up into it. It is also capped at **3** fixed country slots (default 2), set inline as
`[0, 1, 2]`, with a "Reset to 2" button.

Two gaps:
1. No factor-level comparison.
2. Country count is fixed at 3 and not dynamic.

## Users / context

The single fixed profile (Dhaka-based Bangladeshi couple) shortlisting migration
countries. A user comparing e.g. Germany vs Netherlands vs Canada on `visa-access`
wants to see which *factors* (approval rate, processing, embassy access, …) drive the
gap — not just the rolled-up category number.

## Outcomes

- From the Category-scores table, drill into any category and compare its factor
  sub-scores across the chosen countries in a modal.
- Compare up to **5** countries (min 2), added/removed dynamically.
- No data/score change — pure UI over existing scored data + one pure helper. No
  `cache:scores`, no research gate.

## Decisions (locked)

| # | Decision | Choice |
|---|----------|--------|
| 1 | Factor view surfacing | **Per-category drill-in**: one trigger per category row → focused modal for that category's factors across the chosen countries (mirrors CountryDetail's "View factor details"). |
| 2 | Dynamic slots | **Add / remove**: start at 2; "Add country" appends up to 5 (auto-fills next-best unselected); slots removable when count > 2. Replaces fixed `[0,1,2]` + "Reset to 2". |
| 3 | Trigger label | **"Compare factors"** — rendered as a compact icon button (`Table2`); the label is the accessible name + tooltip (visible text ×14 rows would bloat the table). |
| 4 | §6 consistency tweak | Order the Category-scores **rows** by weight desc (`byWeightDesc`), matching leaderboard / country-detail / methodology. |

## Functional requirements

| ID | Requirement |
|----|-------------|
| FR-1 | Each scored category row in the Category-scores table shows a "Compare factors" trigger (icon button, `aria-label`/`title` = "Compare factors"). The Overall row shows none. |
| FR-2 | Clicking opens a Dialog titled with the category name + weight; description = category description. |
| FR-3 | Modal table: rows = that category's factors (source order, matching `CategoryFactorScores`); columns = **Factor · Weight · {each chosen country}**. |
| FR-4 | Each country/factor cell shows that country's **raw** factor sub-score (0–100) via `ScoreBadge`; `—` (muted) when the factor is pending/absent for that country. |
| FR-5 | Per-row, the highest non-null score cell is highlighted with `bg-primary/5` (same idiom as the main category table). |
| FR-6 | Footer row "Category score": each country's **recalibrated display** score (`categoryScore()`), i.e. the number clicked from; `—` when non-derivable. |
| FR-7 | Note under the table: factor scores are absolute 0–100; the category-score row is recalibrated (see Methodology). |
| FR-8 | Country slots: render one `Select` per entry in `selected[]`, starting at 2. "Add country" button visible when `< 5`, auto-fills the next unselected country by rank. Each slot removable (✕) when `selected.length > 2`. `optionsFor(i)` still prevents duplicate picks. |
| FR-9 | Page intro copy: "three" → "five". |
| FR-10 | Category-scores rows ordered by `byWeightDesc`. |

## Architecture

Pure helper + two presentational components + Compare-page wiring. No change to
scoring, schema, data, or the score cache.

### Data model changes

None to JSON/schema. One new derived type in `@/types`:

```ts
export interface FactorComparisonRow {
  id: string;
  label: string;
  weight: number;            // factor weight within the category (sums to 100)
  scores: (number | null)[]; // raw 0–100 per country, aligned to input order; null = pending/absent
}
```

### Pure helper — `src/lib/scoring.ts`

```ts
export function deriveFactorComparison(
  category: Category,
  cells: (CategoryScore | null | undefined)[],
): FactorComparisonRow[] {
  return category.factors.map((factor) => ({
    id: factor.id,
    label: factor.label,
    weight: factor.weight,
    scores: cells.map((cell) => {
      if (!cell || cell.status !== "scored") return null;
      const fs = cell.factors[factor.id];
      return fs && fs.status === "scored" ? fs.score : null;
    }),
  }));
}
```

- One row per factor, source order. `scores[i]` aligns to `cells[i]` (caller passes
  cells in chosen-country order). Null when the cell or the factor is non-scored.
- Per-row max highlight is computed in the component (parity with the existing main
  table, which does `Math.max` inline) — not in the helper.

### Components — `src/components/compare/`

**`FactorCompareTable.tsx`** (presentational)
- Props: `{ category: Category; countries: ScoredCountry[] }`.
- Derive `cells = countries.map((c) => c.categories[category.id] ?? null)`.
- `rows = deriveFactorComparison(category, cells)`.
- Render Table: header `Factor | Weight | {country.flag country.name}×n`.
- Body: per row, `formatPercent(weight)`; per country cell `score == null ? —
  : <ScoreBadge score={score} />`; highlight cell where `score === rowMax` and
  `rowMax` is finite.
- Footer: "Category score" + `categoryScore(country, category.id)` per country
  (`ScoreBadge` or `—`).
- Note `<p>` per FR-7.
- Wrap in `overflow-x-auto`.

**`FactorCompareDialog.tsx`**
- Props: `{ category: Category; countries: ScoredCountry[] }`.
- Trigger: `<Button variant="ghost" size="icon" title="Compare factors"
  aria-label="Compare factors"><Table2 /></Button>`.
- `DialogContent className="sm:max-w-3xl"`; header title `{category.name}` +
  `formatPercent(category.weight)`; description `{category.description}`; body
  `<FactorCompareTable category countries />`.

### Compare page wiring — `src/pages/Compare.tsx`

- Slots: `selected.map((iso, i) => <Select…>)`; remove control per slot when
  `selected.length > 2`; "Add country" button (`selected.length < 5`) appends
  `countries.find((c) => !selected.includes(c.iso))?.iso`. Remove the "Reset to 2"
  button.
- Category-scores rows: iterate `[...categories].sort(byWeightDesc)`.
- Add a trailing column to the table header (e.g. screen-reader-only "Factors") and a
  trailing `<TableCell>` per category row holding `<FactorCompareDialog category
  countries={chosen} />`. Overall row's trailing cell empty.
- Intro copy "three" → "five".

## Error / edge handling

- A category pending/absent for a country → that country's factor cells all `—`, and
  its footer category score `—`. Trigger still renders (other countries may differ).
- A factor scored for some countries but not others → mixed scores and `—` in the row;
  max highlight ignores nulls.
- ≥2 countries guaranteed: the table (and its triggers) only render when
  `chosen.length >= 2`.
- Duplicate picks prevented by `optionsFor(i)`; "Add country" only offers unselected.

## Testing

- `src/lib/scoring.test.ts` — `deriveFactorComparison`: row per factor in order;
  `scores` aligned to cells; null for pending/absent cell; null for missing/pending
  factor; mixed scored/non-scored across cells.
- `src/components/compare/FactorCompareTable.test.tsx` — renders factor labels,
  country column headers, scores, `—` for nulls, footer category scores; asserts the
  max cell carries `bg-primary/5`.
- `src/components/compare/FactorCompareDialog.test.tsx` — factor rows hidden until the
  trigger is clicked; click reveals a factor label.
- `src/pages/Compare.test.tsx` (light) — "Add country" raises the slot count; remove
  lowers it; floor of 2 enforced.

## Out of scope

- Persisting selection to the URL.
- Sorting/filtering inside the factor modal.
- Changing factor or category *scores* (data) — none touched.
- Reworking the single-country CountryDetail factor modal.

## Open questions

None — all four decisions locked above.
