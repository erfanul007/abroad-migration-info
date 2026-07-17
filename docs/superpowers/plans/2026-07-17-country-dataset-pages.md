# Country Dataset Pages + All-Markers Map — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the per-country dataset dialog with two deep-linkable pages (cities, universities), each opening with an all-markers map whose pins carry short labels and open a small detail modal on click.

**Architecture:** Extract the modal body into `DatasetView`; render it plus a new self-contained `DatasetMap` from one shared `CountryDatasetPage kind=…` wired to two routes. Add an optional, researched `abbr` field to dataset rows for university marker labels. Delete `DatasetModal`.

**Tech Stack:** React 19, TypeScript (strict), React Router 7 (`createBrowserRouter`), Zod 4, Leaflet + react-leaflet, shadcn/ui (Dialog, Tabs, Select), Tailwind v4, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-17-country-dataset-pages-design.md`.

## Global Constraints

- **DO NOT COMMIT.** Repo rule + explicit user instruction this session. Stage nothing to history; leave all changes in the working tree. The template's "Commit" steps are replaced by a test-green gate.
- **No data claim from memory.** The `abbr` values (Task 3) go through the mandatory `deep-research` protocol: official institutional sources, citations recorded, `lastReviewed` updated. Never invent an acronym.
- **Strict TS, no `any`.** Derive types from Zod; import via the `@/` alias.
- **Tailwind + shadcn only** for component styling; the sole raw-CSS exception is the existing Leaflet block in `src/index.css`, which this plan extends (never a new CSS file).
- **Route param name is `iso`** (existing `country/:iso`). Reuse it. Routes are declared with relative, no-leading-slash paths; `<Link>` targets use a leading slash (basename auto-applies for GH Pages).
- **Quality gate before "done":** `npm run lint && npm run typecheck && npm run test && npm run build`, plus `npm run cache:scores` (must leave `scoreboard.json` unchanged — `abbr` is not a score).
- **Numbers/dates** via `src/lib/formatters.ts` (en-GB) — never hardcode separators.

---

### Task 1: Schema — optional `abbr` on dataset rows

**Files:**
- Modify: `src/lib/schema.ts` (`datasetRowSchema`)
- Test: `src/lib/schema.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `DatasetRow.abbr?: string` (inferred type, re-exported from `@/types`).

- [ ] **Step 1: Write the failing test** — add to `src/lib/schema.test.ts`:

```ts
it("accepts an optional abbr on a dataset row", () => {
  const base = { id: "tum", label: "Technical University of Munich (TUM)", values: {} };
  expect(datasetRowSchema.parse({ ...base, abbr: "TUM" }).abbr).toBe("TUM");
  expect(datasetRowSchema.parse(base).abbr).toBeUndefined();
});
```

Ensure `datasetRowSchema` is imported in the test file (add to the existing import from `@/lib/schema`).

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/lib/schema.test.ts -t "optional abbr"`
Expected: FAIL (`abbr` stripped/undefined or import missing).

- [ ] **Step 3: Add the field** — in `src/lib/schema.ts`, inside `datasetRowSchema` object (next to `sublabel`):

```ts
abbr: z.string().min(1).optional(),
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/lib/schema.test.ts -t "optional abbr"`
Expected: PASS.

- [ ] **Step 5: Gate** — `npm run typecheck && npx vitest run src/lib/schema.test.ts`. Expected: green. (No commit.)

---

### Task 2: `markerLabel` helper (pure, TDD)

**Files:**
- Modify: `src/lib/datasets.ts`
- Test: `src/lib/datasets.test.ts`

**Interfaces:**
- Consumes: `DatasetRow`, `DatasetKind` from `@/types`.
- Produces: `export function markerLabel(row: DatasetRow, kind: DatasetKind): string` and `export const MARKER_LABEL_FIT = 18`.

- [ ] **Step 1: Write the failing tests** — append to `src/lib/datasets.test.ts` (add `markerLabel` to the `@/lib/datasets` import; `DatasetKind` is already available via `@/types` — import it):

```ts
describe("markerLabel", () => {
  const uni = (label: string, abbr?: string): DatasetRow => ({ id: "x", label, abbr, values: {} });
  it("returns the city name for cities (always short)", () => {
    expect(markerLabel({ id: "c", label: "Munich", values: {} }, "cities")).toBe("Munich");
  });
  it("returns the full name when a university name is short enough", () => {
    expect(markerLabel(uni("TU Berlin", "TUB"), "universities")).toBe("TU Berlin");
  });
  it("returns abbr when a university name is too long", () => {
    expect(markerLabel(uni("Technical University of Munich (TUM)", "TUM"), "universities")).toBe("TUM");
  });
  it("falls back to the full name when a long university has no abbr", () => {
    const label = "Technical University of Munich (TUM)";
    expect(markerLabel(uni(label), "universities")).toBe(label);
  });
});
```

Note: `DatasetRow` is already imported in this test file; add `DatasetKind` is not needed (the string literals `"cities"`/`"universities"` satisfy the param). Import `markerLabel` (and it's fine to import `MARKER_LABEL_FIT` if asserted, not required here).

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx vitest run src/lib/datasets.test.ts -t markerLabel`
Expected: FAIL (`markerLabel is not a function`).

- [ ] **Step 3: Implement** — append to `src/lib/datasets.ts` (add `DatasetKind` to the existing `@/types` import):

```ts
/** Max characters that read cleanly on a map pin label before we prefer an abbreviation. */
export const MARKER_LABEL_FIT = 18;

/** The on-pin label for a row: city name for cities; for universities the full name when it
 *  fits, otherwise the sourced `abbr` (falling back to the full name when no abbr exists). */
export function markerLabel(row: DatasetRow, kind: DatasetKind): string {
  if (kind !== "universities") return row.label;
  if (row.label.length <= MARKER_LABEL_FIT) return row.label;
  return row.abbr ?? row.label;
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx vitest run src/lib/datasets.test.ts -t markerLabel`
Expected: PASS.

- [ ] **Step 5: Gate** — `npm run typecheck && npx vitest run src/lib/datasets.test.ts`. Expected green. (No commit.)

---

### Task 3: Research + populate `abbr` for the 26 Germany universities (DATA — deep-research protocol)

**Files:**
- Modify: `src/data/universities/germany.json` (26 rows: add `abbr`, refresh per-row `lastReviewed`, add/append an official-source link where the abbr came from; bump dataset `lastReviewed`)
- Validate via: `npm run test` (Zod gate) + `npm run cache:scores`

**Interfaces:**
- Consumes: `markerLabel` semantics (only long names actually use `abbr`, but populate all 26 for completeness/future).
- Produces: every university row has an authentic `abbr`.

- [ ] **Step 1: Research** — invoke the `deep-research` skill for the official/conventional short form of each of the 26 universities. For each: the institution's own website is the primary source. Rules: use the official abbreviation where one exists (e.g. RWTH, KIT, LMU, TUM, HU Berlin, Charité); the conventional published short form otherwise (e.g. "Uni Bonn", "TU Dortmund", "Uni Freiburg"); **never invent** an acronym. Record source URL + the exact abbr per row. Output a mapping `rowId -> { abbr, sourceTitle, sourceUrl }`.

- [ ] **Step 2: Apply to JSON** — for each row in `germany.json`, add `"abbr": "<value>"`; ensure `links` includes the official source used (append if new, with `title` + `url`); set the row's `lastReviewed` to today (`2026-07-17`) where the row was touched; bump the dataset-level `lastReviewed` to `2026-07-17`. Keep it ISO 8601 in JSON.

- [ ] **Step 3: Validate the data gate**

Run: `npm run test`
Expected: PASS (Zod schema accepts `abbr`; no malformed data). If it fails, fix the offending row and re-run.

- [ ] **Step 4: Regenerate the score cache (drift check)**

Run: `npm run cache:scores`
Expected: `src/data/cache/scoreboard.json` unchanged by git status (abbr is not a score). Confirm with `git status --short src/data/cache/scoreboard.json` → no output. If it changed, investigate before proceeding.

- [ ] **Step 5: Gate** — `npm run test`. Expected green. (No commit.)

---

### Task 4: `DatasetView` — extract the modal body

**Files:**
- Create: `src/components/dataset/DatasetView.tsx`
- Test: `src/components/dataset/DatasetView.test.tsx`
- Reference (source of the JSX to move): `src/components/dataset/DatasetModal.tsx`

**Interfaces:**
- Consumes: `DatasetTable`, `CityCompare`, `UniversityCompare`, `TierLegend`, `scoreColumns` (from `@/lib/datasets`), `formatPercent`/`formatDate` (from `@/lib/formatters`) — all existing.
- Produces: `export function DatasetView({ dataset }: { dataset: ComparativeDataset })` — renders the `Tabs` (Table / Compare / Methodology / Sources) with the existing `showCompare`/`showMethodology`/`showSources` gating. Consumed by Task 6.

- [ ] **Step 1: Write the failing test** — `src/components/dataset/DatasetView.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DatasetView } from "@/components/dataset/DatasetView";
import type { ComparativeDataset } from "@/types";

const ds: ComparativeDataset = {
  kind: "universities", countryId: "germany", title: "German universities", scale: "rank",
  lastReviewed: "2026-07-17",
  columns: [{ id: "overallRank", label: "Rank", kind: "rank", betterWhen: "low" }],
  rows: [
    { id: "tum", label: "Technical University of Munich (TUM)", abbr: "TUM", sublabel: "Munich, Bavaria", values: { overallRank: 1 } },
    { id: "rwth", label: "RWTH Aachen University", abbr: "RWTH", sublabel: "Aachen, North Rhine-Westphalia", values: { overallRank: 2 } },
  ],
};

describe("DatasetView", () => {
  it("renders the table tab with the dataset rows", () => {
    render(<DatasetView dataset={ds} />);
    expect(screen.getByText("Technical University of Munich (TUM)")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /table/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/dataset/DatasetView.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement** — create `DatasetView.tsx` by moving the JSX **inside** `DatasetModal`'s `<DialogContent>` (everything below the `DialogHeader`) into this component: the `Tabs` with the four `TabsContent` bodies plus the `isScore`/`showCompare`/`showMethodology`/`showSources`/`weighted` locals. Drop the `Dialog`/`DialogTrigger`/`DialogContent`/`DialogHeader` wrappers and the `trigger` prop. Signature:

```tsx
export function DatasetView({ dataset }: { dataset: ComparativeDataset }) {
  // ...move the modal's tab-visibility locals and <Tabs> subtree here verbatim...
}
```

Copy imports the moved JSX needs (Tabs primitives, `DatasetTable`, `CityCompare`, `UniversityCompare`, `TierLegend`, `scoreColumns`, `formatPercent`, `ExternalLink`, etc.). Do **not** yet edit `DatasetModal` (Task 8 deletes it) — but if leaving it importing removed pieces breaks typecheck, temporarily leave `DatasetModal` intact and self-contained; it is deleted in Task 8.

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/dataset/DatasetView.test.tsx`
Expected: PASS.

- [ ] **Step 5: Gate** — `npm run typecheck && npm run lint`. Expected green. (No commit.)

---

### Task 5: `DatasetMap` — all-markers map + `MarkerDetail` modal

**Files:**
- Create: `src/components/dataset/DatasetMap.tsx`
- Test: `src/components/dataset/DatasetMap.test.tsx`
- Modify: `src/index.css` (add a text-label marker/tooltip rule next to the existing `.university-map-marker*` block if the reused `.country-label` tooltip needs a size tweak for pin labels)
- Reference: `src/components/dataset/UniversityCompareMap.tsx` (scaffold to copy)

**Interfaces:**
- Consumes: `markerLabel`, `MARKER_LABEL_FIT` (Task 2), `rowTier`/`scoreColumns` (existing), `ComparativeDataset`, `DatasetRow`. shadcn `Dialog`.
- Produces: `export function DatasetMap({ dataset }: { dataset: ComparativeDataset })`. Consumed by Task 6.

- [ ] **Step 1: Write the failing tests** — `src/components/dataset/DatasetMap.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatasetMap } from "@/components/dataset/DatasetMap";
import type { ComparativeDataset } from "@/types";

const loc = (lat: number, lng: number, label: string) => ({ lat, lng, label, sourceUrl: "https://example.org" });
const ds: ComparativeDataset = {
  kind: "universities", countryId: "germany", title: "German universities", scale: "rank",
  lastReviewed: "2026-07-17",
  columns: [{ id: "overallRank", label: "Rank", kind: "rank", betterWhen: "low" }],
  rows: [
    { id: "tum", label: "Technical University of Munich (TUM)", abbr: "TUM", sublabel: "Munich, Bavaria",
      values: { overallRank: 1 }, location: loc(48.15, 11.58, "Garching campus") },
    { id: "rwth", label: "RWTH Aachen University", abbr: "RWTH", sublabel: "Aachen, NRW",
      values: { overallRank: 2 }, location: loc(50.78, 6.06, "Informatikzentrum") },
    { id: "nowhere", label: "No Location University", abbr: "NLU", values: { overallRank: 3 } },
  ],
};

describe("DatasetMap", () => {
  it("renders a permanent label per located row, using abbr for long names", () => {
    render(<DatasetMap dataset={ds} />);
    expect(screen.getByText("TUM")).toBeInTheDocument();
    expect(screen.getByText("RWTH")).toBeInTheDocument();
  });
  it("skips rows without a location", () => {
    render(<DatasetMap dataset={ds} />);
    expect(screen.queryByText("NLU")).not.toBeInTheDocument();
  });
  it("opens a detail modal with the full name when a marker is activated", () => {
    render(<DatasetMap dataset={ds} />);
    fireEvent.click(screen.getByText("TUM"));
    expect(screen.getByRole("dialog")).toHaveTextContent("Technical University of Munich (TUM)");
  });
  it("renders no map section when no row has a location", () => {
    const bare = { ...ds, rows: ds.rows.map((r) => ({ ...r, location: undefined })) };
    const { container } = render(<DatasetMap dataset={bare} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx vitest run src/components/dataset/DatasetMap.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement** — create `DatasetMap.tsx`. Copy the scaffold from `UniversityCompareMap` (imports, `GERMANY_BOUNDS`, `germanyFeature`, `TILE_URL`, `TILE_ATTRIBUTION`, `tileFailed` state, `MapContainer`/`GeoJSON`/`TileLayer`). Then:
  - Compute `located = dataset.rows.filter(r => r.location)`. If `located.length === 0` return `null`.
  - A `FitBounds` child using `useMap()` + `latLngBounds(located.map(r => [r.location!.lat, r.location!.lng]))` with `{ padding: [36,36], maxZoom: 11 }`.
  - One `<Marker>` per located row: a single-colour teardrop `divIcon` (reuse `.university-map-marker` shape; use one class, no `-a/-b`), `keyboard`, `title`/`alt` = full `row.label`, `eventHandlers={{ click: () => setSelected(row) }}`, and a child `<Tooltip permanent direction="top" className="country-label">{markerLabel(row, dataset.kind)}</Tooltip>`.
  - `const [selected, setSelected] = useState<DatasetRow | null>(null)`.
  - A shadcn `Dialog` `open={!!selected} onOpenChange={(o) => !o && setSelected(null)}` rendering `MarkerDetail` for `selected`: `DialogTitle` = `selected.label`; body = kind-aware basic overview from existing data only — universities: `sublabel` + `location.label`, intake `tags` badges, and key `values` (`overallRank`, `nonEuTuition` via `€{formatNumber}`, `programs`, `language`), plus `detail?.summary`; cities: `sublabel`/`location.label`, `rowTier(dataset, row)` label (score datasets), a couple of top `values`, plus `detail?.summary`.
  - Wrap the map in `<section aria-label={\`\${dataset.kind === "cities" ? "City" : "University"} locations in Germany\`}>` with the map container `div` sized like the compare maps (`h-[320px] sm:h-[400px] overflow-hidden rounded-lg border bg-muted`).
  - If a label-size tweak is needed for readability, add ONE rule in `src/index.css` near the existing marker block (e.g. `.leaflet-tooltip.country-label { font-size: 11px; font-weight: 700; }`) — only if the reused style is too large.

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx vitest run src/components/dataset/DatasetMap.test.tsx`
Expected: PASS. (If Leaflet needs DOM APIs missing in jsdom, mirror the setup used by the existing `UniversityCompareMap.test.tsx`.)

- [ ] **Step 5: Gate** — `npm run typecheck && npm run lint && npx vitest run src/components/dataset/DatasetMap.test.tsx`. Expected green. (No commit.)

---

### Task 6: `CountryDatasetPage` + routes

**Files:**
- Create: `src/pages/CountryDatasetPage.tsx`
- Test: `src/pages/CountryDatasetPage.test.tsx`
- Modify: `src/routes/index.tsx`

**Interfaces:**
- Consumes: `useCountry` (`@/hooks/useData`), `getDatasets` (`@/lib/data`), `DatasetMap` (Task 5), `DatasetView` (Task 4), `formatDate`, `Section`/`Link`.
- Produces: `export default function CountryDatasetPage({ kind }: { kind: "cities" | "universities" })`; two routes rendering it.

- [ ] **Step 1: Write the failing tests** — `src/pages/CountryDatasetPage.test.tsx`. Use a real country id that has both datasets (Germany). Confirm the id/iso Germany uses (`getDatasets` matches iso or id, case-insensitive) — use `"germany"` (its `countryId`) which resolves.

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import CountryDatasetPage from "@/pages/CountryDatasetPage";

function renderAt(path: string, kind: "cities" | "universities") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="country/:iso/:kind" element={<CountryDatasetPage kind={kind} />} />
        <Route path="*" element={<div>fallback</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("CountryDatasetPage", () => {
  it("renders the dataset title and a back link for a known country", () => {
    renderAt("/country/germany/universities", "universities");
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to/i })).toBeInTheDocument();
  });
  it("shows not-found for an unknown country", () => {
    renderAt("/country/zzz/universities", "universities");
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx vitest run src/pages/CountryDatasetPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement the page** — `src/pages/CountryDatasetPage.tsx`:

```tsx
import { Link, useParams } from "react-router";
import { useCountry } from "@/hooks/useData";
import { getDatasets } from "@/lib/data";
import { DatasetMap } from "@/components/dataset/DatasetMap";
import { DatasetView } from "@/components/dataset/DatasetView";
import { formatDate } from "@/lib/formatters";

export default function CountryDatasetPage({ kind }: { kind: "cities" | "universities" }) {
  const { iso } = useParams();
  const country = useCountry(iso);
  const dataset = iso ? getDatasets(iso)[kind] : undefined;

  if (!country) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold tracking-tight">Country not found</h1>
        <Link to="/leaderboard" className="text-primary hover:underline">← Back to leaderboard</Link>
      </div>
    );
  }
  if (!dataset) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold tracking-tight">No {kind} data for {country.name}</h1>
        <Link to={`/country/${iso}`} className="text-primary hover:underline">← Back to {country.name}</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Link to={`/country/${iso}`} className="text-sm text-primary hover:underline">← Back to {country.name}</Link>
        <h1 className="text-2xl font-bold tracking-tight">{dataset.title}</h1>
        {dataset.subtitle && <p className="max-w-2xl text-sm text-muted-foreground">{dataset.subtitle}</p>}
        <p className="text-xs text-muted-foreground">Reviewed {formatDate(dataset.lastReviewed)}</p>
      </div>
      <DatasetMap dataset={dataset} />
      <DatasetView dataset={dataset} />
    </div>
  );
}
```

- [ ] **Step 4: Add the routes** — in `src/routes/index.tsx`, add under the `<Layout>` `children` array (after `country/:iso`), importing `CountryDatasetPage`:

```tsx
{ path: "country/:iso/universities", element: <CountryDatasetPage kind="universities" /> },
{ path: "country/:iso/cities", element: <CountryDatasetPage kind="cities" /> },
```

- [ ] **Step 5: Run tests, verify they pass**

Run: `npx vitest run src/pages/CountryDatasetPage.test.tsx`
Expected: PASS.

- [ ] **Step 6: Gate** — `npm run typecheck && npm run lint && npx vitest run src/pages/CountryDatasetPage.test.tsx`. Expected green. (No commit.)

---

### Task 7: `CountryDatasets` — buttons become Links

**Files:**
- Modify: `src/components/dataset/CountryDatasets.tsx`
- Test: `src/components/dataset/CountryDatasets.test.tsx`

**Interfaces:**
- Consumes: `getDatasets`, `Button`, `Link`. Routes from Task 6.
- Produces: launch `Link`s to `/country/:iso/{cities,universities}`.

- [ ] **Step 1: Rewrite the test** — replace modal-trigger assertions in `CountryDatasets.test.tsx` with link-href assertions. Wrap render in `MemoryRouter`. Use a country id with both datasets (`germany`):

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CountryDatasets } from "@/components/dataset/CountryDatasets";

describe("CountryDatasets", () => {
  it("links to the cities and universities pages when present", () => {
    render(<MemoryRouter><CountryDatasets iso="germany" /></MemoryRouter>);
    expect(screen.getByRole("link", { name: /universities/i })).toHaveAttribute("href", "/country/germany/universities");
    expect(screen.getByRole("link", { name: /cities/i })).toHaveAttribute("href", "/country/germany/cities");
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/dataset/CountryDatasets.test.tsx`
Expected: FAIL (still renders modal triggers, no links).

- [ ] **Step 3: Implement** — rewrite `CountryDatasets.tsx` render to use `Button asChild` + `Link`, keeping the presence check and icons:

```tsx
import { useMemo } from "react";
import { Link } from "react-router";
import { Building2, GraduationCap } from "lucide-react";
import { getDatasets } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CountryDatasets({ iso, className }: { iso: string; className?: string }) {
  const { cities, universities } = useMemo(() => getDatasets(iso), [iso]);
  if (!cities && !universities) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {universities && (
        <Button asChild variant="outline" size="sm">
          <Link to={`/country/${iso}/universities`}><GraduationCap aria-hidden />Universities</Link>
        </Button>
      )}
      {cities && (
        <Button asChild variant="outline" size="sm">
          <Link to={`/country/${iso}/cities`}><Building2 aria-hidden />Cities</Link>
        </Button>
      )}
    </div>
  );
}
```

Remove the `DatasetModal` import.

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/dataset/CountryDatasets.test.tsx`
Expected: PASS.

- [ ] **Step 5: Gate** — `npm run typecheck && npm run lint && npx vitest run src/components/dataset/CountryDatasets.test.tsx`. Expected green. (No commit.)

---

### Task 8: Delete `DatasetModal` + final full gate

**Files:**
- Delete: `src/components/dataset/DatasetModal.tsx`
- Delete: `src/components/dataset/DatasetModal.test.tsx` (if present)

**Interfaces:** none produced.

- [ ] **Step 1: Confirm no importers**

Run: `rg -n "DatasetModal" src` (or Grep tool)
Expected: no references outside the files being deleted. If any remain, fix them first.

- [ ] **Step 2: Delete the files**

Remove `DatasetModal.tsx` and its test if it exists.

- [ ] **Step 3: Full quality gate**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: all green (0 lint errors; typecheck clean; all tests pass; build succeeds).

- [ ] **Step 4: Cache drift check**

Run: `npm run cache:scores` then verify `git status --short src/data/cache/scoreboard.json` prints nothing.
Expected: no change.

- [ ] **Step 5: Manual verification** — invoke the `verify` (or `run`) skill: start the dev server, open a country detail page, click **Universities** → confirm the route, the map with abbr labels, a pin click opening the detail modal with the full name, and the table search/filter working; repeat for **Cities**. (No commit — report results and await approval.)

---

## Self-Review

**Spec coverage:** D1 (routes)→T6; D2 (full replace)→T7+T8; D3 (local filter state)→inherited by DatasetView/DatasetTable, no new work; D4 (abbr)→T1+T3; D5 (map all rows)→T5; D6 (compare untouched)→T5 self-contained; D7 (tooltip label + click modal)→T5. FR1–FR3→T6; FR4–FR5→T5; FR6→T4; FR7→T7; FR8→T8; FR9→T1+T3. All covered.

**Placeholder scan:** none — every code step carries concrete code; the only deferred content is the researched `abbr` values (Task 3), which MUST be sourced live, not pre-written (protocol).

**Type consistency:** `markerLabel(row, kind)` + `MARKER_LABEL_FIT` defined in T2, used in T5. `DatasetView({dataset})` T4→T6. `DatasetMap({dataset})` T5→T6. `CountryDatasetPage({kind})` T6, referenced by routes T6 + links T7. `abbr?: string` T1, used T2/T3/T5. Consistent.
