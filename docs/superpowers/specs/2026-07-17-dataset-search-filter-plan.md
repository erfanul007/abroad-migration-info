# Dataset search & filter — implementation plan

Spec: `2026-07-17-dataset-search-filter-design.md`. TDD on pure logic; UI wired after logic is green.

## Step 1 — pure logic (TDD)
1. Write `src/lib/datasets.test.ts` covering `deriveFacets` and `filterDatasetRows` (see spec Testing). Run → red.
2. Implement `DatasetFacet`/`DatasetFilter` types + `deriveFacets` + `filterDatasetRows` in `src/lib/datasets.ts`. Run → green.

## Step 2 — SearchBox prop
3. Add optional `placeholder` (+ aria-label) to `SearchBox`; default keeps `Search countries…`. Leaderboard call site unchanged.

## Step 3 — toolbar component
4. Add `src/components/dataset/DatasetToolbar.tsx`: `{ dataset, facets, filter, onFilterChange, total, matched }`. Renders SearchBox + one Select per facet + count + conditional Clear. Style per `leaderboard/Filters.tsx`.

## Step 4 — wire into DatasetTable
5. Add `filter` state, `deriveFacets` + `filterDatasetRows` memos, feed `filteredRows` to `useReactTable`, render `DatasetToolbar` above the table, add zero-match empty-state row.

## Step 5 — quality gate
6. `npm run lint && npm run typecheck && npm run test && npm run build`. No cache regen (no data/scoring change). Report results honestly. No commit.
