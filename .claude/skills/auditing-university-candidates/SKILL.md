---
name: auditing-university-candidates
description: Use when deciding whether a university belongs in src/data/universities/*.json, adding or removing a university row, re-auditing a previously rejected institution, or answering whether the shortlist missed any candidates.
---

# Auditing University Candidates

Carries only what the repo does not already state unambiguously: the rank-exception scope, the PASS/FAIL precedents, and where the real authority lives.

**`src/lib/data.test.ts` is the authority on row shape.** Read it before adding a row — it defines tag vocabulary, required fields, link minimums, note regexes and map bounds, and it holds hardcoded row counts plus rank-exception allowlists that **every** addition must update in the same change. Never mirror those values from memory, and never edit a researched number to green a test.

## The five gates

| # | Gate | Rule |
|---|------|------|
| 1 | Rank | EduRank **overall** world rank ≤1000 nationwide; ≤3200 via the listed-city exception. Never a subject rank. |
| 2 | Programme | Current, degree-seeking, on-campus, computing-centred, **completable entirely in English**. |
| 3 | Credentials | Admits a foreign (Bangladeshi) CSE bachelor. |
| 4 | Cost | Non-EU tuition ≤€5000/semester. Semester contribution and application fee never count toward it. |
| 5 | Evidence | Official programme + admission + fee + campus + rank links. |

A near-miss is a fail; report the margin. Only the user changes a ceiling.

## The ≤3200 exception applies in every listed city

Any city present in `src/data/cities/germany.json` — **including cities that already have a top-1000 university**. A well-covered city is the usual source of missed candidates, not a reason to skip one.

The dataset `subtitle` still calls this a "Berlin-region" exception. That string is **stale**, contradicted by `methodology` and by existing rows (Frankfurt UAS, TH Köln, Leipzig). Do not treat it as the rule.

## Gate 2 decides most cases

The test is full completability in English **and** no German certificate required for admission.

| Verdict | Basis | Examples |
|---|---|---|
| FAIL | Partial English ("German, further languages English") | Humboldt (75%), Duisburg-Essen (50%), h_da Darmstadt, HM Munich |
| FAIL | German certificate required | HAW Hamburg CS, TH Nürnberg, Goethe Frankfurt |
| FAIL | Economics/management-led | Hohenheim, Halle |
| FAIL | No computing degree | Charité, Hannover Medical School |
| PASS | Adjacent discipline, computing method core | Stuttgart INFOTECH, Cologne Business Analytics |
| PASS | Domain-specialised, needs a domain-credit caveat in the row | Leipzig Earth System Data Science |

Check the institution's **whole** English catalogue before recording a FAIL — a flagship CS master may fail while another programme passes. Prefer the university's own list of fully-English masters over programme-by-programme guessing.

Prior FAILs expire. Re-audit against the current catalogue; record confirmations as explicitly as reversals.

## Sweeping for misses

Cover all three axes and name which you covered: (1) nationwide ≤1000; (2) ≤3200 in every listed city; (3) prior FAILs. An unverifiable candidate is **unresolved** — not a pass, not a fail.

## Red flags

- Using a subject rank for gate 1
- Treating ≤3200 as Berlin-only or coverage-holes-only
- Accepting "taught in English" without checking completability and the German requirement
- Recording FAIL after checking only the flagship CS master
- Counting semester contribution toward the €5000 ceiling
- Adding a row without reading `data.test.ts` for the counts and allowlists it must update
