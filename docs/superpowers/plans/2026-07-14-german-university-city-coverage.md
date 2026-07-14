# German University City Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cover all 16 listed German cities with at least one researched English-taught CS-related university option.

**Architecture:** Preserve the generic university dataset shape and append researched rows. Enforce geographic completeness with a data-integrity test based on city labels and university location strings.

**Tech Stack:** JSON, Zod, TypeScript, Vitest, React.

## Global Constraints

- Official university sources govern admissions facts.
- EduRank values are bibliometric indicators, not official admissions rankings.
- Do not invent unavailable subject ranks or unpublished 2027 dates.

---

### Task 1: Geographic coverage regression

- [ ] Add a test in `src/lib/data.test.ts` that compares Germany city labels with university sublabels.
- [ ] Run the focused test and confirm it fails with the uncovered cities.

### Task 2: Researched university rows

- [ ] Extend `src/data/universities/germany.json` with the six qualifying institutions and expand FAU's Nuremberg programme coverage.
- [ ] Include ranks, numeric tuition, programme, intake, application, portal, language, requirements, narrative, pros, cons, and official links.
- [ ] Run the focused integrity test until all cities are covered.

### Task 3: Verification

- [ ] Validate the JSON and count city coverage.
- [ ] Run all tests, lint, and production build.
