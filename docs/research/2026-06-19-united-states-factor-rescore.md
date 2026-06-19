# United States — factor-level re-score — 2026-06-19

**Profile:** Bangladeshi (Dhaka) couple, both ~2022 BSc-CSE / software-AI engineers; MSc → PSW → PR → citizenship; relocating together.

**Scope:** 20th and final country under the factor model. 14 categories, 91 factors vs `categories.json`; derived in `scoring.ts`. US was a full `pending` placeholder.

## Method

Targeted gov-first WebSearch (deep-research workflow throttled by org spend limit), dual-citizenship check first. Sourcing: uscis.gov, travel.state.gov, IRS, Boundless, WJP, Henley, US Embassy Dhaka/TBS (social-media vetting), American Immigration Council (travel ban). ≥2 sources per decisive claim.

## Decisive finding — NO blocker

- **Dual citizenship retained both ways.** The US allows dual citizenship with no renunciation, and the US is on Bangladesh's DNC list → `dual-citizenship-retention` 90, `hasBlocker = false`.

## Key decisive facts (cited in `united-states.json`)

- **The path is the obstacle:** F-1 → OPT (1 yr) + **STEM OPT (24 mo) = 3 years** → **H-1B lottery (~25% odds + a new $100,000 fee)** → employment green card.
- **A structural advantage:** **Bangladesh is NOT EB-green-card-backlogged** (unlike India/China), so EB-2/EB-3 (or EB-2 NIW for strong AI researchers, self-petition, no lottery) can be relatively fast IF work status is secured.
- **Citizenship:** 5 years after green card + native-English civics test (new 128-question version); dual retained. Henley 2026 ~10th.
- **Jobs:** the world's highest pay (FAANG L4 ~$306k, AI $145–350k) and #1 AI ecosystem — but H-1B-gated and hit by ~82k Q1-2026 layoffs.
- **Study:** MIT/Stanford/CMU/Berkeley (world's best CS/AI) but extreme tuition ($50–80k/yr).
- **Visa (BD lens — a weakness):** full embassy in Dhaka, but **mandatory public social-media vetting**, 'hostility' screening and 2025 appointment suspensions sharply raise F-1 refusal risk; Bangladesh is NOT on the expanded travel ban.
- **Spouse-family (weak):** F-2 spouse cannot work; H-4 work only at the green-card stage — so the couple effectively needs both on F-1/OPT.
- **Healthcare (weak):** no universal system; employer-tied or expensive private; students pay $2–5k/yr; high out-of-pocket and gaps.
- **Politics (the lowest score recorded):** the Trump administration is restricting H-1B/OPT/F-1 and expanding travel bans amid extreme volatility.
- **Diaspora (a highlight):** the **largest Bangladeshi-American community (~600,000, two-thirds in NYC — 'Little Bangladesh')**, hundreds of mosques, abundant halal.

## Derived result

| Category | Derived | | Category | Derived |
|---|---|---|---|---|
| job-market | 68.6 | | healthcare | 45.2 |
| visa-access | 46.4 | | culture-language | 73.6 |
| citizenship | 61.4 | | safety-law | 49.0 |
| post-study-work | 65.6 | | politics | 33.5 |
| spouse-family | 54.1 | | tax | 53.7 |
| msc-study | 64.0 | | muslim-diaspora | 73.8 |
| pr-pathway | 52.8 | | **OVERALL** | **~58.2** |
| income-cost | 61.1 | | | |

**Read:** The US has the highest ceiling in the whole set — salary-levels 95, AI-specialisation 88, the largest BD diaspora (73.8), English-native (73.6), and a green-card backlog advantage Bangladeshis (unlike Indians) actually enjoy. But the factor model penalises the **path and the edges**: the H-1B lottery + $100k fee (sponsorship 40, pr-pathway 52.8), Trump-era F-1 scrutiny (visa-access 46.4), no universal healthcare (45.2), gun-violence/enforcement safety (49.0), restricted spouse work (54.1) and the most hostile immigration politics recorded (33.5). It lands at **~58.2 — below 60: pulled down by the path, not the prize.**

## Inclusion verdict — DROP CANDIDATE (marginal)

`hasBlocker = false`; derived overall **~58.2 < 60** → flagged for dropping; surfaced, not deleted. The highest-variance case: if the H-1B lottery is won (or an EB-2 NIW succeeds), the US is arguably the best outcome of all; if not, the path collapses. The model scores the expected path, not the best case.
