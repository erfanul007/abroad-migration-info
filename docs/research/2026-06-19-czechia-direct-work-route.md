# Czechia — `direct-work-route` factor scoring — 2026-06-19

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc Computer Science / software-AI engineers; goal migrate → PR → citizenship via a **Direct Work-Visa Route** (the alternative to study-first).

**Scope:** Score the six factors of the `direct-work-route` category (BD lens, absolute 0–100), filling the last `pending` cell in `czechia.json`. Gov-first, ≥2 sources per decisive claim, 2025–26 currency.

## Method

Targeted gov-first WebSearch + WebFetch (deep-research harness throttled; same lighter method used for Germany/Austria/etc.). Led with the decisive **route-accessibility** check (Employee Card vs Blue Card vs Highly Qualified Worker Programme) and the **Delhi-mission / quota** reality for Bangladeshi applicants.

**Gov / authoritative sources:** mzv.gov.cz New Delhi embassy (Employee Card / Blue Card / economic-migration quota pages), mpo.gov.cz (Ministry of Industry & Trade — programme definitions), ipc.gov.cz (Integration Centres — PR/Blue Card), mvcr.cz (citizenship), plus VisaHQ/EIG/Expats.cz for dated 2025–26 policy changes and academic (Wiley/Mucha 2026) for the BD track-record proxy.

## Decisive findings

- **Two viable direct routes, materially different for a BD national:**
  - **EU Blue Card** — the cleaner route. **No quota**; the applicant can **book a New Delhi appointment and apply directly** (not locked to a government programme). Requires a ≥3-year university degree (both hold BSc-CSE) and salary ≥1.5× average gross wage = **CZK 73,823/mo (~€2,960) from 1 May 2026** (was ~CZK 69,248/mo in 2025). A Prague/Brno software-engineer salary clears this. Decision deadline 90 days.
  - **Employee Card via Highly Qualified Worker Programme** — **not territorially limited** (all third countries, incl. Bangladesh), covers CZ-ISCO groups 1–3 (professionals/technicians = software engineers). **Employer registers** (firm must operate ≥2 yrs, ≥3 employees). BUT since **Oct 2025 the Delhi embassy refuses ad-hoc/courier Employee Card requests** — applications accepted **only through a government economic-migration programme**. Delhi Employee Card quota is **1,560/yr total** (600 Qualified Worker + 960 Highly Qualified/Key Staff), **shared across India/Bangladesh/Nepal/Sri Lanka/Maldives/Bhutan**.
- **Bangladesh confirmed eligible** at New Delhi, but BD public documents need **superlegalization** (heavier than India's apostille).
- **Highly-skilled fast-track / "digital nomad" pilot EXCLUDES Bangladesh** (list is Australia/Canada/Japan/UK/US/Brazil/Israel/Mexico/Singapore etc.) — that accelerated lane is not available to this couple.
- **July 2025 Delhi allocation: only 24 visa slots for IT/science professionals** — a tight subcontinent-wide cap and a real friction signal.
- **Current direction is net-expanding for skilled labour despite the ANO win:** **1 June 2026 MPO measures loosened paperwork and expanded access** to the Highly-Qualified Employee Programme + Key & Scientific Personnel Programme; **+2,000 Qualified Employee slots for 2026**; EU Single Permit **90-day processing cap** by May 2026; policy explicitly **favours skilled over unskilled**. Tempered by the hostile ANO/SPD political backdrop and the tight Delhi IT cap.
- **Route linkage to settlement is clean:** Blue Card / Employee Card time counts toward **PR at 5 years** continuous residence (A2 Czech), then **citizenship at ~10 years total** (B1 Czech + Life & Institutions test). **Dual citizenship retained both ways** — Czechia allows it since 1 Jan 2014, and Czechia is on Bangladesh's DNC list (per existing `citizenship` cell). (PR/citizenship difficulty itself is scored in `pr-pathway` / `citizenship`, not here — this factor scores route linkage only.)

## Factor scores

| Factor | Score | One-line rationale |
|---|---:|---|
| work-visa-accessibility-bd | 64 | Blue Card open (no quota; degree+salary both met; IT in demand) + Employee Card via Highly Qualified Worker Programme (all third countries); friction from BD superlegalization, rising salary floor, Delhi-only filing. |
| overseas-direct-hire | 58 | Blue Card permits direct hire+relocate from Dhaka (apply at Delhi, no in-country presence); but Employee Card now programme-locked (Oct-2025 Delhi tightening), BD excluded from the highly-skilled fast-track pilot, and only 24 Delhi IT/science slots (2025). |
| bd-direct-work-track-record | 40 | Emerging, not established: documented but modest BD flow to Czechia (academic 2018–24, "only half stay", partly transit/irregular); strongest proxy is Indian/non-EU IT inflow, not BD-specific. Modest confidence. |
| employer-sponsorship-willingness | 60 | Prague/Brno tech hires actively; Blue Card sponsor burden moderate; Highly Qualified Worker Programme needs employer ≥2 yrs / ≥3 staff (most tech firms qualify); friction from programme registration + doc burden; smaller market than DE/NL. |
| route-onward-pr-citizenship | 72 | Clean settlement track: Blue/Employee Card time → PR at 5 yrs (A2) → citizenship ~10 yrs (B1), dual retained both ways. Not higher only because the route carries Czech-language gates downstream. |
| current-openness | 62 | Net-expanding for skilled despite ANO win (June-2026 MPO loosening + expansion, +2,000 slots, 90-day Single-Permit cap, skilled favoured) — tempered by tight 24-slot Delhi IT cap and hostile ANO/SPD backdrop. |

**Derived category score** (weights 24/22/16/16/14/8): 64·.24 + 58·.22 + 40·.16 + 60·.16 + 72·.14 + 62·.08 = **15.36 + 12.76 + 6.40 + 9.60 + 10.08 + 4.96 = ~59.2.**

## Extras (requested)

- **dual_citizenship:** `{ allowed: true (Czechia permits dual since 1 Jan 2014), on_bd_dnc_list: true (Czechia within Bangladesh's all-Europe Dual-Nationality-retention scope), note: "Naturalising Bangladeshi keeps BD nationality; both sides clear. Scored in the citizenship cell (dual-citizenship-retention 88) — context only here." }`
- **decisive_movers:** (1) Blue Card = no quota + direct individual filing in Delhi (lifts accessibility); (2) Oct-2025 Delhi rule locking Employee Card to government programmes + only 24 IT/science Delhi slots (depresses overseas-direct-hire/openness); (3) thin, emerging BD track record (caps track-record factor); (4) clean PR-at-5 / citizenship-at-10 linkage with dual retained (lifts route-onward); (5) June-2026 MPO expansion of skilled programmes (lifts openness).
- **highlight_flag:** **No.** A genuinely workable direct-work route (Blue Card especially), but not a standout: subcontinent-shared quotas, BD doc superlegalization, a thin BD track record, and the hostile ANO/SPD climate keep it merely "good, with friction," not a highlight. (Note: the country overall already sits below the 60% inclusion line and is flagged as a drop candidate on Muslim-diaspora/politics grounds.)
- **confidence:** Moderate–high on the regulatory route (Blue Card / Employee Card / quotas — all gov-sourced and cross-checked); **moderate** on current-openness (fast-moving 2026 policy, ANO government still forming); **lower** on bd-direct-work-track-record (no clean BD-by-nationality work-permit series; proxy-based).
- **caveats:** Salary floor rises annually (re-check each May). Delhi IT-slot allocation (24 in 2025) is small and should be re-verified for 2026. Employee Card programme-locking (Oct 2025) is recent and embassy practice may evolve. The Blue Card no-quota route is the recommended primary path for this couple.

## Sources (official-first)

- Czech Embassy New Delhi — Economic migration: programmes & quotas (effective 01.07.2025): https://mzv.gov.cz/newdelhi/en/ko/visa_information/long_term_visa_long_term_residence/economic_migration_programs_and_quotas.html
- Czech Embassy New Delhi — Employee Card application (BD eligible; superlegalization; programme-only appointments): https://mzv.gov.cz/newdelhi/en/ko/visa_information/long_term_visa_long_term_residence/employee_card_application_2.html
- Czech Embassy New Delhi — Blue Card application (direct filing; no quota; 90-day decision): https://mzv.gov.cz/newdelhi/en/ko/visa_information/long_term_visa_long_term_residence/blue_card_application.html
- Ministry of Industry & Trade (MPO) — Economic migration & government programmes (Highly Qualified Worker vs Qualified Worker scope/eligibility): https://mpo.gov.cz/en/foreign-trade/economic-migration/economic-migration-and-government-programs--239491/
- ipc.gov.cz — Permanent residence after 5 years of temporary residence (A2 Czech): https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/permanent-residence/permanent-residence-permit-after-5-years-of-temporary-residence-in-the-czech-republic/
- VisaHQ — Czechia lifts EU Blue Card salary threshold to CZK 73,823 from 1 May 2026: https://www.visahq.com/news/2026-04-19/cz/czech-republic-lifts-eu-blue-card-salary-threshold-to-czk-73823-from-1-may-2026/
- Expats.cz — Czechia approves new foreign-worker quotas (Delhi 24 IT/science slots; skilled favoured): https://www.expats.cz/czech-news/article/czechia-approves-new-foreign-worker-quotas-who-stands-to-benefit
- VisaHQ — Czech govt loosens paperwork & expands economic-migration programmes (1 June 2026): https://www.visahq.com/news/2026-06-02/cz/czech-government-loosens-paperwork-expands-access-to-economic-migration-programmes/
- Wiley / Mucha (2026), *Population, Space and Place* — BD migrant transit via Central/Eastern Europe incl. Czechia (track-record proxy): https://onlinelibrary.wiley.com/doi/full/10.1002/psp.70181
