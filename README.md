# Abroad Migration Feasibility

Static React SPA ranking candidate migration countries against one personal profile. JSON is the data store; scores are weighted (weights sum to 100) and computed at runtime.

## Develop
- `npm install`
- `npm run dev` — local dev server
- `npm run test` — unit tests (scoring, schema, formatters, data)
- `npm run typecheck` — TypeScript project check
- `npm run build` — production build to `dist/`

## Data
Edit `src/data/` only — no component changes needed to add a country (`countries/<id>.json`) or category (`categories.json`, keep weights summing to 100). Every file is validated at load against the Zod schemas in `src/lib/schema.ts`; the gate throws in dev and test, so `npm run test` (which runs before `build` in CI) fails on a malformed file, category weights ≠ 100, or a score outside 0–100.

## Docs
- Product spec: `docs/abroad-migration-feasibility-prd.md`
- Design system + wireframes: `docs/design/`
- Implementation plan: `docs/superpowers/plans/2026-06-16-abroad-migration-info/`

## Deploy
Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`.

## Germany admissions and applicant profile

The university page is `/country/germany/universities`; Tanima’s study evidence/preferences and reported offer are on `/about`. Use the City and Tags filters and expand rows for academic requirements, dates, routes, funding and review scope.

`Open now` means an explicitly current published cycle; `Annual window open` is a standing-rule inference, not confirmed portal state. `Funding needed` / `Funding unverified` remain separate from admission timing. The existing rank/cost gates and campus ordering are preserved; exclusions and incomplete checks are documented in `docs/research/2026-11-10-germany-cs-programme-evidence.md`.

Profile facts came from the supplied local documents and maintainer instructions. Original scans, IDs, contacts and other applicant documents are not bundled.
