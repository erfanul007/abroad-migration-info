# Chancenkarte to Blue Card City Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the German city administration assessment around Opportunity Card-to–EU Blue Card conversion and Anmeldung, with naturalisation retained only as descriptive context.

**Architecture:** Extend the existing dataset row-detail schema with a focused `immigration` object, validate it only for German city rows, and render it through the existing expanded city panel. Keep sorting and weighted-score calculation data-driven through score columns.

**Tech Stack:** React 19, TypeScript, Zod, Vitest, Testing Library, JSON datasets.

## Global Constraints

- Official responsible-authority sources take precedence over third-party estimates.
- eAT production time must never be presented as total conversion time.
- Naturalisation information is unscored.
- Existing unrelated workspace changes must be preserved.

---

### Task 1: Validate the revised city model

**Files:**
- Modify: `src/lib/schema.ts`
- Modify: `src/lib/schema.test.ts`
- Modify: `src/lib/data.test.ts`

- [ ] Write failing tests requiring weights to total 100, forbidding a scored `settle` city column, and requiring complete immigration evidence for all German city rows.
- [ ] Run the focused tests and confirm failures identify the old model.
- [ ] Add the minimal structured schema and Germany-city refinements.
- [ ] Re-run focused tests.

### Task 2: Present conversion evidence in expanded city details

**Files:**
- Modify: `src/components/dataset/DatasetTable.test.tsx`
- Modify: `src/components/dataset/DatasetTable.tsx`
- Modify if required: `src/components/dataset/CityCompare.test.tsx`
- Modify if required: `src/components/dataset/CityCompare.tsx`

- [ ] Write failing tests for processing scope, application route, work-start guidance, confidence, verification date, and separate naturalisation context.
- [ ] Confirm the tests fail because the structured assessment is not rendered.
- [ ] Implement a compact responsive evidence panel inside expanded city details and equivalent comparison content.
- [ ] Re-run component tests.

### Task 3: Research and rescore all German cities

**Files:**
- Modify: `src/data/cities/germany.json`
- Modify: `docs/germany-cities.md`

- [ ] Audit each current timing against the responsible immigration authority.
- [ ] Populate all structured evidence fields and official links, using `Not published` where appropriate.
- [ ] Remove `settle`, change `conv` to weight 22, change `anm` to weight 12, and conservatively rescore conversion.
- [ ] Rewrite methodology, caveats, summaries, notes, pros, and cons that relied on unsupported timings.
- [ ] Run focused data and UI tests.

### Task 4: Verify the decision output

**Files:**
- Review: all files above

- [ ] Inspect the weighted ordering and confirm it reflects job availability plus documented conversion risk.
- [ ] Run `npm.cmd test` and confirm zero failures.
- [ ] Run `npm.cmd run lint` and confirm zero errors.
- [ ] Run `npm.cmd run build` and confirm a successful production build.
- [ ] Run `git diff --check` and review the scoped diff for accidental unrelated changes.

