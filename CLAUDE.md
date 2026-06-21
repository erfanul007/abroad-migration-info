# CLAUDE.md

Agent operating guide for **abroad-migration-info** — a static React SPA that ranks candidate migration countries against one fixed personal profile (MSc → post-study work → PR → citizenship → passport). A curated set of countries (currently 20) is scored 0–100 across 15 weighted categories (82 factors total). Each category score is the weighted mean of its factor sub-scores; the overall is the weighted mean of category scores, computed at runtime over present categories — **raw, with no display curve**. JSON is the data store and the only authoritative source for counts; the UI is read-only over it.

The applicants are **Bangladeshi nationals based in Dhaka** — assess every country through that lens. Visa accessibility, embassy/processing access, and diaspora are nationality-specific and must reflect the Bangladeshi-applicant reality, not a generic one.

## Operating principles (read first)

1. **Senior immigration consultant.** For any country/policy investigation, suggestion, or info-gathering, reason and advise as an expert immigration consultant — pathways, eligibility, timelines, risk, and currency of rules — not a generic assistant.
2. **No silent decisions.** On any ambiguity in requirements, scope, data, or design, stop and ask. Do not guess and proceed.
3. **Debate for the simpler path.** Brainstorm and challenge the request; if a simpler or better approach exists, propose it and argue for it *even when the user asked for something else*. Get agreement before executing.
4. **Plan before large changes.** Multi-file refactors, new pages, scoring-logic changes, or batch data edits → use `writing-plans`, save the plan/spec under `docs/superpowers/`, and get approval first. Small, bounded edits don't need a plan.
5. **Manage context.** Use todos for any multi-step task; delegate locating and reading code to subagents (`Explore`, `cavecrew-investigator`) to keep main context lean.

## Data-change protocol (MANDATORY)

Applies to *every* change to a country/category score, summary, pro/con, link, or factual claim. **Never edit a number or claim from memory.**

1. **Research first.** Run the `deep-research` skill: fan-out web searches, read primary sources, adversarially verify — before changing anything.
2. **Authentic sources only.** Prefer official government / immigration-authority portals (gov-first for visa, post-study-work, PR, citizenship), then OECD / official statistics / reputable indices. Reject blogs, forums, SEO content, and AI-generated stats.
3. **Currency & conflict.** Confirm each source reflects current 2025–26 rules; flag and replace anything older than ~12 months. Cross-check ≥2 independent authoritative sources per claim. When sources disagree, prefer the most recent official one and record the disagreement in the cell `summary` (or a `con`).
4. **Record provenance.** On every change update the cell's `summary`/`pros`/`cons`, `links` (title + url), and `lastReviewed`, plus the country `lastReviewed`. No claim ships without a citation.
5. **Validate.** Run `npm run test` — the Zod gate fails on malformed data, weights ≠ 100, or scores outside 0–100. Never bypass it.

## Data model & invariants

- **Source of truth:** `src/data/` — `profile.json`, `categories.json`, `countries/<id>.json` (one per country). Zod schemas live in `src/lib/schema.ts`; types are inferred via `z.infer` and re-exported from `@/types`. JSON is validated at load (throws in dev/test).
- **Add a country/category = JSON only**, no component changes. New category → `categories.json`; new country → `countries/<id>.json`.
- **Weights sum to 100** (±0.001), category ids are unique, and a country may only reference known category ids.
- **Absolute 0–100 scale** (not data-relative): five tiers (`scoreTier`, single source `config.ts` `TIERS`) — ≥80 excellent · ≥70 good · ≥60 average · ≥50 weak · <50 poor. `scoreTier` rounds to a whole percent first so a tier colour always matches the shown number. Choropleth fill is a separate, absolute single-hue **green ramp** (`scoreToGreen`) floored at 50 (= inclusion) and capped at 80 (= excellent) — deepest green highest, faintest lowest; `<50` renders as neutral land.
- **Overall is computed at runtime, never stored** in a source country JSON (raw weighted mean, renormalised over present categories — no display curve). Do not add a precomputed `overall` field to a country file. The one sanctioned derived artifact is the generated, drift-tested `src/data/cache/scoreboard.json` (regenerate via `npm run cache:scores`; never hand-edit).
- **Inclusion:** drop countries scoring <50% overall (surfaced, not auto-deleted).
- **Cell standard:** a `scored` category cell carries `factors` (each `{status, score}`), `summary`, `pros[]`, `cons[]`, `links[]`, `lastReviewed`. Provenance (the evidence + reasoning behind a score) lives in the `summary`, `pros`/`cons`, and `links`. `pending` = placeholder, rendered muted; pending cells are excluded from the overall, not counted as zero.
- **Categories** (`id` · weight, sum = 100): `job-market` 10 · `visa-access` 9 (BD lens) · `citizenship` 9 · `post-study-work` 8 · `spouse-family` 8 · `msc-study` 7 · `pr-pathway` 7 · `income-cost` 6 · `healthcare` 5 · `culture-language` 6 · `safety-law` 5 · `politics` 4 · `tax` 3 · `muslim-diaspora` 3 · `direct-work-route` 10 (BD direct skilled-work entry route; owns sponsorship). Rebalance the whole set if you change any weight — the sum must stay 100. Categories have no `other` catch-all factor.

## Stack

React 19 · TypeScript (strict) · Vite 8 · React Router 7 · Tailwind CSS v4 + shadcn/ui · Zod 4 · Recharts · Leaflet + react-leaflet · TanStack Table · Vitest + Testing Library. Package manager: **npm**. Deploy: GitHub Pages (`base: /abroad-migration-info/`, build only).

## Repo map

- `src/lib/` — pure, tested logic: `schema.ts` (Zod), `scoring.ts` (overall/rank), `data.ts` (load + validate), `formatters.ts` (en-GB), `utils.ts` (`cn`).
- `src/data/` — JSON data store (above).
- `src/components/` — `ui/` (shadcn), `charts/` (radar, bars, choropleth), `leaderboard/` (table, search, filters), `common/` (layout, nav, badges).
- `src/pages/` (Dashboard, Leaderboard, Compare, CountryDetail, Methodology, About, NotFound), `src/routes/`, `src/hooks/` (`useData`, `useTheme`), `src/types/`.
- `docs/` — PRD, design system + wireframes, implementation plans, research briefs.

## Code hygiene

- **Strict TS, no `any`.** Type props explicitly; derive types from Zod, don't redeclare them.
- **Pure logic in `src/lib/`** with co-located `*.test.ts`; write or extend tests for any scoring/schema/format change (TDD for non-trivial logic).
- **Styling:** Tailwind utilities + shadcn only — no raw CSS files. Compose classes via `cn()` from `@/lib/utils`. Dark mode is class-based.
- **Formatting:** route all user-facing numbers/dates through `src/lib/formatters.ts` (en-GB locale) — never hardcode separators or date formats.
- **Conventions:** kebab-case files, PascalCase types, camelCase functions; import via the `@/` alias. Preserve accessibility (Radix/ARIA, contrast, keyboard nav).

## Quality gate & commits

- **Before "done", all green:** `npm run lint && npm run typecheck && npm run test && npm run build`. Report results honestly; never claim passing unverified.
- **Regenerate the score cache before committing any data/scoring change:** `npm run cache:scores` (rewrites `src/data/cache/scoreboard.json`); the drift test fails the gate if it is stale.
- **Commits:** Conventional Commits, imperative mood (`data:`, `docs:`, `feat:`, `fix:`, `refactor:`, `ci:`). Branch off `main` for non-trivial work.
- **Never commit or push without explicit approval** — including in auto-accept / auto-edit mode. Auto mode covers edits, not git history. Stage and propose; wait for the go-ahead.

## Skills cheat-sheet

`brainstorming` (before any feature/design) · `deep-research` (mandatory before data/score/evidence edits) · `writing-plans` (before large changes) · `test-driven-development` (lib logic) · `systematic-debugging` (any bug) · `verification-before-completion` (before claiming done).

## Never

- Change a score/evidence/claim without deep research and citations.
- Store a precomputed overall in a source country JSON (the generated `scoreboard.json` cache is the only exception), or add a country/category via code instead of JSON.
- Fabricate statistics, sources, or `lastReviewed` dates.
- Hardcode number/date separators, or bypass the Zod test gate.
- Decide silently on ambiguity, or skip the simpler-approach debate.
- Commit or push without explicit approval — auto mode never authorises git actions.
