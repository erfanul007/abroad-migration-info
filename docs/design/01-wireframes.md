# Wireframes — Abroad Migration Feasibility

> Low-fidelity layout reference for all five routes. Follows the shell, tokens, and components in `00-design-system.md`. Desktop-first; responsive rules per page. These are layout contracts, not pixel specs.

Legend: `[ ]` container/card · `▮▮` score badge (rendered as `%`, e.g. `84%`) · `◔` chart · `▼` select · `🔍` search.

---

## Shared shell (every page)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Migration Feasibility   Dashboard · Leaderboard · Compare · About  ☾ │  sticky top nav (h-14), border-b, blur
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌────────────────────  max-w-6xl, px-4, py-8  ───────────────────┐   │
│   │                       page content                             │   │
│   └────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```
Active nav item: `bg-muted`. The **brand title** ("Migration Feasibility") links to the Dashboard (`/`). Theme toggle (☾/☀) far right. On **mobile (<`sm`)** the inline links collapse into a hamburger (☰) that toggles a stacked menu; brand + toggle + hamburger stay on one row. Country detail is **not** in nav — reached by clicking countries.

---

## 1. Dashboard `/`

```
Migration Feasibility                                       (h1, text-3xl)
Ranking countries for the goal: MSc studies → post-study work → … → passport.  About the method →

── Top countries ─────────────────────────────────────────────
        ┌─────────┐   ┌─────────┐   ┌─────────┐
        │  #2     │   │  #1 ⬆    │   │  #3     │     ← podium, 1st raised
        │  🇨🇦     │   │  🇩🇪     │   │  🇦🇺     │
        │ Canada  │   │ Germany │   │Australia│
        │  ▮81▮   │   │  ▮84▮   │   │  ▮79▮   │
        └─────────┘   └─────────┘   └─────────┘

┌─ Countries ─┐ ┌─ Categories ──┐ ┌─ Top score ──┐ ┌ Last reviewed ┐   ← 4 StatCards
│     13      │ │ 14 · wts 100% │ │ ▮84%▮ Germany │ │  16/06/2026   │
└─────────────┘ └───────────────┘ └──────────────┘ └───────────────┘

── World view ────────────────────────────────────────────────
┌──────────────────────────────────────────────────────────┐
│ [+]  🗺️ full-world choropleth (Leaflet/SVG)               │  drag→pan · scroll/btn→zoom
│ [−]  all countries; scored ones green-shaded; north-up    │
│      55% ░▒▓█ 85%   (gradient legend, low→high)           │  click→popup overview → "View <country>"
└──────────────────────────────────────────────────────────┘
Plain Leaflet map, **all countries** from our GeoJSON (no external tiles → offline); scored ones shaded on a **continuous green ramp** (pale = low, deep = high) via `scoreToGreen()` over the data-fit domain, others neutral grey. Reliable SVG rendering (no WebGL). Longitudes unwrapped so dateline-crossing countries (Russia, Fiji) don't draw full-width bands; Antarctica omitted. Default world `center`/`zoom`. Default interactions only: **pan + zoom** (top-left control); always north-up. Clicking a country opens the **default Leaflet popup** with a basic overview (flag · name · score · region · rank · summary) + one *View &lt;country&gt;* button → navigates; ✕ / click-elsewhere closes. Legend is a gradient bar anchored with the actual min/max %. Ocean theme-aware (`bg-muted`); minimal — no custom theming/hover/controls.

── Leaderboard ──────────────────────────  [ Full leaderboard → ]
┌──────────────────────────────────────────────────────────┐
│ 1  🇩🇪 Germany ............................... ▮84▮         │  top 5, each row → detail
│ 2  🇨🇦 Canada  ............................... ▮81▮         │
│ 3  🇦🇺 Australia ............................. ▮79▮         │
│ 4  🇳🇱 Netherlands  [Pending] ............... ▮60▮         │
│ 5  🇸🇪 Sweden       [Pending] ............... ▮60▮         │
└──────────────────────────────────────────────────────────┘
```
Responsive: podium 3-up ≥sm, stacks on mobile; StatCards `grid-cols-2 sm:grid-cols-4`; map scales by `viewBox` (full width).

---

## 2. Leaderboard `/leaderboard`

```
Leaderboard                                                  (h1)
Countries ranked by overall feasibility. Sort any column; search & filter.

🔍 Search countries…              ▼ All regions   [ ⚙ Columns ]
┌──────────────────────────────────────────────────────────────────────────┐
│ # │ Country          │Overall│Job│Visa│Cit│PSW│Spo│MSc│PR │…│  ← sortable
│───┼──────────────────┼───────┼───┼────┼───┼───┼───┼───┼───┼─│    headers,
│ 1 │ 🇩🇪 Germany       │ ▮84▮ │▮88│▮70 │▮78│▮85│▮75│▮90│▮80│…│    shortLabel +
│ 2 │ 🇨🇦 Canada        │ ▮81▮ │▮85│▮72 │▮82│▮88│▮80│▮78│▮85│…│    title=full name
│ 3 │ 🇦🇺 Australia     │ ▮79▮ │▮82│▮68 │▮80│▮90│▮78│▮75│▮82│…│
│ 4 │ 🇳🇱 Netherlands ⊘ │ ▮60▮ │ — │ — │ — │ — │ — │ — │ — │…│  ⊘=pending
└──────────────────────────────────────────────────────────────────────────┘
```
- Default sort: Overall desc. Click any header → toggle asc/desc (arrow indicator).
- `🔍` filters by name (global filter). `▼` region filter. `⚙ Columns` popover toggles category columns (Switch per category).
- Score cells = `ScoreBadge`; pending rows show `—` per category + `[Pending]` chip by the name.
- Wide table → `overflow-x-auto`; rank column stays first.

---

## 3. Compare `/compare`

```
Compare                                                      (h1)
Compare up to three countries side by side.

▼ Germany     ▼ Canada      ▼ Country 3        [ Reset to 2 ]

── Profiles ──────────────────────────────────────────────
┌──────────────────────────────────────────────────────────┐
│                   ◔ radar (overlay)                       │  one polygon/country,
│            Germany ─ Canada ─ Australia (legend)          │  series colours §2.3
└──────────────────────────────────────────────────────────┘

── Category scores ───────────────────────────────────────
┌────────────────┬──────────┬──────────┬──────────┐
│ Category       │ 🇩🇪 Ger   │ 🇨🇦 Can   │ 🇦🇺 Aus   │
│ Overall        │  ▮84▮    │  ▮81▮    │  ▮79▮    │   ← bold row
│ Job Market     │  ▮88▮ ★  │  ▮85▮    │  ▮82▮    │   ★ / bg-primary/5 = winner
│ Visa Access    │  ▮70▮    │  ▮72▮ ★  │  ▮68▮    │
│ …              │   …      │   …      │   …      │
└────────────────┴──────────┴──────────┴──────────┘
```
- 3 selectors; comparison renders when ≥2 chosen. Per-category max highlighted (`bg-primary/5`).
- Responsive: table `overflow-x-auto`; radar full width above table.

---

## 4. Country detail `/country/:iso`

```
🇩🇪  Germany                                         Overall
     Europe · Rank #1 · Reviewed 16/06/2026          ▮84▮
     Strong software/AI market, no tuition… (summary)
     [Pending] Some categories not yet assessed — provisional.   (only if pending)

┌─ Category profile ─────────┐  ┌─ Contribution to overall ──┐
│      ◔ radar (single)      │  │  Job Market   ████████ 10.6│  ← bars, sorted desc,
│                            │  │  MSc Study    ██████   7.2 │     tooltip "x of N pts"
└────────────────────────────┘  └────────────────────────────┘

── Category detail ───────────────────────────────────────  (2-col card grid)
┌──────────────────────────────┐ ┌──────────────────────────────┐
│ Software & AI Job Market ▮88▮│ │ Visa Accessibility (BD)  ▮70▮│
│ Strong demand… (summary)     │ │ Embassy in Dhaka… (summary)  │
│ Why this score… (reasoning)  │ │ Why this score… (reasoning)  │
│ • evidence bullet            │ │ • evidence bullet            │
│ • evidence bullet            │ │ EU Blue Card ↗  German Miss ↗│
│ Source ↗     Reviewed 16/06  │ │ Reviewed 16/06/2026          │
└──────────────────────────────┘ └──────────────────────────────┘
   … one card per category (pending cards show "Not yet assessed.")

── References ────────────────────────────────────────────
 • Make it in Germany (official) ↗
```
Responsive: two charts `lg:grid-cols-2` (stack on mobile); cards `md:grid-cols-2`.

---

## 5. About `/about`

```
About this tool                                              (h1)
A transparent, personally-weighted ranking… (intro)

── The household ─────────────────────────────────────────   (two equal peers — no applicant/dependent label)
┌───────────────────────┐  ┌────────────────────────┐
│ Erfanul Bhuiyan       │  │ Tanima Hossain         │
│ Software Eng·Netpower │  │ Software Eng·Optimizely│
│ Dhaka, Bangladesh     │  │ Dhaka, Bangladesh      │
│ Portfolio ↗  LinkedIn↗│  │ Portfolio ↗  LinkedIn↗ │  ← per-person links
└───────────────────────┘  └────────────────────────┘
Both hold a BSc in CSE from Daffodil International University; either of us can lead the application — the other joins as the dependent.

── Goal & pathway ────────────────────────────────────────
[ MSc studies ] → [ Post-study work ] → [ PR ] → [ Citizenship ] → [ Passport ]

── Preferences ───────────────────────────────────────────
• Regions: Europe, Australia…        • Faster citizenship: yes
• Profession: IT / Software / AI…    • Dual citizenship: preferred

── Scoring methodology ───────────────────────────────────
Each category has a fixed weight (its % ceiling). Overall = weighted average; pending cells use a flagged placeholder score and ARE included (country marked provisional); only categories absent from the data are excluded (renormalised).
┌────────────────────────────┬────────┬───────────────────────────┐
│ Category                   │ Weight │ What it measures          │
│ Software & AI Job Market   │  12%   │ Demand, salary, sponsor…  │   sorted by weight desc
│ Visa Accessibility (BD)    │  10%   │ Acceptance, Dhaka mission…│
│ …                          │   …    │ …                         │
└────────────────────────────┴────────┴───────────────────────────┘
```
Per-person Portfolio/LinkedIn links live inside each profile card (above), so there is no separate Links section.
Responsive: profile cards `sm:grid-cols-2`; pathway chips wrap; weight table `overflow-x-auto`.

---

## Responsive breakpoints (Tailwind defaults)

| Token | Min width | Key changes |
|-------|-----------|-------------|
| base | 0 | Single column; nav links collapse to a hamburger menu; wide tables scroll-x; map pan/zoom (touch) |
| `sm` | 640px | Podium 3-up; StatCards 4-up; profile cards 2-up |
| `md` | 768px | Category cards 2-up |
| `lg` | 1024px | Detail charts side-by-side |

Desktop-first per NFR5; everything remains usable down to ~360px via horizontal scroll on dense tables.
