# German City University Coverage Reconciliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile the German university shortlist with every city already present in the German city scoreboard, adding all newly verified qualifying institutions while documenting cities for which no qualifying local institution exists.

**Architecture:** Keep `src/data/universities/germany.json` as the sole university-data source and preserve its schema. Extend the existing rank exception from Berlin-only rows to qualifying campuses in any already-listed scoreboard city; the nationwide ceiling remains 1,000, while those city-coverage rows may rank up to 3,200. Keep city and university datasets independent so a city without a qualifying local university remains available for employment and commuting analysis.

**Tech Stack:** JSON, Zod-inferred TypeScript data loading, Vitest, React/Vite documentation conventions.

## Global Constraints

- Overall EduRank rank must be `<= 1000` nationwide or `<= 3200` when the qualifying programme campus is in a city already present in the German city scoreboard.
- The qualifying on-campus programme must be completable in English, computing-related, open to applicants with foreign credentials, and charge non-EU tuition no higher than `€5000` per semester.
- Programme, admissions, fees, intake and campus claims require official sources; EduRank is used for overall and available subject ranks.
- Do not invent Summer 2027 or Winter 2027 dates where an institution has not published them; distinguish a published recurring window from a released target-cycle deadline.
- Preserve the existing data schema and use only the existing `Public`/`Private`, `Open`, `Summer ’27`, and `Winter ’27` tag vocabulary.
- Do not remove a city merely because no qualifying local university exists.
- Do not commit or push.

---

### Task 1: Encode the city-coverage contract in tests

**Files:**
- Modify: `src/lib/data.test.ts`

- [x] Add the four approved city-coverage institution IDs to the regional rank-exception set.
- [x] Assert that Frankfurt am Main, Cologne and Leipzig each resolve to at least one qualifying university row.
- [x] Assert that the six researched negative cities remain explicitly uncovered rather than being silently treated as data omissions.
- [x] Run `npm run test -- src/lib/data.test.ts` and confirm the new assertions fail before data changes.

### Task 2: Add fully evidenced university records

**Files:**
- Modify: `src/data/universities/germany.json`

- [x] Add Frankfurt University of Applied Sciences with High Integrity Systems and Information Technology, exact campus pin, available EduRank topics, public ownership, official admission route, current fee evidence and intake status.
- [x] Add University of Cologne with Computational Sciences and Business Analytics and Econometrics, including the natural-science-credit caveat and exact Cologne campus pin.
- [x] Add TH Köln with only the Data and Information Science specialisation taught at Südstadt; do not imply that Gummersbach specialisations are located in Cologne.
- [x] Add Leipzig University with Earth System Data Science and Remote Sensing, explicitly documenting the 35-ECTS domain/data prerequisite and its domain-specialised character.
- [x] Update dataset review date and methodology/caveats where necessary.
- [x] Run `npm run test -- src/lib/data.test.ts` and confirm the coverage assertions pass.

### Task 3: Reconcile research and user-facing documentation

**Files:**
- Modify: `docs/germany-universities.md`
- Modify: `docs/research/2026-07-22-germany-top-1000-universities-scratchpad.md`
- Modify: `docs/research/2026-07-22-berlin-region-universities-expansion.md`

- [x] Replace superseded Cologne, Leipzig and TH Köln exclusions with the verified city-coverage exception decisions.
- [x] Record the 23-city coverage result, including the six cities with no qualifying local institution.
- [x] Record official programme/admission/fee/campus evidence and EduRank links for each new row.
- [x] Keep historical nationwide-top-1,000 decisions distinguishable from the later city-coverage exception.

### Task 4: Regenerate derived data and verify

**Files:**
- Modify if generated: `src/data/cache/scoreboard.json`

- [x] Run `npm run cache:scores`.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run test`.
- [x] Run `npm run build`.
- [x] Inspect `git diff --check`, `git status --short`, and the final diff summary; leave all changes uncommitted and commit-ready.
