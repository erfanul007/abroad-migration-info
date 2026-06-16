# Design System — Abroad Migration Feasibility

> Single source of truth for visual language. Every page and component MUST follow these tokens and rules. Direction (PRD §10.5): **clean modern minimal** — neutral surfaces, one accent, data-forward, generous whitespace, subtle motion, light + dark.

---

## 1. Design principles

1. **Data leads, chrome recedes.** Scores, charts, and the leaderboard are the heroes. UI furniture (borders, shadows, fills) stays quiet.
2. **One accent only.** A single blue accent for interaction/identity. All "good/bad" meaning is carried by the score-tier scale, never by the accent.
3. **Consistent rhythm.** Same page shell, same section spacing, same heading scale everywhere.
4. **Honest states.** `pending` data is always visibly muted and labelled — never dressed up as a real score.
5. **Accessible by default.** WCAG AA contrast, visible focus rings, keyboard-navigable table, `<title>`/aria labels on charts.

---

## 2. Colour palette

Tokens are shadcn/ui CSS variables in `src/index.css` (oklch). Components reference semantic tokens (`bg-background`, `text-muted-foreground`, `bg-primary`) — **never** raw colours, except the score-tier scale below.

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

### 2.2 Score-tier scale (the ONE place semantic colour is allowed)

Drives `ScoreBadge`, choropleth fills, and contribution emphasis. Defined in `lib/formatters.ts` as the single source.

| Tier | Range | Hex (fill) | Badge classes |
|------|-------|-----------|---------------|
| `excellent` | 80–100 | `#16a34a` | `bg-emerald-500/15 text-emerald-700 dark:text-emerald-300` |
| `good` | 65–79 | `#65a30d` | `bg-lime-500/15 text-lime-700 dark:text-lime-300` |
| `fair` | 45–64 | `#d97706` | `bg-amber-500/15 text-amber-700 dark:text-amber-300` |
| `weak` | 0–44 | `#e11d48` | `bg-rose-500/15 text-rose-700 dark:text-rose-300` |

Thresholds live in code (`scoreTier()`), not scattered in components. Change them once.

### 2.3 Chart series colours (Compare overlay, ≤3 countries)

`["#2f6df6", "#16a34a", "#ea580c"]` — accent blue, green, orange. Distinct in both themes and for common colour-blindness; never more than three.

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
- **Section rhythm:** vertical stacks use `space-y-10` (page) / `space-y-6` (within page) / `space-y-3` (within section).
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
| `Section` | Titled section wrapper | `title`, `action?` | — |
| `ScoreBadge` | Render a 0–100 score, tier-coloured | `score`, `className?` | tier colour by value |
| `PendingBadge` | "pending" chip for unsourced data | `className?` | muted only |
| `StatCard` | Single KPI (label/value/hint) | `label`, `value`, `hint?` | — |
| `Podium` | Top-3 countries, 1st raised | `countries` | links to detail |
| `LeaderboardTable` (leaderboard/) | TanStack table: sort/filter/columns | `countries`, `categories`, `globalFilter`, `columnVisibility`, `onColumnVisibilityChange` | empty = "No countries match" |
| `SearchBox` (leaderboard/) | Debounced name search | `value`, `onChange` | — |
| `Filters` (leaderboard/) | Region select + column-visibility menu | `regions`, `region`, `categories`, `columnVisibility`, … | — |
| `RadarProfile` (charts/) | Category radar; overlay ≤3 | `countries`, `categories` | legend only when >1 |
| `ContributionBars` (charts/) | Weighted contribution per category | `country` | sorted desc |
| `Choropleth` (charts/) | World map shaded by overall | `countries` | non-seed = muted, no click |

### 5.1 ScoreBadge — canonical score rendering

Every score on every page renders through `ScoreBadge` (or the tier scale it uses). No raw coloured score numbers elsewhere. Shape: `inline-flex min-w-9 rounded-md px-2 py-0.5 text-sm font-semibold tabular-nums` + tier classes.

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
4. **Scores** always via `ScoreBadge`; **dates** always via `formatDate` (en-GB, DD/MM/YYYY); **numbers** via `formatNumber` (en-GB). Never inline-format.
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
- Charts carry `role="img"` + `aria-label`; map paths carry `<title>` with name + score.
- Contrast: tier badge text meets AA on its tint in both themes (verify emerald/lime/amber/rose `*-700` on `/15` light, `*-300` dark).
- Respect `prefers-color-scheme` for the initial theme before any saved choice.
