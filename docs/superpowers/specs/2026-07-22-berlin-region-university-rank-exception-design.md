# Berlin-region University Rank Exception Design

**Goal:** Restore and discover qualifying Berlin-region universities by applying an inclusive overall-rank ceiling of 3,200 inside the established Berlin/commuter geography while preserving the nationwide ceiling of 1,000 elsewhere.

## Inclusion contract

A university qualifies only when all applicable gates pass:

1. Its physical qualifying-programme campus is in Berlin, Potsdam, Cottbus, Brandenburg an der Havel, Frankfurt (Oder), Eberswalde, Oranienburg, Falkensee or Bernau bei Berlin and its overall world rank is `<= 3200`; universities outside that geography remain limited to `overallRank <= 1000`.
2. It offers a current, on-campus, CS-related master's that an international applicant can complete in English. Computing/data methods must be central rather than incidental.
3. The official international route accepts foreign credentials, including the Bangladeshi applicant profile.
4. Mandatory non-EU programme tuition is `<= €5000` per semester. Semester contributions and application charges are recorded separately.

The regional ceiling is not a manual exemption from the other gates. A campus elsewhere does not qualify merely because the institution has an administrative Berlin address or remote delivery.

## Research scope

Revalidate BHT Berlin, BTU Cottbus-Senftenberg and HTW Berlin, which were removed solely by the nationwide rank rule. Re-screen every institution in the approved geography using official university catalogues, DAAD/Hochschulkompass discovery and the existing Berlin-region research ledger. Record explicit failures for rank, tuition, language, programme centrality, delivery mode or international access.

Use official university sources for programmes, curricula, admissions, deadlines, fees, ownership and campus addresses. Use EduRank 2026 for overall and subject ranks when present; a credible ordinal fallback is allowed only when EduRank has no institutional record and must be disclosed. Do not infer unpublished application dates or unavailable subject ranks.

## Data and interface

Keep the current JSON schema and UI unchanged. Restore/add only complete rows in `src/data/universities/germany.json`, including ownership/intake tags, address-level map pin, rank fields, tuition and contribution, programme, international application route, language/academic requirements, applicant checks, narrative and evidence links.

Update the German university methodology, both research ledgers and tests so the two-tier rank rule is explicit. Tests must reject a non-regional row above 1,000, reject every row above 3,200, enforce tuition at most €5,000, and assert the complete retained regional set.

## Verification

Regenerate the score cache and run `npm run lint && npm run typecheck && npm run test && npm run build`, `git diff --check`, and a mechanical audit of every retained row. No commit or push is authorised.
