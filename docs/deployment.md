# Deployment

How `abroad-migration-info` is built and published.

## Summary

- **Host:** GitHub Pages (project site).
- **URL:** `https://erfanul007.github.io/abroad-migration-info/`
- **Source:** GitHub Actions (artifact-based, not a `gh-pages` branch).
- **Trigger:** every push to `main`. Pull requests run the quality gate only.
- **Pipeline:** `.github/workflows/deploy.yml`.

## Pipeline

On push to `main` (or `workflow_dispatch`):

1. **build** job — `ubuntu-latest`, Node 22, `npm ci`:
   - `npm run lint` — ESLint flat config.
   - `npm run typecheck` — `tsc -b --noEmit`.
   - `npm test` — Vitest (data-integrity suite; Zod gate validates every country, weights, score ranges).
   - `npm run build` — `tsc -b && vite build` → `dist/`.
   - `actions/configure-pages` → `actions/upload-pages-artifact` (uploads `dist/`).
2. **deploy** job — runs only if **build** passed and the event is not a PR:
   - `actions/deploy-pages` publishes the artifact.

A failing gate (lint, types, tests, or build) blocks the deploy — broken changes never reach the live site.

On pull requests the **build** job runs as a gate; the **deploy** job is skipped.

## Why this setup

- **Actions source over `gh-pages` branch:** no extra branch to manage, no `gh-pages` npm dependency, artifact-based and official. `actions/configure-pages` enables Pages in "GitHub Actions" mode automatically on the first run.
- **Quality gate before publish:** lint + typecheck + test + build mirror the local commands, so CI fails the same way a developer would locally.

## SPA routing on Pages

GitHub Pages has no server-side rewrite, so deep links (e.g. `/abroad-migration-info/country/germany`) would 404 on refresh. Handled by the [rafgraph SPA fallback](https://github.com/rafgraph/spa-github-pages):

- `public/404.html` — stores the requested URL in `sessionStorage.redirect` and redirects to the app root.
- `index.html` — on load, restores that URL via `history.replaceState` before React mounts.
- `vite.config.ts` sets `base: "/abroad-migration-info/"` for builds; React Router's `createBrowserRouter` reads `import.meta.env.BASE_URL` as its `basename`.

Renaming the repo means updating `base` in `vite.config.ts` and `location.replace(...)` in `public/404.html` to match the new subpath.

## Local commands

```bash
npm run dev        # dev server at /
npm run lint       # eslint
npm run typecheck  # tsc -b --noEmit
npm test           # vitest run
npm run build      # tsc -b && vite build -> dist/ (base /abroad-migration-info/)
npm run preview    # serve the production build locally
```

## One-time GitHub setup

Performed once when the repo was created (or auto-handled by `actions/configure-pages`):

- Pages **Source** = "GitHub Actions" (`build_type=workflow`).
- The `github-pages` environment is created automatically by the deploy action.

## Notes

- Build emits a chunk-size warning (~1.7 MB / ~515 KB gzip) from Leaflet + Recharts + TanStack Table. Acceptable for a static site; route-level code-splitting is a future optimization, not a blocker.
