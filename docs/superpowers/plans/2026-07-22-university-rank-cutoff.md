# University Rank and Tuition Cutoffs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce maximums of 3,200 overall rank and €5,000 non-EU tuition per semester in the German university dataset.

**Architecture:** Delete disallowed JSON rows and update exact data invariants; all UI consumers update automatically from the authoritative dataset.

**Tech Stack:** JSON, TypeScript, Vitest, React/Vite.

## Global Constraints

- Keep only rows with both `overallRank <= 3200` and `nonEuTuition <= 5000`.
- Remove a row when either maximum is exceeded.
- Do not change the schema.
- Do not commit or push.

### Task 1: Add the cutoff invariant

- [x] Update `src/lib/data.test.ts` to assert 27 rows, no rank above 3,200, no tuition above €5,000, and the reduced ownership/open-tag sets.
- [x] Run `npm run test -- --run src/lib/data.test.ts` and confirm it fails against the five disallowed rows.

### Task 2: Remove disallowed rows and stale documentation

- [x] Delete UE, SRH, Hochschule Fresenius, TH Brandenburg and Gisma from `src/data/universities/germany.json`.
- [x] Update dataset methodology/caveats and `docs/research/2026-07-22-berlin-region-universities-expansion.md` to record the cutoff and reduced open-intake inventory.
- [x] Run the focused data and dataset UI tests and confirm they pass.

### Task 3: Verify the complete repository

- [x] Run `npm run cache:scores`.
- [x] Run `npm run lint && npm run typecheck && npm run test && npm run build`.
- [x] Run `git diff --check` and a Node audit for row count, maximum rank, tags and locations.
- [x] Report results without committing.
