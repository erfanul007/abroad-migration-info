# City Row Score Visualizations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add category-profile and weighted-contribution visuals to expanded city rows in the Cities modal.

**Architecture:** A new dataset-specific visualization component derives chart rows directly from score columns and a selected dataset row. `DatasetTable` supplies the dataset to expanded row detail and conditionally renders the component for city scoreboards only.

**Tech Stack:** React 19, TypeScript 6, Recharts 3, Tailwind CSS 4, Vitest, Testing Library

## Global Constraints

- Apply only to score-scale city datasets.
- Keep university and non-score dataset rendering unchanged.
- Reuse existing formatting and tier-colour utilities; add no dependency.
- Preserve existing modal scrolling and expanded-row detail content.

---

### Task 1: Dataset score visualization component

**Files:**
- Create: `src/components/dataset/DatasetScoreVisuals.tsx`
- Create: `src/components/dataset/DatasetScoreVisuals.test.tsx`

**Interfaces:**
- Consumes: `ComparativeDataset`, `DatasetRow`, `formatNumber`, `formatPercent`, `scoreTier`, and `tierColor`.
- Produces: `DatasetScoreVisuals({ dataset, row }: { dataset: ComparativeDataset; row: DatasetRow })`.

- [ ] **Step 1: Write the failing component tests**

Render a two-category city row and assert that `Category profile for Hamburg`, `Contribution to overall for Hamburg`, category labels, and calculated labels `45 / 60` and `32 / 40` are present.

- [ ] **Step 2: Verify the test fails**

Run: `npm.cmd test -- src/components/dataset/DatasetScoreVisuals.test.tsx`

Expected: FAIL because `DatasetScoreVisuals` does not exist.

- [ ] **Step 3: Implement the component**

Derive entries with:

```ts
dataset.columns
  .filter((column) => column.kind === "score")
  .flatMap((column) => {
    const score = row.values[column.id];
    return typeof score === "number"
      ? [{ id: column.id, name: column.label, shortLabel: column.shortLabel ?? column.label, weight: column.weight ?? 0, score, contribution: (score / 100) * (column.weight ?? 0) }]
      : [];
  })
  .sort((a, b) => b.weight - a.weight)
```

Render a responsive radar chart and weighted contribution bars in `grid gap-6 lg:grid-cols-2`, each with a visible section heading and a city-specific accessible figure label.

- [ ] **Step 4: Verify the component tests pass**

Run: `npm.cmd test -- src/components/dataset/DatasetScoreVisuals.test.tsx`

Expected: PASS.

### Task 2: Expanded city-row integration

**Files:**
- Modify: `src/components/dataset/DatasetTable.tsx`
- Modify: `src/components/dataset/DatasetTable.test.tsx`

**Interfaces:**
- Consumes: `DatasetScoreVisuals` from Task 1.
- Produces: expanded city rows containing the two visuals before existing narrative detail.

- [ ] **Step 1: Write the failing integration tests**

Assert that city chart labels are absent before expansion, appear after expanding Hamburg, and remain absent for a rank-scale university fixture.

- [ ] **Step 2: Verify the integration test fails**

Run: `npm.cmd test -- src/components/dataset/DatasetTable.test.tsx`

Expected: FAIL because expanded row detail does not render `DatasetScoreVisuals`.

- [ ] **Step 3: Wire the dataset into row detail**

Change the call to:

```tsx
<RowDetail dataset={dataset} row={row.original} contextCols={contextCols} />
```

Change `RowDetail` props to include `dataset: ComparativeDataset`, then insert:

```tsx
{dataset.kind === "cities" && dataset.scale === "score" && (
  <DatasetScoreVisuals dataset={dataset} row={row} />
)}
```

before the existing summary.

- [ ] **Step 4: Verify targeted tests pass**

Run: `npm.cmd test -- src/components/dataset/DatasetScoreVisuals.test.tsx src/components/dataset/DatasetTable.test.tsx src/components/dataset/CountryDatasets.test.tsx`

Expected: PASS.

### Task 3: Full verification

**Files:**
- Verify all changed source, tests, specification, and plan files.

- [ ] **Step 1: Run the complete test suite**

Run: `npm.cmd test`

Expected: all test files and tests pass.

- [ ] **Step 2: Run the production build**

Run: `npm.cmd run build`

Expected: TypeScript and Vite complete with exit code 0; the existing bundle-size advisory may remain.

- [ ] **Step 3: Review the final diff**

Run: `git diff --check` and `git diff -- src/components/dataset docs/superpowers/specs/2026-07-14-city-row-score-visualizations-design.md docs/superpowers/plans/2026-07-14-city-row-score-visualizations.md`

Expected: no whitespace errors and only the scoped city visualization changes.
