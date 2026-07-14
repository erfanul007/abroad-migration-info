# University Global Rank, Tuition, and Intake Calendar Design

## Goal

Improve the Germany university shortlist with decision-ready global ranking, non-EU tuition, intake month, and application-period information verified from appropriate sources through calendar year 2027.

## Visible table fields

The compact university table adds two sortable numeric fields:

- `Overall world rank`: the university's EduRank global position. Lower is better.
- `Non-EU tuition / semester`: programme-specific non-EU tuition in euros. Tuition-free programmes use numeric `0`. Lower is better.

These fields are intentionally visible alongside the existing subject ranks. All other number/text context remains in the expanded row. Tuition excludes semester contributions, application fees, deposits, and living costs.

## Expanded admissions calendar

Each university's expanded facts include:

- International intake names and teaching-start months, limited to currently available or upcoming starts no later than December 2027.
- An application-period entry for each intake, formatted with intake indication and explicit start/end dates when officially published.
- Separate identification of compulsory deadlines, recommended visa deadlines, uni-assist/VPD lead time, and programme-specific windows.

Example display:

`Winter 2027 · October start`

`Winter 2027 · 1 February 2027–31 May 2027 (compulsory); apply by 31 March for visa planning`

The UI does not infer a 2027 date from an older cycle. When 2027 dates are unpublished, it says `Not yet published` and may add an explicitly labelled recurring official pattern if the official source states one. No 2028 intake is included.

## Data semantics

- `overallRank` is a `rank` column sourced from EduRank's university overview, not a government ranking.
- `nonEuTuition` is a `number` column with `unit: "€"` and represents euros per semester for the specifically shortlisted programme.
- `intakes` and `applicationWindow` remain descriptive text fields because universities can have multiple programmes and windows.
- `semesterFee` remains a separate context field.
- Existing narrative tuition notes remain available for exemptions, state rules, and announced future changes.

If a university has no suitable English programme, tuition still reflects the institution's relevant public-study policy only when officially verifiable, while the row remains clearly unsuitable. A programme-dependent fee that cannot be represented honestly as one number is not guessed; the selected programme or active shortlist status determines the value.

## Source hierarchy

- Overall global rank: EduRank university page or EduRank global ranking dataset, with snapshot date.
- Tuition: official programme fee page first; official university fee page second; official state policy page third.
- Intakes and application periods: official programme/admissions page or official application portal.
- DAAD and uni-assist may corroborate policy or route but do not override programme-specific official information.

Each row includes official links supporting fees and admissions timing. Dataset methodology discloses that EduRank is bibliometric and not an official accreditation or government ranking.

## Table and comparison behavior

`DatasetTable` introduces a small university-visible-field rule: rank columns plus `nonEuTuition` remain compact; other fields stay expanded. The tuition cell formats zero as `€0` and positive values with thousands separators.

`UniversityCompare` includes overall global rank and tuition in aligned comparison rows. Lower rank and lower tuition are visually emphasized. Intake months and application periods remain in the admissions comparison table.

## Testing

- Unit test the compact-field rule, euro formatting, and numeric tuition sorting.
- Test that intake months and application start/end dates remain hidden until expansion.
- Test overall rank and tuition in the university comparison, including `€0` and lower-value emphasis.
- Integration-test real TUM data for global rank, €6,000 tuition, intake month, and dated winter/summer application periods.
- Validate all JSON through the existing schema/data tests.
- Run the full test suite, production build, and `git diff --check`.

## Accuracy constraints

- Research scope ends at 31 December 2027; no 2028 intake is presented.
- A winter intake beginning in October 2027 is labelled `Winter 2027` in the interface even if an official academic-year page uses `2027/28`; no separate 2028 start is implied.
- Dates are never silently projected.
- Tuition values never include semester contributions.
- `€0` means no tuition, not zero total study cost.
