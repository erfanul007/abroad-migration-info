# PRD — Abroad Migration Feasibility

| Field | Value |
|-------|-------|
| Document | Product Requirements Document |
| Product | Abroad Migration Feasibility (working title) |
| Repository | `abroad-migration-info` |
| Owner | Erfanul Bhuiyan |
| Status | Final (ready for implementation planning) |
| Version | 1.0 |
| Created | 2026-06-16 |
| Last updated | 2026-06-16 |

---

## 1. Overview & Problem

### 1.1 Problem
Choosing a country to migrate to is a high-stakes, multi-factor decision. Information is scattered across government portals, forums, and rankings; criteria are weighed inconsistently; and the same country can be excellent on one dimension (e.g. job market) and weak on another (e.g. speed to citizenship). There is no single, transparent, personally-weighted view that ranks candidate countries against **one applicant's specific goal and profile**.

### 1.2 Solution
A static React single-page application that scores and ranks candidate migration countries against a fixed personal profile and goal. Each country is scored 0–100 on a set of weighted categories; a transparent weighted-sum produces an overall 0–100 score. The app surfaces this through a dashboard, an interactive leaderboard, country deep-dives with evidence and references, and country comparison. Data is stored as JSON files and treated as the backend store; the frontend is presentation-only.

### 1.3 Primary goal context
The applicant's intended pathway is: **MSc studies → post-study work permit → permanent residency (PR) → citizenship → passport**, ideally with spouse accompanying. Preference is for Europe, Australia, and similar first-world destinations, with faster routes to citizenship favoured. No candidate country is discarded outright — countries are scored, not filtered.

---

## 2. Goals & Outcomes

### 2.1 Outcomes
| ID | Outcome |
|----|---------|
| O1 | A ranked, transparent view of candidate countries tailored to the applicant's goal and profile. |
| O2 | Each score is explainable — backed by reasoning, evidence, and references, with a review date. |
| O3 | Easy what-if exploration: re-sort, filter, and compare countries across any category. |
| O4 | A polished, shareable artifact suitable for a public portfolio / professional network. |
| O5 | Data is decoupled from UI so countries, categories, and weights can be extended without code changes. |

### 2.2 Success signals (non-binding)
- The applicant and spouse can reach a shortlist of 3–5 countries from the leaderboard and comparison views.
- Any score on the leaderboard can be traced to its reasoning and at least one reference link within two clicks.
- Adding a new country or category requires editing JSON only — no component changes.

---

## 3. Users & Personas

| Persona | Role | Needs | Priority |
|---------|------|-------|----------|
| Applicant ("You") | Software Engineer, Netpower; primary decision-maker | Rank countries against the MSc→PSW→PR→citizenship→passport goal; drill into evidence; compare finalists | Primary |
| Spouse | Software Engineer, Optimizely, 4+ yrs; co-decision-maker | Understand spouse work/study rights and family pathway per country | Primary |
| Public visitor / recruiter | External viewer reached via portfolio/LinkedIn | Quickly grasp the methodology and see a credible data-visualisation showcase | Secondary |

**Applicant profile (fixed data):** Both applicant and spouse hold BSc in CSE from Daffodil International University (completed 2022-02), both currently based in Dhaka, Bangladesh, both working as software engineers (Netpower; Optimizely). Shared profession: IT / Software / AI Engineering — a top-priority decision factor.

---

## 4. Scope

### 4.1 In scope (v1)
- Personal profile/goal storage and an About page rendering it.
- 15 weighted scoring categories (weights sum to 100), extendable via JSON.
- 20 seed countries, extendable via JSON.
- Per-country, per-category score (0–100) with reasoning, evidence, references, and review date.
- Computed overall 0–100 score via weighted sum.
- Dashboard home, interactive leaderboard, comparison view, country detail pages.
- Visualisations: interactive leaderboard table, radar profile, weighted-contribution bars, and choropleth map (the radar is reused as the comparison overlay).
- Light/dark theme.
- Static deployment to GitHub Pages.

### 4.2 Out of scope (v1) — see §12 for the authoritative list
Backend, auth, database, i18n/localisation, live data feeds, user accounts, content management UI, mobile app.

---

## 5. Domain Model & Scoring Methodology

### 5.1 Definitions
- **Category** — a scored dimension of migration feasibility. Has a fixed `weight`.
- **Weight** — a category's ceiling contribution to the overall score. Weights across all categories **sum to 100**, so each weight is effectively that category's percentage of the total.
- **Score** — a country's rating on a category, integer or decimal **0–100**. Near 100 = most beneficial / best match; near 0 = not recommended.
- **Overall score** — computed, never stored.

### 5.2 Formula
```
overall = Σ over categories ( category.score / 100 × category.weight )
```
Because weights sum to 100, `overall` is bounded to **0–100** and reads directly as a percentage. The overall score is a pure, derived value computed at runtime from per-category scores (single source of truth); it is not persisted in data files.

If a category is **entirely absent** from a country's data, it is excluded and the remaining weights are **renormalised** (the present weights are rescaled to 100), so a missing category is never silently counted as 0. A **pending** cell, by contrast, carries a placeholder score and **is** included in the sum — the country is then flagged provisional (per Q3 / §9).

### 5.3 Categories (v1) — weights sum to 100
| # | Category | Short label | Weight | What it measures (documented factors) |
|---|----------|-------------|--------|----------------------------------------|
| 1 | Software & AI Job Market | Job Market | 10 | Demand for software/AI engineers, salary levels, visa sponsorship norms, remote acceptance, market size for both spouses. |
| 2 | Direct Work-Visa Route (Bangladesh) | Direct Work | 10 | _New category._ _Bangladeshi direct skilled-work entry route:_ sponsorship availability and salary thresholds, route to take up skilled work from Bangladesh without first studying. |
| 3 | Visa Accessibility (Bangladesh) | Visa Access | 9 | _Bangladeshi-national lens:_ student/entry visa **acceptance vs. refusal rate for Bangladeshi applicants**, **embassy/consulate in Dhaka** vs. travel required (e.g. New Delhi) for biometrics/interview, processing time & procedural complexity, financial-proof / blocked-account / sponsorship bars, document verification & scrutiny burden, **diplomatic ties** Bangladesh ↔ country, history of **bans / restrictions / heightened scrutiny** for BD passport holders. |
| 4 | Citizenship & Passport Strength | Citizenship | 9 | Years to citizenship, dual-citizenship allowed, residency/language requirements, passport strength (visa-free access). |
| 5 | Post-Study Work Permit | Post-Study Work | 8 | **PSW permit duration**, eligibility ease, job-search window, transition to skilled-work visa, **spouse work rights during PSW**. |
| 6 | Spouse Work & Family | Spouse & Family | 8 | Dependent visa availability, **spouse work permit during study**, **spouse work permit after study/work**, family reunification, children's schooling. |
| 7 | Master's Study Access | MSc Study | 7 | English-taught program availability, tuition/study cost, scholarship availability, **typical program duration**, **student part-time work rights (hrs/week)**, spouse-can-accompany, intake flexibility. |
| 8 | Permanent Residency Pathway | PR Pathway | 7 | Years to PR eligibility, clarity of route, points/criteria difficulty, predictability of policy. |
| 9 | Income & Cost of Living | Income & Cost | 6 | Net salary vs. rent and living cost, savings potential, housing availability. |
| 10 | Culture & Language | Culture/Lang | 6 | English usability day-to-day, **local-language requirement for PR/citizenship**, integration support, work–life balance, openness/diversity, climate, general livability. |
| 11 | Healthcare & Welfare | Healthcare | 5 | Healthcare access, quality, cost & coverage for students/residents; unemployment support; parental benefits; pensions; general safety net. |
| 12 | Safety & Rule of Law | Safety & Law | 5 | Crime levels, rule of law, treatment of immigrants, judicial fairness. |
| 13 | Political Stability | Politics | 4 | Government stability, immigration-policy volatility, anti-immigrant sentiment trend. |
| 14 | Tax Burden | Tax | 3 | Income tax burden, treatment of students/foreign workers, take-home pay. |
| 15 | Muslim Diaspora | Muslim | 3 | Muslim & South-Asian community size, halal food availability, mosques/prayer facilities, religious accommodation, anti-Muslim sentiment trend. |
| | **Total** | | **100** | |

_Ordered by weight, descending. Ties are listed pathway-stage first. **Direct Work-Visa Route (Bangladesh)** is the newly added category._

> Weights and category set are **data**. They can be rebalanced or extended by editing `categories.json`; the only invariant the app enforces/validates is that weights sum to 100.
>
> **Naming:** the full `name` is canonical and shown on country pages, the About methodology, radar axes (where space allows), and tooltips. The `shortLabel` is used **only** for dense leaderboard category-column headers; hovering a column header reveals the full name.
>
> **Scoring rigor:** scores are curated judgements, each backed by cited sources and a `lastReviewed` date. The high-weight, policy-volatile categories — Visa Accessibility, Post-Study Work, Citizenship, PR Pathway — must each carry at least one authoritative (ideally official/government) source, because they shift with policy and move rankings the most; thinly-sourced scores in these categories are the main credibility risk for the tool.

### 5.4 Seed countries — 20, extendable
The set (alphabetical): Australia, Austria, Belgium, Canada, Czechia, Denmark, Estonia, Finland, France, Germany, Ireland, Italy, Luxembourg, Netherlands, New Zealand, Norway, Sweden, Switzerland, United Kingdom, United States.

**Curation (as-built):** all 20 countries are fully scored — every one of the 15 categories carries an integer score with summary, reasoning, evidence bullets, and official-first source links, each stamped with a `lastReviewed` date. Scores were validated against live 2025–26 official sources, anchored to the fixed applicant profile on a single absolute 0–100 scale (methodology: `docs/superpowers/research/score-validation-brief-2026-06-16.md`). No cell currently ships as `pending`; the `pending` status remains a supported state for any future not-yet-sourced category. Inclusion rule: a candidate is added only if it scores **≥ 50 overall** and its shape exists in the Natural Earth `countries-110m` geometry — so countries that fall below 50 or cannot render on the map (e.g. Singapore, Malta) are excluded.

---

## 6. Functional Requirements

### 6.1 Dashboard (Home) — route `/`
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-D1 | Show a podium of the top 3 countries by overall score, with flag, name, and score. | Must |
| FR-D2 | Show a choropleth world map shaded by overall score; clicking a country opens a popup overview (score, region, rank, summary) with a link to its detail page. | Should |
| FR-D3 | Embed a compact leaderboard table (top N) with a link to the full leaderboard. | Must |
| FR-D4 | Show quick stats: number of countries, number of categories, highest/lowest scoring category across the set, last-reviewed range. | Could |
| FR-D5 | Provide a one-line summary of the applicant's goal and a link to About. | Must |

### 6.2 Leaderboard — route `/leaderboard`
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-L1 | List all countries sorted descending by overall score (default). | Must |
| FR-L2 | Show overall score and every category's score per country (category columns). | Must |
| FR-L3 | Sort by overall score or by any individual category, ascending/descending. | Must |
| FR-L4 | Global text search across country names (and optionally region). | Must |
| FR-L5 | Filter by region and by overall-score range. | Should |
| FR-L6 | Toggle category column visibility (manage column density). | Should |
| FR-L7 | Expand a row to reveal per-category score detail inline, or link to the country page. | Should |
| FR-L8 | Visually encode scores (e.g. colour scale / bar) for fast scanning. | Should |
| FR-L9 | Rank reflects current sort; overall-score rank is stable regardless of column sort. | Must |

### 6.3 Compare — route `/compare`
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-C1 | Select up to 5 countries to compare (minimum 2). | Must |
| FR-C2 | Show a side-by-side table of all category scores plus overall score. | Must |
| FR-C3 | Show an overlaid radar chart of the selected countries' category profiles. | Should |
| FR-C4 | Highlight the per-category winner among the selected countries. | Could |

### 6.4 Country detail — route `/country/:iso`
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CD1 | Show country header: name, flag, region, overall score, overall rank, summary, last-reviewed date. | Must |
| FR-CD2 | Show a radar chart of the country's category profile. | Should |
| FR-CD3 | Show weighted-contribution bars: each category's contribution to the overall score. | Should |
| FR-CD4 | For each category, show a card with score, summary, reasoning, evidence bullets, reference links, and last-reviewed date. | Must |
| FR-CD5 | Show country-level reference links. | Must |
| FR-CD6 | Gracefully render placeholder content where data is not yet filled. | Must |

### 6.5 About — route `/about`
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-A1 | Render the applicant and spouse profile (profession, experience, education, location). | Must |
| FR-A2 | Render the migration goal and the target pathway (MSc → PSW → PR → citizenship → passport). | Must |
| FR-A3 | Render preferences (regions, faster citizenship, dual citizenship, software & AI job-market priority). | Must |
| FR-A4 | Explain the scoring methodology and list categories with their weights. | Must |
| FR-A5 | Link to the portfolio and LinkedIn profile. | Could |

### 6.6 Methodology — route `/methodology`
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-M1 | Explain how a score is built: factor → category (weighted mean of factor sub-scores) → overall (weighted mean of present categories), raw with no display curve. | Must |
| FR-M2 | Show the absolute tier scale (Excellent ≥80 · Good ≥70 · Average ≥60 · Weak ≥50 · Poor <50) and its colours, read live from `config.ts`. | Must |
| FR-M3 | Explain the two country flags (positive highlight; blocker tradeoff). | Should |
| FR-M4 | Show category weights (chart + per-category tiles, read live from data); open any category for its factor table. | Must |

### 6.7 Cross-cutting
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-X1 | All scores and totals derive from JSON data; no scores hard-coded in components. | Must |
| FR-X2 | Overall score computed by a single pure, unit-tested scoring function. | Must |
| FR-X3 | Adding a country (new JSON file) or category (new entry) requires no component code changes. | Must |
| FR-X4 | Light/dark theme toggle, persisted across sessions. | Should |
| FR-X5 | Responsive layout (desktop-first, usable on tablet/mobile). | Should |
| FR-X6 | Build-time or runtime validation that category weights sum to 100. | Should |

---

## 7. Information Architecture

```
Home (Dashboard)  /
  ├─ podium (top 3) · choropleth map · compact leaderboard · quick stats · goal summary
Leaderboard       /leaderboard
  └─ interactive table: search · per-category sort · filters · column toggle · expandable rows
Compare           /compare
  └─ up to 5 countries: side-by-side table · overlaid radar
Country detail    /country/:iso
  └─ header · radar · contribution bars · per-category evidence cards · references
Methodology       /methodology
  └─ how the score is built · tier scale · flags · category weights (chart + tiles)
About             /about
  └─ profile · goal · pathway · preferences · scoring methodology · links
```

Navigation: persistent top nav — Dashboard · Leaderboard · Compare · Methodology · About — plus theme toggle. Country detail pages are reached from the leaderboard, map, and podium (not the top nav).

---

## 8. Visualisations

| Visualisation | Where | Library | Notes |
|---------------|-------|---------|-------|
| Interactive data table | Leaderboard, Compare | TanStack Table v8 (headless) | Native sort, filter, global search, column visibility. |
| Radar / spider chart | Country detail, Compare | Recharts | One axis per category; overlay multiple countries on Compare. |
| Weighted-contribution bars | Country detail | Recharts | Shows how each weighted category builds the overall score. |
| Interactive choropleth map | Dashboard | Leaflet + react-leaflet + topojson-client + world-atlas | Full-world choropleth shaded by overall score; pan + zoom, always north-up. SVG rendering (no WebGL → reliable). All country shapes from bundled GeoJSON, **no external tiles** (offline, no third-party calls); longitudes unwrapped to avoid Leaflet antimeridian bands. Click a country → popup overview → details. |

---

## 9. Data Model

JSON files under `src/data/`. Treated as the backend store; presentation-only consumes them. Every file is validated at load against a Zod schema (`src/lib/schema.ts`); the TypeScript data types are inferred from those schemas, so the runtime shape and the compile-time types share one definition.

### 9.1 `profile.json`
```jsonc
{
  // Two-person household of equivalent profiles. Peers, not applicant/dependent —
  // either partner can lead the application; the choice is interchangeable.
  "household": {
    "people": [
      { "name": "...", "role": "Software Engineer", "company": "Netpower", "location": "Dhaka, Bangladesh", "links": { "portfolio": "...", "linkedin": "..." } },
      { "name": "...", "role": "Software Engineer", "company": "Optimizely", "location": "Dhaka, Bangladesh", "links": { "portfolio": "...", "linkedin": "..." } }
    ]
  },
  "education": { "degree": "BSc in CSE", "institution": "Daffodil International University", "completed": "2022-02" },
  "goal": "MSc studies → post-study work → permanent residency → citizenship → passport",
  "pathway": ["MSc studies", "Post-study work permit", "Permanent residency", "Citizenship", "Passport"],
  "preferences": {
    "regions": ["Europe", "Australia", "First-world"],
    "fasterCitizenship": true,
    "dualCitizenship": "preferred",
    "professionPriority": "IT / Software / AI Engineering",
    "relocateTogether": true
  }
}
```

### 9.2 `categories.json`
```jsonc
[
  {
    "id": "job-market",
    "name": "Software & AI Job Market",
    "shortLabel": "Job Market",
    "weight": 10,
    "description": "Demand, salary, sponsorship, and market size for software/AI engineers.",
    "factors": ["Demand for SW/AI engineers", "Salary levels", "Visa sponsorship norms", "Remote acceptance", "Market size for both spouses"]
  }
  // ... 15 entries, weights sum to 100 (factors are now objects {id,label,description,weight}, not strings — see categories.json)
]
```

### 9.3 `countries/<id>.json` (file named by `id`, e.g. `germany.json`, `new-zealand.json`)
```jsonc
{
  "id": "germany",
  "name": "Germany",
  "iso": "DE",
  "iso3": "DEU",
  "flag": "🇩🇪",
  "region": "Europe",
  "summary": "Short narrative about Germany for this applicant.",
  "lastReviewed": "2026-06-16",
  "links": [{ "title": "Make it in Germany (official)", "url": "https://..." }],
  "categories": {
    "job-market": {
      "status": "scored",
      "score": 88,
      "summary": "Strong demand for software engineers.",
      "reasoning": "Why this score...",
      "evidence": ["Evidence bullet 1", "Evidence bullet 2"],
      "links": [{ "title": "Source", "url": "https://..." }],
      "lastReviewed": "2026-06-16"
    }
    // ... one entry per category id
    // placeholder cell: { "status": "pending", "score": 70 } — score shown muted, flagged "not yet sourced"
  }
}
```

> Notes: overall score is **not** stored — it is computed. `status` is `"scored"` (curated + sourced) or `"pending"` (placeholder). Pending cells render visibly marked ("not yet assessed / not yet sourced"); per Q3 they are not treated as 0. A country with any pending cell is flagged as incompletely assessed.

---

## 10. Technical Architecture

### 10.1 Stack (versions verified current, June 2026)
- **React 19 + TypeScript 5 + Tailwind CSS v4**, bundled with **Vite 8** (`@tailwindcss/vite` plugin).
- Routing: **React Router v7** — `createBrowserRouter`; import from the `react-router` package (v7 merged `react-router-dom`).
- Table: **TanStack Table v8** (headless) — sort/filter/search/column-visibility.
- UI components: **shadcn/ui** (Radix + Tailwind v4, CLI-installed) for polished primitives.
- Charts: **Recharts 3** (radar, bars).
- Map: **Leaflet + react-leaflet + topojson-client + world-atlas** — full-world choropleth on a tile-less Leaflet map (a `GeoJSON` layer, SVG renderer, no WebGL).
- Data validation + types: **Zod 4** — schemas in `lib/schema.ts` validate every JSON file at load; the data TypeScript types are inferred from those schemas (`z.infer`), so runtime checks and compile-time types can't drift.
- All dependencies installed via npm / component CLI — no hand-rolled equivalents of the above.

> **Map library decision (as-built, deviation from v1.0):** the PRD originally named `react-simple-maps` (latest release 3.0.0, 2022, React `^16.8` peer range — outdated and React-19-incompatible; its React-19 community fork is thin). The build settled on **plain Leaflet via react-leaflet**, drawing our bundled GeoJSON as a tile-less `GeoJSON` layer (SVG renderer, no WebGL, no external tiles → fully offline). Leaflet provides robust pan/zoom, popups, and event handling out of the box, versus hand-rolling SVG projection and interaction code. Counter-risk: Leaflet does not clip at the antimeridian, so dateline-crossing rings (Russia, Fiji, Aleutians) need their longitudes **unwrapped** to avoid full-width bands, and Antarctica is omitted (it wraps the pole) — ~30 lines we own. Geometry join is by country name (Natural Earth `countries-110m` names are stable for the 20 seeds); `iso` is retained for flags and `/country/:iso` routing (`iso3` is retained for possible future use). Topojson is decoded with `topojson-client`'s `feature()`.

### 10.2 Folder structure (separation of concern)
```
src/
  data/        profile.json · categories.json · countries/<id>.json (20)
  types/       data types re-exported from the Zod schemas + derived types (ScoredCountry, ScoredCategory)
  lib/         utils (cn) · schema (Zod schemas + inferred types, +test) · scoring (+test) · formatters (+test) · data (+test) · palette
  components/
    ui/         shadcn primitives
    charts/     RadarProfile · ContributionBars · Choropleth
    leaderboard/ LeaderboardTable · columns · SearchBox · Filters
    common/     Layout · Nav · ThemeProvider · ThemeToggle · ScoreBadge · PendingBadge · StatCard · Podium · Section
  pages/        Dashboard · Leaderboard · Compare · CountryDetail · About · NotFound
  hooks/        useData · useTheme
  routes/       route definitions
```

### 10.3 Scoring module
`lib/scoring.ts` exposes a pure `computeOverall(country, categories)` and `rankCountries(...)`. Unit tests cover: weighted-sum correctness, handling of missing category data, and stable ranking. Data validation lives in `lib/schema.ts` (Zod): the schemas check full shape (status enum, required fields, integer 0–100 scores, link URLs); the two cross-field rules we own — category weights summing to 100, and a country referencing only known category ids — are tested. Tests cover our logic only, not Zod's shape-checking. Tests ship with each module (non-trivial logic).

### 10.4 Deployment
Static build deployed to **GitHub Pages**. English only. No backend, no auth. JSON bundled at build time. Vite `base` set to `/abroad-migration-info/` for the Pages project subpath; React Router uses a matching basename.

### 10.5 Locked implementation decisions (2026-06-16)
| Decision | Choice |
|----------|--------|
| Data curation scope | All **20** countries fully scored and sourced against live 2025–26 data (see §5.4); `pending` retained as a supported state for future categories. |
| Visual direction | **Clean modern minimal** — shadcn neutral base + single accent, data-forward, generous whitespace, subtle motion; light/dark. |
| Test runner | **Vitest** (Vite-native) for the scoring module and data validators. |
| Map data | Bundled `world-atlas/countries-110m.json` (decoded with `topojson-client`); rendered via **Leaflet / react-leaflet** (tile-less GeoJSON layer); geometry join on **country name** (iso/iso3 retained in data). |
| Region taxonomy | Derived from `region` values present in country JSON (no hardcoded list). |
| Pages base path | `/abroad-migration-info/` (Vite `base` + Router basename). |
| Verified library versions (2026-06-16) | React 19 · Vite 8 · React Router v7 · Tailwind v4 · shadcn/ui (latest) · TanStack Table v8 · Recharts 3 · Leaflet + react-leaflet · Zod 4 (data validation + inferred types). See §10.1 note for the map library rationale. |

---

## 11. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR1 | Fully static; no runtime backend dependency. |
| NFR2 | Initial load and leaderboard interaction feel instant for 20–40 countries × 15 categories. |
| NFR3 | Accessible: keyboard-navigable table, sufficient colour contrast, chart fallbacks/labels. |
| NFR4 | Maintainable: data edits never require touching components (FR-X3). |
| NFR5 | Responsive, desktop-first. |
| NFR6 | Type-safe: data shapes defined once as Zod schemas with inferred TypeScript types; every JSON file is validated against them at load (throws in dev/test, logs in prod). |

---

## 12. Out of Scope (v1)

- Backend services, database, authentication, user accounts.
- Internationalisation / localisation (English only; folder structure not pre-built for i18n).
- Live or automated data ingestion (scores are curated manually in JSON).
- Content-management UI for editing scores in-app.
- Native mobile apps.
- Automated recomputation of weights / what-if weight sliders (candidate for v2 — see Open Questions).

---

## 13. Open Questions

| ID | Question | Default assumption (if unanswered) |
|----|----------|-------------------------------------|
| Q1 | Should the leaderboard allow live re-weighting (sliders to change category weights and re-rank)? | No in v1; weights fixed in JSON. Candidate v2 feature. |
| Q2 | Should there be a "shortlist / favourites" mechanism for the applicant? | No in v1. |
| Q3 | When a country lacks a score for a category, exclude it from that country's overall (renormalise) or treat as pending? | Treat as pending placeholder; flag the country as incompletely assessed; do not count as 0. |
| Q4 | Display scores as raw 0–100 only, or also show letter/tier grades (A–F)? | Raw 0–100 with colour scale in v1. |
| Q5 | Is profile data considered public (portfolio) — confirm nothing sensitive is published? | Treat all profile/JSON content as public; exclude anything sensitive. |

---

## 14. Future / Extensibility

- Add countries by dropping a new `countries/<id>.json`; add categories via `categories.json` (rebalance weights to 100).
- v2 candidates: interactive weight sliders (personal re-weighting), favourites/shortlist, tier grades, score history / change log, i18n.

---

## Appendix A — Glossary
- **MSc** — Master of Science (postgraduate degree).
- **PR** — Permanent Residency.
- **PSW** — Post-Study Work (permit).
- **SPA** — Single-Page Application.
- **Overall score** — weighted-sum feasibility score, 0–100.
- **Weight** — a category's percentage-point ceiling contribution to the overall score (weights sum to 100).
