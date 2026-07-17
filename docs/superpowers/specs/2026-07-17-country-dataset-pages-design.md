# Country dataset pages + all-markers map — design spec

**Date:** 2026-07-17
**Status:** Implemented; map popup interaction corrected on 2026-07-17
**Supersedes UI surface of:** `2026-07-17-dataset-search-filter-design.md` (that search/filter work is retained verbatim; it moves from the modal into the new page unchanged).

## Problem

The per-country cities/universities datasets render inside a shadcn `Dialog` (`DatasetModal`) launched from buttons on the country detail page. With search, filter, sort, expandable rows, a compare mode, and a map, the content has outgrown a dialog — a pattern meant for short, focused, transient tasks. It is cramped on mobile, focus-trapped, not deep-linkable, and does not integrate with browser history. Users also have no at-a-glance geographic overview of *all* cities/universities — only the two-item compare map.

## Users

The single fixed profile (Bangladeshi MSc applicant) exploring a candidate country's cities and universities. Read-only over the JSON data store.

## Outcomes

- Cities and universities each get a dedicated, full-viewport, deep-linkable page.
- Each page opens with a map plotting **every** city/university in that country, with a label per marker.
- The existing table (with the just-added search/filter), compare, methodology, and sources views carry over unchanged.
- The dialog surface is removed — one surface to maintain.

## Decisions (locked in brainstorm)

| # | Decision |
|---|---|
| D1 | **Two routes** — `country/:iso/universities` and `country/:iso/cities`. |
| D2 | **Full replace** — delete `DatasetModal`; launch buttons become `Link`s. No modal kept. |
| D3 | **Defer URL-synced filter/sort** — pages use local filter state (as the modal did); URL sync is a documented follow-up. |
| D4 | **Researched `abbr` field** for university marker labels — official/conventional short form per university, sourced with citations; no invented acronyms. |
| D5 | **Map shows all rows**, independent of the table's search/filter (a stable geographic index). |
| D6 | **Compare maps left untouched** — `DatasetMap` is self-contained; no shared-scaffold extraction or compare-map refactor in this pass. |
| D7 | **Reuse the permanent tooltip-label pattern** (existing `.country-label`) for on-pin labels; a marker click opens a **small shadcn `Dialog`** (full name + basic overview from existing row data), not a Leaflet popup. |

## Architecture

### 1. `DatasetView` — extracted modal body
New `src/components/dataset/DatasetView.tsx`, props `{ dataset: ComparativeDataset }`. Contains the modal's tabbed body verbatim: Table / Compare / Methodology / Sources, plus the `showCompare` / `showMethodology` / `showSources` gating currently inline in `DatasetModal`. The two inline JSX blobs (criteria+weights list; caveats+sources list) move here. Single source of the dataset UI.

### 2. `DatasetMap` — all-markers map (new)
New `src/components/dataset/DatasetMap.tsx`, props `{ dataset: ComparativeDataset }`. Renders one marker per row that has a `location`, `fitBounds` over all present locations.

- **Scaffold:** self-contained copy of the compare-map constants (`GERMANY_BOUNDS`, `germanyFeature`, tile URL/attribution, `tileFailed` fallback). No shared module, no change to the compare maps (D6).
- **Marker:** a compact single-colour teardrop `divIcon` reusing the existing `.university-map-marker` teardrop shape (drop the A/B colour variants — one marker style).
- **Label:** a **permanent** react-leaflet `<Tooltip>` per marker, reusing the existing `.leaflet-tooltip.country-label` label pattern, showing `markerLabel(row, kind)` (see §4) — abbr for long university names, city name for cities.
- **Click → small modal (not a Leaflet popup):** clicking or keyboard-activating a marker opens a small shadcn `Dialog` (`MarkerDetail`, internal to `DatasetMap`) with the **full name** and a **basic overview drawn only from existing row data**, kind-aware:
  - universities: `label`, location context (`sublabel` + `location.label`), intake `tags`, a few key `values` (overall world rank, non-EU tuition, primary programs, language), and `detail.summary` if present;
  - cities: `label`, `sublabel`/`location.label`, the runtime overall tier (score datasets) + a couple of top `values`, and `detail.summary` if present.
  Controlled by a `selectedRow` state (`open={!!selectedRow}`). No Leaflet `<Popup>`.
- **Guards:** rows without `location` are skipped; if no row has a location the map section is not rendered (page still shows the table).
- **A11y:** `section` with `aria-label`; markers are keyboard-focusable (`keyboard`), Enter/click both open the modal; the `Dialog` uses standard shadcn focus management with its title = full name.
- **Placement:** top of the page, above `DatasetView`.
- **Not synced to table filter (D5).**

### 3. `CountryDatasetPage` — one shared page (new)
New `src/pages/CountryDatasetPage.tsx`, props `{ kind: "cities" | "universities" }` (one component, two routes — the only per-kind differences are the bundle field, icon, and copy).

```
const { iso } = useParams();
const country = useCountry(iso);
const dataset = getDatasets(iso)[kind];
if (!country) -> inline "Country not found" + back-to-leaderboard (mirror CountryDetail)
if (!dataset)  -> inline "No {kind} data for {country.name}" + back-to-country
render:
  <Link to={`/country/${iso}`}>← Back to {country.name}</Link>
  <h1>{dataset.title}</h1> + subtitle + "Reviewed {formatDate(dataset.lastReviewed)}"
  <DatasetMap dataset={dataset} />
  <DatasetView dataset={dataset} />
```

Chrome reuses the existing convention: `Layout` supplies `<main class="mx-auto max-w-6xl px-4 py-8">` automatically; page uses the `space-y-8` + `space-y-1`/`h1`/`p` header pattern (as Methodology/About) and the hand-rolled `← Back` link convention (as CountryDetail/NotFound).

### 4. `markerLabel` — pure helper
Add to `src/lib/datasets.ts`, unit-tested:
```ts
export function markerLabel(row: DatasetRow, kind: DatasetKind): string;
// cities:       -> row.label (city names are short)
// universities: -> row.label if it fits (<= LABEL_FIT threshold, e.g. 18 chars),
//                  else row.abbr ?? row.label (abbr expected present for long uni names)
```
Threshold is a named constant. Cities never need `abbr`.

### 5. Routes (`src/routes/index.tsx`)
Two siblings under the `<Layout>` children array (relative paths; basename auto-applies):
```tsx
{ path: "country/:iso/universities", element: <CountryDatasetPage kind="universities" /> },
{ path: "country/:iso/cities",       element: <CountryDatasetPage kind="cities" /> },
```

### 6. `CountryDatasets.tsx` — entry points
Replace each `<DatasetModal dataset trigger={<Button…>}>` with `<Button asChild><Link to={`/country/${iso}/${kind}`}>…</Link></Button>`, keeping the icons (`Building2`, `GraduationCap`), styling, and the `getDatasets` presence check (`if (!cities && !universities) return null`). Leading-slash paths.

### 7. Remove `DatasetModal`
Delete `src/components/dataset/DatasetModal.tsx` and its test once no importer remains (grep-confirm; only `CountryDatasets` imports it today). The `src/components/ui/dialog` primitive is **retained** — the new `MarkerDetail` modal (§2) uses it.

## Data model changes

- **Schema:** add optional `abbr: z.string().min(1).optional()` to `datasetRowSchema` in `src/lib/schema.ts`; the inferred `DatasetRow` type picks it up automatically. No new invariant; no weight/scale impact. Extend a schema test to accept a row with `abbr`.
- **Data (`universities/germany.json`, 26 rows):** populate `abbr` per university via the data-research protocol — official abbreviation where one exists (e.g. RWTH, LMU, TUM, KIT, HU Berlin, Charité), conventional published short form otherwise (e.g. "Uni Bonn", "TU Dortmund"); **never an invented acronym**. Update each changed row's evidence/`lastReviewed`, the dataset `lastReviewed`, and citations. Cities: no `abbr`.
- **Cache:** run `npm run cache:scores`; `abbr` does not affect any score, so `scoreboard.json` is expected unchanged — the drift test still must pass.

## Out of scope (documented follow-ups)

- URL-synced filter/sort (D3).
- Map ↔ table filter sync; click-marker-to-highlight-row (D5).
- Compare-map de-duplication / shared `germany-map.ts` (D6).
- Global-nav breadcrumb for the sub-pages; open/close transitions.
- `abbr` for any dataset other than Germany universities.

## Functional requirements

| # | Requirement |
|---|---|
| FR1 | Routes `country/:iso/universities` and `country/:iso/cities` render a full page under `Layout`. |
| FR2 | An unknown `:iso` shows an inline "Country not found"; a country lacking the requested dataset shows an inline "No {kind} data" — each with a back link. |
| FR3 | Each page shows a back link, the dataset title/subtitle/reviewed date, a map, then the full dataset view. |
| FR4 | `DatasetMap` plots one marker per located row and fits bounds to all of them; rows without a location are skipped; an all-missing map is not rendered. |
| FR5 | Each marker carries a permanent label — `abbr` for long university names, the name otherwise / city name for cities. Clicking or keyboard-activating a marker opens a small modal with the full name and a basic overview built only from existing row data. |
| FR6 | `DatasetView` reproduces the modal's Table/Compare/Methodology/Sources tabs and their visibility gating; the search/filter/sort in `DatasetTable` works unchanged. |
| FR7 | Launch controls on the country page are `Link`s to the two routes, rendered only for datasets the country has. |
| FR8 | `DatasetModal` and its test are removed with no remaining importers. |
| FR9 | Schema accepts an optional `abbr` on dataset rows; all 26 Germany university rows carry a sourced `abbr`. |

## Testing

- `src/lib/datasets.test.ts`: `markerLabel` — city returns name; short uni name returns name; long uni name returns `abbr`; long uni name without `abbr` falls back to name.
- `src/lib/schema.test.ts`: a dataset row with `abbr` validates; `abbr` is optional.
- `DatasetMap.test.tsx`: renders a marker + permanent label per located row; a long-named university's label is its `abbr`; a row without location is skipped; a no-location dataset renders no map section; activating a marker opens the modal showing the full name + overview. (Follow existing Leaflet component test patterns; render within the required providers.)
- `CountryDatasetPage.test.tsx` (MemoryRouter): real country with dataset → title + map + table + back link; unknown iso → not-found; country without that kind → not-found.
- `CountryDatasets.test.tsx`: rewrite — assert `Link` hrefs (`/country/:iso/{kind}`) and presence gating; no modal.
- Keep the existing `DatasetTable`/`CityCompare`/`UniversityCompare` tests green; delete `DatasetModal.test.tsx`.

## Risks / counterarguments

- **Lost in-context glance:** the modal let users peek without leaving the country page; a page costs a navigation. Mitigated by the back link. Accepted (D2) — search/filter implies exploration, which suits a page.
- **`abbr` authenticity:** forcing acronyms where none officially exist would fabricate. Mitigated by sourcing official/conventional short forms with citations and never inventing (D4); the marker only substitutes `abbr` when the full name doesn't fit.
- **26 markers over one country:** on-pin text can still crowd. Compact tokens (abbr) + click popups keep it legible; a legend/clustering is a possible later refinement, not needed now.
- **Marker/label CSS:** `src/index.css` already houses the Leaflet marker (`.university-map-marker*`) and permanent-label (`.leaflet-tooltip.country-label`) styles — the repo's established, sanctioned Leaflet exception to Tailwind-only. `DatasetMap` extends those existing rules (a single-colour marker + a reused label style); no new styling pattern is introduced.
- **One shared page vs two files:** a shared `kind`-prop component is DRY but slightly less greppable; the per-kind delta is tiny, so the shared component wins. Accepted.

## Files

- New: `src/pages/CountryDatasetPage.tsx`, `src/components/dataset/DatasetView.tsx`, `src/components/dataset/DatasetMap.tsx`, plus tests `src/pages/CountryDatasetPage.test.tsx`, `src/components/dataset/DatasetMap.test.tsx`.
- Edit: `src/routes/index.tsx` (routes), `src/components/dataset/CountryDatasets.tsx` (Links), `src/lib/datasets.ts` (`markerLabel`), `src/lib/datasets.test.ts`, `src/lib/schema.ts` (`abbr`), `src/lib/schema.test.ts`, `src/data/universities/germany.json` (`abbr` ×26), `src/components/dataset/CountryDatasets.test.tsx`.
- Delete: `src/components/dataset/DatasetModal.tsx`, `src/components/dataset/DatasetModal.test.tsx` (if present).
