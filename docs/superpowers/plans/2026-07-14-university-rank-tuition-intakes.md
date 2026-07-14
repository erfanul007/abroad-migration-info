# University Global Rank, Tuition, and Intake Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add verified EduRank global rank, numeric non-EU tuition, intake months, and dated application periods through 2027 to the Germany university modal.

**Architecture:** Extend the existing generic university dataset with `overallRank` and `nonEuTuition` numeric columns. Keep these decision metrics visible through a focused compact-column predicate, while admissions-calendar text remains in expanded rows and the existing comparison facts table.

**Tech Stack:** React 19, TypeScript 6, TanStack Table, Tailwind CSS 4, Zod JSON schema, Vitest, Testing Library.

## Global Constraints

- Research scope ends at 31 December 2027; no 2028 intake is presented.
- Overall rank is EduRank global rank and must be labelled as such.
- Tuition is euros per semester for non-EU students and excludes semester contributions.
- Tuition-free programmes use numeric `0`.
- Dates are never projected from an older cycle without an explicit recurring official rule.
- Long intake and application-period text remains visible only after expansion.

---

### Task 1: Compact university decision columns

**Files:**
- Modify: `src/components/dataset/DatasetTable.test.tsx`
- Modify: `src/components/dataset/DatasetTable.tsx`

**Interfaces:**
- Consumes: university columns with ids `overallRank`, `nonEuTuition`, and descriptive context.
- Produces: compact table containing all `rank` columns plus `nonEuTuition`; expanded facts exclude visible compact fields.

- [ ] Add a failing test dataset with overall rank, subject rank, numeric tuition, intake text and application-window text. Assert overall rank and tuition headers are visible, `€0`/`€6,000` formatting works, tuition sorting is numeric, and intake/window content is hidden until expansion.
- [ ] Run `npm.cmd test -- src/components/dataset/DatasetTable.test.tsx`; expect failure because the current compact rule hides all non-rank columns.
- [ ] Add a university compact-column predicate that retains rank columns and `nonEuTuition`, and format that field as euros without changing generic number formatting.
- [ ] Run the focused test; expect all DatasetTable tests to pass.

### Task 2: University comparison metrics

**Files:**
- Modify: `src/components/dataset/UniversityCompare.test.tsx`
- Modify: `src/components/dataset/UniversityCompare.tsx`

**Interfaces:**
- Consumes: numeric `overallRank` and `nonEuTuition` plus descriptive admissions facts.
- Produces: subject/global rank rows and a euro-formatted tuition row with lower values emphasized.

- [ ] Extend the comparison fixture and assertions for global ranks, `€0`/`€6,000`, and lower-is-better emphasis.
- [ ] Run `npm.cmd test -- src/components/dataset/UniversityCompare.test.tsx`; expect failure because tuition uses generic numeric rendering and emphasis.
- [ ] Add metric-aware formatting and `betterWhen` comparison styling to admissions numeric facts while preserving rank behavior.
- [ ] Run the focused test; expect it to pass.

### Task 3: Source-backed Germany dataset

**Files:**
- Modify: `src/data/universities/germany.json`
- Modify: `src/components/dataset/CountryDatasets.test.tsx`
- Modify: `docs/germany-universities.md`

**Interfaces:**
- Consumes: EduRank global rankings and official university/programme/state fee and admissions pages.
- Produces: every row has numeric `overallRank`, numeric `nonEuTuition`, intake month(s), dated 2026/2027 windows or explicit unpublished status, and supporting links.

- [ ] Add failing real-data assertions for TUM global rank, `€6,000`, `Winter 2027 · October start`, `Summer 2027 · April start`, and dated application periods.
- [ ] Run `npm.cmd test -- src/components/dataset/CountryDatasets.test.tsx`; expect missing metric and calendar failures.
- [ ] Research and update all rows. Use `0` only where official policy confirms no tuition, `1500` for applicable Baden-Württemberg non-EU public-university tuition, and the official programme fee for exceptions such as TUM.
- [ ] Add rank/fee/admissions source links and update methodology and documentation with snapshot and scope rules.
- [ ] Run integration and schema/data tests; expect them to pass.

### Task 4: Full verification

**Files:**
- Review: all files changed in Tasks 1–3.

**Interfaces:**
- Consumes: completed UI and dataset changes.
- Produces: verified working tree without publishing or committing unrelated user changes.

- [ ] Run `npm.cmd test`; expect all tests to pass.
- [ ] Run `npm.cmd run build`; expect TypeScript and Vite build success, allowing only the existing chunk-size advisory.
- [ ] Run `git diff --check`; expect exit code 0 and no whitespace errors.
