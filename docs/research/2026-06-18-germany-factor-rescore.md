# Germany — factor-level re-score — 2026-06-18

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc-CSE / software-AI engineers; MSc → post-study work → PR → citizenship; relocating together.

**Scope:** Second country re-scored under the factor model (Australia was the pilot). All 14 categories, 91 factors, each scored 0–100 against its rubric in `categories.json`; category and overall scores derived in `scoring.ts`. Germany previously sat as a full `pending` placeholder (no hand-set baseline to compare against).

## Method

- **One `deep-research` workflow** (gov-first), 5 angles, 26 sources fetched → 88 claims → 25 adversarially verified (3-vote, need 2/3 to kill): 20 confirmed, 5 killed. 108 agents, ~3.4M tokens. Angles: citizenship/dual-nationality, PR/Blue Card/PSW timelines, Bangladeshi student-visa reality at Embassy Dhaka, software/AI market + salary + study, living conditions (safety/tax/passport/politics/diaspora).
- **Targeted self-verification** (direct search) of the volatile, score-moving numbers the workflow left thin or out of date: EU Blue Card **2026** salary thresholds, settlement-permit (PR) timelines, WJP 2025 + GPI 2025 ranks, Henley 2026 rank, software-developer salary, OECD tax wedge, statutory-health-insurance eligibility, 2025 federal-election result, housing costs, anti-Muslim incident trend, BD/Muslim diaspora.
- **Gov-first sourcing:** BMI, BAMF, Make-it-in-Germany (federal portal), German Embassy Dhaka, German missions (germany.info), Bangladesh MOFA, OECD, WJP, GPI/Vision of Humanity, Henley, Destatis/IOM; StepStone via heise, CLAIM, and reputable secondaries where no gov EN page carries the figure.

## Conflicts resolved (data-change protocol §3)

- **EU Blue Card thresholds.** The workflow refuted (0-3) the figures €50,700 / €45,934.20 as "2025." Direct verification shows these are the **2026** thresholds (≈5% rise over 2025): **€50,700 general, €45,934.20 for shortage occupations / new entrants / IT specialists**. Software is a shortage occupation, so two engineers comfortably clear the lower bar. Recorded under job-market and pr-pathway.
- **Three-year citizenship fast-track.** Verified **repealed by the 2025 coalition** (both "3-year fast-track exists" claims killed 0-3). Standard naturalisation is **five years**; `time-to-citizenship` scored 68 and `policy-stability` 55 (the repeal is a citizenship-stage tightening, but dual + 5-year stay intact).

## Key decisive facts (cited in `germany.json`)

- **Dual citizenship retained — no blocker.** Germany permits multiple nationality since **27 June 2024** (StAG reform), AND Bangladesh grants a Dual Nationality Certificate (Citizenship Act §2B(2)) covering Germany. Both sides allow → `dual-citizenship-retention` 90. Verified 3-0 on both legs (BMI/BAMF + Bangladesh MOFA).
- **PR is unusually fast.** EU Blue Card → settlement permit in **21 months (B1 German)** or **27 months (A1)**; skilled-worker route 36 months (24 with a German degree). The salary bar is trivial for engineers — German A1/B1 is the real gate. → `years-to-pr` 80.
- **PSW = 18-month** graduate job-search residence permit, unrestricted work while searching, deterministic offer-based conversion to Blue Card; each graduating spouse qualifies independently.
- **Dhaka entry is the binding weakness:** ~**27-month** student-visa **appointment** backlog at the German Embassy Dhaka (still current June 2026), plus APS certificate, ~**€11,904** blocked account, and genuine-student scrutiny. → `dhaka-mission-appointment-capacity` 25.
- **Money/safety/politics:** software-dev median ~€65,250 (StepStone 2025) +15–25% AI premium; OECD tax wedge **47.9%** single (2nd-highest OECD), no expat regime, but a Germany–Bangladesh DTA exists; **WJP 2025 6th/143 (0.83)**, **GPI 2025 20th**, **Henley 2026 4th (185)**; **AfD 20.8% / 151 seats (second place)** in Feb 2025, CDU/CSU–SPD coalition under Merz; ~5.5m Muslims with abundant halal/mosques but anti-Muslim incidents rising fast (CLAIM 3,080 in 2024, +60%).
- **Study:** tuition-free public master's (semester fee ~€250–350; Baden-Württemberg non-EU €1,500/sem), deep English-taught CS/AI catalogue (~40–58 programmes), ~20 hrs/week student work.
- **Healthcare:** immediate statutory coverage — students ~€140/month, workers auto-enrolled in GKV with employer-split contributions.

## Derived result

| Category | Derived | Prior |
|---|---|---|
| job-market | 64.7 | pending |
| visa-access | 43.1 | pending |
| citizenship | 68.4 | pending |
| post-study-work | 73.0 | pending |
| spouse-family | 76.4 | pending |
| msc-study | 78.9 | pending |
| pr-pathway | 71.0 | pending |
| income-cost | 55.6 | pending |
| healthcare | 73.3 | pending |
| culture-language | 56.5 | pending |
| safety-law | 62.6 | pending |
| politics | 50.7 | pending |
| tax | 38.6 | pending |
| muslim-diaspora | 52.8 | pending |
| **OVERALL** | **63.94** | pending |

**Read:** Germany scores **63.9 overall — included (>60)**, and its shape is the mirror image of an English-native destination. The **back half of the journey is excellent** — fast Blue Card PR (21–27 months), retained dual citizenship, five-year naturalisation, free public study, immediate healthcare — driving msc-study (78.9), spouse-family (76.4), healthcare (73.3) and post-study-work (73.0). The **drag sits at the entry and the edges**: visa-access (43.1) is gutted by the ~27-month Dhaka appointment backlog; tax (38.6) by the OECD's second-highest wedge with no expat relief; politics (50.7), culture-language (56.5) and muslim-diaspora (52.8) by the German-language burden and a hardening, AfD-amplified, rising-Islamophobia climate.

## No blocker

`hasBlocker = false` — dual citizenship is retained both ways and the PR/citizenship path is intact. The 27-month Dhaka backlog is a severe but non-blocking entry friction (scored as `normal`, not a blocker, since it delays rather than precludes the pathway).
