# Norway — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) couple, both ~2022 BSc-CSE / software-AI engineers; MSc → PSW → PR → citizenship; relocating together.

**Scope:** 16th country under the factor model. 14 categories, 91 factors vs `categories.json`; derived in `scoring.ts`. Norway was a full `pending` placeholder.

## Method

Targeted gov-first WebSearch (deep-research workflow throttled by org spend limit), dual-citizenship check first. Sourcing: udi.no, studyinnorway.no, WJP, Henley, Skatteetaten, Wikipedia (Islam/diaspora). ≥2 sources per decisive claim.

## Decisive finding — NO blocker

- **Dual citizenship retained both ways.** Norway has allowed dual citizenship since 2020, and as a European country it falls within Bangladesh's 'all of Europe' DNC scope → `dual-citizenship-retention` 85, `hasBlocker = false`. (Assumption recorded: relies on Norway being within the geographic 'all of Europe' DNC listing; confirm against the current MOHA list.)

## Key decisive facts (cited in `norway.json`)

- **Citizenship:** 8 years (of last 11) + **B1 Norwegian** (raised from A2) + citizenship test. Henley 2026 joint **4th (~185)**.
- **PSW = 12-month** job-seeker permit (any job, non-extendable) → skilled-worker permit; funds NOK ~325,400.
- **PR:** reachable after ~3 years of skilled work + Norwegian-language/integration.
- **Jobs:** very high salaries (SWE NOK 760k–1.2m, AI ~$126k) in a small, Oslo-centric market.
- **Study:** NTNU/Oslo English CS/AI — but Norway **introduced non-EEA tuition in 2023** (previously free), and costs are among the world's highest.
- **Visa (BD lens):** no Norwegian mission in Dhaka; high funds bar.
- **Tax:** ~47% marginal; no expat regime; Norway–Bangladesh treaty exists.
- **Healthcare:** universal national insurance; excellent oil-funded welfare and childcare.
- **Safety:** WJP 2025 **2nd** worldwide; very safe.
- **Diaspora:** ~3–6% Muslim, ~50 mosques (2/3 in Oslo), large Pakistani community for South-Asian ecosystem — but **domestic halal slaughter is banned** (imported only) and the BD community is small.

## Derived result

| Category | Derived | | Category | Derived |
|---|---|---|---|---|
| job-market | 62.2 | | healthcare | 68.4 |
| visa-access | 49.6 | | culture-language | 55.8 |
| citizenship | 53.5 | | safety-law | 71.8 |
| post-study-work | 63.0 | | politics | 53.3 |
| spouse-family | 66.2 | | tax | 49.7 |
| msc-study | 61.5 | | muslim-diaspora | 48.7 |
| pr-pathway | 57.9 | | **OVERALL** | **~58.9** |
| income-cost | 54.0 | | | |

**Read:** Norway mirrors Denmark/Finland — a structurally excellent Nordic (WJP 2nd, safety 71.8, healthcare 68.4, spouse-family 66.2, top salaries) pulled just under the line by the same forces for this profile: an 8-year/B1-Norwegian citizenship (53.5), the Norwegian-language burden (culture-language 55.8), newly charged tuition + extreme costs (income-cost 54.0), a high funds bar with no Dhaka mission (visa-access 49.6), and a small BD community with banned domestic halal slaughter (muslim-diaspora 48.7). Lands at **~58.9 — below 60.**

## Inclusion verdict — DROP CANDIDATE (marginal)

`hasBlocker = false`; derived overall **~58.9 < 60** → flagged for dropping; surfaced, not deleted.
