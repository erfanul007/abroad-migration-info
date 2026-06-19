# Netherlands — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) couple, both ~2022 BSc-CSE / software-AI engineers; MSc → PSW → PR → citizenship; relocating together.

**Scope:** 14th country under the factor model. 14 categories, 91 factors vs `categories.json`; derived in `scoring.ts`. Netherlands was a full `pending` placeholder.

## Method

Targeted gov-first WebSearch (deep-research workflow throttled by org spend limit), dual-citizenship check first. Sourcing: ind.nl, government.nl, The Hague International Centre, Leiden University, OECD/Payroll.org (30% ruling), WJP, Henley, DutchNews/TRT (politics), Minority Rights Group. ≥2 sources per decisive claim.

## Decisive finding — BLOCKER

- **Dutch naturalisation generally requires renouncing prior nationality.** The exemptions — spouse of a Dutch national, refugee, born in NL, or a home country that refuses renunciation — don't fit a standard Bangladeshi skilled migrant, because **Bangladesh accepts renunciation** (unlike Iran/Morocco). So the first naturalising spouse must give up BD nationality → `dual-citizenship-retention` 15, `severity: "blocker"`. The couple's goal of **both** retaining BD via the standard route fails. (Narrow mitigation: once the first spouse is Dutch, the second could naturalise as 'spouse of a Dutch national' and be exempt — but the first cannot.)

## Key decisive facts (cited in `netherlands.json`)

- **Citizenship:** 5 years + A2 Dutch civic-integration exam + **renunciation** (the blocker). Henley 2026 joint **4th (~185)**.
- **PSW = orientation year (zoekjaar):** 12 months of fully unrestricted work (no permit, no salary threshold), open to Dutch and top-200 global graduates; each spouse qualifies.
- **PR:** 5 years via Highly Skilled Migrant; A2 Dutch.
- **Jobs (a strength):** deep AI/tech market (ASML/Eindhoven, Booking, Adyen); AI €72–175k; English operates fully; Highly Skilled Migrant scheme fast.
- **Spouse-family (the best in the set):** the HSM partner gets **fully unrestricted** work rights (spouse-work-rights 85).
- **Study:** TU Delft/Eindhoven/UvA/Leiden world-class, English-taught — but non-EU tuition high (~€22–26k) and student work restricted.
- **Visa (BD lens):** recognised-sponsor route via embassy + VFS in Dhaka — relatively smooth.
- **Tax:** to 49.5% but the **30% ruling (→27% from 2027)** is generous relief; NL–Bangladesh treaty in force.
- **Politics (the worst in the set):** **Wilders/PVV** won the 2023 election and dominate; programme includes **banning the Quran, a 'hijab tax', closing mosques** — extreme anti-Muslim targeting; the 2024 coalition collapsed in 2025.
- **Diaspora:** ~5.8% Muslim with ~400 mosques and abundant halal, but the **Bangladeshi community is tiny (~3,500)**.

## Derived result

| Category | Derived | | Category | Derived |
|---|---|---|---|---|
| job-market | 72.4 | | healthcare | 63.2 |
| visa-access | 59.2 | | culture-language | 62.2 |
| citizenship | 50.0 | | safety-law | 66.8 |
| post-study-work | 69.6 | | politics | 37.2 |
| spouse-family | 76.3 | | tax | 57.3 |
| msc-study | 63.4 | | muslim-diaspora | 45.5 |
| pr-pathway | 59.4 | | **OVERALL** | **~61.8** |
| income-cost | 54.1 | | | |

**Read:** On the factor numbers the Netherlands is a top-5 destination — **derived overall ~61.8** — carried by the strongest spouse-family score yet (76.3), a deep tech market (72.4) and a generous PSW (69.6). **But the renunciation blocker governs:** the couple cannot both keep BD nationality through the standard naturalisation route, which is the core of their plan. The PVV's explicitly anti-Muslim programme (politics 37.2 — the lowest political score recorded) compounds the unsuitability.

## Inclusion verdict — BLOCKER (overall >60, but blocked)

`hasBlocker = true` (renunciation required) despite derived overall **~61.8 ≥ 60**. Unlike the sub-60 drop candidates, the Netherlands' problem is the **blocker, not the score** — surfaced prominently for the user, file not deleted. If the retain-BD constraint were relaxed (or only one spouse needed citizenship), the Netherlands would rank as a strong include.
