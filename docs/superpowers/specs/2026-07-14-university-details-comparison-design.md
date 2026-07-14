# University Details and Comparison Design

## Goal

Extend the Germany universities modal with the same progressive-disclosure and side-by-side comparison behavior as the cities modal, tailored to Tanima Hossain's international-student context: a BSc in CSE, professional software-engineering experience, and interest in English-taught German master's programs strongly related to computer science or engineering.

## Scope

The shortlist may include Computer Science, Informatics, Artificial Intelligence, Machine Learning, Data Science, Software Engineering, Information Systems, Robotics, Embedded Systems, Computational Engineering, and similarly close disciplines. A research rank alone does not make a university suitable: rows without a relevant English-taught program must be clearly flagged.

The feature must not infer Tanima's GPA, IELTS score, German level, exact undergraduate module credits, GRE status, or eligibility. Unknown requirements appear as applicant checks.

## Information Architecture

### Table

The collapsed table remains scan-friendly. It shows the university identity and numeric subject ranks. Descriptive columns—including programs, intakes, application windows, tuition, semester contribution, portal, route, requirements, and student context—move to the expanded row.

### Expanded university profile

Each expandable row groups information into:

1. A short international-student and Tanima-fit summary.
2. An admissions facts grid containing suitable program, intake, application window, tuition, semester contribution, application route, application portal, language, academic prerequisites, and documents or special checks where available.
3. Pros and cons from an international CS/engineering student's perspective.
4. A caution or interpretation note.
5. Official program, admissions, fees, and application links.

Long descriptive answers are only rendered after expansion. Missing information is omitted rather than replaced with invented content.

### Compare tab

The Universities modal gains a Compare tab when at least two rows exist. It contains two mutually exclusive university selectors and defaults to the first two shortlist rows. The comparison is organized into:

- University identity and best-fit program summary.
- Subject ranks, with the lower rank highlighted as stronger and missing ranks shown as an em dash.
- Admissions and cost facts aligned row-by-row.
- Parallel narrative cards with summary, pros, cons, notes, and official links.

Ranks remain ordinal indicators. The UI does not calculate an overall university score or weighted contribution from ranks.

## Data Model

The existing generic dataset schema remains the source of truth. Practical admissions facts use non-rank columns in `row.values`; narrative content uses `row.detail`. No university-specific schema branch is required.

University table behavior changes so rank columns stay in the collapsed table and non-rank columns become expanded context facts. This matches the current score-dataset progressive-disclosure pattern without coupling the generic schema to Germany-only fields.

Recommended context column identifiers are `programs`, `intakes`, `applicationWindow`, `tuition`, `semesterFee`, `applicationRoute`, `applicationPortal`, `language`, `academicRequirements`, and `studentChecks`.

## Content and Accuracy Rules

- Prefer official university and program pages; use DAAD only as a secondary directory or policy source.
- State dates as the published window and qualify them by intake/year where known.
- Use “verify for the selected intake” when a future window is not officially published.
- Separate tuition from mandatory semester contributions.
- Distinguish the web portal from the application route, such as direct application, uni-assist, or VPD plus university portal.
- Mark programs with German-language or mixed-language constraints plainly.
- Fit notes may connect Tanima's CSE/software background to program orientation, but admissions decisions remain conditional on official credit and grade checks.

## Components

- `DatasetTable` owns progressive disclosure for university context columns.
- `UniversityCompare` owns selector state and side-by-side rank, admissions, and narrative presentation.
- `DatasetModal` conditionally exposes `UniversityCompare` for university datasets while retaining the existing city comparison.
- Germany university JSON owns all program-specific facts and source links.

## Interaction and Accessibility

- Selector triggers have explicit accessible names and are not wrapped in labels, preserving the nested Radix portal fix.
- Selecting one university excludes it from the opposite selector.
- Tables have accessible names.
- Expanded facts use semantic definition lists and narratives use headings and lists.
- The dataset modal continues to ignore outside pointer dismissal; Escape and the close button remain available.

## Testing

Component tests cover:

- University non-rank columns moving out of the collapsed table and into an expanded row.
- A university row rendering program, intake, window, fees, portal, pros, cons, and source links after expansion only.
- University Compare tab availability in the real Germany modal.
- Default pair selection, lower-rank highlighting, aligned practical facts, narrative details, and explicit selector accessibility.
- City comparison and university rank sorting remaining unchanged.

The full test suite, production build, schema loading, and diff whitespace check must pass.
