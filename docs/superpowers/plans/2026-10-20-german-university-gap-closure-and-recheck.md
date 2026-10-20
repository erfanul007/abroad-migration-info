# German University Gap Closure and Re-check Plan

Status: **approved and executed 2026-10-20 (uncommitted on branch `data/german-university-gap-closure`).**
Evidence date: 20 October 2026. Rank edition: EduRank 2026 (updated 15 March 2026).
Working ledger and raw agent output: session scratchpad `uni-audit/ledger.md` (not committed).

## Goal

Bring `src/data/universities/germany.json` (59 rows) in line with current official sources: add the verified
missing candidates, fix the row that now fails the tuition gate, and correct stale fee and language data found
by re-checking every existing row.

## Sweep coverage

1. Nationwide ≤1,000: EduRank lists exactly the 60 institutions already audited; no rank changes.
2. ≤3,200 in listed cities: Munich, Nuremberg, Stuttgart, Karlsruhe, Berlin, Potsdam, Hamburg, Hannover,
   Frankfurt, Darmstadt, Cologne, Düsseldorf, Aachen, Dortmund, Dresden, Leipzig. Cottbus and the six small
   Brandenburg cities were not re-swept (audited July 2026).
3. Prior FAILs re-audited against current catalogues: HM, TH Nürnberg, HKA, Humboldt, Charité, FH Potsdam, MHH,
   Goethe, h_da, FH Aachen (was unresolved), Mainz, Jena, Giessen, Duisburg-Essen, Halle, Hohenheim. All
   still fail except FH Aachen and Giessen (see below).

## Decisions already made by the user

- TUM: switch to M.Sc. Information Engineering (Heilbronn).
- Add HFT Stuttgart, FH Aachen, Giessen Agrobioinformatics; add Medical Informatics to the FH Dortmund row.
- Remove Greifswald (German DSH-1 required to apply).
- Keep Bayreuth and RPTU Kaiserslautern with a visible study-German caveat.
- Keep Göttingen and LMU with caveats.
- Re-check all existing rows (done).

## Changes

### A. New rows (3) — all pass; row count 59 → 61 with Greifswald removed

| id | Institution | EduRank | Gate path | Programme | Key facts (all verified from official pages) |
|---|---|---|---|---|---|
| `hft-stuttgart` | HFT Stuttgart | 2,323 | Stuttgart listed-city exception | M.Sc. Software Technology | All courses English; no German (DAAD: none); ≥210 ECTS CS-related; IELTS 6.5 / TOEFL; direct electronic application; €1,500 BW non-EU fee; €180.50–€192.50 semester fee (stale, June 2024); deadlines 31 Aug (summer, extra round 15 Jan) and 28 Feb (winter, extra round 15 Jul); Schellingstr. 24, 70174 Stuttgart |
| `fh-aachen` | FH Aachen | 1,318 | Aachen listed-city exception | M.Sc. Information Systems | English throughout ("possible to study the entire programme in English"); no German proof; GRE or transcript for non-EHEA degrees; applicant mark ≤1.90; IELTS 6.5 (6.0 per band) / TOEFL 92; direct portal, no uni-assist; non-EHEA windows usually 15–31 May and 15–30 Nov; no tuition; €384.60 semester fee; Eupener Str. 70, 52066 Aachen |
| `giessen` | University of Giessen | 331 (CS 565, AI 689, ML 714, DS 791, SWE 1,009) | Nationwide ≤1,000 | M.Sc. Agrobioinformatics | Entire degree English; CS/Data Science/Bioinformatics bachelors named; C1 English; uni-assist; winter only, 1 May–15 Jun (2027 dates due spring 2027); no tuition; €421.43 semester fee; Heinrich-Buff-Ring 26, 35390 Gießen |

Caveats to carry in each row (not hide):
- FH Aachen: business-and-computing mix; some computing electives are German-only; GRE plus 1.90 mark is a
  real hurdle; 2027 windows inferred from "usually" dates, not published.
- Giessen: crop-science degree, roughly half the core is computational; domain caveat like Leipzig's. Admission
  panel reviews foreign degrees case by case.
- HFT: central Campusportal was down after an IT incident; confirm the direct route still works.

### B. TUM row (`tum`) — rewrite on a new programme

Games Engineering fails gate 4 (€6,000/semester per TUM's page; also "German or English by focus area").
Replace with M.Sc. Information Engineering, TUM Campus Heilbronn (Bildungscampus 2, 74076 Heilbronn):
- English only, no German; computing-centred (ML, software engineering, GPU/parallel, chip design electives).
- Foreign bachelor admitted via curriculum check (≥61 informatics credits, 36 maths); GRE or GATE mandatory
  for Bangladesh; uni-assist VPD; English TOEFL 88 / IELTS 6.5; €97 semester contribution.
- Windows: summer 2027 **1 Oct–30 Nov 2026 (open now)**; winter 2027/28 1 Feb–31 May 2027.
- Tuition: DAAD says "None"; TUM's page has no tuition section while every fee-charging TUM page has one; the
  fee annex lists all other Heilbronn programmes as "keine Gebühr". **No explicit TUM statement exists.**
  Row must say so. Pre-execution step (user): ask ie-master@hn.cit.tum.de for a one-line confirmation.
- `nonEuTuition` 4000 → 0; map pin Garching → Heilbronn; summary, pros/cons, links replaced. TUM fees rise to
  €4,600/€6,800 from winter 2027/28 for fee-charging programmes; this programme is not expected to be affected.

### C. Removal

- `greifswald` — fails gate 2 (German DSH-1/B2 to apply). Remove row; remove the matching caveat sentence
  ("Greifswald's Data Science programme … requires German DSH-1/B2"); record the removal in methodology.

### D. Field changes on existing rows (from the re-check)

| Row | Change |
|---|---|
| `fau` | `nonEuTuition` 0 → **4000** (AI, Computational Engineering, International Information Systems; applies to non-EU students enrolling from summer 2027); semester fee €140 → €82; add €100 application fee for non-EU applicants from winter 2026/27; add GRE requirement for AI; Computational Engineering language unverified (no fau.eu degree page found) |
| `wuerzburg` | AI & Extended Reality closed (last intake winter 2026/27) → remove from programmes; keep M.Sc. Computer Science (German or English; mandatory courses offered in both). Note unresolved Bavarian fee signal (€2,500 appeared, looks LL.M.-only) |
| `goettingen` | language "mainly English"; two specialisations (Digital Business Administration, Physical Modelling and Data Analysis) may have mandatory German-taught courses; semester fee ≈€460 (DAAD figure) |
| `lmu` | caveat: admission needs a degree in or with a major/minor in statistics/data science plus aptitude test; a plain CSE bachelor may not qualify. Semester fee €97 (Aug 2026) |
| `kiel` | watch note: university is "preparing to make changes … to include some level of German"; recheck before 2027 intakes |
| `bayreuth` | caveat: German A1 within first year (institute) / end of second semester (PDF); English proof letters not accepted |
| `rptu-kaiserslautern` | semester fee ≈€320 → €381.80; caveat: German A1 course or A2 certificate within first year |
| `kassel` | add GRE requirement (min Quant 160, Verbal 155, Writing 3.5) for non-EU bachelors; replace two dead links; deadlines summer 2027 1 Sep 2026–15 Jan 2027, winter 2027/28 1 Mar–15 Jul 2027; semester fee €409.27 probable (undated) |
| `paderborn` | add GRE/dMat requirement (waivable below 1.8); German grade 3.0 or better; medium-of-instruction certificate not accepted |
| `oldenburg` | semester fee €223 → €457.90 |
| `osnabrueck` | semester fee ≈€350 → €459.30 (from a search result; page fetch showed no figure) ; replace dead link |
| `bremen` | semester fee €425.40 → €443.40 (the €425.40 was the summer 2026 figure) |
| `bielefeld` | semester fee €333.65 → €351.65 |
| `tu-berlin` | semester fee → €379.06; language resolved (English, B2); 2027 windows added |
| `tu-darmstadt` | semester fee → €402.68; language "Teaching language: English", C1 |
| `tu-dresden` | semester fee → €361 (search-summary figure); GRE strongly recommended |
| `leibniz-hannover` | semester fee → €453.16; English-only route needs C1 English |
| `hhu-duesseldorf` | semester fee → €371.15; foreign bachelor needs 30 ECTS maths (Analysis I/II, Linear Algebra I, Stochastics I), converted grade 2.5 or better |
| `freiburg` | semester fee → €190 |
| `hwr-berlin` | semester fee €363.77 → €379.77; add 210-credit note (180-ECTS applicants earn 30 more, four semesters) |
| `fh-dortmund` | replace two dead links; add M.Sc. Medical Informatics (English, no tuition, C1 English, applications 1 Mar–15 Jun and 1 Sep–15 Dec; enrol at FH Dortmund) with **gate 3 caveat**: expects prior computing and medical competence, plain CSE decided case by case |

Rows whose official sources I could not fetch directly (figures came from search summaries or DAAD) are marked
below. They must be recorded in the cell as unverified rather than stamped as verified:
Osnabrück fee, Kassel fee, TU Dresden fee, TU Berlin fee, RWTH fee (€298.06 is summer 2025), Göttingen fee,
TU Dortmund language/fee (programme page truncated), Lübeck €400.60 semester figure.

### E. Confirmed unchanged (39 rows)

heidelberg, hamburg, tuebingen, fu-berlin, bonn, rwth-aachen, kit, muenster, ruhr-bochum, stuttgart, marburg,
saarland, regensburg, ulm, konstanz, rostock, tu-dortmund, potsdam-hpi, tu-braunschweig, mannheim,
ovgu-magdeburg, luebeck, augsburg, wuppertal, chemnitz, trier, siegen, btu-cottbus, htw-berlin, bht-berlin,
frankfurt-uas, university-cologne, th-koeln, leipzig-university, tuhh, haw-hamburg, plus the confirmed rows
carrying dead links to repair (Regensburg fees link, Konstanz programme link, Augsburg international link,
Ruhr Bochum programme link). Tuition for Baden-Württemberg rows already carries 1,500.

### F. Remain excluded (record in the research doc)

HM, TH Nürnberg, UTN (unranked), HdM, Hohenheim, HKA, UniBw München, Humboldt, Charité, UdK, FH Potsdam, HSU
Hamburg, HCU (#4,397), MHH, TiHo, Hochschule Hannover, Goethe, h_da, HSD, DSHS, HTW Dresden (#7,378), HTWK
Leipzig, Leipzig Informatik/Data Science (German, partly English), Mainz, Jena, Duisburg-Essen, Halle.
TUHH M.Sc. Computer Science stays unclaimed (TUHH advises visa-needing applicants to choose another programme).

### G. Leads, not added

- TH Köln Communication Systems and Networks (Deutz): "primarily English", completability unconfirmed.
- TUM AI in Society: fails gate 2 and 3 in practice (about 22% computing; social-science prerequisites).
- Software Engineering Elite (TUM/LMU/Augsburg): applies and enrols at Augsburg; needs its own audit.
- TU Braunschweig Computational Sciences in Engineering: German skills listed with no level; Data Science alone
  carries the row.

## Test and gate changes (`src/lib/data.test.ts`)

Authority on shape; update in the same change. Do not edit a researched value to green a test.
- Row count 59 → **61** (both occurrences) — 59 − Greifswald + HFT, FH Aachen, Giessen.
- `listedCityRankExceptions` and `regionalRankExceptions`: add `hft-stuttgart`, `fh-aachen`.
- `newIds`: remove `greifswald`, add `giessen`; remove `greifswald` from `winterOnlyIds`; add `giessen`
  (winter only).
- `regionalIds`: add `hft-stuttgart`, `fh-aachen`.
- "Open now" id list: TUM's summer window is open today, so `tum` joins it; other rows' status chips were last
  verified 5 September and are **not** re-verified here (see Risks).
- uni-assist rows need a positive `applicationFee` (Giessen, TUM); HFT and FH Aachen apply directly.
- Also: dataset `caveats` (drop Greifswald, add TUM, FAU, Bayreuth/RPTU, Göttingen/LMU notes), `methodology`
  tuition sentence, `subtitle` if needed, `sources` additions, dataset `lastReviewed`.

## Docs to update

- `docs/germany-universities.md`: snapshot date, row count, TUM and FAU notes.
- New research record `docs/research/2026-10-20-german-university-gap-closure.md` from the scratchpad ledger
  (sweep axes, PASS/FAIL ledger with URLs, unverified items).
- Run `npm run cache:scores` only if scoring inputs change (they should not: this dataset is independent).

## Risks and open items

1. **Intake and status chips are stale.** Today is 20 October; the "Open now" and "Opens …" chips were set on
   5 September and application windows have moved. The re-check agents did not verify portal state. Options:
   (a) leave chips and state their verification date; (b) a separate portal-state refresh pass over all rows.
   Recommend (b) as its own change after this one.
2. **TUM no-tuition claim is indirect** until TUM answers by email; row must carry that wording.
3. **FAU summer 2027 intake is charged**; applicants from outside the EU already pay from the first enrolment
   after that date, so the €4,000 figure is the planning number.
4. **GRE requirements** now appear at FAU (AI), Kassel, Paderborn, Konstanz, KIT, RWTH, FH Aachen and TUM
   Heilbronn. Worth a dedicated applicant-checks line on each row.
5. **Unverified figures** listed in section D must not be recorded as verified.
6. Rank gate not re-verified for the 58 existing rows (only for ≤1000 list completeness); ranks unchanged by
   the nationwide check.

## Order of work

1. Approve this plan (and say whether to send the TUM email first).
2. Update `data.test.ts` expectations to the target state; run — expect failures.
3. Edit `germany.json`: remove Greifswald, rewrite TUM, add three rows, apply section D edits, update
   dataset-level fields. Pin coordinates for the new rows from OpenStreetMap with `sourceUrl`.
4. `npm run test` → `npm run lint && npm run typecheck && npm run test && npm run build`.
5. Update docs; propose commit (`data: ...`) for approval — no commit or push without approval.
