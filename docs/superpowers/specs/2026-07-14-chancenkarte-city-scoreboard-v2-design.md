# Chancenkarte City Scoreboard v2 — Design

Date: 2026-07-14 · Status: approved (user, this session) · Owner: data + one bounded UI change

## Context

The applicant's pathway changed from *MSc → post-study work → PR → citizenship* to
**job-search visa (Chancenkarte) → part-time odd jobs while searching → full-time job + EU Blue Card → PR → citizenship**, Germany only.
Scope of this change is the Germany cities dataset (`src/data/cities/germany.json`) and the dataset modal UX. **No country-level data is reassessed.** Country categories, weights, and all `src/data/countries/*.json` stay untouched.

Applicant lens for scoring (records the "who"):

- Bangladeshi national, based in Dhaka; relocating with spouse (also a software engineer).
- **Full-time lens:** international talent, 4y+ experience — C# / .NET and Python, distributed systems, AI/RAG, enterprise integrations. Mid-level, not junior.
- **Part-time lens:** any field — gastro, warehouse/logistics, delivery, retail, physical labour; student-style odd jobs within the Chancenkarte ≤20 h/week allowance. Not limited to tech gigs.

## Decisions

### D1 — Criteria: 12 (11 existing + `settle`, `dual` rejected)

- New `settle` — **PR & naturalisation office speed**: city Ausländerbehörde / Einbürgerungsbehörde throughput for Niederlassungserlaubnis and citizenship processing. City-differentiating (Berlin: years of backlog; Leipzig: weeks).
- `dual` (dual-earner depth) was proposed and **rejected by the user** — do not add.
- Rule: every scored criterion must differ between cities. Federal constants (21/27-month settlement, B1 requirement, Blue Card salary bar, €1,091/month proof of funds) live in methodology text only, never as scored cells.

Criterion description rewrites (lens baked in):

- `jobs`: demand + sponsor density for a **mid-level .NET/Python + AI-RAG/enterprise-integration** engineer (enterprise employers such as DATEV, Bosch, fintech, corporates now count for more; junior-generalist volume counts for less).
- `comp`: saturation **at mid level** — the junior "300–400 applications/role" wall is discounted.
- `pt`: depth of **any-field ≤20 h/week gig market** (gastro, logistics, delivery, retail) accessible without German fluency.
- `eng`: English usability for **full-time work + bureaucracy + daily life** only — part-time access no longer depends on it.

### D2 — Weights (sum 100)

| id | label | old | new |
|---|---|---:|---:|
| jobs | Job availability & sponsors | 14 | **18** |
| conv | Blue Card conversion speed | 16 | **16** |
| anm | Anmeldung ease | 10 | **10** |
| pt | Part-time / side-income (any field) | 6 | **10** |
| rent | Housing + rent affordability | 13 | **8** |
| eng | English usability | 9 | **7** |
| safe | Safety & xenophobia climate | 8 | **7** |
| comp | Competition / odds (mid-level) | 8 | **6** |
| settle | PR & naturalisation office speed | — | **6** |
| cost | Cost of living | 6 | **5** |
| conn | Connectivity & facilities | 6 | **4** |
| comm | BD/Muslim community + halal | 4 | **3** |

Clusters: land-job 41 (jobs+pt+eng+comp — pt any-field is the survival line) · convert 26 (conv+anm) · settle 6 · live 27 (rent+safe+cost+conn+comm).
Ordering rationale: land full-time job inside the 12-month window dominates; conversion speed second; settlement real but distant; rent reduced per user instruction.

### D3 — Cities: 16

Existing 12 (Berlin, Munich, Hamburg, Frankfurt, Cologne, Düsseldorf, Stuttgart, Nuremberg, Karlsruhe, Leipzig, Dresden, Aachen) + **Potsdam, Dortmund, Darmstadt, Hannover**.

### D4 — Research scope (deep-research protocol, gov-first, ≥2 sources/claim)

1. 4 new cities: all 12 criteria + context columns + full detail block (summary, note, pros, cons, links).
2. Existing 12 cities: score `settle` (new), **re-score `jobs`, `comp` (mid-level lens) and `pt` (any-field lens)**; spot-check `eng`.
3. Existing scores for conv, anm, rent, safe, cost, conn, comm stand (reviewed 2026-07-13) unless research surfaces contradictions.
4. Refresh methodology, caveats, sources; verify 2026 Blue Card salary bar and Chancenkarte proof-of-funds figures.
5. Every changed cell: provenance in detail/links, `lastReviewed` bumped.

### D5 — Modal table UX

- Table shows **scored columns + overall only**; non-score context columns (population, rentCentre, rentM2, salary, bdCommunity, embassy) move out of the table into a per-row expandable dropdown (collapsible row detail).
- Row detail renders **pros and cons for every city** (data must guarantee non-empty pros/cons per row), plus summary, note, links, and the context values.
- Data-driven: component keys off `column.kind`; no schema change expected.

### D6 — Profile text update

`profile.json`: update `goal` + `pathway` strings to the Chancenkarte route; add full-time skills/experience emphasis (4y+, C#/.NET, Python, distributed systems, AI/RAG, enterprise integrations) and the any-field part-time note. Text-only; no scores; country categories intentionally left MSc-framed (out of scope).

## Validation

- `npm run lint && npm run typecheck && npm run test && npm run build` all green before done.
- `npm run cache:scores` before commit (country data unchanged; run to satisfy drift gate).
- Dataset Zod gate: score-column weights present, cities scale = "score", unique ids.
- No commit/push without explicit user approval.

## Out of scope

Country JSONs, categories.json weights, universities dataset, choropleth/leaderboard logic, any non-Germany city data.
