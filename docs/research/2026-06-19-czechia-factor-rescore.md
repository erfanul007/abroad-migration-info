# Czechia — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc-CSE / software-AI engineers; MSc → post-study work → PR → citizenship; relocating together.

**Scope:** Sixth country re-scored under the factor model. All 14 categories, 91 factors, scored 0–100 against `categories.json`; derived in `scoring.ts`. Czechia was a full `pending` placeholder.

## Method

- Targeted gov-first WebSearch (deep-research workflow still throttled by org spend limit), leading with the dual-citizenship check.
- **Gov-first sourcing:** mvcr.cz (Interior Ministry), studyin.cz (national portal), mzv.gov.cz (Embassy New Delhi), Charles University, GLOBALCIT, WJP (country profile), Vision of Humanity (GPI), Henley; PwC/Accace (tax), Radio Prague (diaspora). ≥2 sources per decisive claim.

## Decisive finding — NO blocker

- **Dual citizenship retained both ways.** Czechia has allowed multiple nationality since 1 January 2014 (naturalising foreigners keep their origin nationality), and Czechia is on Bangladesh's DNC list → `dual-citizenship-retention` 88, `hasBlocker = false`.

## Key decisive facts (cited in `czechia.json`)

- **Citizenship ~10 years + B1 Czech** (incl. ~5 yrs permanent residence) plus a Czech Life & Institutions exam — slow and language-heavy (though dual is retained, unlike Austria). Henley 2026 7th (~182–183).
- **PSW = 9-month job-seeker** permit → Employee Card / EU Blue Card (offer-based). Short runway; each spouse eligible.
- **PR ~5 years** continuous residence; A2 Czech for PR.
- **Jobs:** Prague IT hub (Red Hat, Microsoft, Honeywell, Avast); ICT +9.6% to 2030; 63% IT firms short; but pay low absolute (~€34–48k SWE; offset by low cost).
- **Study:** CTU Prague / Charles University English CS/AI; moderate tuition; Czech-taught is free; low living costs.
- **Visa (BD lens):** VFS Dhaka lodgement but decided by Embassy New Delhi via a **capacity-constrained email-registration appointment system**; modest funds; annual renewal.
- **Tax:** low **15% flat** income tax (23% above ~€70k); no expat regime; **no confirmed Czech–Bangladesh tax treaty** (BD has only ~36 DTAs).
- **Healthcare:** good once employed (mandatory public VZP; from 1 Jan 2026 the state even covers unemployed Employee-Card holders) — but **non-EU students are excluded from public insurance** and must buy gappy commercial cover (~€280–520/yr).
- **Safety/politics:** GPI 2025 **11th (1.435)**, WJP 2025 **20th** — very safe; but **ANO (Babiš) won the Oct-2025 election** and is courting the far-right SPD, with a consistent anti-EU-migration line.
- **Diaspora (weakest):** Muslims ~**0.2%** (~20,000), **no purpose-built mosque**, scarce halal, essentially no Bangladeshi community, and documented Islamophobia (Brno mosque death-threat graffiti; ~31% of Muslim job-seekers report discrimination).

## Derived result

| Category | Derived | Prior |
|---|---|---|
| job-market | 58.6 | pending |
| visa-access | 49.5 | pending |
| citizenship | 53.9 | pending |
| post-study-work | 57.7 | pending |
| spouse-family | 58.5 | pending |
| msc-study | 63.4 | pending |
| pr-pathway | 58.1 | pending |
| income-cost | 59.2 | pending |
| healthcare | 55.9 | pending |
| culture-language | 46.9 | pending |
| safety-law | 63.4 | pending |
| politics | 43.9 | pending |
| tax | 50.3 | pending |
| muslim-diaspora | 31.6 | pending |
| **OVERALL** | **~55.3** | pending |

**Read:** Czechia is **safe (63.4), cheap (income-cost 59.2) and well-passported** with dual citizenship retained — but it is a **poor fit for a Muslim Bangladeshi couple**. The end-state is dragged down by a near-absent Muslim diaspora and documented Islamophobia (muslim-diaspora 31.6 — the lowest category score recorded across all countries so far), an ANO/SPD anti-migration turn (politics 43.9), the Czech-language burden for daily life and status (culture-language 46.9), a New-Delhi-routed visa with an appointment bottleneck (visa-access 49.5), and a ~10-year citizenship clock (citizenship 53.9). The result lands at **~55.3 — below the 60% inclusion line.**

## Inclusion verdict — DROP CANDIDATE

`hasBlocker = false` (dual retained), but derived overall **~55.3 < 60** → **flagged for dropping; surfaced, not deleted.** Awaiting the user's curation decision.
