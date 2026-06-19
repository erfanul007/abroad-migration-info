# Estonia — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc-CSE / software-AI engineers; MSc → post-study work → PR → citizenship; relocating together.

**Scope:** Eighth country re-scored under the factor model. 14 categories, 91 factors, scored against `categories.json`; derived in `scoring.ts`. Estonia was a full `pending` placeholder.

## Method

- Targeted gov-first WebSearch (deep-research workflow throttled by org spend limit), leading with the dual-citizenship check.
- **Sourcing:** politsei.ee (Police & Border Guard Board), studyinestonia.ee, TalTech, University of Tartu, WJP, Henley; Levels.fyi/SalaryExpert (pay), Wikipedia (nationality law / Islam in Estonia). ≥2 sources per decisive claim.

## Decisive finding — BLOCKER

- **Estonia does not allow dual citizenship for naturalised citizens.** A naturalising Bangladeshi must renounce BD nationality → `dual-citizenship-retention` 12, `severity: "blocker"`. Fails the couple's core retain-BD goal (same posture as Austria).
- Naturalisation also needs **8 years** residence (5 on a permanent permit) plus a **B1 Estonian** exam (a hard Finno-Ugric language), a Constitution/Citizenship-Act exam and an oath.

## Key decisive facts (cited in `estonia.json`)

- **PSW = 9-month (270-day)** graduate job-search extension, no employer needed; recent graduates exempt from the salary threshold and UIF permission — practical but short.
- **PR ~5 years** continuous residence, with a B1 Estonian requirement.
- **Jobs:** Tallinn punches above its weight (Bolt, Wise, Skype heritage); SWE ~€48–77k, AI ~€40–72k, strong vs low costs — but Tallinn-only and small.
- **Study:** TalTech/Tartu English CS/AI at low non-EU tuition (~€3–6k/yr); generous student work; Tartu ending non-EU waivers from 2026/27.
- **Tax:** simple flat ~20–22%, world-class digital filing; no expat regime; no confirmed Estonia–Bangladesh treaty.
- **Healthcare:** public once employed (e-health), private insurance during study.
- **Safety/passport:** upper-tier EU rule of law, safe; Henley 2026 ~183 visa-free (strong).
- **Diaspora (weak):** Muslims ~0.7% (~10,000, Tatar/Azeri), **no purpose-built mosque**, limited halal, essentially no Bangladeshi community.

## Derived result

| Category | Derived | Prior |
|---|---|---|
| job-market | 59.6 | pending |
| visa-access | 51.5 | pending |
| citizenship | 38.9 | pending |
| post-study-work | 59.8 | pending |
| spouse-family | 59.8 | pending |
| msc-study | 64.9 | pending |
| pr-pathway | 57.3 | pending |
| income-cost | 61.5 | pending |
| healthcare | 57.9 | pending |
| culture-language | 48.5 | pending |
| safety-law | 65.1 | pending |
| politics | 53.5 | pending |
| tax | 51.0 | pending |
| muslim-diaspora | 35.7 | pending |
| **OVERALL** | **~55.4** | pending |

**Read:** Estonia is a clean, cheap, safe, digital tech state with affordable study and a strong passport — but it fails this couple on the two dimensions that matter most: the **no-dual-citizenship blocker** (citizenship 38.9) and a near-absent Muslim/Bangladeshi community (muslim-diaspora 35.7), compounded by the Estonian-language burden (culture-language 48.5). It lands at **~55.4 — below the 60% inclusion line.**

## Inclusion verdict — DROP CANDIDATE + BLOCKER

`hasBlocker = true` (no dual citizenship) **and** derived overall **~55.4 < 60** → **flagged for dropping; surfaced, not deleted.** Awaiting the user's curation decision.
