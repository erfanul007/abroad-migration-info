# France — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) married couple, both ~2022 BSc-CSE / software-AI engineers; MSc → post-study work → PR → citizenship; relocating together.

**Scope:** Tenth country under the factor model. 14 categories, 91 factors vs `categories.json`; derived in `scoring.ts`. France was a full `pending` placeholder.

## Method

Targeted gov-first WebSearch (deep-research workflow throttled by org spend limit), dual-citizenship check first. Sourcing: france-visas.gouv.fr, Campus France, Fragomen (2026 civics/B2 rules), OECD (Taxing Wages), WJP (country profile), Vision of Humanity (GPI), Henley, France 24/Bridge Initiative (laïcité). ≥2 sources per decisive claim.

## Decisive finding — NO blocker

- **Dual citizenship retained both ways.** France recognises dual nationality with no renunciation, and France is on Bangladesh's DNC list → `dual-citizenship-retention` 88, `hasBlocker = false`.

## Key decisive facts (cited in `france.json`)

- **Citizenship:** 5 years, but from **1 Jan 2026 B2 French** (up from B1) + a new civics exam + stable French-source income; 18–24-month processing. Henley 2026 joint **4th (~185)**.
- **PSW = 12-month APS** (full work rights, any employer) → Salarié / Passeport Talent; 2026 added A2-French to convert and barred APS remote-work for non-French firms.
- **PR:** carte de résident after 5 years; 2026 added civic/language tests; Passeport Talent eases it.
- **Jobs:** Paris is a top-3 EU **AI hub** (Mistral AI, Meta FAIR, Station F, Datadog); AI €52–160k; large multi-city market.
- **Study:** 52 English-taught AI master's (PSL, Polytechnique, Paris-Saclay, Sorbonne); historically low public tuition but **non-EU fees rising from Sept 2026**; 60% of priority grants reserved for AI.
- **Visa (BD lens — a strength):** full **Campus France + embassy + VFS in Dhaka** → in-country application/biometrics (unlike Finland/Estonia/Czechia/Belgium); ~30–60-day processing; modest funds.
- **Tax:** 58.2% marginal wedge (3rd-highest OECD); impatriate regime generous but generally needs recruitment-from-abroad (largely unavailable to a graduate who became resident while studying); France–Bangladesh treaty in the broad French network.
- **Healthcare:** universal **PUMA** after ~3 months; students enrol free in social security.
- **Safety:** WJP 2025 **22nd**; GPI 2025 **74th** (lowest in W. Europe — militarisation, unrest, urban crime).
- **Politics/diaspora (the drag):** **RN largest single party** (142 seats, 2024) amid hung-parliament instability; **laïcité weaponised** against visible Islam (school/sport hijab + abaya bans, 700+ mosque closures). Yet Europe's **largest Muslim community** with abundant mosques/halal and a real **Bangladeshi quarter in Paris (La Chapelle)**.

## Derived result

| Category | Derived | | Category | Derived |
|---|---|---|---|---|
| job-market | 68.4 | | healthcare | 70.2 |
| visa-access | 57.9 | | culture-language | 49.8 |
| citizenship | 61.0 | | safety-law | 55.9 |
| post-study-work | 64.3 | | politics | 38.8 |
| spouse-family | 62.9 | | tax | 49.5 |
| msc-study | 68.1 | | muslim-diaspora | 54.1 |
| pr-pathway | 53.6 | | **OVERALL** | **~59.7** |
| income-cost | 54.0 | | | |

**Read:** France's strengths are real and distinctive — the strongest job-market of the Europeans so far (68.4, the Mistral/Station F AI hub), top healthcare (70.2), deep affordable study (68.1), best-in-class Dhaka visa access (57.9), and 5-year dual-retained citizenship (61.0). They are very nearly offset by a uniquely hostile climate for a visibly Muslim couple: **politics 38.8** (RN largest, laïcité weaponisation, hung-parliament churn), **culture-language 49.8** and **muslim-diaspora 54.1** (Europe's best infrastructure but worst legal restrictions on visible practice — legal-accommodation factor 28), plus **safety-law 55.9** (GPI 74th) and a 58% tax wedge. Net: **~59.7 — just below the 60% line.**

## Inclusion verdict — DROP CANDIDATE (marginal)

`hasBlocker = false`; derived overall **~59.7 < 60** → flagged for dropping; surfaced, not deleted. The closest call of all the drop candidates — France's AI-hub strength almost rescues it, but laïcité restrictions on visible Muslim practice and RN-driven instability hold it just under for this specific profile. A strong candidate for the user's explicit review.
