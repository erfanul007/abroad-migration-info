# Abroad Migration Feasibility SPA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Work milestones in order; each ends green (tests + typecheck) and committed.

**Goal:** Build a static React SPA that scores and ranks candidate migration countries against one fixed personal profile, with a dashboard, interactive leaderboard, country deep-dives, comparison, and four data visualisations — all driven by JSON.

**Architecture:** Frontend-only Vite SPA. JSON files under `src/data/` are the backend store, imported at build time. A pure, unit-tested scoring module computes each country's overall 0–100 score (weighted sum, renormalised over present categories) at runtime — overall is never stored. Presentation is decoupled from data: adding a country or category is JSON-only. Clean modern minimal UI (shadcn/ui neutral base + single accent), light/dark.

**Tech stack — versions verified current (June 2026):**

| Layer | Choice | Notes |
|-------|--------|-------|
| Build | **Vite 8** | Rolldown-based; scaffolded via `npm create vite@latest` |
| UI runtime | **React 19 + TypeScript 5** | Vite react-ts template default |
| Styling | **Tailwind CSS v4** + `@tailwindcss/vite` | CSS `@import "tailwindcss"`; `@theme` tokens |
| Components | **shadcn/ui** (latest) | CLI-installed; supports TW4 + React 19 |
| Routing | **React Router v7** | `createBrowserRouter`; import from `react-router` (v7 merged `react-router-dom`) |
| Table | **TanStack Table v8** | Headless; React 19 ✓ |
| Charts | **Recharts 3** | Radar + bars; React 19 ✓ |
| Map | **d3-geo + topojson-client + world-atlas** | Choropleth as SVG `<path>`; replaces unmaintained `react-simple-maps` (PRD §10.1 note) |
| Tests | **Vitest** + Testing Library + jsdom | TDD for `lib/`; smoke for components |
| Icons | **lucide-react** | Ships with shadcn |

**Knowledge base — read before coding:**
- Product spec: [`../../../abroad-migration-feasibility-prd.md`](../../../abroad-migration-feasibility-prd.md)
- Design system (tokens, components, consistency): [`../../../design/00-design-system.md`](../../../design/00-design-system.md)
- Wireframes (per-page layout): [`../../../design/01-wireframes.md`](../../../design/01-wireframes.md)

---

## Milestones (build in this order)

| # | File | Tasks | Output |
|---|------|-------|--------|
| 0 | [`00-foundations.md`](./00-foundations.md) | 1–3 | Vite+React+TW4+shadcn scaffold, deps, Vitest |
| 1 | [`01-data-core.md`](./01-data-core.md) | 4–10 | Types, JSON data, validation, scoring, formatters, data assembly (TDD) |
| 2 | [`02-shell-leaderboard.md`](./02-shell-leaderboard.md) | 11–16 | Theme, badges, layout/routing, useData, leaderboard page |
| 3 | [`03-visualizations.md`](./03-visualizations.md) | 17–19 | Radar, contribution bars, choropleth |
| 4 | [`04-pages.md`](./04-pages.md) | 20–23 | Dashboard, country detail, compare, about |
| 5 | [`05-build-deploy.md`](./05-build-deploy.md) | 24–25 | Verification pass, GitHub Pages CI, README |

## File structure (locked)

```
abroad-migration-info/
  index.html · vite.config.ts · tsconfig*.json · components.json
  .github/workflows/deploy.yml · public/404.html
  src/
    main.tsx · index.css
    types/index.ts
    lib/      cn.ts · scoring.ts(+test) · validation.ts(+test) · formatters.ts(+test) · data.ts(+test)
    data/     profile.json · categories.json · countries/<iso>.json (13)
    hooks/    useTheme.ts · useData.ts
    components/
      ui/          (shadcn primitives, CLI-added)
      common/      Layout · Nav · ThemeProvider · ThemeToggle · ScoreBadge · PendingBadge · Podium · StatCard · Section
      leaderboard/ LeaderboardTable · columns · SearchBox · Filters
      charts/      RadarProfile · ContributionBars · Choropleth
    pages/    Dashboard · Leaderboard · Compare · CountryDetail · About · NotFound
    routes/   index.tsx
```

## Conventions

- **Package manager:** npm. Prefer CLI (`npx shadcn add …`) over hand-written primitives.
- **Imports:** `@/…` alias for `src/…`. React Router from `react-router` (not `react-router-dom`).
- **Dates/numbers:** ISO 8601 in JSON; user-facing via `formatters` (en-GB: DD/MM/YYYY, point decimal).
- **TDD:** strict for `lib/` (red → green → commit). Components/pages: build + render-smoke + manual verify.
- **Commits:** one per task min; conventional style; every message ends with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- **Windows:** PowerShell-compatible `npm`/`npx`/`git`.

## Spec coverage map (self-review)

- PRD §4–5 → M1. §6.1 Dashboard → M4 (Task 20). §6.2 Leaderboard → M2 (15–16). §6.3 Compare → M4 (22). §6.4 Country detail → M4 (21). §6.5 About → M4 (23). §6.6 cross-cutting → M1 (4,8,10) + M2 (11,13,16).
- §7 IA / §8 visualisations → M2 (13) + M3 (17–19). §9 data → M1 (4–6). §10 architecture → M0 + M1 (10) + M5 (25). §11 NFRs → M2 (11), M5 (24), M1 (4,10). §10.5 locked decisions → M0 (base path), M1 (en-GB, flagship+pending), M3 (map), M5 (Vitest in CI).
