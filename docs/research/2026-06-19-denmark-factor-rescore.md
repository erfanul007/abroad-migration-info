# Denmark — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc-CSE / software-AI engineers; MSc → post-study work → PR → citizenship; relocating together.

**Scope:** Seventh country re-scored under the factor model. All 15 categories, 82 factors, scored 0–100 against `categories.json`; derived in `scoring.ts`. Denmark was a full `pending` placeholder.

## Method

- Targeted gov-first WebSearch (deep-research workflow throttled by org spend limit), leading with the dual-citizenship check.
- **Gov-first sourcing:** nyidanmark.dk/SIRI, borger.dk (Life in Denmark), studyindenmark.dk, DTU, Skat (tax agency), WJP (country profile), Vision of Humanity (GPI), Henley; PwC (tax), Migration Policy Institute (policy). ≥2 sources per decisive claim.

## Decisive finding — NO blocker

- **Dual citizenship retained both ways.** Denmark has allowed dual citizenship since September 2015 (no renunciation), and Denmark is on Bangladesh's DNC list → `dual-citizenship-retention` 88, `hasBlocker = false`.

## Key decisive facts (cited in `denmark.json`)

- **PSW is best-in-class:** since the 2023 reform, a Danish bachelor/master/PhD graduate gets a **3-year work permit without limitations, no job offer required**, family may accompany — on par with Canada. Each spouse eligible.
- **Citizenship is among Europe's hardest:** **9 years** residence, **B2 Danish** (Prøve i Dansk 3), citizenship test, 2 years self-sufficiency, granted by parliamentary act. Henley 2026 **3rd (~186)**.
- **PR ~8 years** (reducible to 4 only with strong employment + integration), Danish-language + self-support.
- **Jobs/money:** SWE Copenhagen ~DKK 600–880k, AI ~DKK 600k–1m+; high tax (~57%, 60.5% with labour-market tax); the **27% researcher scheme** exists but its ~DKK 65,400/month (~€105k/yr) threshold is largely out of reach for new graduates.
- **Study:** most master's in English (DTU/KU/AU, strong CS/AI); non-EU tuition high (DTU ~€30k/2yr); ~20 hrs/week work; qualifies for the 3-yr PSW.
- **Visa (BD lens):** VFS Denmark VAC in Dhaka (SIRI decides); funds ~DKK 100,000/yr + tuition; 2–3 month processing.
- **Healthcare:** **CPR registration → immediate free universal care** (a clear strength).
- **Safety/rule of law:** WJP 2025 **#1 worldwide**, GPI 2025 **8th** — top-tier.
- **Politics/diaspora (the drag):** Social-Democrat government runs **Europe's most restrictive migration regime** — 'zero asylum', revocable protection, **'parallel society'/ghetto laws keyed to 'non-Western' origin**, an expanding **burqa/niqab ban**, and recurrent **Quran-burnings** (170+ anti-Muslim protests in a month; condemned by Bangladesh). Muslims ~5.1% with 150+ mosques and good halal, but a hostile legal/sentiment climate.

## Derived result

| Category | Derived | Prior |
|---|---|---|
| job-market | 65.7 | pending |
| visa-access | 51.2 | pending |
| citizenship | 47.7 | pending |
| post-study-work | 79.5 | pending |
| spouse-family | 62.6 | pending |
| msc-study | 66.3 | pending |
| pr-pathway | 49.5 | pending |
| income-cost | 53.7 | pending |
| healthcare | 75.3 | pending |
| culture-language | 51.4 | pending |
| safety-law | 65.0 | pending |
| politics | 43.9 | pending |
| tax | 47.7 | pending |
| muslim-diaspora | 45.3 | pending |
| **OVERALL** | **~59.0** | pending |

**Read:** Denmark is the sharpest split yet — **structurally world-class** (PSW 79.5, healthcare 75.3, safety-law 65.0 with WJP #1, job-market 65.7, msc-study 66.3) yet **a poor fit for this specific profile**. The drag is concentrated where it matters most to a Muslim Bangladeshi couple seeking citizenship-with-retention: a 9-year/B2 naturalisation (citizenship 47.7), an 8-year PR (pr-pathway 49.5), the most explicitly anti-non-Western-Muslim politics in Europe (politics 43.9), a Quran-burning/burqa-ban climate (muslim-diaspora 45.3) and high tax with out-of-reach expat relief (tax 47.7). It lands at **~59.0 — just below the 60% inclusion line.**

## Inclusion verdict — DROP CANDIDATE (marginal)

`hasBlocker = false` (dual retained), but derived overall **~59.0 < 60** → **flagged for dropping; surfaced, not deleted.** This is a genuinely close call — a top-tier country pulled under the line by the citizenship/PR difficulty and an openly hostile integration-politics climate for the applicant profile. Worth the user's explicit curation decision.
