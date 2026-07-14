# Summer 2027 University Chip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display a `Summer ’27` chip beside eligible university names.

**Architecture:** Store curated row tags in the generic dataset row schema and render them in the existing label cell. Keep eligibility in the researched university dataset instead of parsing prose at runtime.

**Tech Stack:** React, TypeScript, Zod, Vitest, Testing Library, Tailwind CSS.

## Global Constraints

- Render exactly one neutral `Summer ’27` chip for an eligible row.
- Do not label upcoming application windows as currently open.
- Do not add a new table column.

---

### Task 1: Row tag contract and UI

**Files:**
- Modify: `src/lib/schema.ts`
- Modify: `src/components/dataset/DatasetTable.tsx`
- Test: `src/components/dataset/DatasetTable.test.tsx`

- [ ] Add a failing component test with one tagged Summer 2027 university and one untagged winter-only university.
- [ ] Run `npm.cmd test -- src/components/dataset/DatasetTable.test.tsx` and confirm the chip assertion fails.
- [ ] Add optional string-array tags to `datasetRowSchema` and render tags inline in the university label cell.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Germany eligibility data and verification

**Files:**
- Modify: `src/data/universities/germany.json`

- [ ] Add `tags: ["Summer ’27"]` only to universities with a listed Summer 2027 intake and a deadline not passed at the 2026-07-14 review date.
- [ ] Validate the JSON and run the full tests, lint, and production build.
