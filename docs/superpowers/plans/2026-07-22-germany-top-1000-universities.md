# Germany Top-1,000 English CS Universities Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Research and populate a qualifying-only German university census under the EduRank top-1,000, English CS-related programme and €5,000 tuition limits.

**Architecture:** Audit the complete EduRank threshold population into a research ledger before mutating the authoritative JSON. Add or retain only fully evidenced rows, delete failures, then update invariants and documentation consumed by the existing read-only UI.

**Tech Stack:** JSON, TypeScript, Zod, Vitest, React/Vite, official university web sources, EduRank 2026.

## Global Constraints

- The three inclusion gates are conjunctive: `overallRank <= 1000`, a current on-campus CS-related degree completable in English and open to foreign credentials, and `nonEuTuition <= 5000` per semester.
- Use official university sources for programme, curriculum, international admission, tuition, intakes and campus claims; use EduRank 2026 only for ranks.
- Do not create a row with unconfirmed mandatory information or infer an English pathway from isolated English modules.
- Audit existing rows under the same standard and remove every failure.
- Preserve the schema and existing subject-rank values unless current ranking evidence proves them wrong.
- Keep a dated scratchpad with URLs, findings, conflicts and pass/fail reasoning.
- Do not commit or push.

---

### Task 1: Establish the audit ledger and failing invariants

**Files:**
- Create: `docs/research/2026-07-22-germany-top-1000-universities-scratchpad.md`
- Modify: `src/lib/data.test.ts`

- [x] Create the scratchpad with the inclusion contract, field checklist and a section for all 60 EduRank-threshold institutions.
- [x] Add data tests requiring every final row to have `overallRank <= 1000`, `nonEuTuition <= 5000`, one ownership tag, a map location, official detail links and populated programme/admission/tuition fields.
- [x] Run `npm run test -- --run src/lib/data.test.ts`; expect failure because the current data retains four rows ranked above 1,000 and several non-qualifying rows.

### Task 2: Audit ranks 1–20 one institution at a time

**Institutions:** Heidelberg; LMU; TUM; Hamburg; Tübingen; FU Berlin; Bonn; Göttingen; Humboldt Berlin; Freiburg; Cologne; RWTH; FAU; TU Dresden; KIT; Münster; Leipzig; Mainz; TU Berlin; Würzburg.

- [x] For each institution, record EduRank overall/available subject ranks and official programme, English curriculum, foreign-admission, non-EU tuition, intake and campus evidence in the scratchpad.
- [x] Give each institution an explicit `PASS` or `FAIL` with the failed gate named; treat LMU's current Statistics and Data Science programme and TUM's Games Engineering English path adversarially.
- [x] Cross-check every pass with at least two sources, one of which is the official programme/admissions authority.

### Task 3: Audit ranks 21–40 one institution at a time

**Institutions:** Ruhr Bochum; Charité; Kiel; Stuttgart; Marburg; TU Darmstadt; Jena; Giessen; Saarland; Leibniz Hannover; Duisburg-Essen; HHU Düsseldorf; Halle-Wittenberg; Bielefeld; Bremen; Regensburg; Ulm; Goethe Frankfurt; Konstanz; Rostock.

- [x] Complete the same evidence checklist and pass/fail decision for every institution.
- [x] Reject mixed-language programmes unless an official complete English pathway is explicit.
- [x] Audit Halle's economics/data programme against the CSE-background and computing-centrality rules rather than its title alone.

### Task 4: Audit ranks 41–60 one institution at a time

**Institutions:** TU Dortmund; Potsdam/HPI; TU Braunschweig; Bayreuth; Hannover Medical School; Mannheim; RPTU Kaiserslautern-Landau; Greifswald; Magdeburg; Hohenheim; Lübeck; Kassel; Augsburg; Wuppertal; Chemnitz; Oldenburg; Trier; Paderborn; Siegen; Osnabrück.

- [x] Complete the same evidence checklist and pass/fail decision for every institution.
- [x] Audit Hohenheim against the CSE-background and computing-centrality rules.
- [x] Confirm Greifswald's German-language admission prerequisite separately from its English teaching language and document the applicant impact.

### Task 5: Reconcile and populate the authoritative dataset

**Files:**
- Modify: `src/data/universities/germany.json`
- Modify: `docs/research/2026-07-22-germany-top-1000-universities-scratchpad.md`

- [x] Remove existing automatic rank failures: TH Köln, BHT Berlin, BTU Cottbus-Senftenberg and HTW Berlin.
- [x] Remove existing top-1,000 rows whose completed audit is `FAIL`.
- [x] Correct existing rows only where the audit found stale or incorrect information, including LMU if it passes through the current programme.
- [x] Add every new `PASS` row with all existing-schema fields, official links, ownership/intake tags and a sourced or documented approximate campus pin.
- [x] Sort rows consistently by overall rank and run JSON/Zod validation after each coherent cohort.

### Task 6: Update methodology, tests and UI inventories

**Files:**
- Modify: `src/data/universities/germany.json`
- Modify: `src/lib/data.test.ts`
- Modify as required by exact-count assertions: `src/pages/datasets-page.test.tsx`, `src/components/datasets/dataset-toolbar.test.tsx`
- Modify: `docs/research/2026-07-22-berlin-region-universities-expansion.md`

- [x] Replace the 3,200 methodology cutoff with the inclusive 1,000 cutoff and document the strict English-completion and computing-centrality rules.
- [x] Update exact row, tag, ownership, map and intake inventories to the audited result.
- [x] Preserve the old three admission-intake chip categories plus Public/Private ownership tags.
- [x] Run focused data and dataset UI tests; expect all to pass.

### Task 7: Regenerate and verify

**Files:**
- Regenerate: `src/data/cache/scoreboard.json`

- [x] Run `npm run cache:scores`.
- [x] Run `npm run lint && npm run typecheck && npm run test && npm run build` and inspect every exit code.
- [x] Run `git diff --check`.
- [x] Mechanically audit the final JSON for row count, unique IDs, maximum rank, maximum tuition, ownership tags, mandatory values, locations and links.
- [x] Compare the final pass list with the scratchpad so no audited institution is silently omitted.
- [x] Report inclusions, exclusions, changed existing rows and verification results without committing.
