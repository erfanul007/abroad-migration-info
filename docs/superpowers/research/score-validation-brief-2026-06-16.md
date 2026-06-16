# Country Score Validation Brief — 2026-06-16

> Single source of truth for the per-country research subagents. Every agent reads
> THIS file so all 14 countries are scored on one comparable absolute scale.

## The applicant (anchor every score to this exact profile)

A **two-person household, both Bangladeshi nationals currently in Dhaka, Bangladesh**:

- **Erfanul Bhuiyan** — Software Engineer @ Netpower.
- **Tanima Hossain** — Software Engineer @ Optimizely.
- Both hold **BSc in CSE** (Daffodil International University, completed 2022-02).
- **Goal pathway (in order):** MSc studies → post-study work permit → permanent
  residency → citizenship → passport.
- **Preferences:** regions Europe / Australia / first-world; **faster citizenship
  matters**; **dual citizenship preferred** (they do not want to renounce Bangladeshi
  citizenship if avoidable); profession priority **IT / Software / AI Engineering**;
  **they must relocate together** (`relocateTogether = true`) and both want to work.

### What this profile implies for scoring (apply consistently)

1. **Both are skilled IT workers**, not one earner + a trailing spouse. A country
   that only lets the primary applicant work, or bans dependants from working, is a
   serious penalty under `spouse-family`. A country where the *spouse of a student*
   cannot work (e.g. taught-master's dependant bans) is a decisive weakness for them.
2. **Bangladeshi-national lens is real and decisive for `visa-access`.** Score from
   Dhaka: Is there a mission in Dhaka that decides/handles the visa, or must they
   travel to New Delhi / a third country? What are refusal rates for Bangladeshi
   applicants, financial-proof bars (blocked accounts), document scrutiny, appointment
   backlogs, and any BD-specific bans or heightened scrutiny? Generic "easy visa"
   reputation is irrelevant — only the Bangladesh experience counts.
3. **Dual citizenship "preferred" + faster citizenship "true"** make `citizenship`
   hinge on: years to naturalise (shorter = better), whether dual citizenship is
   permitted for Bangladeshi nationals (no-renunciation = big plus), and language/test
   bars. Note Bangladesh itself permits dual citizenship with many countries but
   requires Dual Nationality Certificate — the *destination's* stance is what we score.
4. **They want to settle and get a passport**, so `pr-pathway` and `citizenship`
   carry real weight; a great job market with no PR route scores lower than its
   salaries alone suggest.
5. English is their working language; **local-language requirements for PR/citizenship
   are friction** under `culture-language` (and partly `citizenship`).
6. They are **Muslim and South Asian** — `muslim-diaspora` covers Bangladeshi/South
   Asian community size, halal access, mosques, and the anti-Muslim sentiment trend.

## Research mandate (this round is live-data, not from memory)

- You **MUST** use `WebSearch` and `WebFetch` to gather the **latest 2025–2026**
  official data before scoring. Do not score from training memory.
- **Prefer primary/official sources:** government immigration portals, the destination
  country's embassy/mission pages **for Dhaka/Bangladesh**, official statistics
  offices, WJP Rule of Law Index 2025, OECD, official tuition/fee pages, central
  university/DAAD-style portals. Use Numbeo/official cost indices for cost of living,
  reputable news only for very recent policy changes (with dates).
- Every score's `reasoning` must cite **specific, dated figures** (e.g. "blocked
  account €11,904 for 2026/27", "naturalisation 5 years per StAG 2024", "Skilled
  Worker salary floor £41,700 from 2025"). No vague claims.
- `links` must be **real, working, official-first URLs** you actually fetched/verified
  this session (2–4 per category). If you could not verify a URL, do not invent one.
- If a 2025/2026 policy change moved a score, say so explicitly in `reasoning`.

## Absolute scoring scale (0–100) — score on THIS scale, not relative to the country

These bands are **cross-country absolute anchors**. A 90 in Germany's job market and a
90 in Canada's citizenship must mean comparably "excellent for this couple". Do not
grade on a curve within one country.

General band meaning:
- **90–100** — Best-in-class globally for this couple; almost no friction.
- **75–89** — Strong; minor friction.
- **60–74** — Decent; real but surmountable hurdles.
- **45–59** — Mixed; significant hurdles or trade-offs.
- **30–44** — Weak; major barriers.
- **0–29** — Severe barrier / near-disqualifying for this profile.

### Per-category anchors

- **job-market (w12):** Demand for SW/AI engineers, salaries, sponsorship norms,
  capacity for BOTH spouses. 90+ = acute shortage + both easily hired + English-OK
  tech scene. 45 = thin market, sponsorship rare, or only one spouse likely placed.
- **visa-access (w10) [BD lens]:** 80+ = decided in Dhaka, low refusal, modest funds,
  fast. 50 = travel to New Delhi OR high refusal OR heavy financial/scrutiny bars.
  <40 = severe scrutiny / very high refusal / no local processing.
- **citizenship (w10):** 90+ = ~3yr naturalisation + dual allowed + light test
  (e.g. Canada 3yr). 70 = ~5yr + dual allowed. 45 = dual disallowed or 7–10yr or hard
  language. <30 = dual effectively banned AND long/onerous.
- **post-study-work (w9):** 90+ = ≥3yr open work + spouse works (e.g. NZ/Canada-style).
  70 = ~18–24mo job-search permit, in-country switch, spouse works. <50 = short/no PSW
  or spouse barred.
- **spouse-family (w9):** 90+ = both work freely throughout (student & work phases),
  easy dependant route. 60 = spouse works only in work phase, not study phase. <40 =
  dependant work ban during study (decisive penalty for this couple).
- **msc-study (w8):** English-taught CS MSc availability, tuition, scholarships,
  student work hrs, spouse-accompany. 88+ = abundant English MSc + ~free/cheap +
  spouse accompanies + student work allowed. 55 = pricey or limited English options.
- **pr-pathway (w8):** Years to PR, clarity, predictability. 85+ = fast (≤2–3yr) +
  clear points route. 60 = ~5yr standard. <45 = long/uncertain/quota-locked.
- **income-cost (w7):** Net SW salary vs rent/living + savings potential. 75+ = strong
  net + affordable housing + good savings on two incomes. 55 = high tax/rent erodes
  savings. <45 = poor net or housing crisis.
- **healthcare (w6):** Access/quality/cost + welfare/parental/pension. 90+ = universal,
  cheap, top quality. 60 = decent but cost/coverage gaps for newcomers.
- **culture-language (w6):** English usability day-to-day, language bar for
  PR/citizenship, integration, work-life, livability, openness. 90+ = English-native +
  open + high livability. 55 = local language needed for officialdom/citizenship.
- **safety-law (w5):** Crime, rule of law (WJP 2025), treatment of immigrants, judicial
  fairness. 90+ = top WJP tier + low crime + fair to migrants.
- **politics (w4):** Govt stability, immigration-policy volatility, anti-immigrant
  trend. 80+ = stable + steady pro-skilled-migration. 45 = tightening + rising
  anti-immigrant party.
- **tax (w3):** Income-tax burden + treatment of foreign workers + take-home. 80+ =
  low burden, high take-home. 45 = high burden (~35–45% effective). <35 = very high.
- **muslim-diaspora (w3):** Muslim & South-Asian (esp. Bangladeshi) community, halal,
  mosques, accommodation, sentiment trend. 85+ = large established BD/South-Asian
  community + halal everywhere + low hostility. 55 = present but small or rising
  hostility.

## Comparability cross-checks (sanity-check your scores against these known truths)

- **Canada** has among the best citizenship (3yr physical-presence + dual allowed) →
  citizenship should be ~88–92, the top of the set.
- **Portugal's** famous 5-year citizenship is **gone** — 2025 reform moves it toward
  ~10 years for most third-country nationals (and clock-start changes). Score it down.
- **UK** banned dependants of taught-master's students (Jan 2024) → spouse-family is a
  decisive weakness for THIS couple (both must work); keep it low (~35–42).
- **Germany** repealed the 3-year fast-track citizenship (in force 30 Oct 2025);
  standard 5yr + dual stays.
- Every **Nordic** country tightened citizenship in 2025–26 (longer residence, language,
  self-sufficiency) — reflect this; none should look like an easy/fast passport.
- **Australia/NZ** have no fast citizenship but strong PSW + spouse work; visa from
  Dhaka has real friction (no New Delhi requirement, but funds/processing matter).
- **Visa-from-Dhaka** is a genuine differentiator: countries that force New Delhi travel
  or have high BD refusal rates must score below those that decide in Dhaka.

## Output contract (rewrite the country JSON exactly)

- Keep identity fields **byte-identical**: `id`, `name`, `iso`, `iso3`, `flag`,
  `region`. The Leaflet map joins on `name` — never change it.
- Each of the 14 categories: `status: "scored"`, integer `score` (0–100),
  `summary` (≤140 chars, the headline), `reasoning` (2–4 sentences with dated figures),
  `evidence` (3–5 short bullets), `links` (2–4 verified official-first URLs),
  `lastReviewed: "2026-06-16"`.
- Update the top-level `summary` (1–2 sentences) and top-level `lastReviewed`.
- Valid JSON, UTF-8, 2-space indent. The app has a validation gate that throws on
  malformed data — your file must parse.
