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
