# Berlin-region University Rank Exception Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore and discover qualifying Berlin-region English CS master's options under the approved regional rank ceiling of 3,200.

**Architecture:** Preserve the existing schema and read-only UI. Encode the geographic exception through documented data-selection rules and regression tests, while keeping the nationwide top-1,000 census unchanged outside the approved region.

**Tech Stack:** JSON, TypeScript, Zod, Vitest, React/Vite.

## Global Constraints

- Berlin-region qualifying-programme campus and `overallRank <= 3200`; elsewhere `overallRank <= 1000`.
- English-completable, on-campus, computing-centred master's accepting international foreign credentials.
- Bangladeshi/non-EU tuition `<= €5000` per semester.
- Official university evidence for programme, admission, fee, timeline and campus claims; EduRank 2026 for ranking fields.
- Preserve schema and existing verified rows; do not commit or push.

---

### Task 1: Re-screen the complete Berlin-region institution universe

**Files:**
- Modify: `docs/research/2026-07-22-berlin-region-universities-expansion.md`
- Modify: `docs/research/2026-07-22-germany-top-1000-universities-scratchpad.md`

- [x] Search official catalogues and credible discovery indexes for every approved location.
- [x] Revalidate BHT, BTU and HTW and record every additional candidate's pass/fail reason.
- [x] Cross-check ranks, English completion, foreign-credential access, tuition and physical campus.

### Task 2: Add complete qualifying rows with regression coverage

**Files:**
- Modify: `src/lib/data.test.ts`
- Modify: `src/data/universities/germany.json`

- [x] Write failing tests for the two-tier rank rule and expected regional set.
- [x] Restore/add complete rows with current facts, rankings, timelines, fees, address pins and evidence.
- [x] Run `npm run test -- --run src/lib/data.test.ts` and resolve every failure.

### Task 3: Reconcile methodology and verify end to end

**Files:**
- Modify: `docs/germany-universities.md`
- Modify: `docs/research/2026-07-22-berlin-region-universities-expansion.md`
- Modify: `docs/research/2026-07-22-germany-top-1000-universities-scratchpad.md`

- [x] Replace obsolete universal top-1,000 wording with the two-tier rule.
- [x] Regenerate the score cache with `npm run cache:scores`.
- [x] Run `npm run lint && npm run typecheck && npm run test && npm run build`.
- [x] Run `git diff --check` and mechanically audit rank, tuition, maps, tags and mandatory fields.
