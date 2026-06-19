# Italy — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc-CSE / software-AI engineers; MSc → post-study work → PR → citizenship; relocating together.

**Scope:** Twelfth country under the factor model. 14 categories, 91 factors vs `categories.json`; derived in `scoring.ts`. Italy was a full `pending` placeholder.

## Method

Targeted gov-first WebSearch (deep-research workflow throttled by org spend limit), dual-citizenship check first. Sourcing: Universitaly, Ministry of Labour migrant report, Politecnico di Milano/Torino, WJP, Henley, Agenzia delle Entrate; ≥2 sources per decisive claim.

## Decisive finding — NO blocker

- **Dual citizenship retained both ways.** Italy has allowed dual citizenship without restriction since 1992, and Italy is on Bangladesh's DNC list → `dual-citizenship-retention` 88, `hasBlocker = false`.

## Key decisive facts (cited in `italy.json`)

- **Citizenship: 10 years** residence (among the EU's longest) + B1 Italian + tax/income history; a **June-2025 referendum to cut it to 5 failed** on turnout. Henley 2026 joint **4th (~185)**.
- **PSW = 12-month** job-search residence permit (any degree, no offer needed); Questura backlogs bite.
- **PR:** EU long-term residence after 5 years + A2/B1 Italian.
- **Jobs:** AI demand surging (Milan +11%); but Italian salaries are low (SWE ~€46k) and hiring is bureaucratic.
- **Study (a standout):** Politecnico di Milano (top-~40 CS, ~45 English MSc) at **income-based tuition ~€1–4k** with generous scholarships; Bologna adds depth.
- **Visa (BD lens — a strength):** full **embassy in Dhaka** + Universitaly pre-enrolment + Italy's deep BD migration pipeline; modest funds, but slow processing.
- **Tax:** heavy wedge (IRPEF to 43% + regional + INPS); impatriate regime now 50% exemption (cut from 70% in 2024); Italy–Bangladesh treaty exists.
- **Healthcare:** SSN universal/low-cost once registered; regional quality variation.
- **Safety:** WJP ~32nd (mid; corruption, slow justice).
- **Politics:** stable but hard-right (Meloni/FdI + League), restrictive and anti-Islam in posture; Islam lacks official religious recognition.
- **Diaspora (the highlight):** **continental Europe's largest Bangladeshi community (~150,000–200,000, Rome-centred)** with a dense halal/BD-business ecosystem — but <10 officially recognised mosques and a politically hostile climate.

## Derived result

| Category | Derived | | Category | Derived |
|---|---|---|---|---|
| job-market | 55.8 | | healthcare | 61.7 |
| visa-access | 57.3 | | culture-language | 50.7 |
| citizenship | 53.3 | | safety-law | 55.0 |
| post-study-work | 59.0 | | politics | 43.7 |
| spouse-family | 62.4 | | tax | 52.0 |
| msc-study | 72.3 | | muslim-diaspora | 60.2 |
| pr-pathway | 53.3 | | **OVERALL** | **~57.2** |
| income-cost | 55.3 | | | |

**Read:** Italy is the **Bangladeshi-diaspora champion** (muslim-diaspora 60.2 — driven by a bangladeshi-diaspora factor of 88, the highest recorded) and offers the **best study value** of the set (msc-study 72.3 — PoliMi top-40 at ~€1–4k). But it lands **below 60**, pulled down by the **10-year citizenship** (53.3), **low salaries/weak tech market** (job-market 55.8), the **Meloni/League anti-Islam climate** (politics 43.7), the Italian-language burden (culture-language 50.7) and bureaucratic PR (53.3). A genuinely conflicted case: warm community, cold institutions.

## Inclusion verdict — DROP CANDIDATE

`hasBlocker = false`; derived overall **~57.2 < 60** → flagged for dropping; surfaced, not deleted. Worth noting for the user: Italy scores worst on the *path* (citizenship/jobs/politics) yet best on *community* — if diaspora weight were higher, it would rank differently.
