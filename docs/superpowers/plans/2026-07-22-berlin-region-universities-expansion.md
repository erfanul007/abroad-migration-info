# Berlin-Region Universities Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the German university shortlist with every verified English-taught, CS-related master's option in Berlin and the established Berlin-commuter city set that accepts international applicants, without changing any existing university row.

**Architecture:** `src/data/universities/germany.json` remains the authoritative, UI-consumed dataset. Each added institution becomes one row, listing all verified qualifying programmes at that institution, its official campus location, a current-intake chip, and sourced admissions facts; existing generic table and map components render them without changes. A dated research scratchpad records an institution-by-institution evidence chain, explicit exclusions, and live-status date.

**Tech Stack:** JSON data, Zod validation, React 19, TypeScript, Vitest, Testing Library.

## Global Constraints

- Do not alter existing university rows or their admissions facts, ranks, locations, tags, links, or `lastReviewed` values.
- Use official university and VBB pages for programme, eligibility, fee, campus, and commute claims.
- Use EduRank 2026 only for the six existing comparative rank columns; label it as a third-party research-output ranking in provenance.
- Retain the current column structure; do not add a commute column that would require editing every established row.
- Include only a currently active, English-taught, CS-related master's programme that accepts international applicants. Split clearly between core CS/AI/security/software options and data/AI programmes with an interdisciplinary or business/policy focus.
- Cover Berlin, Potsdam, Brandenburg an der Havel, Cottbus, Frankfurt (Oder), Eberswalde, Oranienburg, Falkensee, and Bernau bei Berlin; include a campus only when it is physically in one of those places. Record assessed non-matches in the research scratchpad rather than adding them as candidates.
- Include public and private state-recognised institutions; state private tuition prominently in the row's tuition fields and cons.
- Every candidate must have an official campus location source URL, coordinates (an approximate campus-neighbourhood pin is acceptable when an authoritative point is unavailable), and an admission chip determined from the reviewed application evidence: open, upcoming, closed, or verify-current-cycle.
- New factual data must carry links and the dataset and new rows must use `2026-07-22` as `lastReviewed`.
- No commit or push is authorised by this plan.

---

### Task 1: Build an institution-by-institution source-backed research record

**Files:**
- Create: `docs/research/2026-07-22-berlin-region-universities-expansion.md`

**Interfaces:**
- Consumes: official programme/admission pages from BHT Berlin and BTU Cottbus-Senftenberg, VBB RE1 service page, and EduRank 2026 ranking pages.
- Produces: an audit trail for the exact claims inserted in Task 2 and a list of excluded cities/programmes.

- [ ] **Step 1: Write the research record**

  Record, with direct URLs and access date `2026-07-22`:

  For each of BHT Berlin, BTU Cottbus-Senftenberg, TH Brandenburg, Hochschule Fresenius Berlin, University of Europe for Applied Sciences Potsdam, Gisma University of Applied Sciences Potsdam, SRH University Berlin, HTW Berlin, and Hertie School Berlin, record: official legal/provider name; qualifying programme(s); degree and ECTS; language; start semesters; current international application route, deadline, and status; tuition/semester contribution/application fee; academic and language thresholds; complete campus address; map coordinate source; and direct official links.
  - For BHT Berlin record M.Sc. Data Science.
  - For BTU Cottbus-Senftenberg record M.Sc. Artificial Intelligence and M.Sc. Cyber Security.
  - For TH Brandenburg record M.Sc. Interactive Media, including its CS/media-credit and portfolio requirement.
  - VBB's current RE1 corridor and service frequency. State that it proves corridor connectivity, not a permanent door-to-door duration; construction changes require an application-time timetable check.
  - Available EduRank 2026 worldwide positions. Record all six fields only where EduRank exposes a reliable institution/topic match; leave unavailable values blank and explain them rather than estimating. Label these as third-party bibliometric rankings, not admissions evidence.
  - Exclusions: no German-taught-only programme, remote-only programme, or programme outside the specified cities may be added. State the exact official evidence for each assessed city with no qualifying programme. University of Potsdam/HPI, TU Berlin and FU Berlin already have current suitable rows, so they are untouched.

- [ ] **Step 2: Verify every URL is direct and the claims match the linked page**

  Run: `rg -n 'https?://' docs/research/2026-07-22-berlin-region-universities-expansion.md`

  Expected: only direct programme, transport, and EduRank URLs used by Tasks 2–3.

### Task 2: Add all evidence-complete university rows and dataset provenance

**Files:**
- Modify: `src/data/universities/germany.json`

**Interfaces:**
- Consumes: the `columns` already declared in the Germany universities dataset and the evidence recorded in Task 1.
- Produces: complete `DatasetRow` objects for every Task 1 institution that passes all inclusion criteria, each valid under `comparativeDatasetSchema`.

- [ ] **Step 1: Add each verified Berlin campus after the existing Berlin entries**

  Each row must contain:

  Add schema-valid rows for the nine approved candidate ids. Every row must have a sourced overall world rank; prefer EduRank and document a credible fallback when EduRank has no institutional record. Populate subject and numeric fee fields only when supported by evidence. Use the user's approved approximate campus-neighbourhood coordinates where no authoritative point coordinate is published. Intake chips must use only `Summer ’27`, `Winter ’27`, or `No CS intake ’27`; exact uncertainty belongs in the application-window text.

- [ ] **Step 2: Add only the necessary dataset-level provenance**

  Append the official BHT and BTU programme links, the VBB RE1 link, and both EduRank pages to `sources` if not already present. Update the dataset `lastReviewed` to `2026-07-22`; do not alter existing row facts.

- [ ] **Step 3: Run JSON/schema validation**

  Run: `npm run test -- src/lib/data.test.ts`

  Expected: PASS and no Zod validation errors.

### Task 3: Protect the scoped expansion with a regression test

**Files:**
- Modify: `src/lib/data.test.ts`

**Interfaces:**
- Consumes: `getDatasets("germany").universities` loaded through the same data validation path as the app.
- Produces: a regression test that validates the two ids, rank values, current programmes, and source-backed location URL requirement without freezing unrelated existing university facts.

- [ ] **Step 1: Write the failing test**

  Add a test that obtains `const universities = getDatasets("germany").universities!`, builds `new Map(universities.rows.map((row) => [row.id, row]))`, and expects the final approved candidate-id list; for each candidate, verify a non-empty programme string, a valid `location.sourceUrl`, a status tag, and at least two `detail.links`. A separate assertion requires either complete ranks or an explicit missing-EduRank explanation.

  ```ts
  for (const id of candidateIds) {
    const row = rows.get(id);
    expect(typeof row?.values.programs).toBe("string");
    expect(row?.location?.sourceUrl).toMatch(/^https:\/\//);
    expect(row?.detail?.links?.length).toBeGreaterThanOrEqual(2);
  }
  ```

- [ ] **Step 2: Run the focused test to verify it fails before data insertion**

  Run: `npm run test -- src/lib/data.test.ts`

  Expected: FAIL because `bht-berlin` and `btu-cottbus` are absent.

- [ ] **Step 3: Apply Task 2's minimal data change and rerun the focused test**

  Run: `npm run test -- src/lib/data.test.ts`

  Expected: PASS.

### Task 4: Validate the rendered dataset and full quality gate

**Files:**
- Modify: none

**Interfaces:**
- Consumes: all data and existing generic table/map components.
- Produces: verified loading, sorting, map rendering, and production build without UI changes.

- [ ] **Step 1: Run university-focused component tests**

  Run: `npm run test -- src/components/dataset/DatasetTable.test.tsx src/components/dataset/UniversityCompare.test.tsx src/components/dataset/UniversityCompareMap.test.tsx`

  Expected: PASS; the generic components require no change because both new rows use the existing schema.

- [ ] **Step 2: Run the mandatory full quality gate**

  Run: `npm run lint && npm run typecheck && npm run test && npm run build`

  Expected: all commands exit 0; note pre-existing non-blocking warnings separately if present.

- [ ] **Step 3: Inspect the final diff and preserve the no-commit boundary**

  Run: `git diff --check && git diff -- src/data/universities/germany.json docs/research/2026-07-22-berlin-region-universities-expansion.md src/lib/data.test.ts`

  Expected: no whitespace errors; only the two new rows, dataset provenance, research record, and regression test differ. Do not commit or push.
