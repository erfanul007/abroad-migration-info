# University Ownership and Open-Intake Tags Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add filterable public/private ownership and officially verified live intake states to all German university rows.

**Architecture:** Keep the existing schema-free `tags[]` model. Rename the tag-derived facet to `Tags`, centralise visual semantics in `intakeTagClass`, and make `germany.json` authoritative for ownership and reviewed intake state.

**Tech Stack:** React 19, TypeScript, TanStack Table, Tailwind CSS, Vitest, JSON/Zod data loading.

## Global Constraints

- Do not change the schema.
- Use official university admissions sources for all open/closed claims.
- `open` means confirmed active on 22 July 2026; do not project dates from an earlier cycle.
- Use exactly one of `Public` or `Private` on every row.
- Do not commit or push.

---

### Task 1: Generalise the intake facet to tags

**Files:**
- Modify: `src/lib/datasets.ts`
- Test: `src/lib/datasets.test.ts`
- Test: `src/components/dataset/DatasetTable.test.tsx`

**Interfaces:**
- Produces: a `DatasetFacet` with `id: "tags"`, `label: "Tags"`, and `getValues(row) === row.tags ?? []`.
- Consumed by: `DatasetToolbar`, which derives the copy `All tags` from the label.

- [x] **Step 1: Write failing tests**

Change the facet expectations to find `id === "tags"`, assert `label === "Tags"`, and assert the rendered toolbar contains `All tags`.

- [x] **Step 2: Run the focused tests and confirm failure**

Run: `npm run test -- --run src/lib/datasets.test.ts src/components/dataset/DatasetTable.test.tsx`

Expected: failures because the current facet is `intake` / `Intake`.

- [x] **Step 3: Implement the facet rename**

In `deriveFacets`, replace:

```ts
{ id: "intake", label: "Intake", options: [], getValues: (r) => r.tags ?? [] }
```

with:

```ts
{ id: "tags", label: "Tags", options: [], getValues: (r) => r.tags ?? [] }
```

- [x] **Step 4: Run the focused tests and confirm they pass**

Run the Task 1 command and expect all selected tests to pass.

### Task 2: Add ownership and open-state visual semantics

**Files:**
- Modify: `src/components/dataset/DatasetTable.tsx`
- Test: `src/components/dataset/DatasetTable.test.tsx`

**Interfaces:**
- Consumes: exact tag strings from `germany.json`.
- Produces: blue Public, violet Private, green `open`, teal Summer, amber Winter, and rose no-intake badge classes.

- [x] **Step 1: Write a failing colour-semantics test**

Render tags `Public`, `Private`, `Summer ’27 open`, `Winter ’26 open`, `Winter ’27 open`, `Summer ’27`, `Winter ’27`, and `No CS intake ’27`; assert the required Tailwind colour families.

- [x] **Step 2: Run the component test and confirm failure**

Run: `npm run test -- --run src/components/dataset/DatasetTable.test.tsx`

- [x] **Step 3: Implement exact class selection**

Use ownership checks first, then `tag.endsWith(" open")`, then no-intake, winter, and summer checks. Keep a neutral fallback for unknown tags.

- [x] **Step 4: Re-run the component test**

Expect it to pass.

### Task 3: Audit and update all university tags

**Files:**
- Modify: `src/data/universities/germany.json`
- Modify: `docs/research/2026-07-22-berlin-region-universities-expansion.md`
- Test: `src/lib/data.test.ts`

**Interfaces:**
- Produces: one ownership tag and only allowed admission tags on every university row.
- Consumed by: `deriveFacets` and `DatasetTable`.

- [x] **Step 1: Audit official admissions sources**

For all 35 rows, verify programme intake and application availability on 22 July 2026. Record Winter 2026, Summer 2027, and Winter 2027 open states only where the official source identifies that target intake and an active route/window.

- [x] **Step 2: Write failing data invariants**

Assert the exact six-member Private set, exact 29-member Public set, exactly one ownership tag per row, admission tags drawn from the approved vocabulary, and no simultaneous plain/open tag for one season.

- [x] **Step 3: Run the data test and confirm failure**

Run: `npm run test -- --run src/lib/data.test.ts`

- [x] **Step 4: Update data and provenance**

Add `Private`, replace plain tags with open variants only where verified, update affected `applicationWindow` strings and `detail.links`, and append an official-source audit table to the research log.

- [x] **Step 5: Re-run the data test**

Expect it to pass with all 35 rows satisfying the invariants.

### Task 4: Full verification

**Files:**
- Generated if changed: `src/data/cache/scoreboard.json`

**Interfaces:**
- Verifies the complete application and data-loading pipeline.

- [x] **Step 1: Regenerate the score cache**

Run: `npm run cache:scores`

- [x] **Step 2: Run the quality gate**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`

Expected: zero errors, all tests passing, production build successful. Existing non-blocking warnings must be reported honestly.

- [x] **Step 3: Run final structural checks**

Run `git diff --check`, inspect `git status --short`, and execute a Node audit that prints the ownership partition, allowed tag vocabulary, and any invariant violations.

- [x] **Step 4: Report without committing**

Summarise researched open intakes, modified files, full gate results and remaining warnings. Do not commit or push.
