# Ireland — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc-CSE / software-AI engineers; MSc → post-study work → PR → citizenship; relocating together.

**Scope:** Eleventh country under the factor model. 14 categories, 91 factors vs `categories.json`; derived in `scoring.ts`. Ireland was a full `pending` placeholder.

## Method

Targeted gov-first WebSearch (deep-research workflow throttled by org spend limit), dual-citizenship check first. Sourcing: irishimmigration.ie (ISD), citizensinformation.ie, Education in Ireland, WJP (country profile), Vision of Humanity (GPI), Henley, Irish Times/Dept of Finance (housing), KPMG (tax). ≥2 sources per decisive claim.

## Decisive finding — NO blocker

- **Dual citizenship retained both ways** (Ireland allows it; on Bangladesh's DNC list), and crucially **no language or civics test** for naturalisation → `dual-citizenship-retention` 90, `hasBlocker = false`.

## Key decisive facts (cited in `ireland.json`)

- **Citizenship:** 5 years **reckonable** residence in the prior 9 (+12 months continuous), **no language/civics test** — but student (Stamp 2) time is NOT reckonable, so the realistic clock from arrival is ~7 years. Henley 2026 joint **4th (~185)**.
- **PSW = 24-month Stamp 1G** (12+12) for master's graduates, full work, no employment permit; each spouse eligible.
- **PR:** Critical Skills Employment Permit holders reach **Stamp 4 after ~2 years**, no language requirement (ICT clears the salary bar easily).
- **Jobs:** Dublin = EMEA HQ hub (Google, Meta, Apple, Microsoft, LinkedIn); SWE €65–140k, AI €55–103k; English-native — but 2024–25 Big-Tech layoffs.
- **Study:** TCD/UCD English-native CS/AI; non-EU tuition high (~€15–30k); 20 hrs/week work; Government of Ireland scholarships.
- **Visa (BD lens):** online AVATS, modest funds (~€7,000/yr), no Schengen biometrics centre — but no decision-making mission in Dhaka (via New Delhi).
- **Tax:** 40% higher rate from ~€44k + USC + PRSI; narrow SARP relief; Ireland–Bangladesh treaty exists.
- **Healthcare (weak):** two-tier, long public waits, **out-of-pocket GP fees** (no universal free GP), students need private insurance.
- **Safety:** GPI 2025 **2nd**, WJP 2025 **8th (0.82)** — excellent.
- **Cost (the drag):** a severe, structural **housing crisis** (record homelessness, prices up 21 months, projected to last 15+ years).
- **Diaspora:** ~1.6% Muslim; Dublin mosques (the **Clondalkin mosque serves largely Bangladeshis**) and a **Parnell Street** halal/South-Asian hub; no legal restrictions on practice.

## Derived result

| Category | Derived | | Category | Derived |
|---|---|---|---|---|
| job-market | 70.5 | | healthcare | 53.1 |
| visa-access | 55.0 | | culture-language | 74.6 |
| citizenship | 71.7 | | safety-law | 69.9 |
| post-study-work | 73.9 | | politics | 57.8 |
| spouse-family | 65.6 | | tax | 50.9 |
| msc-study | 66.5 | | muslim-diaspora | 58.6 |
| pr-pathway | 66.3 | | **OVERALL** | **~64.4** |
| income-cost | 46.9 | | | |

**Read:** Ireland is a strong include — **2nd only to Canada so far**. The English-native trifecta drives it: post-study-work (73.9, 24-month Stamp 1G + fast Stamp 4), culture-language (74.6, no language test anywhere), citizenship (71.7, dual + no exams), job-market (70.5, Big-Tech HQ hub), and safety (69.9, GPI 2nd). The clear drags are the **housing crisis** (income-cost 46.9 — the lowest of any included country) and a **two-tier health system** (healthcare 53.1).

## Inclusion verdict — INCLUDE

`hasBlocker = false`; derived overall **~64.4 ≥ 60** → **included**, ranking just below Canada (66.85) and above Germany (63.94).
