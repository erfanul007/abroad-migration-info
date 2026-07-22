# Job-First City Scoreboard Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rescore Germany's city scoreboard for an experienced software engineer using either the Chancenkarte or student-visa route, with jobs as the largest category and no naturalisation content.

**Architecture:** Keep the generic comparative-dataset engine unchanged. Replace the city dataset's `anm` score column with `scale-pay`, fold Anmeldung evidence into `conv`, remove naturalisation-only fields from the city schema and rows, and update all 23 data rows after an official-source reassessment. The declared score-column order controls the table, comparison and map detail ordering.

**Tech Stack:** React 19, TypeScript, Zod 4, JSON data, Vitest, Vite.

## Global Constraints

- Use only official/primary public sources for every changed factual claim; record links and `lastReviewed`/`asOf` evidence.
- No invented local salary, population, employment or processing data; record unavailable city-level evidence explicitly.
- Do not commit, stage or push.
- Score columns, in display order: `jobs 22`, `conv 18`, `scale-pay 12`, `comp 9`, `rent 9`, `cost 7`, `pt 6`, `eng 6`, `safe 5`, `conn 3`, `comm 3`.
- `conv` covers registration friction, residence-authority route and legal full-time work authorisation for both entry pathways.
- Naturalisation/citizenship is out of scope for this city dataset and must not appear in schema, rows, documentation, table columns or tests.

---

### Task 1: Establish the new data-contract tests

**Files:**
- Modify: `src/lib/data.test.ts`
- Modify: `src/lib/schema.ts`

**Interfaces:**
- Produces a city dataset contract with required 11 numeric score columns and no naturalisation fields.

- [ ] **Step 1: Write failing tests**

```ts
expect(scored.map((column) => [column.id, column.weight])).toEqual([
  ["jobs", 22], ["conv", 18], ["scale-pay", 12], ["comp", 9], ["rent", 9],
  ["cost", 7], ["pt", 6], ["eng", 6], ["safe", 5], ["conn", 3], ["comm", 3],
]);
expect(cities.columns.find((column) => column.id === "anm")).toBeUndefined();
expect(cities.columns.find((column) => column.id === "natTime")).toBeUndefined();
expect(row.detail?.immigration?.naturalisation).toBeUndefined();
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm run test -- src/lib/data.test.ts`

Expected: failure because `anm`, `natTime`, and `immigration.naturalisation` still exist and the current weights/order differ.

- [ ] **Step 3: Update Zod and test expectations minimally**

Remove `naturalisation` from `immigrationEvidenceSchema`; retain only residence/work-authorisation fields. Update pre-existing city-test language so it verifies the pathway-neutral conversion evidence instead of naturalisation context.

- [ ] **Step 4: Run the focused test and verify the contract is green after Task 2 data changes**

Run: `npm run test -- src/lib/data.test.ts`

Expected: PASS.

### Task 2: Rebuild the city-data model and official evidence

**Files:**
- Modify: `src/data/cities/germany.json`
- Modify: `docs/research/2026-07-21-berlin-commuter-cities-expansion.md`
- Create: `docs/research/2026-07-21-job-first-city-scoreboard-reassessment.md`

**Interfaces:**
- Consumes: the Task 1 score-column/schema contract.
- Produces: 23 complete, cited rows with `scale-pay` and merged conversion evidence.

- [ ] **Step 1: Research every city using official sources**

For each city, collect a current official population/metro-scale source, an official wage proxy (BA Entgeltatlas or official statistical office where city-specific), authoritative local economic/employment data, housing source, authority/registration channel and current city-specific work-permit evidence. For existing city evidence older than twelve months, replace or flag it. Record source URLs, publication/reference dates, conflicts, and unavailable measures in the new scratchpad.

- [ ] **Step 2: Replace the columns and wording**

Remove `anm` and `natTime`; add `scale-pay` as a 12-point score directly after `conv`. Order all 11 score columns by descending weight. Change `conv` label/description to “Conversion & work authorisation” and explicitly include registration, responsible authority, transition from either current title, and the lawful full-time-work point.

- [ ] **Step 3: Rescore all 23 rows**

Set every row's `scale-pay`; remove `anm` and naturalisation value/evidence. Reassess `jobs`, `conv`, `rent`, `cost`, `eng`, `comp`, `pt`, `safe`, `conn`, and `comm` only where the new official research warrants it. Update each changed row's summary, pros, cons, links, `immigration.asOf`, and dataset `lastReviewed`.

- [ ] **Step 4: Verify JSON and focused tests**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/data/cities/germany.json','utf8'))" && npm run test -- src/lib/data.test.ts`

Expected: JSON parses and focused tests pass.

### Task 3: Remove naturalisation from the rendered city experience and documentation

**Files:**
- Modify: `docs/germany-cities.md`
- Modify: `src/components/dataset/CityCompare.test.tsx` if its visible-column assertions need updating
- Modify: `src/components/dataset/DatasetOverviewMap.test.tsx` if its score-column assertions need updating

**Interfaces:**
- Consumes: city data with no naturalisation fields and a declared score order.
- Produces: all city-facing documentation and tests aligned with the new job-first, two-route framing.

- [ ] **Step 1: Write/adjust a failing UI-contract test**

Assert that the comparison/table score-column sequence starts `jobs`, `conv`, `scale-pay`, that no `Anm`/Naturalisation column is rendered, and that city rows remain compareable.

- [ ] **Step 2: Run the focused UI test and verify failure**

Run: `npm run test -- src/components/dataset/CityCompare.test.tsx src/components/dataset/DatasetOverviewMap.test.tsx`

Expected: failure against the old columns.

- [ ] **Step 3: Update user-facing copy and any affected expectations**

Document the two qualifying entry routes as paths to the same skilled-work outcome. Replace the criteria table, ranking table, TSV and methodology with recalculated values. Remove all city naturalisation content and update recommendations so they do not imply the city board ranks citizenship processing.

- [ ] **Step 4: Run focused UI tests**

Run: `npm run test -- src/components/dataset/CityCompare.test.tsx src/components/dataset/DatasetOverviewMap.test.tsx`

Expected: PASS.

### Task 4: Regenerate derived data and verify the complete change

**Files:**
- Modify (generated): `src/data/cache/scoreboard.json`

- [ ] **Step 1: Regenerate the cache**

Run: `npm run cache:scores`

Expected: `Wrote scoreboard.json (20 countries, 15 categories)`.

- [ ] **Step 2: Run complete validation**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`

Expected: no lint errors, successful typecheck, all tests passing and successful production build.

- [ ] **Step 3: Review the diff without staging**

Run: `git diff --check && git status --short`

Expected: no whitespace errors and no staging/commit action.
