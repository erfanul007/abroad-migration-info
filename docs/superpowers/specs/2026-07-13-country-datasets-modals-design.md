# Design Spec — Per-Country Supplementary Datasets & Modals (Cities · Universities)

**Status:** approved design, pre-implementation
**Date:** 2026-07-13
**Owner:** Erfanul Bhuiyan
**Related:** `docs/germany-cities.md`, `docs/germany-universities.md` (human-readable research
record; the JSON data files below cite back to these)

---

## 1. Problem

Two large research artefacts exist for Germany — a 12-city Chancenkarte relocation scoreboard and
a 20-university CS ranking table — but they live only as standalone markdown. They are not
reachable from the app, not structured, not validated, and not repeatable for other countries. We
want them surfaced *in context* on the country detail page, as rich, consistent, data-driven
views, in a way that generalises to every country and appears **only when a country actually has
the data**.

## 2. Users / personas

- **Primary:** the single fixed profile — a Bangladeshi software engineer evaluating migration
  targets. On a country page they want to drill from the country verdict into city-level and
  university-level detail without leaving the page.
- **Maintainer (also the user):** adds a dataset for a new country by dropping one JSON file, no
  component changes — mirroring the existing "add a country = JSON only" contract.

## 3. Outcomes / success criteria

1. On the Germany detail page, two buttons appear beside the profile summary — **Cities** and
   **Universities** — each opening a large modal with the full, structured dataset.
2. For any other country, a button appears **only if** that country has the corresponding dataset
   file; otherwise nothing renders (no empty buttons, no errors).
3. Both modals share one component and one visual language (consistent with the app's tiers,
   badges, tables, en-GB formatting, dark mode).
4. Data is Zod-validated at load through the existing gate; malformed datasets fail the test
   suite. `scoreboard.json` and its drift test are unaffected.
5. `npm run lint && npm run typecheck && npm run test && npm run build` all green.

## 4. Scope decisions (locked with user)

| Decision | Choice |
|---|---|
| Data location | **Separate files** — `src/data/cities/<id>.json`, `src/data/universities/<id>.json`, joined by country id |
| Schema shape | **One generic** `comparativeDataset` schema, discriminated by `kind`; one modal component |
| Enrichment | **Targeted** — add a few migration-critical fields (below); otherwise restructure existing research |
| Universities scale | **Ordinal ranks** kept (bibliometric source; no fabricated 0–100); non-official caveat stays visible |
| Cities overall | **Computed at runtime** from column weights (no stored overall — matches app philosophy) |
| Countries covered now | **Germany only**; the other 19 get datasets later, one file each |

## 5. Data model

### 5.1 New Zod schema (`src/lib/schema.ts`)

Reuses existing `proConSchema` and `referenceLinkSchema`. New building blocks:

```ts
export const datasetKindSchema  = z.enum(["cities", "universities"]);      // extensible
export const datasetScaleSchema = z.enum(["score", "rank"]);
export const columnKindSchema   = z.enum(["score", "rank", "number", "text"]);
export const betterWhenSchema   = z.enum(["high", "low"]);

export const datasetColumnSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  shortLabel: z.string().optional(),
  kind: columnKindSchema,
  weight: z.number().nonnegative().optional(),   // required on score columns when scale==="score"
  betterWhen: betterWhenSchema.default("high"),   // "low" for ranks/rent-style columns
  unit: z.string().optional(),                    // e.g. "€/mo", "€/sem"
  description: z.string().optional(),
});

export const datasetRowSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sublabel: z.string().optional(),                // e.g. city region, or university city
  values: z.record(z.string(), z.union([z.number(), z.string()])),
  detail: z.object({
    summary: z.string().optional(),
    pros: z.array(proConSchema).optional(),
    cons: z.array(proConSchema).optional(),
    note: z.string().optional(),                  // e.g. per-row "conversion note"
    links: z.array(referenceLinkSchema).optional(),
  }).optional(),
});

export const comparativeDatasetSchema = z.object({
  kind: datasetKindSchema,
  countryId: z.string().min(1),                   // join key; must equal an existing country id
  title: z.string().min(1),
  subtitle: z.string().optional(),
  scale: datasetScaleSchema,
  lastReviewed: z.string(),
  columns: z.array(datasetColumnSchema).min(1),
  rows: z.array(datasetRowSchema).min(1),
  methodology: z.string().optional(),
  caveats: z.array(z.string()).optional(),
  sources: z.array(referenceLinkSchema).optional(),
});
```

Cross-field rules enforced by `validateDataset` (see 5.3), not plain `.refine` where they need the
country catalogue:

- Column ids unique; row ids unique.
- Every key in each `row.values` is a known column id.
- Value type matches column kind: `score`/`rank`/`number` → `number`; `text` → `string`
  (missing values allowed — rendered as `—`).
- `kind === "cities"` ⇒ `scale === "score"`; `kind === "universities"` ⇒ `scale === "rank"`.
- If `scale === "score"`: every `score`-kind column has a `weight`, and those weights sum to
  **100 ± `WEIGHT_TOLERANCE`** (reuse existing constant, 0.001).
- `countryId` matches an id in the loaded countries (checked in the runtime/test gate, like
  `validateCountry` checks category ids).

Types via `z.infer`, re-exported from `@/types`: `DatasetKind`, `DatasetScale`, `ColumnKind`,
`BetterWhen`, `DatasetColumn`, `DatasetRow`, `ComparativeDataset`.

### 5.2 Runtime-derived (never stored)

A pure helper (`src/lib/datasets.ts`, co-located test):

```ts
rowOverall(dataset, row): number | null   // weighted mean over PRESENT score columns, renormalised
                                          // (mirrors country overall math); null if no score cols
rowTier(dataset, row): Tier               // scoreTier(rowOverall) — only for scale==="score"
bestValue(dataset, colId): number | null  // min if betterWhen==="low", else max — for cell highlight
```

`rowOverall` reproduces the verified cities overalls exactly (Hamburg 70.1, Karlsruhe 68.3, …) —
used as a regression fixture in tests.

### 5.3 Loading (`src/lib/data.ts`)

Two new eager globs, mirroring the countries glob, keyed by country id parsed from the dataset's
`countryId` field (authoritative) with the filename as a sanity cross-check:

```ts
const cityMods = import.meta.glob<{ default: ComparativeDataset }>("@/data/cities/*.json",        { eager: true });
const uniMods  = import.meta.glob<{ default: ComparativeDataset }>("@/data/universities/*.json",  { eager: true });
// → Map<countryId, { cities?: ComparativeDataset; universities?: ComparativeDataset }>
export function getDatasets(iso: string): { cities?: ComparativeDataset; universities?: ComparativeDataset };
```

`getDatasets` resolves by the same iso/id rule as `getScoredCountry` (case-insensitive, iso or
id). Returns `{}` when the country has neither dataset.

Validation gate (`data.ts:16-25`) gains `…datasets.flatMap(d => validateDataset(d, countryIds))`;
throws in DEV/test exactly as today. **`scripts/build-score-cache.ts` and `scoreboard.json` are
untouched** — datasets never feed scoring, so the drift test stays isolated and no `cache:scores`
run is needed.

### 5.4 Germany data files

**`src/data/cities/germany.json`** — `kind: "cities"`, `scale: "score"`, `countryId: "germany"`
(files are named by country **id**, like `countries/germany.json`; `iso` is `"DE"`).
- 11 score columns (weights summing to 100): `conv` 16, `jobs` 14, `rent` 13, `anm` 10, `eng` 9,
  `comp` 8, `safe` 8, `cost` 6, `pt` 6, `conn` 6, `comm` 4.
- Context columns (unscored): `population` (number), `rentCentre` (text/number, `€/mo`,
  `betterWhen: low`), `rentM2` (number, `betterWhen: low`), **new:** `salary` (text, junior/mid
  band), `bdCommunity` (text), `embassy` (text — Bangladesh embassy is Berlin-only).
- 12 rows (the ranked cities) with per-column scores + `detail` (summary, pros, cons,
  conversion `note`, links) ported from `docs/germany-cities.md`.
- `methodology`, `caveats[]`, `sources[]` ported + condensed.

**`src/data/universities/germany.json`** — `kind: "universities"`, `scale: "rank"`,
`countryId: "germany"`.
- Columns: `cse`, `ai`, `ml`, `ds`, `swe` (kind `rank`, `betterWhen: low`); `city` (text);
  **new:** `englishMsc` (text: yes/limited/German-only), `tuition` (text, `€/sem` non-EU),
  `apply` (text: uni-assist/direct).
- 20 rows (the ranked universities) from `docs/germany-universities.md`; `detail.note` for the
  Charité/medical caveat etc.
- `methodology`/`caveats`/`sources` port the EduRank provenance + the non-official caveat.

Enrichment fields (`salary`, `bdCommunity`, `embassy`, `englishMsc`, `tuition`, `apply`) require a
**focused research pass** under the data-change protocol (gov/official first, ≥2 sources, cited in
`sources[]` / `detail.links[]`). Any field that cannot be sourced is set to `"—"`/omitted, never
guessed.

## 6. Components

All under `src/components/dataset/` (new folder), co-located `*.test.tsx`.

| Unit | Responsibility | Depends on |
|---|---|---|
| `DatasetTable.tsx` | Sortable comparative table for one dataset. Columns built from `dataset.columns`; score cells → `ScoreBadge`, rank/number → `tabular-nums`, text → plain, missing → `—`. Best cell per column highlighted via `bestValue` + `betterWhen`. For `scale==="score"`: prepend a computed **Overall** column (`ScoreBadge`) + rank; default sort Overall desc. For `scale==="rank"`: default sort primary column asc. Expandable per-row `detail` panel (full-width row, `colSpan`, `aria-expanded`). | TanStack Table (leaderboard pattern), `ScoreBadge`, `SeverityBadge`, `formatNumber`/`formatPercent`, `rowOverall`/`bestValue` |
| `DatasetModal.tsx` | shadcn `Dialog` (`className="sm:max-w-4xl"`), `DialogHeader` (title + subtitle + `formatDate(lastReviewed)`), then `Tabs`: **Table** (`DatasetTable`) · **Methodology** (`methodology` text + `TierLegend` for score datasets + column/weight legend) · **Sources** (`sources[]` + `caveats[]`). Accepts `dataset` + `trigger` node. | `Dialog`, `Tabs`, `DatasetTable`, `TierLegend`, `formatDate` |
| `CountryDatasets.tsx` | Given `iso`, calls `getDatasets(iso)`; renders a button per present dataset (`🏙/Building2` Cities, `🎓/GraduationCap` Universities), each wrapping a `DatasetModal`. Renders nothing if `{}`. | `getDatasets`, `DatasetModal`, `Button`, lucide icons |

**Integration point:** `src/pages/CountryDetail.tsx:34-50` header row — add `<CountryDatasets
iso={country.iso} />` as a button row beneath the Overall block (or a third flex child), so it sits
beside the profile summary as specified. No other page changes.

**Reuse, don't reinvent:** Dialog blueprint from `FactorCompareDialog.tsx`; table sorting from
`LeaderboardTable.tsx`/`columns.tsx`; badges/tiers/formatters as mapped. `TooltipProvider` is not
mounted app-wide — avoid Tooltip, or mount a local provider inside the modal if needed.

## 7. Data flow

`CountryDetail` → `CountryDatasets(iso)` → `getDatasets(iso)` (pure lookup over globbed, validated
data) → 0–2 `DatasetModal`s. Each modal is self-contained over its `ComparativeDataset`; overall/
tier/best-cell are computed on render via `src/lib/datasets.ts`. No network, no state beyond
dialog open + table sort/expand (local component state).

## 8. Error handling

- Missing dataset file → `getDatasets` returns `{}` → no button (the "dynamic" requirement).
- Malformed dataset → `validateDataset` throws in DEV/test (fails the suite), `console.error` in
  prod build — same policy as countries.
- Missing `row.values[col]` → rendered `—`, excluded from overall renormalisation and best-cell.
- Unknown `countryId` → validation error (caught by gate/test).

## 9. Testing

- `src/lib/schema.test.ts` (extend): valid dataset passes; unknown column ref fails; score-weights
  ≠ 100 fails; duplicate column/row ids fail; value-type mismatch fails; kind/scale mismatch fails.
- `src/lib/datasets.test.ts` (new): `rowOverall` reproduces the 12 verified cities overalls
  (Hamburg 70.1 … Aachen 60.5) within rounding; `bestValue` respects `betterWhen`.
- `src/lib/data.test.ts` (extend): `getDatasets("germany")` returns both (and `getDatasets("DE")`
  resolves the same by iso); a country without returns `{}`; Germany cities weights sum to 100;
  Germany universities `scale==="rank"`; all dataset `countryId`s resolve to real countries.
- `src/components/dataset/DatasetTable.test.tsx` (new): renders rows; sorts on header click;
  expands a row to show detail.
- Gate unchanged for `scoreboard.test.ts` (no scoring impact).

## 10. Out of scope

- Datasets for the other 19 countries (added later, one file each).
- Converting universities to 0–100 scores.
- Any change to country scoring, categories, weights, or `scoreboard.json`.
- New routes / deep-linkable modal URLs (possible future; modals only for now).
- A generic Sources component beyond what the modal needs.

## 11. Open questions / risks

- **Enrichment sourcing:** precise Bangladeshi-population-by-city figures are often unpublished;
  where no authoritative figure exists the field stays qualitative or `—` (never fabricated).
- **Bavaria/Baden-Württemberg tuition:** non-EU fees changed recently (2024/25) — must be
  re-verified per university at research time; flag currency in `caveats`.
- **Germany country id (resolved):** id is `"germany"`, iso is `"DE"`; files are `cities/germany.json`
  and `universities/germany.json` with `countryId: "germany"` (matches `countries/germany.json`).

## 12. Build order

1. Focused research pass for the six enrichment fields (cited).
2. Author `src/data/cities/de.json` + `src/data/universities/de.json`.
3. Add schema + types + `validateDataset`; wire the runtime gate.
4. Add loader globs + `getDatasets`; `src/lib/datasets.ts` helpers.
5. Build `DatasetTable` → `DatasetModal` → `CountryDatasets`.
6. Integrate into `CountryDetail` header.
7. Tests (schema, datasets, data, table).
8. Full quality gate green.
