# Austria — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc-CSE / software-AI engineers; MSc → post-study work → PR → citizenship; relocating together.

**Scope:** Fourth country re-scored under the factor model (after Australia pilot, Germany, Canada). All 15 categories, 82 factors, each scored 0–100 against its rubric in `categories.json`; category and overall scores derived in `scoring.ts`. Austria previously sat as a full `pending` placeholder.

## Method

- The deep-research workflow remains throttled by the org monthly spend limit, so Austria was researched entirely via **targeted gov-first WebSearch** (the lighter method that has worked since Germany), leading with the decisive **dual-citizenship** check before scoring.
- **Gov-first sourcing:** oesterreich.gv.at, migration.gv.at, BMEIA (Austrian MFA / Embassy New Delhi), TU Wien / University of Vienna, ÖEAD/ÖGK, OECD Taxing Wages 2025, WJP, Vision of Humanity (GPI), Henley; PwC, study.eu, Wikipedia (election/Islam overviews) and ABA (workinaustria.com, the official investment-agency portal) where no single gov EN page carried the figure. ≥2 independent sources per decisive claim.

## Decisive finding — BLOCKER

- **Austria does not permit dual citizenship.** Standard naturalisation requires renouncing prior nationality within two years; the only waiver is §10(6) "extraordinary achievement" (inapplicable to this profile). A naturalising Bangladeshi therefore **loses BD nationality** → `dual-citizenship-retention` 12 with a `severity: "blocker"` con. This directly fails the couple's stated retain-BD goal and is consistent with the repo's existing flag for no-dual-citizenship countries.
- **Naturalisation is also slow and demanding:** 10 years' continuous residence (5 on a permanent permit), **B2 German** (raised from B1 under the 2025–29 government programme), history/values exam, and 36 months of self-sufficient income in the last 6 years.

## Key decisive facts (cited in `austria.json`)

- **PSW is short:** 12-month student-permit extension to job-search → Red-White-Red Card for graduates (no points, offer-based, deterministic). Shorter runway than Canada (3 yr) or Germany (18 mo).
- **PR ~5 years:** RWR Card → RWR Card Plus (after 21 months) → long-term residence-EU at 5 years, but requires **B1 German** (Integration Agreement Module 2) and strict absence limits (≤10 months total / ≤6 consecutive).
- **Study is cheap:** non-EU public tuition only **~€726.72/semester (~€1,453/yr)**; 350+ English-taught programmes, 32 CS/IT master's (TU Wien ~QS 197, Univ. Vienna ~QS 152). But non-EU **student work needs an employer-applied permit** (~20 hrs cap, bureaucratic).
- **Jobs:** software/data-processing on the **2026 shortage list** (64 occupations; 272k unfilled, 78% of firms short); SWE ~€53–83k (Vienna ~€63–69k), AI premium — but Vienna-centric and German-gated outside MNCs.
- **Visa (BD lens):** VFS lodgement in **Dhaka**, but the student residence-permit **decision is made by the Austrian Embassy in New Delhi**; funds ~€12,000/yr; ~15 working-day processing; no BD-specific targeting.
- **Healthcare is a strength:** compulsory insurance, **no waiting period** — students self-insure ~€78.84/mo, employees covered day one.
- **Tax is heavy:** OECD wedge **47.1% (4th-highest, 2025)**, 58.3% marginal for high earners, no expat regime, and **no Austria–Bangladesh tax treaty** in force (negotiations only authorised July 2024).
- **Safety/passport:** GPI 2025 **4th**, WJP 2025 **12th (0.79)**, Henley 2026 **joint 4th (185)** — excellent (but the passport is only reachable by renouncing BD).
- **Politics/diaspora:** far-right **FPÖ won the Sept-2024 election (29.2%)** on "Fortress Austria"/"remigration" (excluded from the ÖVP–SPÖ–NEOS coalition formed 2025); Islam is the largest minority religion (8.3%), legally recognised since 1912, with 200+ Vienna mosques and abundant halal, but a **small** Bangladeshi community and a strained sentiment climate.

## Derived result

| Category | Derived | Prior |
|---|---|---|
| job-market | 62.0 | pending |
| visa-access | 52.5 | pending |
| citizenship | 29.8 | pending |
| post-study-work | 60.5 | pending |
| spouse-family | 59.5 | pending |
| msc-study | 71.6 | pending |
| pr-pathway | 57.1 | pending |
| income-cost | 57.5 | pending |
| healthcare | 72.9 | pending |
| culture-language | 46.8 | pending |
| safety-law | 68.9 | pending |
| politics | 44.5 | pending |
| tax | 41.9 | pending |
| muslim-diaspora | 53.7 | pending |
| **OVERALL** | **~56.1** | pending |

**Read:** Austria is objectively an excellent country — healthcare (72.9), msc-study (71.6, near-free tuition), safety-law (68.9, GPI 4th) and job-market (62.0, shortage-listed) all score well — but it is a **poor fit for *this* profile and goal**. The end-state is gutted by the **no-dual-citizenship blocker** (citizenship 29.8), the pervasive German-language burden (culture-language 46.8: B1 for PR, B2 for citizenship), the FPÖ-amplified hostile climate (politics 44.5) and the OECD's 4th-highest tax wedge with no BD treaty (tax 41.9). The result lands at **~56.1 overall — below the 60% inclusion line.**

## Inclusion verdict — DROP CANDIDATE

`hasBlocker = true` (no dual citizenship) **and** derived overall **~56.1 < 60**. Per the curation policy (drop <60; flag no-dual-citizenship countries), Austria is **flagged for dropping — surfaced, not deleted.** Awaiting the user's decision on whether to drop the file or retain it as a scored-but-excluded reference.
