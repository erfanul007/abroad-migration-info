# Research brief — add USA + dual-citizenship audit (2026-06-17)

**Profile:** two Bangladeshi-national software engineers (Dhaka), goal MSc → post-study work → PR → citizenship → passport, dual citizenship preferred, relocating together.

**Request:** add USA, South Korea, and any other fitting country; analyse/score/validate; drop if overall < 60. Mid-task the user added: don't keep any country lacking a viable (dual) citizenship path, and severely flag existing countries that don't allow dual citizenship (drop if the penalty pushes them < 60).

## Method

- Four per-country `deep-research` workflow runs (USA, South Korea, Japan, Singapore), 5 search angles each, gov-first sourcing. The automated 3-vote adversarial-verify stage was interrupted by an org API spend limit, so most gathered claims are **source-backed (gov-primary) but not machine-re-verified**. Decisive, cutoff-deciding facts were re-verified manually.
- One `dual-citizenship-audit` workflow over all 21 countries (research → adversarial verify), BD-national lens: can a naturalising Bangladeshi retain BD nationality?
- Scoring is senior-consultant judgment on the project's absolute 0–100 scale, calibrated to the existing set (Canada ≈ 71 anchor).

## Candidate verdicts (new)

| Country | Overall | Verdict | Reason |
|---|---|---|---|
| United States | **60.8** | **ADDED** | Elite jobs/income, dual allowed, EB-2 Current for BD; but PR endpoint currently obstructed (Jan-2026 immigrant-visa pause incl. BD) + H-1B lottery + 2025 F-1 refusal surge + spouse work limits + volatile politics. Borderline include. |
| Japan | 60.6 | dropped | No dual citizenship (renunciation required); naturalisation now ~10yr administrative practice. Fails the dual/citizenship endpoint. |
| Singapore | 61.3 | dropped | No dual citizenship (renunciation required); discretionary/opaque PR; no formal PSW window. |
| South Korea | 55.8 | dropped | < 60: Korean-language wall, renunciation-required citizenship, idle spouse on F-3, thin Muslim/BD diaspora, 2024-25 political turmoil. |

## Decisive facts verified manually

- **Henley 2026:** Singapore #1 (192); Japan & South Korea joint 2nd (188); **US 10th (179)**.
- **US immigrant-visa pause:** from 21 Jan 2026, immigrant-visa issuance paused for nationals of 75 countries **including Bangladesh** (public-charge review); B1/B2 bond up to USD 15,000. F-1 student visas not affected; BD not on Proclamation 10998 full-ban tier.
- **US EB green card for BD:** EB-2 Rest-of-World (incl. BD) **Current** (June 2026 Visa Bulletin); EB-3 RoW ~Jun 2024. BD is not in the India/China backlog — the bottleneck is the pause + H-1B lottery, not the queue.
- **Japan naturalisation:** the "10 years" (eff. 2026-04-01) is an MOJ administrative screening practice (~10yr residence + 5yr tax + 2yr social insurance), not a Nationality Act change (statutory minimum still 5yr); dual citizenship still barred.

## Dual-citizenship audit (BD lens) — existing countries

**No dual for a Bangladeshi** (destination requires renunciation): **Austria, Estonia, Netherlands, Spain** (confirmed: oesterreich.gv.at, politsei.ee, government.nl/IND, boe.es).

**New Zealand:** NZ permits dual, **but New Zealand is not on Bangladesh's Dual Nationality Certificate (DNC) eligible list** (US/Canada/Europe/UK + HK/SG/MY/BN/KR/JP; 2023 expansion added only Fiji in Oceania). NZ/Australia appear only on Bangladesh's separate "No Visa Required" travel list, which is wrongly conflated with the DNC. So a Bangladeshi naturalising in NZ loses BD nationality → effectively no-dual.

**Australia:** clears — Australia **is** on Bangladesh's DNC list (dual achievable via DNC, like Canada).

## Actions taken

- **Created** `countries/united-states.json` — 14 fully-cited cells, overall 60.8.
- **New Zealand** citizenship cell re-scored 70 → 28 + prominent no-dual flag (BD-DNC gap); country summary updated. Overall 74.7 → 70.5 (stays).
- **Spain removed** — citizenship harmonised toward Austria's no-dual scoring (10yr + renunciation, BD not exempt) → overall ~59.4 < 60 → dropped per curation policy.
- **Austria / Estonia / Netherlands** — audit **validated** the existing no-dual flags and scores (20 / 30 / 30); no change required (avoids unjustified churn).

**Result:** 20 countries (−Spain, +USA), all ≥ 60. Lowest: united-states 60.8.

## Caveats

- Automated adversarial verification was incomplete (spend-limit). Claims rest on gov-primary citations + manual checks of decisive facts; a full re-verify pass is advisable if the data is challenged.
- USA (60.8) and the Spain-removal call are borderline and rest on judgment about, respectively, the temporary-vs-permanent nature of the US immigrant-visa pause and Spain/Austria scoring consistency. Revisit USA if the pause lifts.
- All figures current as of 2026-06-17. Synthetic/public data only.

## Key sources

bls.gov, state.gov, travel.state.gov, uscis.gov, whitehouse.gov, nafsa.org, oecd.org, henleyglobal.com, worldjusticeproject.org, pewresearch.org; oesterreich.gv.at, politsei.ee, government.nl/ind.nl, boe.es/administracion.gob.es, govt.nz; washington.mofa.gov.bd (Bangladesh DNC); thedailystar.net, cnn.com (immigrant-visa pause).
