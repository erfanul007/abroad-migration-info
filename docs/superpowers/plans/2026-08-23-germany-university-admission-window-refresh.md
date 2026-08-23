# Germany University Admission-Window Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-verify the current admission-opening status of all 59 rows in `src/data/universities/germany.json` against official sources and correct any row whose status/intake-window text has drifted since the dataset's last review (2026-08-11), per the user's explicit request to re-check every German university's admission opening.

**Architecture:** No schema or code change. For each row, cross-check the qualifying programme(s) already on record against the university's own admissions/international-office pages (plus a DAAD detail page where useful) as of today, then update only `tags` (status chip + intake chips), `values.applicationWindow`, `values.semesterFee` (if it changed), and `detail.links`/`detail.note` where the evidence changed. Bump the dataset's top-level `lastReviewed` to the verification date once every row has been checked. Batch the 59 rows into 10 research groups of ~6, each handled by one research subagent with strict sourcing rules, so findings can be recorded independently before a single edit pass applies them.

**Tech Stack:** JSON data store (`src/data/universities/germany.json`), Zod-validated at load (`src/lib/schema.ts`), Vitest gate (`src/lib/data.test.ts`).

**Spec:** None — governed directly by CLAUDE.md's Data-change protocol and by the `researching-migration-evidence` and `auditing-university-candidates` skills (both already loaded this session).

## Global Constraints

- **Sourcing:** official government/university/DAAD pages only. Banned: mygermanuniversity, shiksha, collegedunia, yocket, standyou, mastersportal, globaladmissions, unirank, 4icu, beyondthestates, any blog/forum/SEO content. Cross-check every changed claim against ≥2 independent sources; prefer the most recent official one on conflict and record the conflict.
- **Blocked sites:** a 403/404/bot-interstitial is not a finding. Before giving up, try the faculty/department subdomain, then the DAAD detail page, then the international-office English-programmes catalogue. Only then mark **unresolved** for that row and leave its current value untouched, noting the row as unresolved in the summary.
- **Tag vocabulary (`src/lib/data.test.ts:289-316`):** each row's `tags` must contain exactly one status chip — either the literal `Open now` or a chip matching `/^Opens (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ’(26|27)$/` — plus at least one of `Summer ’27` / `Winter ’27`. Never both a status chip and none, never two status chips. If the status chip is `Open now`, `values.applicationWindow` must contain the substring `Open now` (case-insensitive).
- **Do not weaken existing gates:** do not change `overallRank`, tuition ceiling, or programme/language facts as a side effect of an admission-window edit — those are out of scope for this pass unless the research surfaces a factual error, in which case stop and flag it before editing (data-change protocol: no silent decisions).
- **Provenance:** every changed row gets updated `detail.links` (title + url) reflecting the source(s) actually used for the new status; do not invent or reuse a stale link that doesn't support the new text.
- **`lastReviewed`:** stamp the dataset top-level `lastReviewed` with the date the verification pass actually completes — never a placeholder date.
- **No commit/push** without explicit approval, per CLAUDE.md.

## Row inventory and batching (59 rows, current state as of 2026-08-11 review)

| Batch | Row ids |
|---|---|
| B1 | heidelberg, lmu, tum, hamburg, tuebingen, fu-berlin |
| B2 | bonn, goettingen, freiburg, rwth-aachen, fau, tu-dresden |
| B3 | kit, muenster, tu-berlin, wuerzburg, ruhr-bochum, kiel |
| B4 | stuttgart, marburg, tu-darmstadt, saarland, leibniz-hannover, hhu-duesseldorf |
| B5 | bielefeld, bremen, regensburg, ulm, konstanz, rostock |
| B6 | tu-dortmund, potsdam-hpi, tu-braunschweig, bayreuth, mannheim, rptu-kaiserslautern |
| B7 | greifswald, ovgu-magdeburg, luebeck, kassel, augsburg, wuppertal |
| B8 | chemnitz, oldenburg, trier, paderborn, siegen, osnabrueck |
| B9 | btu-cottbus, htw-berlin, hwr-berlin, bht-berlin, frankfurt-uas, university-cologne |
| B10 | th-koeln, leipzig-university, tuhh, haw-hamburg, fh-dortmund |

Known-stale-risk rows to double-check carefully: `wuerzburg` (currently tagged `Opens Aug ’26`, i.e. this month — likely already open), `luebeck`, `kassel`, `th-koeln` (all tagged `Opens Sep ’26`, i.e. next month — verify the exact published open date hasn't already passed).

---

### Task 1: Research batch B1 (heidelberg, lmu, tum, hamburg, tuebingen, fu-berlin)

**Files:** read-only against `src/data/universities/germany.json`; write findings to `docs/research/2026-08-23-germany-admission-window-refresh.md` (create on first batch, append thereafter).

**Interfaces:**
- Produces: one findings block per row id — `{id, currentTagsInDataset, verifiedStatusTag, verifiedIntakeTags, verifiedApplicationWindow, verifiedSemesterFee?, sources: [{title, url}], changed: bool, unresolved: bool, note}`.

- [ ] **Step 1: Dispatch a research subagent** with this exact brief (substitute the row's existing `values.programs`, `values.applicationWindow`, and `detail.links` from `germany.json` for each id so the agent knows what it's re-checking, not rediscovering from scratch):

  > For each of these Heidelberg/Bavaria/Hamburg-area German universities — heidelberg, lmu, tum, hamburg, tuebingen, fu-berlin — verify the CURRENT (today, 2026-08-23) application-portal status for the specific qualifying English-taught master's programme(s) already on record: [paste each row's `values.programs` + `values.applicationWindow`]. For each: find the university's own admissions/international-office page (or, if blocked, the faculty/CS-department subdomain, then a DAAD detail page) stating whether the portal is open now, or the exact month it opens next, for Summer 2027 and/or Winter 2027/28 intake. Cross-check against a second independent official source before reporting a change. Do not use aggregators (mygermanuniversity, shiksha, collegedunia, yocket, standyou, mastersportal, globaladmissions, unirank, 4icu, beyondthestates) as evidence — discovery only. Report per university: verified status (`Open now` or `Opens <Month> ’<YY>`), verified intake(s) (Summer ’27 / Winter ’27), the exact application-window sentence to use, semester fee if stated, every source URL+title used, whether this differs from the dataset's current text, and mark **unresolved** (do not guess) if you cannot reach an authoritative page after trying the fallbacks.

- [ ] **Step 2: Append the six structured findings to `docs/research/2026-08-23-germany-admission-window-refresh.md` under a `## B1` heading**, one row each, in the `{id, ...}` shape above.

- [ ] **Step 3: Sanity-check the findings against the tag-vocabulary constraint** (exactly one status chip, ≥1 intake chip, `Open now` requires `applicationWindow` to say so) before moving to the next batch. Flag any finding that would violate it instead of recording it as-is.

---

### Task 2: Research batch B2 (bonn, goettingen, freiburg, rwth-aachen, fau, tu-dresden)

**Files:** same as Task 1.

Repeat Task 1's Steps 1–3 for this batch's six ids, appending a `## B2` section to the same findings file.

---

### Task 3: Research batch B3 (kit, muenster, tu-berlin, wuerzburg, ruhr-bochum, kiel)

**Files:** same as Task 1.

Repeat Task 1's Steps 1–3 for this batch. Pay particular attention to `wuerzburg` — its current tag is `Opens Aug ’26`, which is this month; confirm whether the portal has already opened and the status chip must become `Open now`, and get the exact published open date.

---

### Task 4: Research batch B4 (stuttgart, marburg, tu-darmstadt, saarland, leibniz-hannover, hhu-duesseldorf)

**Files:** same as Task 1.

Repeat Task 1's Steps 1–3 for this batch. `marburg` is currently `Open now` — confirm the window hasn't since closed.

---

### Task 5: Research batch B5 (bielefeld, bremen, regensburg, ulm, konstanz, rostock)

**Files:** same as Task 1.

Repeat Task 1's Steps 1–3 for this batch.

---

### Task 6: Research batch B6 (tu-dortmund, potsdam-hpi, tu-braunschweig, bayreuth, mannheim, rptu-kaiserslautern)

**Files:** same as Task 1.

Repeat Task 1's Steps 1–3 for this batch. `tu-braunschweig` is currently `Open now` — confirm the window hasn't since closed.

---

### Task 7: Research batch B7 (greifswald, ovgu-magdeburg, luebeck, kassel, augsburg, wuppertal)

**Files:** same as Task 1.

Repeat Task 1's Steps 1–3 for this batch. `luebeck` and `kassel` are both currently `Opens Sep ’26` — next month; confirm the exact date hasn't already passed relative to 2026-08-23.

---

### Task 8: Research batch B8 (chemnitz, oldenburg, trier, paderborn, siegen, osnabrueck)

**Files:** same as Task 1.

Repeat Task 1's Steps 1–3 for this batch.

---

### Task 9: Research batch B9 (btu-cottbus, htw-berlin, hwr-berlin, bht-berlin, frankfurt-uas, university-cologne)

**Files:** same as Task 1.

Repeat Task 1's Steps 1–3 for this batch. `htw-berlin` is currently `Open now` — confirm the window hasn't since closed.

---

### Task 10: Research batch B10 (th-koeln, leipzig-university, tuhh, haw-hamburg, fh-dortmund)

**Files:** same as Task 1.

Repeat Task 1's Steps 1–3 for this batch. `th-koeln` is currently `Opens Sep ’26` — confirm the exact date hasn't already passed.

---

### Task 11: Apply findings to the dataset

**Files:**
- Modify: `src/data/universities/germany.json`
- Modify (only if a row's status/intake membership changed): `src/lib/data.test.ts` — specifically the hardcoded `idsWith("Open now")` list at the `"classifies researched university intake-tag states"` test, and, only if evidence shows a programme's actual intake availability changed (not just its window date), the `winterOnlyIds` set in `"fully enriches every newly added top-1,000 university row"`.
- Read: `docs/research/2026-08-23-germany-admission-window-refresh.md` (all 10 batch sections)

**Interfaces:**
- Consumes: the findings file produced by Tasks 1–10.

- [ ] **Step 1: For every row marked `changed: true` in the findings file**, update in `germany.json`: `tags` (status chip + intake chips), `values.applicationWindow`, `values.semesterFee` if provided, and `detail.links` (replace/add the entries that back the new text; keep unrelated existing links). Leave rows marked `changed: false` or `unresolved: true` untouched.

- [ ] **Step 2: Update `lastReviewed` at the top of `germany.json` to `2026-08-23`** (or the actual completion date if it slips past that day).

- [ ] **Step 3: If any row's status chip changed to/from `Open now`, update the hardcoded array at `src/lib/data.test.ts` line ~314** (`expect(idsWith("Open now")).toEqual([...])`) to the new, alphabetically-sorted list of ids currently tagged `Open now`.

- [ ] **Step 4: Run `npm run test -- src/lib/data.test.ts` and fix any failure** — most likely the intake-tag classification test (`"classifies researched university intake-tag states"`) or the `winterOnlyIds` assertion if a batch's findings changed which universities offer a Summer intake.

- [ ] **Step 5: Diff-review `git diff src/data/universities/germany.json`** and confirm every changed row's new text is traceable to a source recorded in the findings file. Note any row left `unresolved` in the summary for the user.

---

### Task 12: Full quality gate

**Files:** none (verification only).

- [ ] **Step 1: Run `npm run lint`.** Expected: no errors.
- [ ] **Step 2: Run `npm run typecheck`.** Expected: no errors.
- [ ] **Step 3: Run `npm run test`.** Expected: all suites pass, including the updated `data.test.ts` assertions.
- [ ] **Step 4: Run `npm run build`.** Expected: clean build.
- [ ] **Step 5: Run `git status --short` and confirm only `src/data/universities/germany.json` (and `src/lib/data.test.ts` if Task 11 Step 3 applied) are modified**, plus the new research doc under `docs/research/`. Leave everything uncommitted for the user's review — no commit/push without explicit approval.

- [ ] **Step 6: Report to the user**: how many of the 59 rows changed, how many were confirmed unchanged, how many are `unresolved` (and why), and the new `lastReviewed` date.
