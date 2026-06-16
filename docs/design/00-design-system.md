# Design System — Abroad Migration Feasibility

> Single source of truth for visual language. Every page and component MUST follow these tokens and rules. Direction (PRD §10.5): **clean modern minimal** — neutral surfaces, one accent, data-forward, generous whitespace, subtle motion, light + dark.

---

## 1. Design principles

1. **Data leads, chrome recedes.** Scores, charts, and the leaderboard are the heroes. UI furniture (borders, shadows, fills) stays quiet.
2. **One accent only.** A single blue accent for interaction/identity. All score (good/bad) meaning is carried by the score-encoding colours (§2.2: tier badges + choropleth green ramp), never by the accent.
3. **Consistent rhythm.** Same page shell, same section spacing, same heading scale everywhere.
4. **Honest states.** `pending` data is always visibly muted and labelled — never dressed up as a real score.
5. **Accessible by default.** WCAG AA contrast, visible focus rings, keyboard-navigable table, `<title>`/aria labels on charts.

---

## 2. Colour palette

Tokens are shadcn/ui CSS variables in `src/index.css` (oklch). Components reference semantic tokens (`bg-background`, `text-muted-foreground`, `bg-primary`) — **never** raw colours, except the data-encoding colours: the score-tier badge scale + choropleth green ramp (§2.2) and the chart/map series literals (§2.3, centralised in `lib/palette.ts`).

### 2.1 Semantic tokens (neutral base + blue accent)

| Token | Light (oklch) | Dark (oklch) | Use |
|-------|---------------|--------------|-----|
| `--background` | `1 0 0` | `0.145 0 0` | Page background |
| `--foreground` | `0.205 0.004 285` | `0.985 0 0` | Primary text |
| `--card` | `1 0 0` | `0.18 0.004 285` | Card surface |
| `--card-foreground` | `0.205 0.004 285` | `0.985 0 0` | Card text |
| `--muted` | `0.97 0.002 285` | `0.24 0.004 285` | Subtle fills, pending |
| `--muted-foreground` | `0.55 0.006 285` | `0.7 0.006 285` | Secondary text |
| `--border` | `0.92 0.003 285` | `0.27 0.004 285` | Hairlines, table grid |
| `--input` | `0.92 0.003 285` | `0.3 0.004 285` | Field borders |
| `--ring` | `0.55 0.18 255` | `0.7 0.16 255` | Focus ring (accent) |
| `--primary` | `0.55 0.18 255` | `0.7 0.16 255` | Accent: links, active nav, buttons, chart series 1 |
| `--primary-foreground` | `0.98 0 0` | `0.2 0 0` | Text on accent |

> Approx hex for reference only (do not hardcode): accent `#2f6df6` (light) / `#6ea0ff` (dark); foreground `#1f2024`; muted-fg `#71717a`.

### 2.2 Score-encoding colours (tier badge scale + choropleth green ramp)

Drives `ScoreBadge` and contribution emphasis. Defined in `lib/formatters.ts` as the single source.

| Tier | Range | Badge classes |
|------|-------|---------------|
| `excellent` | 80–100 | `bg-emerald-500/15 text-emerald-700 dark:text-emerald-300` |
| `good` | 65–79 | `bg-lime-500/15 text-lime-700 dark:text-lime-300` |
| `fair` | 45–64 | `bg-amber-500/15 text-amber-700 dark:text-amber-300` |
| `weak` | 0–44 | `bg-rose-500/15 text-rose-700 dark:text-rose-300` |

Thresholds live in code (`scoreTier()`), not scattered in components. Change them once.

**Choropleth fill — fixed absolute single-hue green ramp.** The map does *not* use the discrete tiers (a score is an ordered quantity; tiers fake cliffs at the boundaries), nor a data-relative domain (a country's colour would then shift as the dataset grows). Instead `scoreToGreen(score)` maps an **absolute, constant** scale (OKLCH hue 150): `< 60` → `null` (unshaded, renders as neutral land `#c9ced6`); `60 → 80` → one distinct green shade **per whole percent** (21 fixed shades, pale → deep; lightness 0.90→0.36, chroma 0.06→0.21); `≥ 80` → the single deepest green. Whole-percent quantisation (`Math.round`) guarantees "1% = one shade" forever, so a country's colour is stable across future data and small gaps stay visible. An **ease-in curve** (`FILL_CURVE`, convex) weights the ramp toward the deep end, so an equal score gap reads as a wider shade difference at higher scores (76 vs 72 separates more than 66 vs 62). Thresholds (`FILL_MIN`/`FILL_MAX`) live in code. Legend = a neutral `<60` chip + an 8-stop gradient bar sampled from the fixed 60→80 ramp.

**Choropleth labels — Leaflet permanent tooltips + size-aware declutter.** Each scored country gets a permanent Leaflet tooltip (`bindTooltip`, `direction: "center"`) showing its ISO-2 code, styled (`.country-label`) down to a bare white-haloed label. Leaflet 1.9 has **no built-in label collision** (unlike vector engines such as Mapbox GL / MapLibre / Google), so `LabelDeclutter` (a `useMap` child) gates each label on the polygon's **rendered pixel size**: on `zoomend` it projects the layer bounds with `latLngToContainerPoint` and `openTooltip`/`closeTooltip`s based on `LABEL_MIN_W`/`LABEL_MIN_H`. Big countries label early, small ones only when zoomed in (slippy-map behaviour). Size depends only on zoom (panning shifts both corners equally), so no recompute on pan. No plugin, no hand-rolled placement — Leaflet's projection does the measuring.

### 2.3 Chart series colours (Compare overlay, ≤3 countries)

`["var(--primary)", "#16a34a", "#ea580c"]` — app primary (theme-aware, matches buttons/links), green, orange. Distinct in both themes and for common colour-blindness; never more than three.

**Single source for chart/map literals.** Recharts and Leaflet need raw CSS colour strings (they can't read Tailwind classes), so the few literal colours they require live in **one place — `src/lib/palette.ts`** (`SERIES`, `MAP_LAND`, `MAP_BORDER`). No component hardcodes a hex. The choropleth's per-country fill comes from `scoreToGreen()` (§2.2); single-value charts (`ContributionBars`) use the `var(--primary)` token directly. Everything else uses theme tokens via Tailwind utilities.

---

## 3. Typography

- **Family:** **Geist** (self-hosted via the `geist` npm package, bundled offline by the shadcn nova preset), falling back to the system UI stack. Clean, modern, no runtime CDN dependency. Tailwind `font-sans`.
- **Numbers:** always `tabular-nums` for scores, ranks, weights (aligned columns).

| Role | Classes | Usage |
|------|---------|-------|
| Page title (h1) | `text-2xl font-bold tracking-tight` (dashboard hero `text-3xl`) | One per page |
| Section title (h2) | `text-lg font-semibold tracking-tight` | `Section` component |
| Card title | `text-base font-semibold` | Category/profile cards |
| Body | `text-sm` | Default copy |
| Secondary | `text-sm text-muted-foreground` | Descriptions, hints |
| Micro | `text-xs text-muted-foreground` | Review dates, legends, labels |

---

## 4. Spacing, layout, radius, elevation, motion

- **Page shell:** `mx-auto max-w-6xl px-4 py-8`. One shell (`Layout`), every page.
- **Page header:** title + subtitle wrapped in a `space-y-1` block. Subtitle is always `text-sm text-muted-foreground` (`max-w-2xl` when long). Page title `text-2xl` — Dashboard hero is the single `text-3xl` exception (§3).
- **Section rhythm:** every page stacks its sections with `space-y-8` (uniform across all routes); `space-y-3` within a `Section`.
- **Grid gaps:** `gap-3` (tight: stat cards, podium) / `gap-4`–`gap-6` (cards, two-column).
- **Radius:** `--radius: 0.625rem`. Cards/inputs `rounded-lg`, badges `rounded-md`.
- **Elevation:** flat. Borders (`border`) over shadows. Hover affordance = `hover:border-primary` or `hover:bg-muted`, not drop shadows.
- **Motion:** `transition-colors`/`transition-opacity`, ~150ms. Podium 1st place gets a static `-translate-y-3` raise. No entrance animations, no parallax.

---

## 5. Component schema

Reusable building blocks (in `src/components/common/` unless noted). Each has one responsibility and is used identically across pages.

| Component | Responsibility | Key props | States |
|-----------|----------------|-----------|--------|
| `Layout` | App shell: nav + centered main | — | — |
| `Nav` | Sticky top nav + theme toggle | — | active link = `bg-muted text-foreground` |
| `ThemeToggle` | Light/dark switch (persisted) | — | sun/moon icon |
| `Section` | Titled section wrapper | `title`, `icon?`, `action?` | — |
| `ScoreBadge` | Render a 0–100 score as a percentage, tier-coloured | `score`, `className?` | tier colour by value |
| `PendingBadge` | "Pending" chip for unsourced data | `className?` | muted only |
| `StatCard` | Single KPI (label/value/hint) | `label`, `value`, `badge?`, `hint?`, `icon?` | — |
| `Podium` | Top-3 countries, 1st raised | `countries` | links to detail |
| `LeaderboardTable` (leaderboard/) | TanStack table: sort/filter/columns | `countries`, `categories`, `globalFilter`, `columnVisibility`, `onColumnVisibilityChange` | empty = "No countries match" |
| `SearchBox` (leaderboard/) | Debounced name search | `value`, `onChange` | — |
| `Filters` (leaderboard/) | Region select + column-visibility menu | `regions`, `region`, `categories`, `columnVisibility`, … | — |
| `RadarProfile` (charts/) | Category radar; overlay ≤3 | `countries`, `categories` | legend only when >1 |
| `ContributionBars` (charts/) | Weighted contribution per category | `country` | sorted desc |
| `Choropleth` (charts/) | Full-world **choropleth** on a plain **Leaflet** map (react-leaflet; SVG, no WebGL) | `countries` | **All countries** rendered (GeoJSON, no tiles → offline); scored ones shaded on the continuous green ramp (`scoreToGreen()`, §2.2), others the neutral grey land. Longitudes **unwrapped** so dateline-crossing rings (Russia, Fiji, Aleutians) don't draw full-width white bands (Leaflet, unlike d3, doesn't clip the antimeridian); Antarctica omitted (wraps the pole). Default world view (`center`/`zoom`) shows all. Default Leaflet drag + zoom, north-up. **Click → popup overview** (flag · name · score, or a *Pending* chip if provisional · region · rank · short summary + a *View &lt;country&gt;* button → navigates). Ocean = panel `bg-muted` (theme-aware); green-ramp fills theme-independent. Minimal — no theme-repaint / hover / custom-control / CSS-override code. |

### 5.1 ScoreBadge — canonical score rendering

Every score on every page renders through `ScoreBadge` (or the tier scale it uses). No raw coloured score numbers elsewhere. Scores are 0–100 feasibility ratings shown as a percentage — the `%` suffix comes from `formatPercent()` (the single source), so charts (radar tooltip, choropleth `<title>`) match. Shape: `inline-flex min-w-12 rounded-md px-2 py-0.5 text-sm font-semibold tabular-nums` + tier classes (`min-w-12` keeps `9%`/`100%` columns aligned).

### 5.2 Pending / empty / missing states

| Situation | Rendering |
|-----------|-----------|
| Cell `status: "pending"` | `PendingBadge` instead of a colour badge; narrative shows "Not yet assessed." |
| Category absent for a country | em dash `—` in `text-muted-foreground` |
| Country has any pending cell | `PendingBadge` next to its name + a "overall is provisional" note on detail |
| No table rows after filter | Centered `text-muted-foreground` row: "No countries match your search." |

---

## 6. UI consistency rules (apply to every page)

1. **Shell:** wrap content in `Layout`; never set page margins per-page.
2. **One h1 per page**, using the title scale in §3. Sub-areas use `Section`.
3. **Links** are accent + `hover:underline` (`text-primary hover:underline`). External links append ` ↗` and use `target="_blank" rel="noreferrer"`.
4. **Scores** always via `ScoreBadge` (renders `%` via `formatPercent`); **dates** always via `formatDate` (en-GB, DD/MM/YYYY); **numbers** via `formatNumber` (en-GB). Category **weights** render with a `%` suffix (they sum to 100%). Never inline-format.
5. **Tables** share one look: `rounded-lg border`, sticky-free header in `TableHeader`, `tabular-nums` for numeric cells, `overflow-x-auto` wrapper for wide tables.
6. **Cards** use shadcn `Card`/`CardContent`; flat, `border`, no shadow.
7. **Focus:** rely on shadcn `focus-visible` ring (`--ring`); do not remove outlines.
8. **Dark mode:** never hardcode `text-black`/`bg-white`; use semantic tokens so both themes work.
9. **Icons:** `lucide-react`, `size-4`/`size-5`, `aria-label` on icon-only buttons.
10. **Country links** everywhere point to `/country/:iso` (uppercase ISO alpha-2).

---

## 7. Accessibility checklist (NFR3)

- Table fully keyboard-operable; sortable headers are buttons/clickable with visible focus.
- Score tier never the *only* signal — the numeric value is always shown alongside the colour.
- Charts (radar, bars) carry `role="img"` + `aria-label`. The map surfaces each country's score/region/rank via its **click popup** — and the same scores are reachable on the leaderboard and detail pages, so the map is never the sole path to a datum. **Known gap:** the Leaflet country shapes are mouse-only (not keyboard-focusable) and the map region has no `aria-label`; flagged for a follow-up a11y pass.
- Contrast: tier badge text meets AA on its tint in both themes (verify emerald/lime/amber/rose `*-700` on `/15` light, `*-300` dark).
- Respect `prefers-color-scheme` for the initial theme before any saved choice.

---

## 8. Iconography

Icons are **lucide-react** only (outline set, one visual language). They aid scannability — never the sole carrier of meaning, and never decorative filler. Restraint over coverage.

- **Sizing:** `size-4` (16px) inline / in cards, `size-5` (20px) for nav, `size-[18px]` for `Section` headers. `size-10` for empty/404 states.
- **Colour:** `text-muted-foreground` by default (quiet). The single accent (`text-primary`) only for **identity** (nav `Compass` brand mark, podium `#1` `Crown`) — never to signal good/bad (that stays on the score-tier scale).
- **A11y:** decorative icons carry `aria-hidden`; the adjacent text label is the accessible name. Icon-only buttons keep an explicit `aria-label` (e.g. `ThemeToggle`).
- **Placement (current map):**
  - Nav brand → `Compass` (accent). Theme → `Sun`/`Moon`.
  - Section headers — Dashboard: `Trophy` (Top countries), `Map` (World view), `ListOrdered` (Leaderboard). Country detail: `Radar`, `BarChart3`, `LayoutGrid`, `BookMarked`. Compare: `Radar`, `Table2`. About: `Users`, `Route`, `SlidersHorizontal`, `Calculator`.
  - Dashboard StatCards → `Globe`, `Scale`, `Trophy`, `CalendarClock`. Leaderboard button → `ArrowRight`.
  - Podium ranks → `Crown` (#1, accent), `Medal` (#2/#3).
  - About pathway steps → `GraduationCap → Briefcase → Home → BadgeCheck → Plane` (index-aligned to `profile.pathway`). Preferences list → `MapPin`, `Briefcase`, `Zap`, `Copy`, `Users`.
  - Search → `Search`; column toggle → `SlidersHorizontal`; 404 → `Compass`.
- **Adding new icons:** prefer reusing an existing mapping; keep size/colour rules above; pass via the `icon?` prop on `Section`/`StatCard` rather than hardcoding markup.
