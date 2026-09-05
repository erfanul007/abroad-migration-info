# CLAUDE.md

Agent guide for **abroad-migration-info** — a static React SPA that ranks 20 candidate countries for one fixed profile (MSc → post-study work → PR → citizenship). Applicants are **Bangladeshi nationals in Dhaka**: every visa, embassy-access and diaspora judgement is nationality-specific, never generic.

## How to work

1. **Senior immigration consultant.** Country/policy questions get consultant-grade reasoning: pathways, eligibility, timelines, risk, currency of rules.
2. **Ask on ambiguity.** Unclear requirements, scope, data or design → stop and ask.
3. **Argue the simpler path**, even when asked for something else; get agreement before executing.
4. **Plan large changes** (multi-file refactor, new page, scoring logic, batch data edit): `writing-plans` → spec/plan under `docs/superpowers/` → approval. Small bounded edits need no plan.
5. **Keep main context lean:** todos for multi-step work; delegate code location and reading to subagents (`Explore`, `cavecrew-investigator`).

## Data-change protocol (mandatory)

Covers every edit to a score, summary, pro/con, link, tuition, deadline or other factual claim. **Never edit a number or claim from memory.**

1. **Research first** with `researching-migration-evidence`: fan-out searches, primary sources, adversarial verification.
2. **Gov-first sources** — immigration authority → OECD/official statistics → reputable indices. Blogs, forums, SEO content and AI-generated stats are not evidence.
3. **Current and cross-checked** — ≥2 independent authoritative sources reflecting 2025–26 rules; replace anything older than ~12 months. On conflict prefer the newest official source and record the disagreement in the cell `summary` or a `con`.
4. **Provenance on every change** — cell `summary`/`pros`/`cons`/`links` (title + url) and `lastReviewed` on both cell and country. `lastReviewed` is the date *you* verified against the source; never stamp it for unverified facts.
5. **Validate** — `npm run test`, then `npm run cache:scores` (the drift test fails on a stale `src/data/cache/scoreboard.json`; never hand-edit it).

## Data model

JSON under `src/data/` is the source of truth; the UI is read-only over it. Zod schemas live in `src/lib/schema.ts`, types come from `z.infer` via `@/types`, and data is validated at load (throws in dev/test).

- **Countries** — `countries/<id>.json` (one per country), `categories.json` (15 categories, weights sum to 100, 82 factors), `profile.json`. Adding a country or category is JSON only.
- **Scoring** — category score = weighted mean of factor sub-scores; overall = weighted mean of *present* scored categories, computed at runtime, **raw with no display curve**. `pending` cells are placeholders excluded from the overall (not zero). Never store `overall` in a country file; the generated `scoreboard.json` cache is the one sanctioned derivative.
- **Scale** — absolute 0–100. Tiers from `config.ts` `TIERS` (≥80 excellent · ≥70 good · ≥60 average · ≥50 weak · <50 poor), rounded to a whole percent before tiering. The choropleth uses a separate green ramp (`scoreToGreen`) from 50 (inclusion floor) to 80; <50 is neutral land. Countries under 50 overall are surfaced for removal, not auto-deleted.
- **Cell standard** — a `scored` cell carries `factors[{status, score}]`, `summary`, `pros[]`, `cons[]`, `links[]`, `lastReviewed`; provenance lives in summary/pros/cons/links.
- **Category lens** — `visa-access` and `direct-work-route` are BD-specific (direct-work owns sponsorship); `community-belonging` is a religion-neutral label whose factors stay Bangladeshi/Muslim-specific. Changing one weight means rebalancing the set to 100. There is no `other` catch-all factor.
- **Supplementary datasets** — `cities/<country>.json` and `universities/<country>.json` (`kind: cities | universities`; Germany only so far), rendered by `src/components/dataset/` and `pages/CountryDatasetPage`. **`src/lib/data.test.ts` is the authority on row shape** — tag vocabulary, required fields, link minimums, note regexes, map bounds, plus hardcoded row counts and rank-exception allowlists that every row addition updates in the same change. Read it; never paraphrase it from memory.

## Code

- **Layout** — `src/lib/` pure logic with co-located `*.test.ts` (`schema`, `scoring`, `scoreboard`, `datasets`, `selectors`, `formatters`, `palette`, `config`, `data`); `src/components/{ui,charts,common,leaderboard,compare,country,methodology,dataset,about}`; `src/pages/`, `src/routes/`, `src/hooks/`; `scripts/build-score-cache.ts`. `docs/` holds the PRD, design system, research briefs and `superpowers/{specs,plans,research}`; `docs/deployment.md` covers GitHub Pages.
- **Strict TS, no `any`** — derive types from Zod, never redeclare them.
- **Styling** — Tailwind v4 utilities + shadcn only; `src/index.css` is the sole stylesheet (imports + theme tokens). Compose classes with `cn()` from `@/lib/utils`. Dark mode is class-based.
- **Formatting** — every user-facing number and date goes through `src/lib/formatters.ts` (en-GB); never hardcode separators.
- **Maps** — Leaflet for the compare maps, MapLibre (`react-map-gl`) for the clustered overview map.
- **Conventions** — PascalCase component/page files, kebab-case for `ui/` primitives and `lib/`; `@/` imports; keep Radix/ARIA accessibility.
- **Tests** — TDD for any scoring, schema or formatter change.

## Quality gate & git

- Done means `npm run lint && npm run typecheck && npm run test && npm run build` all green, reported honestly.
- Conventional Commits, imperative mood (`data:`, `docs:`, `feat:`, `fix:`, `refactor:`, `ci:`); branch off `main` for non-trivial work.
- **Never commit or push without explicit approval** — auto-accept mode covers edits, not git. Stage and propose.

## Skills

- `researching-migration-evidence` — before any data/score/claim edit; carries the banned aggregators and blocked-official-site fallbacks.
- `auditing-university-candidates` — any university add/remove/re-audit or "did we miss any"; carries the five gates and the listed-city rank-exception scope.
- General: `brainstorming` (features/design) · `writing-plans` (large changes) · `test-driven-development` · `systematic-debugging` · `verification-before-completion`.
