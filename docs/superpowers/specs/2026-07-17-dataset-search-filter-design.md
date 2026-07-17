# Dataset search & filter — design spec

**Date:** 2026-07-17
**Status:** Approved (brainstorm), pending implementation
**Scope:** UI-only. No data, schema, or scoring changes → data-research protocol and score-cache regen do not apply.

## Problem

The per-country dataset modal (`DatasetModal` → Table tab → `DatasetTable`) renders universities (and cities) with sortable columns and expandable row detail, but has **no way to search or filter**. Germany's universities dataset has 26 rows across 22 cities; scanning for a specific university or a city's programmes means reading the whole table. Users need to search by name and narrow by city and intake status.

## Users

The single fixed profile (Bangladeshi MSc applicant) browsing candidate universities inside a country detail page. Read-only consumption of the JSON data store.

## Outcome

Inside the dataset Table tab, the user can:
- type to search universities by name or city,
- narrow to a single city,
- narrow to an intake status (e.g. hide programmes with no upcoming CS intake),
- see how many rows match and clear all filters in one click.

Cities datasets (no tags, city == the row itself) get the search box only — facets self-hide.

## Design

### Filtering model — pure, external to the table

Mirrors the leaderboard precedent (`byRegion` filters rows *before* the table). All filter logic lives in pure, unit-tested functions in `src/lib/datasets.ts`; `DatasetTable` keeps owning sort + expansion over the already-filtered rows. This keeps TanStack config untouched (no custom `globalFilterFn`) and the logic testable in isolation.

```ts
// src/lib/datasets.ts (additions)

export interface DatasetFacet {
  id: string;                          // "city" | "intake"
  label: string;                       // "City" | "Intake"
  options: string[];                   // distinct values, display order
  getValues: (row: DatasetRow) => string[]; // row's value(s) for this facet
}

export interface DatasetFilter {
  query: string;                       // free-text (name + city)
  facets: Record<string, string>;      // facetId -> selected value ("" = all)
}

/** Facets available for a dataset, each with >= 2 distinct non-empty values.
 *  City derives from sublabel (segment before first comma); Intake from tags[]. */
export function deriveFacets(dataset: ComparativeDataset): DatasetFacet[];

/** Rows passing the query (case-insensitive substring over label + sublabel)
 *  AND every active facet (selected value must be in the row's facet values). */
export function filterDatasetRows(
  dataset: ComparativeDataset,
  rows: DatasetRow[],
  filter: DatasetFilter,
): DatasetRow[];
```

**Facet derivation**
| Facet | id | Source | `getValues(row)` |
|---|---|---|---|
| City | `city` | `sublabel` before first comma, trimmed | `[city]` (or `[]` if no sublabel) |
| Intake | `intake` | `tags[]` | `row.tags ?? []` |

A facet is emitted only when it has ≥ 2 distinct non-empty option values. Consequence: cities dataset (no `tags`, and city derivation over its sublabels is not meaningful) yields 0 facets → search-only toolbar. Universities → City + Intake.

**Matching rules**
- Query: `label` and `sublabel` lower-cased, substring match; empty query matches all.
- Facet: `selected === ""` → no constraint; otherwise `getValues(row).includes(selected)`.
- A row passes iff it satisfies the query AND all active facets (AND across facets).

### UI — `DatasetToolbar`

New presentational component `src/components/dataset/DatasetToolbar.tsx`, rendered by `DatasetTable` above the table wrapper. Layout matches `leaderboard/Filters.tsx` (flex-wrap, gap-2, `Select` `w-44`).

- **Search** — reuse `SearchBox`, generalized with an optional `placeholder` (+ matching `aria-label`) prop; default unchanged so the leaderboard is untouched. Placeholder here: `Search universities…` / `Search cities…` driven by `dataset.kind`.
- **Facet selects** — one shadcn `Select` per derived facet. First item `All {label}` with value sentinel; then options. Same pattern as the region select.
- **Result count** — `{n} of {total}` muted text.
- **Clear** — `Button variant="ghost" size="sm"` visible only when any filter is active; resets query + facets.

### State & integration in `DatasetTable`

- Local `useState<DatasetFilter>({ query: "", facets: {} })`. Ephemeral — resets on remount (modal close/reopen). No URL sync (YAGNI).
- `facets = useMemo(() => deriveFacets(dataset), [dataset])`.
- `filteredRows = useMemo(() => filterDatasetRows(dataset, dataset.rows, filter), [dataset, filter])`.
- Feed `filteredRows` to `useReactTable({ data: filteredRows, ... })` (replaces `dataset.rows`). Sort/expand unchanged; `bestValue`/best-cell highlighting continues to compute over the full dataset (highlight is a dataset property, not a filter artifact — intentional).
- Empty state: when `filteredRows.length === 0`, render a single full-width table row "No matches — adjust search or filters." instead of an empty body.

## Data model changes

None. Reads existing `label`, `sublabel`, `tags` only.

## Out of scope

- Language facet (column is free-text prose, 22 distinct singletons — dropped per decision 2026-07-17).
- Multi-select facets / combobox (no shadcn `command` primitive; single-select `Select` suffices).
- URL/query-param persistence of filter state.
- Search over collapsed detail text (programs, requirements) — search is name + city only.
- Filtering on the Compare tab or any non-table view.

## Functional requirements

| # | Requirement |
|---|---|
| FR1 | `DatasetTable` shows a toolbar above the table for every dataset. |
| FR2 | Search box filters rows by case-insensitive substring over name + city; live. |
| FR3 | For universities, City and Intake single-select facets appear; selecting narrows rows (AND). |
| FR4 | Facets with < 2 distinct values are not rendered (cities dataset → none). |
| FR5 | Toolbar shows "{matched} of {total}" and a Clear control that resets all filters when any is active. |
| FR6 | Zero matches renders an explicit empty-state row, not a blank table. |
| FR7 | Sorting and row expansion operate over the filtered set and are otherwise unchanged. |
| FR8 | `SearchBox` gains an optional `placeholder` prop; the leaderboard usage is visually unchanged. |

## Testing

- `src/lib/datasets.test.ts` (new/extended): `deriveFacets` (city from sublabel, intake from tags, <2-distinct suppression, cities→[]), `filterDatasetRows` (query match, facet match, combined AND, empty query/facets = identity, no matches = []).
- Existing `DatasetTable`/`UniversityCompare` tests must stay green.

## Risks / counterarguments

- **City facet brittleness:** deriving city from `sublabel` assumes "City, State" shape. A sublabel without a comma yields the whole string as the city (acceptable); a missing sublabel yields no city value (row still searchable, just unfiltered by city). Guarded by the ≥2-distinct rule.
- **External filtering vs TanStack `globalFilter`:** external is less "idiomatic" for TanStack but matches the existing `byRegion` precedent, is trivially testable, and avoids coupling facet logic to column defs. Trade accepted.
- **Best-cell highlight over full dataset:** a filtered view may show no "best" cell if the best row is filtered out. Intentional — "best" is a property of the dataset, not the current filter; recomputing per filter would mislead.

## Files

- `src/lib/datasets.ts` — add `deriveFacets`, `filterDatasetRows`, types.
- `src/lib/datasets.test.ts` — tests.
- `src/components/dataset/DatasetToolbar.tsx` — new toolbar component.
- `src/components/dataset/DatasetTable.tsx` — wire state + filtered rows + empty state.
- `src/components/leaderboard/SearchBox.tsx` — optional `placeholder` prop.
