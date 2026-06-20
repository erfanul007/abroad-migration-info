# Canada — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc-CSE / software-AI engineers; MSc → post-study work → PR → citizenship; relocating together.

**Scope:** Third country re-scored under the factor model (after the Australia pilot and Germany). All 15 categories, 82 factors, each scored 0–100 against its rubric in `categories.json`; category and overall scores derived in `scoring.ts`. Canada previously sat as a full `pending` placeholder (no hand-set baseline to compare against).

## Method

- **One `deep-research` workflow** (gov-first) was launched but **hit the org monthly spend limit during its verify phase** — all 25 claims returned `vote: 0-0` (abstentions, *not* refutations, per the Australia-pilot caveat). The workflow's underlying claims came from primary canada.ca / IRCC sources but were left unverified.
- **Targeted self-verification** (direct WebSearch, which remained available after the workflow fan-out was throttled) of every decisive, score-moving fact: dual-citizenship retention (both legs), study-permit cap + PAL exemption for master's at public DLIs (2026), PGWP rules (3-yr, field-of-study lifted, CLB 7), SDS cancellation + proof-of-funds, spousal OWP rules, Express Entry 2026 categories + 2026–28 levels, citizenship 1,095-day/CLB-4 rule, software/AI salary + tech unemployment, master's CS tuition, Toronto/Vancouver cost of living, federal+Ontario tax + Canada–Bangladesh treaty, WJP 2025 / GPI 2025 / Henley, 2025 election + immigration sentiment, Muslim/Bangladeshi diaspora + Bill 21, Dhaka VFS access + 2025 approval-rate collapse.
- **Gov-first sourcing:** IRCC / canada.ca, Justice Laws (Citizenship Act, treaty text), Job Bank, Statistics Canada, WJP, Vision of Humanity (GPI), Henley; VFS Global Canada-Bangladesh; PwC, Robert Half, ApplyBoard/ICEF, university pages and CBC where no single gov EN page carried the figure. Cross-checked ≥2 independent sources per decisive claim.

## Conflicts resolved / caveats (data-change protocol §3)

- **Spend-limit caveat (carried from the Australia pilot).** The deep-research workflow's adversarial-verify phase could not run; do not read its "all claims refuted" summary as refutation — those are abstentions. Scoring rests on the targeted self-verification below, not on the workflow's unverified output.
- **Study-permit approval-rate collapse.** New (non-extension) study-permit approval rates fell to **~30–31% in 2025** from **51% in 2024** after SDS was cancelled (ApplyBoard/ICEF). This is system-wide; master's-at-public-DLI applicants fare better than the headline (college/private drag it down) and are now cap/PAL-exempt — reconciled into `approval-refusal-rate` 38 with `heightened-scrutiny-policy-risk` held at 45 (the tightening is **not** Bangladesh-specific, unlike Australia's EL3).
- **Express Entry STEM category.** Listed as a 2026 priority but **dedicated STEM draws are not guaranteed** (most STEM candidates arrive via CEC/PNP); agriculture delisted; 5 new Canadian-experience categories added. Recorded under pr-pathway `policy-predictability` 48.
- **2025 election seat count.** Some aggregators quoted "189 Liberal seats / majority" — this is wrong; the April 2025 result was a **Liberal minority/plurality** under Carney. Brief and JSON state "minority Liberal government" only.

## Key decisive facts (cited in `canada.json`)

- **Dual citizenship retained — no blocker.** Canada has allowed dual citizenship since 1977 AND Canada is on Bangladesh's Dual Nationality Certificate list (a naturalising Bangladeshi must apply for the DNC to retain BD nationality). Both sides allow → `dual-citizenship-retention` 90.
- **PSW is best-in-class.** Master's graduates get a **3-year PGWP regardless of programme length**; field-of-study restriction lifted for degree graduates (Mar 2025); open work permit; **CLB 7** language gate (trivial for English natives); each graduate spouse gets their own PGWP → post-study-work derives 77.9.
- **PR is clear but competitive.** study (≈2 yr) → PGWP → 1 yr skilled work → **Canadian Experience Class** ≈ 3–4 yrs to PR; CLB 7 only; but CRS cut-offs ~520–540 and **2026–28 levels stabilised at ≈380,000/yr (~21% cut)**; >40% of 2025 PR from in-Canada temporary residents.
- **Entry is the binding weakness:** approval rate ~30% post-SDS, proof of funds **CAD 20,635 + first-year tuition + airfare** (GIC), full genuine-student scrutiny — but VFS Dhaka (Gulshan) is functional with ~8-week processing and **no Germany-style backlog**, and master's-at-public-DLI is cap/PAL-exempt from 1 Jan 2026 → visa-access derives 47.1.
- **Money/jobs/study:** SWE Toronto ~CAD 90–137k, AI/ML ~CAD 85–150k (+35% ML premium), tech unemployment ~3.3%, top-tier AI hub (Vector/Mila/Amii); intl master's CS tuition CAD 23k (Waterloo)–35k (Toronto); 24 hrs/week student work. Housing is the drag — Toronto/Vancouver among least affordable globally (couple ~CAD 3,800–4,100/mo).
- **Tax better than peers:** OECD wedge ~31%, individual assessment (no dual-earner penalty), **Canada–Bangladesh DTA in force since 1985** (credit relief), federal floor cut to 14% for 2026; offset by Ontario top combined ~53.5% and no expat regime.
- **Safety/citizenship/diaspora:** WJP 2025 **13th (0.79)**, GPI 2025 **14th**, Henley **9th (~183)**; naturalisation 1,095 days/5yr + CLB 4 + dual; Muslims 4.9%/1.8m, BD diaspora ~75,400 (Toronto/GTA hub), abundant halal/mosques — tempered by rising hate crime and **Quebec Bill 21**.
- **Politics:** stable institutions, orderly April-2025 transition to Carney minority Liberal government, but sustained 2024–26 immigration tightening and a hardened public mood (56–58% "too much immigration").

## Derived result

| Category | Derived | Prior |
|---|---|---|
| job-market | 71.6 | pending |
| visa-access | 47.1 | pending |
| citizenship | 74.0 | pending |
| post-study-work | 77.9 | pending |
| spouse-family | 78.2 | pending |
| msc-study | 70.8 | pending |
| pr-pathway | 66.9 | pending |
| income-cost | 54.5 | pending |
| healthcare | 58.5 | pending |
| culture-language | 77.5 | pending |
| safety-law | 67.2 | pending |
| politics | 52.4 | pending |
| tax | 53.8 | pending |
| muslim-diaspora | 68.0 | pending |
| **OVERALL** | **~66.9** | pending |

**Read:** Canada scores **~66.9 overall — included (>60)**, the strongest of the three re-scored so far (Australia 62.7, Germany 63.9). Its profile is the classic English-native immigration pipeline doing what it is built for: post-study-work (77.9), spouse-family (78.2), culture-language (77.5), citizenship (74.0) and job-market (71.6) are all strong, anchored by the 3-year open PGWP, dual citizenship retained both ways, a top-tier AI ecosystem and a low-language-burden 5-year naturalisation. The **drag sits at entry and cost**: visa-access (47.1) is gutted by the ~30% post-SDS approval-rate collapse; income-cost (54.5) by Toronto/Vancouver housing; politics (52.4) and tax (53.8) by the immigration crackdown and high marginal rates. Healthcare (58.5) is mid — universal once resident, but with newcomer-coverage gaps and long treatment waits.

## No blocker

`hasBlocker = false` — dual citizenship is retained both ways (Canada allows it; Bangladesh's DNC covers Canada) and the study→PGWP→CEC→citizenship path is intact. The ~30% approval-rate collapse is a severe but non-blocking entry friction (scored `normal`, not a blocker, since it lowers odds rather than precluding the pathway).
