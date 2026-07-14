# City Comparison Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a UX-organized two-city comparison tab to score-scale Cities modals.

**Architecture:** A focused `CityCompare` component owns the two selected row IDs and derives all score, contribution, fact, and narrative views from the existing dataset. `DatasetModal` conditionally mounts it behind a Cities-only Compare tab.

**Tech Stack:** React 19, TypeScript 6, Recharts 3, Radix Select/Tabs, Tailwind CSS 4, Vitest, Testing Library

## Global Constraints

- Compare exactly two distinct cities.
- Add no dependencies and change no dataset values.
- Keep university and non-city modals unchanged.
- Reuse existing scoring and formatting utilities.

---

### Task 1: City comparison dashboard

**Files:**
- Create: `src/components/dataset/CityCompare.tsx`
- Create: `src/components/dataset/CityCompare.test.tsx`

**Interfaces:**
- Consumes: `ComparativeDataset` with city rows and score columns.
- Produces: `CityCompare({ dataset }: { dataset: ComparativeDataset })`.

- [ ] Write failing tests for default top-two selection, weighted contributions, aligned facts, and narrative details.
- [ ] Run `npm.cmd test -- src/components/dataset/CityCompare.test.tsx` and confirm failure because the component is absent.
- [ ] Implement two distinct selectors, summary strip, overlaid radar, score/contribution table, facts table, and narrative panels.
- [ ] Re-run the component test and confirm it passes.

### Task 2: Cities-modal integration

**Files:**
- Modify: `src/components/dataset/DatasetModal.tsx`
- Modify: `src/components/dataset/CountryDatasets.test.tsx`

**Interfaces:**
- Consumes: `CityCompare` from Task 1.
- Produces: a conditional `Compare` tab for `dataset.kind === "cities" && dataset.scale === "score"`.

- [ ] Add failing integration assertions that Cities exposes Compare and Universities does not.
- [ ] Run `npm.cmd test -- src/components/dataset/CountryDatasets.test.tsx` and confirm the Cities assertion fails.
- [ ] Add the conditional trigger and content to `DatasetModal`.
- [ ] Run all dataset tests and confirm they pass.

### Task 3: Verification

**Files:** all changed source, tests, spec, and plan files.

- [ ] Run `npm.cmd test` and confirm zero failures.
- [ ] Run `npm.cmd run build` and confirm exit code 0.
- [ ] Run `git diff --check` and inspect scoped diffs for accidental changes.
