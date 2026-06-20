# New Zealand — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) couple, both ~2022 BSc-CSE / software-AI engineers; MSc → PSW → PR → citizenship; relocating together.

**Scope:** 15th country under the factor model. 15 categories, 82 factors vs `categories.json`; derived in `scoring.ts`. NZ was a full `pending` placeholder.

## Method

Targeted gov-first WebSearch (deep-research workflow throttled by org spend limit), dual/DNC check first. Sourcing: immigration.govt.nz, govt.nz, Bangladesh MOFA (DNC), WJP, Henley/GPI, IRD, Wikipedia (diaspora). ≥2 sources per decisive claim, plus the verified Australia-pilot finding.

## Decisive finding — BLOCKER

- **New Zealand is NOT on Bangladesh's Dual Nationality Certificate list.** NZ permits dual citizenship on its own side, but Bangladesh only allows retention for listed countries (~101 as of the Feb-2023 gazette — North America, all of Europe, parts of Asia; **Australia is on it, NZ is the explicit contrast**). So under Bangladeshi law, acquiring NZ citizenship triggers loss of BD nationality → `dual-citizenship-retention` 15, `severity: "blocker"`. (Caveat recorded in the cell: confirm against the current Bangladesh MOHA DNC list before relying on it.)

## Key decisive facts (cited in `new-zealand.json`)

- **PSW (best in the set):** a Level-9 master earns a **3-year open** Post-Study Work Visa; ICT/AI on the **Green List** gives a fast straight-to-residence path.
- **Citizenship:** 5 years (1,350 days) as PR + basic English (native) + good character — low friction on NZ's side, but the DNC blocker negates it. Henley 2026 ~**183**.
- **Jobs:** AI ~NZ$100–170k, senior SWE ~NZ$130–175k; small, Auckland-centric market with brain-drain to Australia.
- **Study:** Auckland/Waikato Master of AI, English-native — but high tuition (NZ$32–64k).
- **Visa (BD lens):** online, no NZ mission in Dhaka; funds NZ$20,000/yr.
- **Tax:** moderate (to 39%, no social-security tax, no CGT); no expat regime; NZ–Bangladesh treaty exists.
- **Safety:** GPI 2025 **3rd**, WJP 2025 **5th** — and notably **inclusive of Muslims post-2019** (Christchurch reforms).
- **Diaspora:** ~1.5% Muslim, abundant Auckland mosques and halal (NZ is a halal-meat exporter), but a **tiny Bangladeshi community (~3,550)** and geographic isolation.

## Derived result

| Category | Derived | | Category | Derived |
|---|---|---|---|---|
| job-market | 61.5 | | healthcare | 59.5 |
| visa-access | 53.0 | | culture-language | 76.9 |
| citizenship | 56.8 | | safety-law | 72.5 |
| post-study-work | 78.0 | | politics | 60.2 |
| spouse-family | 67.5 | | tax | 53.9 |
| msc-study | 61.8 | | muslim-diaspora | 52.3 |
| pr-pathway | 68.1 | | **OVERALL** | **~62.8** |
| income-cost | 51.2 | | | |

**Read:** On the numbers NZ is a top-4 destination — **derived ~62.8** — led by the best PSW in the set (78.0, 3-year open + Green-List residence), English-native culture (76.9), and elite safety (72.5). **But the dual-retention blocker governs:** NZ's absence from Bangladesh's DNC list means a naturalising Bangladeshi loses BD nationality, defeating the core retain-BD goal — exactly the contrast the Australia pilot drew.

## Inclusion verdict — BLOCKER (overall >60, but blocked)

`hasBlocker = true` (NZ not on Bangladesh's DNC list) despite derived overall **~62.8 ≥ 60**. Like the Netherlands, NZ's issue is the blocker, not the score — surfaced for the user, file not deleted. If the retain-BD constraint were dropped, NZ would rank among the strongest options.
