# United Kingdom — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) couple, both ~2022 BSc-CSE / software-AI engineers; MSc → PSW → PR → citizenship; relocating together.

**Scope:** 19th country under the factor model. 15 categories, 82 factors vs `categories.json`; derived in `scoring.ts`. UK was a full `pending` placeholder.

## Method

Targeted gov-first WebSearch (deep-research workflow throttled by org spend limit), dual-citizenship check first. Sourcing: gov.uk, House of Commons Library (2025 White Paper), Imperial College, Levels.fyi, WJP, Henley, Wikipedia (British Bangladeshis). ≥2 sources per decisive claim.

## Decisive finding — NO blocker

- **Dual citizenship retained both ways.** The UK allows dual citizenship and is explicitly on Bangladesh's DNC list → `dual-citizenship-retention` 90, `hasBlocker = false`.

## Key decisive facts (cited in `united-kingdom.json`)

- **Citizenship:** currently ~6 years (5-yr ILR + 1) with native-English ease (only the Life in the UK test). **Policy risk:** the May-2025 White Paper proposes raising ILR to 10 years ('earned settlement') → ~11 years to citizenship; consultation closed Feb 2026, not yet law. Henley 2026 ~**6th (~186)**.
- **PSW = Graduate Route**, 2 years (PhD 3), fully unrestricted — **cut to 18 months from Jan 2027**; switches to Skilled Worker.
- **PR:** Skilled Worker → ILR at 5 years, B1 English (native); same 10-year-ILR risk.
- **Jobs:** London is a top global AI hub (~80% of UK AI demand); SWE £73–142k, AI £64–112k; English-native.
- **Study:** Imperial/UCL/Oxbridge/Edinburgh, world-class 1-year CS/AI master's — but very high tuition (£32–45k) + IHS.
- **Visa (BD lens — a strength):** deep, well-trodden pipeline via UK High Commission + VFS in Dhaka; efficient processing.
- **Spouse-family:** strong work rights on Graduate/Skilled Worker routes — but **taught-master's dependants barred since 2024**, so the couple must each hold a student visa in the study phase.
- **Tax:** to 45% + NI; non-dom abolished 2025; UK–Bangladesh treaty exists.
- **Healthcare:** full NHS access from arrival via the IHS (£1,035/yr), though waits are long.
- **Politics:** stable institutions, but a sharp tightening (White Paper) and **Reform UK's surge** push an anti-immigration/anti-Islam agenda.
- **Diaspora (the highlight):** the **world's largest British-Bangladeshi community (~652,000, Tower Hamlets/Banglatown)** with abundant mosques/halal and the richest South-Asian ecosystem in the West.

## Derived result

| Category | Derived | | Category | Derived |
|---|---|---|---|---|
| job-market | 72.7 | | healthcare | 63.0 |
| visa-access | 60.0 | | culture-language | 77.2 |
| citizenship | 68.7 | | safety-law | 62.5 |
| post-study-work | 69.6 | | politics | 43.3 |
| spouse-family | 68.1 | | tax | 53.5 |
| msc-study | 65.4 | | muslim-diaspora | 74.8 |
| pr-pathway | 61.1 | | **OVERALL** | **~64.8** |
| income-cost | 51.0 | | | |

**Read:** The UK is a top-tier include — **~64.8, 2nd only to Canada**. The English-native + diaspora combination is unmatched: muslim-diaspora 74.8 (BD-community factor 92, the highest with Italy), culture-language 77.2, job-market 72.7 (London AI hub), and a low-friction ~6-year citizenship (68.7). The drags are income-cost 51.0 (high tuition + London housing) and politics 43.3 (Reform UK + tightening). **Caveat:** if the 10-year-ILR proposal becomes law, citizenship (68.7) and pr-pathway (61.1) would fall materially and the overall would drop toward the high-50s — worth re-checking once the consultation outcome is enacted.

## Inclusion verdict — INCLUDE

`hasBlocker = false`; derived overall **~64.8 ≥ 60** → **included**, ranking 2nd (just above Ireland 64.36, below Canada 66.85).
