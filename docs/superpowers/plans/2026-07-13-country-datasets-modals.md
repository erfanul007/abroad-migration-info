# Per-Country Datasets & Modals (Cities · Universities) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline, batch with checkpoints). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Surface the Germany cities-scoreboard and universities-ranking research as two
conditional, data-driven modals on the country detail page, generalised to all countries.

**Architecture:** One generic `comparativeDataset` Zod schema (discriminated by `kind`) stored in
per-country files (`src/data/cities/<id>.json`, `src/data/universities/<id>.json`), globbed and
joined by country id; one `<DatasetModal>` renders any dataset; conditional buttons in the
`CountryDetail` header. Cities overall/tier computed at runtime from column weights; universities
stay ordinal ranks.

**Tech Stack:** React 19, TS strict, Vite, Zod 4, TanStack Table, shadcn/ui (Dialog, Tabs, Table),
Tailwind v4, Vitest.

## Global Constraints

- **No fabrication.** Every enrichment fact validated against **≥2 authoritative sources**
  (gov/official first); anything unsourced is set to `"—"` or omitted. Cite in `sources[]` /
  `detail.links[]`.
- **Zod gate is law:** `npm run test` must pass; datasets validate through the same gate as
  countries. Never bypass.
- **No stored overall** in dataset files — computed at runtime (matches repo philosophy).
- **`scoreboard.json` untouched** — datasets do not feed scoring; no `cache:scores` run needed.
- **en-GB formatting** via `src/lib/formatters.ts`; never hardcode separators/dates.
- **Strict TS, no `any`;** derive types from Zod; `@/` imports; kebab-case files; Tailwind + `cn()`.
- **Country id = `germany`, iso = `DE`;** files named by id.
- **No commit/push without explicit user approval.**
- **Gate before done:** `npm run lint && npm run typecheck && npm run test && npm run build` green.

---

### Task 0: Enrichment research (multi-source, cited)

**Deliverable:** `docs/superpowers/research/2026-07-13-germany-enrichment.md` — a cited notes file
feeding the six enrichment fields. No code.

Fields (each ≥2 authoritative sources, flag currency):
- **Cities:** avg software/tech salary band (junior + mid, €/yr gross) per city; Bangladeshi/
  South-Asian community size (figure where published, else qualitative); nearest Bangladesh
  embassy/consulate (embassy is Berlin-only — confirm).
- **Universities (20):** English-taught CS/AI MSc availability (yes/limited/German-only); non-EU
  tuition €/semester (Bavaria + Baden-Württemberg charge from 2024/25; most others tuition-free —
  verify per state + spot-check unis); application route (uni-assist vs direct).

- [ ] Run a focused research pass (workflow or direct WebSearch/WebFetch), gov/official first
  (DAAD, study-in-germany.de, each university's admissions page, state ministries, Bangladesh
  mission list, StepStone/Levels.fyi/Glassdoor for salary bands cross-checked ≥2 ways).
- [ ] Write the notes file: one row per fact with value + ≥2 source URLs + a currency flag.
- [ ] Mark any field that could not be dual-sourced as `UNSOURCED → "—"`.

---

### Task 1: Dataset schema + types + validator (TDD)

**Files:**
- Modify: `src/lib/schema.ts` (add sub-schemas after `countrySchema`; add `validateDataset`)
- Modify: `src/types/index.ts` (re-export new inferred types)
- Test: `src/lib/schema.test.ts` (extend)

**Interfaces — Produces:**
- Types: `DatasetKind, DatasetScale, ColumnKind, BetterWhen, DatasetColumn, DatasetRow, ComparativeDataset`
- `validateDataset(dataset: unknown, knownCountryIds: string[]): string[]` (returns `path: message` issues, `[]` when valid — mirrors `validateCountry`)

- [ ] **Step 1: Failing tests** in `schema.test.ts`:

```ts
import { comparativeDatasetSchema, validateDataset } from "./schema";

const validCities = {
  kind: "cities", countryId: "germany", title: "T", scale: "score", lastReviewed: "2026-07-13",
  columns: [
    { id: "conv", label: "Conv", kind: "score", weight: 60, betterWhen: "high" },
    { id: "jobs", label: "Jobs", kind: "score", weight: 40, betterWhen: "high" },
    { id: "pop", label: "Population", kind: "number", betterWhen: "high" },
  ],
  rows: [{ id: "munich", label: "Munich", values: { conv: 68, jobs: 92, pop: 1510000 } }],
};

it("accepts a well-formed cities dataset", () => {
  expect(validateDataset(validCities, ["germany"])).toEqual([]);
});
it("rejects score-column weights that do not sum to 100", () => {
  const bad = { ...validCities, columns: [{ id: "conv", label: "C", kind: "score", weight: 10, betterWhen: "high" }] ,
    rows: [{ id: "m", label: "M", values: { conv: 50 } }] };
  expect(validateDataset(bad, ["germany"]).join()).toMatch(/weight/i);
});
it("rejects a row value referencing an unknown column", () => {
  const bad = { ...validCities, rows: [{ id: "m", label: "M", values: { nope: 1 } }] };
  expect(validateDataset(bad, ["germany"]).join()).toMatch(/unknown column/i);
});
it("rejects an unknown countryId", () => {
  expect(validateDataset(validCities, ["france"]).join()).toMatch(/countryId/i);
});
it("rejects a numeric column carrying a string value", () => {
  const bad = { ...validCities, rows: [{ id: "m", label: "M", values: { conv: "x", jobs: 1 } }] };
  expect(validateDataset(bad, ["germany"]).join()).toMatch(/number/i);
});
```

- [ ] **Step 2: Run — expect FAIL** (`comparativeDatasetSchema`/`validateDataset` undefined):
  `npm run test -- schema`

- [ ] **Step 3: Implement** in `schema.ts` (after `countrySchema`, before `categoriesSchema`):

```ts
export const datasetKindSchema = z.enum(["cities", "universities"]);
export const datasetScaleSchema = z.enum(["score", "rank"]);
export const columnKindSchema = z.enum(["score", "rank", "number", "text"]);
export const betterWhenSchema = z.enum(["high", "low"]);

export const datasetColumnSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  shortLabel: z.string().optional(),
  kind: columnKindSchema,
  weight: z.number().nonnegative().optional(),
  betterWhen: betterWhenSchema.default("high"),
  unit: z.string().optional(),
  description: z.string().optional(),
});

export const datasetRowSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sublabel: z.string().optional(),
  values: z.record(z.string(), z.union([z.number(), z.string()])),
  detail: z
    .object({
      summary: z.string().optional(),
      pros: z.array(proConSchema).optional(),
      cons: z.array(proConSchema).optional(),
      note: z.string().optional(),
      links: z.array(referenceLinkSchema).optional(),
    })
    .optional(),
});

export const comparativeDatasetSchema = z.object({
  kind: datasetKindSchema,
  countryId: z.string().min(1),
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

Then `validateDataset` (near `validateCountry`), enforcing the cross-field rules with the
catalogue:

```ts
export function validateDataset(data: unknown, knownCountryIds: string[]): string[] {
  const parsed = comparativeDatasetSchema.safeParse(data);
  if (!parsed.success) return issues(parsed.error);
  const ds = parsed.data;
  const out: string[] = [];

  if (!knownCountryIds.includes(ds.countryId))
    out.push(`countryId: unknown country "${ds.countryId}"`);

  const colIds = ds.columns.map((c) => c.id);
  if (new Set(colIds).size !== colIds.length) out.push("columns: duplicate column id");
  const rowIds = ds.rows.map((r) => r.id);
  if (new Set(rowIds).size !== rowIds.length) out.push("rows: duplicate row id");

  if (ds.kind === "cities" && ds.scale !== "score")
    out.push('kind "cities" requires scale "score"');
  if (ds.kind === "universities" && ds.scale !== "rank")
    out.push('kind "universities" requires scale "rank"');

  const colById = new Map(ds.columns.map((c) => [c.id, c]));
  if (ds.scale === "score") {
    const scoreCols = ds.columns.filter((c) => c.kind === "score");
    const missing = scoreCols.filter((c) => c.weight == null);
    if (missing.length) out.push(`columns: score column(s) missing weight: ${missing.map((c) => c.id).join(", ")}`);
    const sum = scoreCols.reduce((a, c) => a + (c.weight ?? 0), 0);
    if (Math.abs(sum - 100) > WEIGHT_TOLERANCE) out.push(`columns: score weights must sum to 100 (got ${sum})`);
  }

  for (const row of ds.rows) {
    for (const [key, value] of Object.entries(row.values)) {
      const col = colById.get(key);
      if (!col) { out.push(`rows.${row.id}.values: unknown column "${key}"`); continue; }
      const wantsNumber = col.kind === "score" || col.kind === "rank" || col.kind === "number";
      if (wantsNumber && typeof value !== "number")
        out.push(`rows.${row.id}.values.${key}: expected number for ${col.kind} column`);
      if (col.kind === "text" && typeof value !== "string")
        out.push(`rows.${row.id}.values.${key}: expected string for text column`);
    }
  }
  return out;
}
```

- [ ] **Step 4:** Add `z.infer` type exports + re-export from `@/types` (`DatasetKind`, `DatasetScale`, `ColumnKind`, `BetterWhen`, `DatasetColumn`, `DatasetRow`, `ComparativeDataset`).
- [ ] **Step 5: Run — expect PASS:** `npm run test -- schema`
- [ ] **Step 6: Commit** (only after all tasks green + user approval).

---

### Task 2: Runtime helpers `src/lib/datasets.ts` (TDD)

**Files:** Create `src/lib/datasets.ts`; Test `src/lib/datasets.test.ts`.

**Interfaces — Consumes:** `ComparativeDataset`, `DatasetRow` (Task 1); `scoreTier`, `Tier` (`formatters.ts`).
**Produces:**
- `rowOverall(ds: ComparativeDataset, row: DatasetRow): number | null`
- `rowTier(ds, row): Tier | null`
- `bestValue(ds, columnId): number | null`
- `scoreColumns(ds): DatasetColumn[]`

- [ ] **Step 1: Failing test** — overall renormalises over present score columns; reproduces a known city:

```ts
import { rowOverall, bestValue } from "./datasets";
// minimal fixture with the 11 real weights and Hamburg's 11 scores → expect 70.1 ± 0.05
```
(Use the 11 real weights + Hamburg row `[76,74,66,62,72,60,78,60,70,70,82]` → assert `≈ 70.1`.)

- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement** weighted mean over `kind==="score"` columns present in `row.values`, renormalised by present weight; `bestValue` = min when `betterWhen==="low"`, else max, ignoring non-numeric/missing.
- [ ] **Step 4: Run — expect PASS.**

---

### Task 3: Loader globs + `getDatasets` (TDD)

**Files:** Modify `src/lib/data.ts`; Test `src/lib/data.test.ts` (extend).

**Interfaces — Produces:** `getDatasets(iso: string): { cities?: ComparativeDataset; universities?: ComparativeDataset }`.

- [ ] **Step 1:** Add two eager globs + a `Map<countryId, {...}>` built from each dataset's
  `countryId`; extend the validation gate with `validateDataset(d, countryIds)` for every loaded
  dataset (throw in DEV/test as today). Add `getDatasets` resolving by iso/id like
  `getScoredCountry`.
- [ ] **Step 2:** Tests: before the Germany files exist, `getDatasets("germany")` returns `{}`;
  after Task 4, it returns both, `getDatasets("DE")` resolves the same, and an arbitrary other
  country returns `{}`. (Split: add the "empty" test now; the "returns both" assertions land with
  Task 4.)
- [ ] **Step 3: Run — expect PASS.**

---

### Task 4: Author Germany data files

**Files:** Create `src/data/cities/germany.json`, `src/data/universities/germany.json`.

- [ ] **cities/germany.json** — `kind:"cities"`, `scale:"score"`, `countryId:"germany"`; 11 score
  columns (conv16 jobs14 rent13 anm10 eng9 comp8 safe8 cost6 pt6 conn6 comm4) + context columns
  (population, rentCentre, rentM2, salary, bdCommunity, embassy); 12 rows with scores + `detail`
  (summary/pros/cons/note/links) from `docs/germany-cities.md`; enrichment from Task 0;
  `methodology`/`caveats`/`sources`.
- [ ] **universities/germany.json** — `kind:"universities"`, `scale:"rank"`,
  `countryId:"germany"`; columns cse/ai/ml/ds/swe (rank, betterWhen low) + city/englishMsc/tuition/
  apply (text); 20 rows from `docs/germany-universities.md` + Task 0 enrichment; caveats/sources.
- [ ] **Add Task 3's deferred assertions** to `data.test.ts` (both datasets present, weights sum
  100, universities scale rank, all `countryId`s resolve).
- [ ] **Run — expect PASS:** `npm run test`. (If the gate throws, the data is malformed — fix, do
  not bypass.)

---

### Task 5: `DatasetTable` component (TDD)

**Files:** Create `src/components/dataset/DatasetTable.tsx`; Test `DatasetTable.test.tsx`.

**Interfaces — Consumes:** `ComparativeDataset`, helpers (Task 2), `ScoreBadge`, `SeverityBadge`,
`formatNumber`/`formatPercent`. **Produces:** `<DatasetTable dataset={ds} />`.

- [ ] TanStack Table (mirror `LeaderboardTable`/`columns.tsx`): columns from `dataset.columns`;
  score → `ScoreBadge`, rank/number → `tabular-nums` (`formatNumber`), text → plain, missing →
  `—`; best cell per column highlighted (`bestValue` + `betterWhen`) via `bg-primary/5`. For
  `scale==="score"`: prepend computed **Overall** (`ScoreBadge`) + rank, default sort overall desc;
  for `scale==="rank"`: default sort first rank column asc (`sortUndefined: "last"`). Expandable
  row → full-width `detail` panel (summary + pros/cons via `SeverityBadge` + note + links),
  `aria-expanded`.
- [ ] Tests: renders all rows; header click re-sorts; clicking a row toggles its detail panel.
- [ ] **Run — expect PASS.**

---

### Task 6: `DatasetModal` component

**Files:** Create `src/components/dataset/DatasetModal.tsx`.

**Interfaces — Consumes:** `Dialog*`, `Tabs*`, `DatasetTable`, `TierLegend`, `formatDate`.
**Produces:** `<DatasetModal dataset={ds} trigger={<Button/>} />`.

- [ ] `Dialog` + `DialogContent className="sm:max-w-4xl"` (mirror `FactorCompareDialog`);
  `DialogHeader` = title + subtitle + `Reviewed {formatDate(lastReviewed)}`; `Tabs`: **Table**
  (`DatasetTable`) · **Methodology** (`methodology` + `TierLegend` for score datasets + a
  column/weight legend) · **Sources** (`sources[]` links + `caveats[]`). Guard empty tabs.
- [ ] Manual/light render smoke check (no dedicated test required beyond typecheck; add one if
  trivial).

---

### Task 7: `CountryDatasets` + integrate into `CountryDetail`

**Files:** Create `src/components/dataset/CountryDatasets.tsx`; Modify `src/pages/CountryDetail.tsx:34-50`.

**Interfaces — Consumes:** `getDatasets`, `DatasetModal`, `Button`, lucide `Building2`/`GraduationCap`.
**Produces:** `<CountryDatasets iso={country.iso} />`.

- [ ] `CountryDatasets`: `const { cities, universities } = getDatasets(iso);` render a `Button`
  (variant `outline`, size `sm`) per present dataset, each wrapping a `DatasetModal`; return
  `null` when both absent.
- [ ] Insert `<CountryDatasets iso={country.iso} />` in the header row (beneath the Overall block
  or as a third flex child), so it sits beside the profile summary.
- [ ] Verify: Germany shows both buttons + working modals; a country without datasets shows none.

---

### Task 8: Quality gate + verification

- [ ] `npm run lint` — clean.
- [ ] `npm run typecheck` — clean.
- [ ] `npm run test` — all green (schema, datasets, data, table).
- [ ] `npm run build` — succeeds.
- [ ] Run the app (`npm run dev`), open `/country/germany`, confirm both modals render the data,
  sort, expand, and that a datasetless country (e.g. `/country/france`) shows no buttons.
- [ ] Report results honestly; propose commit; **wait for approval** before any git action.

---

## Self-Review

- **Spec coverage:** generic schema (T1) ✓ · separate files/loader/dynamic presence (T3,T4,T7) ✓ ·
  runtime overall (T2) ✓ · one modal + tabs (T5,T6) ✓ · header buttons (T7) ✓ · enrichment (T0) ✓ ·
  validation/tests (T1–T5) ✓ · `scoreboard.json` untouched (no cache task) ✓.
- **Placeholder scan:** schema/validator/helpers carry real code; component tasks specify exact
  reuse targets + interfaces (full JSX built at execution against the mapped patterns).
- **Type consistency:** `getDatasets`, `validateDataset`, `rowOverall`/`bestValue`,
  `ComparativeDataset` names consistent across tasks; `countryId:"germany"`, iso `DE` throughout.
