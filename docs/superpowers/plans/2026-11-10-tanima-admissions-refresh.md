# Tanima admissions and Germany university refresh

Approved scope: maintainer explicitly requested this repository and directed “proceed now”.

## Goal and approach

Update the existing read-only React SPA, preserving country scoring, rank ordering, campus pins and the five university inclusion gates. Extend only Tanima's optional personal study profile; existing household facts for the other applicant remain unchanged. Update the established Germany university JSON fields/tags, not a parallel dashboard.

Alternative considered: add all discussion institutions directly. Rejected because several fail the English/cost/rank gates. Reconcile every discussed institution in the research ledger and retain only qualifying university rows in the app. Programme variants already researched in this repo (TUM Heilbronn, HAW ICE, Cologne BA&E) must not be overwritten by flagship-only exclusions.

## Order

1. Add failing profile/schema/render tests for the documented academic/language/preferences/offer facts; implement the optional study profile and render it in the existing About page.
2. Import the source-backed programme findings into the matching existing university rows; preserve ranks and programme-campus locations. Label annual vs intake-specific dates and applicant/funding caveats. Never manufacture a currently verified status from an old “Open now” label.
3. Update the admission-tag tests and data to distinguish confirmed Open now, annual-window evidence, future opening, closed, unverified status and funding dependence. Add row review provenance in existing declared text columns so comparisons and expansion work without a new page.
4. Record all 26 discussion candidates, retained alternate programmes, exclusions, unresolved leads and source links under docs/research; update docs/germany-universities.md. No raw personal PDFs, identifiers or unrelated applicant documents copied.
5. Run npm run test, npm run cache:scores, npm run lint, npm run typecheck, npm run build. Start the existing Vite app on loopback and verify HTTP readiness and routes.

## Checks and boundaries

Profile schema must retain the optional data, reject scores outside their stated scales, and keep the other household member unchanged. Status tags must not imply confirmed portal state from a recurring rule; a paid programme must visibly need funding under the applicant's preferences. The existing 61-row census, rank gates and maps remain unless new verified evidence justifies a documented change. Country scores are not being re-researched or changed. No commit, push or public deployment is authorized.

## Verification outcome — 2026-11-10

Completed: optional profile/schema/UI; 20 existing university rows reconciled; all 61 rows retain their ordering, ranks and campus coordinates. The other 41 retain historical evidence with Window unverified. Twenty-six discussion institutions are recorded in the evidence note, including six outside the active census.

`npm run lint`, `npm run typecheck`, `npm run test` (35 files, 194 tests), `npm run cache:scores` and `npm run build` passed. `git diff --check` passed. Headless Chrome rendered `/about` and `/country/germany/universities`; the expected profile, uninspected-offer caveat, admission statuses and funding tags were present. Vite started at http://127.0.0.1:5173. Existing Vite configuration/chunk-size and Node experimental warnings remain.

Limits: no application account/submission or scholarship award was tested; the Ilmenau letter was not supplied; curricular equivalence remains a university decision. Annual/unverified dates remain explicitly labelled. No commit, push or public deployment performed.
