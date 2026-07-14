# University Details and Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add rich, expandable university admissions profiles and a two-university comparison tab for Tanima's Germany master's shortlist.

**Architecture:** Reuse the generic comparative-dataset schema: rank columns form the compact table, non-rank values form expanded and comparison facts, and existing row details supply narratives. A focused `UniversityCompare` component handles side-by-side university presentation, while `DatasetModal` selects the city or university comparison appropriate to the dataset kind.

**Tech Stack:** React 19, TypeScript 6, Radix UI, TanStack Table, Tailwind CSS 4, Vitest, Testing Library, Zod-backed JSON datasets.

## Global Constraints

- Do not infer Tanima's GPA, IELTS score, German level, module credits, GRE status, or admission eligibility.
- Keep long descriptive admissions content out of the collapsed table.
- Treat subject ranks as ordinal positions; do not calculate an overall university score.
- Prefer official university/program sources and distinguish tuition from semester contribution.
- Preserve the modal outside-dismiss protection and accessible selector structure.

---

### Task 1: University progressive disclosure

**Files:**
- Modify: `src/components/dataset/DatasetTable.test.tsx`
- Modify: `src/components/dataset/DatasetTable.tsx`

**Interfaces:**
- Consumes: `ComparativeDataset.columns`, where rank columns are compact metrics and non-rank columns are descriptive context.
- Produces: existing `DatasetTable({ dataset })` with university context rendered only in `RowDetail`.

- [ ] Write a failing test that defines a rank university dataset with `programs`, `intakes`, `applicationWindow`, `tuition`, and `applicationPortal` text columns; assert those labels and values are absent before expansion and visible after clicking `Show details`.
- [ ] Run `npm.cmd test -- src/components/dataset/DatasetTable.test.tsx` and confirm it fails because university non-rank columns are still table headers/cells.
- [ ] Change `contextCols` to include non-rank columns for university rank datasets and `tableCols` to retain only rank columns; preserve existing score-dataset behavior.
- [ ] Run the focused test and confirm it passes without breaking rank sorting or city score details.

### Task 2: University comparison component

**Files:**
- Create: `src/components/dataset/UniversityCompare.test.tsx`
- Create: `src/components/dataset/UniversityCompare.tsx`

**Interfaces:**
- Consumes: `UniversityCompare({ dataset }: { dataset: ComparativeDataset })` with at least two university rows.
- Produces: two accessible selectors, an accessible `University subject rank comparison` table, an accessible `University admissions comparison` table, and two narrative cards.

- [ ] Write a failing component test with two university rows containing subject ranks, program/intake/window/fee/portal facts, summaries, pros, cons, notes, and links. Assert default selections, non-label selector wrappers, lower-rank emphasis, aligned facts, and narratives.
- [ ] Run `npm.cmd test -- src/components/dataset/UniversityCompare.test.tsx` and confirm module resolution fails because the component does not exist.
- [ ] Implement selector state with distinct choices, rank comparison with lower-is-better emphasis, context value formatting, and parallel narrative cards using existing UI primitives.
- [ ] Run the focused test and confirm it passes.

### Task 3: Universities modal integration

**Files:**
- Modify: `src/components/dataset/CountryDatasets.test.tsx`
- Modify: `src/components/dataset/DatasetModal.tsx`

**Interfaces:**
- Consumes: `dataset.kind`, `dataset.scale`, and `dataset.rows.length`.
- Produces: a Compare tab for both eligible city and university datasets, rendering the kind-specific comparison component.

- [ ] Change the Germany integration test to expect a Compare tab in the Universities modal and verify the comparison view exposes `First university` and `Second university` selectors.
- [ ] Run `npm.cmd test -- src/components/dataset/CountryDatasets.test.tsx` and confirm it fails because university comparison is not enabled.
- [ ] Import `UniversityCompare`, enable comparison for university rank datasets with at least two rows, and render the correct comparison component by dataset kind.
- [ ] Run the integration test and confirm it passes while the Cities Compare tab still works.

### Task 4: Germany university admissions content

**Files:**
- Modify: `src/data/universities/germany.json`
- Modify: `src/components/dataset/CountryDatasets.test.tsx`

**Interfaces:**
- Consumes: official program, application, fee, and admissions information current on the review date.
- Produces: context columns and row-level facts/details for every shortlist row, including explicit unsuitable-program flags where needed.

- [ ] Add an integration assertion for TUM that expands its row and expects suitable program, intake, application window, tuition, application portal, profile-fit narrative, a pro, a con, and an official link.
- [ ] Run the integration test and confirm it fails on the missing admissions fields.
- [ ] Add the shared context columns and enrich all university rows with concise values and expanded narratives. Preserve numeric subject ranks. Use cautious wording for unpublished future windows and unknown applicant credentials.
- [ ] Run the integration test, schema/data tests, and university component tests; confirm they pass.

### Task 5: Verification and documentation consistency

**Files:**
- Modify if needed: `docs/germany-universities.md`

**Interfaces:**
- Consumes: completed UI and Germany dataset.
- Produces: a verified build with consistent source notes and no whitespace errors.

- [ ] Update the university documentation if the JSON scope or content rules have materially changed.
- [ ] Run `npm.cmd test` and confirm every test passes.
- [ ] Run `npm.cmd run build` and confirm TypeScript and Vite production build pass; the existing bundle-size advisory is acceptable.
- [ ] Run `git diff --check` and confirm there are no whitespace errors.
