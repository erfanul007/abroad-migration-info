# Australia — factor-level re-score (pilot) — 2026-06-18

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc-CSE / software-AI engineers; MSc → post-study work → PR → citizenship; relocating together.

**Scope:** First country re-scored under the factor model (Phase 2 pilot). All 14 categories, 91 factors, each scored 0–100 against its rubric in `categories.json`, then category and overall scores derived in `scoring.ts`.

## Method

- **Three `deep-research` workflows** (gov-first), ~75 fetched sources across: (1) immigration policy state (visa/485/PR/citizenship/politics), (2) tech labour market + money (jobs/salary/housing/tax/study), (3) social/welfare/safety/diaspora.
- **Spend-limit caveat:** the org monthly spend limit struck the workflows' *verify* phase mid-run, so most claims returned `vote: 0-0` — **abstentions, not refutations.** Underlying sources are primary gov quotes (immi.homeaffairs, ABS, ATO, OECD, Treasury, Services Australia, WJP, GPI). Genuinely panel-verified claims (3-0/2-0) are noted in the workflow outputs.
- **Targeted self-verification** (after limit reset) of the decisive, volatile, score-moving facts via direct search/fetch: Evidence Level for Bangladesh, CSOL status + 189 ICT points, dual-citizenship retention, WJP/Henley ranks, Bondi/Islamophobia trend.

## Conflict resolved (data-change protocol §3)

**Bangladesh student-visa Evidence Level.** Sept-2025 routine update placed Bangladesh at **Level 1**; an **out-of-cycle re-rating on 9 Jan 2026 moved Bangladesh from Level 2 → Level 3 (strictest)** (forged bank-guarantee / fake-transcript spike, Nov–Dec 2025; processing 3→8 weeks). Per "most-recent-official wins," **EL3 stands as of June 2026** — confirmed by The Daily Star, Prothom Alo, visahq, immivisa. Visa-access scored accordingly (heightened-scrutiny 22, financial-bars 40, approval/refusal 38).

## Key decisive facts (cited in `australia.json`)

- **Dual citizenship retained** — Australia allows dual (since 2002) AND is on Bangladesh's Dual Nationality Certificate list → `dual-citizenship-retention` 92, **no blocker** (contrast: New Zealand).
- **Software Engineer (261313)** on the Core Skills Occupation List; independent GSM 189 ran **85–100 pts (Tier 3)** in the 13 Nov 2025 round → sponsorship open, independent-PR bar high.
- **485 PHEW** 2–3 yrs for a coursework master's; age limit cut to ≤35 (1 Mar 2026); both graduate spouses eligible for own 485.
- **Spouse of a coursework-master's student** may work >48 hrs/fortnight (effectively unrestricted) — Home Affairs, verified 2-0.
- **WJP RoL 2025** 11th/143 (0.80); **Henley 2026** equal 7th (182 destinations); **GPI 2025** 18th/163.
- **Post-Bondi (14 Dec 2025) Islamophobia** +740% (Special Envoy, 16 Mar 2026) → `sentiment-safety` 30, `lived-discrimination-hatecrime` 38.
- **No Australia–Bangladesh tax treaty** (Treasury, 47 partners, BD absent); resident tax to 45% + 2% Medicare; **OSHC** mandatory (no Medicare until PR — Bangladesh not on RHCA).

## Derived result vs prior hand-set

| Category | Derived | Old hand-set |
|---|---|---|
| job-market | 64.3 | 62 |
| visa-access | 42.8 | 34 |
| citizenship | 76.7 | 80 |
| post-study-work | 66.5 | 66 |
| spouse-family | 79.6 | 86 |
| msc-study | 66.5 | 58 |
| pr-pathway | 56.0 | 50 |
| income-cost | 56.7 | 58 |
| healthcare | 55.0 | 68 |
| culture-language | 75.4 | 87 |
| safety-law | 61.6 | 78 |
| politics | 49.3 | 55 |
| tax | 47.9 | 55 |
| muslim-diaspora | 61.8 | 58 |
| **OVERALL** | **62.73** | **64.0** |

**Drift read:** overall is stable (−1.3). The largest single-category drops — healthcare (68→55), safety-law (78→62), culture-language (87→75), spouse-family (86→80) — are the factor model surfacing sub-factors a single hand-set score blurred: the newcomer-no-Medicare-until-PR barrier, lived hate-crime (post-Bondi) separated from rule-of-law, and social-acceptance separated from English usability. Rises (visa 34→43, msc 58→66, pr 50→56) reflect crediting real positives (Dhaka VFS access, accessible admission, employer-PR route) that the old single score under-weighted. Australia remains included (>60).

## No blocker

`hasBlocker = false` — dual citizenship is retained and the citizenship path is intact.
