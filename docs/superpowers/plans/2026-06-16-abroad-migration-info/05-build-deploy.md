# Milestone 5 — Build, verify & deploy

Back to [plan index](./README.md). Tasks 24–25. Output: a verified production build and a GitHub Pages deployment pipeline.

---

## Task 24: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the whole suite + typecheck + production build + preview**

```bash
npm run test
npm run typecheck
npm run build
npm run preview    # open printed URL; click every route incl. /country/DE, /country/NL, and an unknown path (404); Ctrl+C
```
Expected: tests green, no TS errors, build succeeds, preview renders every page. Confirm the map, radar, bars, leaderboard sorting/search/column-toggle, compare, and theme toggle all work in the built output.

- [ ] **Step 2: Fix anything broken, then commit**

```bash
git add -A
git commit -m "chore: verification pass — tests, typecheck, build green"
```

---

## Task 25: GitHub Pages deployment + README

**Files:** Create `.github/workflows/deploy.yml`, `public/404.html`, `README.md`; modify `index.html`

- [ ] **Step 1: Add SPA fallback for client-side routing on Pages**

Create `public/404.html` (Pages serves it for unknown paths; redirect into the app so React Router resolves the route):

```html
<!doctype html>
<meta charset="utf-8" />
<script>
  sessionStorage.redirect = location.href;
  location.replace("/abroad-migration-info/");
</script>
```

In `index.html`, just before `</head>`, restore the original path:

```html
<script>
  (function () {
    var r = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (r && r !== location.href) history.replaceState(null, "", r);
  })();
</script>
```

- [ ] **Step 2: Write the deploy workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> Node 22 (Vite 8 requires Node ≥ 20.19 / 22.12). In the repo: Settings → Pages → Source = **GitHub Actions**. First deploy runs on push to `main`.

- [ ] **Step 3: Write `README.md`**

```markdown
# Abroad Migration Feasibility

Static React SPA ranking candidate migration countries against one personal profile. JSON is the data store; scores are weighted (weights sum to 100) and computed at runtime.

## Develop
- `npm install`
- `npm run dev` — local dev server
- `npm run test` — unit tests (scoring, validation, formatters, data)
- `npm run typecheck` — TypeScript project check
- `npm run build` — production build to `dist/`

## Data
Edit `src/data/` only — no component changes needed to add a country (`countries/<iso>.json`) or category (`categories.json`, keep weights summing to 100). The data validator fails the build if weights ≠ 100 or scores fall outside 0–100.

## Docs
- Product spec: `docs/abroad-migration-feasibility-prd.md`
- Design system + wireframes: `docs/design/`
- Implementation plan: `docs/superpowers/plans/2026-06-16-abroad-migration-info/`

## Deploy
Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`.
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "ci: GitHub Pages deploy workflow + SPA 404 fallback + README"
```

---

## Done

All 25 tasks complete → a deployed, data-driven migration-feasibility SPA. Next curation pass: replace the 10 `pending` countries with sourced scores (edit JSON only; no code change).
