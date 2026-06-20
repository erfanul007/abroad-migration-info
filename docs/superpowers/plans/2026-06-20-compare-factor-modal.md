# Compare Factor Modal + Dynamic Slots — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-category factor-comparison modal to the Compare page and make country selection dynamic (2–5 countries).

**Architecture:** One pure helper (`deriveFactorComparison`) + new derived type, two presentational components (`FactorCompareTable`, `FactorCompareDialog`), and Compare-page wiring (dynamic slots, weight-ordered rows, per-row trigger). No change to scoring/schema/data/score-cache.

**Tech Stack:** React 19, TypeScript (strict), Vitest + Testing Library, Tailwind v4 + shadcn/ui (Radix Dialog), Recharts (unaffected).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-06-20-compare-factor-modal-design.md`. All FR-1…FR-10 there.
- No data/score/evidence change → **do NOT** run `npm run cache:scores`; no research gate.
- **Do NOT run `git commit`** during execution — project rule: commits require explicit user approval. Stage groupings are listed as the *proposed* commits only.
- Strict TS, no `any`. Types derived from Zod via `@/types`. Import via `@/` alias.
- All user-facing numbers via `src/lib/formatters.ts` (`formatPercent`). Tailwind + shadcn only; compose with `cn()`.
- Factor scores shown are **raw** 0–100; footer category score is the **recalibrated** display value (`categoryScore()`).
- Factor row order = `category.factors` source order (matches `CategoryFactorScores`). Category row order = `byWeightDesc`.
- Quality gate before done: `npm run test` standalone, then `npm run lint && npm run typecheck && npm run build`.

---

### Task 1: Pure helper `deriveFactorComparison` + `FactorComparisonRow` type

**Files:**
- Modify: `src/types/index.ts` (append after `FactorBreakdown`, ~line 54)
- Modify: `src/lib/scoring.ts` (append after `deriveFactorBreakdown`, ~line 56; extend type import on line 2)
- Test: `src/lib/scoring.test.ts` (add a `describe("deriveFactorComparison")` block)

**Interfaces:**
- Consumes: `Category`, `CategoryScore` from `@/types`.
- Produces: `FactorComparisonRow { id: string; label: string; weight: number; scores: (number|null)[] }`; `deriveFactorComparison(category: Category, cells: (CategoryScore|null|undefined)[]): FactorComparisonRow[]`.

- [ ] **Step 1: Add the type** to `src/types/index.ts`, after the `FactorBreakdown` interface:

```ts
// Factor-level comparison across N countries for one category (Compare modal).
export interface FactorComparisonRow {
  id: string;
  label: string;
  weight: number;            // factor weight within the category (sums to 100)
  scores: (number | null)[]; // raw 0–100 per country, aligned to input order; null = pending/absent
}
```

- [ ] **Step 2: Write the failing test** — add to `src/lib/scoring.test.ts`. Reuse the file's existing `Category` test fixtures if present; otherwise define a local one:

```ts
import { deriveFactorComparison } from "@/lib/scoring";
import type { Category, CategoryScore } from "@/types";

const CAT: Category = {
  id: "c", name: "Cat", shortLabel: "Cat", weight: 10, description: "d",
  factors: [
    { id: "f1", label: "Factor one", description: "", weight: 60 },
    { id: "f2", label: "Factor two", description: "", weight: 40 },
  ],
};
const scoredCell = (f1: number, f2: number): CategoryScore =>
  ({ status: "scored", factors: { f1: { status: "scored", score: f1 }, f2: { status: "scored", score: f2 } },
     summary: "", pros: [], cons: [], links: [], lastReviewed: "2026-06-20" }) as CategoryScore;

describe("deriveFactorComparison", () => {
  it("one row per factor in source order, scores aligned to cells", () => {
    const rows = deriveFactorComparison(CAT, [scoredCell(80, 50), scoredCell(60, 70)]);
    expect(rows.map((r) => r.id)).toEqual(["f1", "f2"]);
    expect(rows[0]).toMatchObject({ label: "Factor one", weight: 60, scores: [80, 60] });
    expect(rows[1].scores).toEqual([50, 70]);
  });
  it("null for a pending/absent cell", () => {
    const pending = { status: "pending" } as unknown as CategoryScore;
    const rows = deriveFactorComparison(CAT, [scoredCell(80, 50), pending, null]);
    expect(rows[0].scores).toEqual([80, null, null]);
    expect(rows[1].scores).toEqual([50, null, null]);
  });
  it("null when an individual factor is missing or pending", () => {
    const partial = { status: "scored",
      factors: { f1: { status: "scored", score: 90 }, f2: { status: "pending" } },
      summary: "", pros: [], cons: [], links: [], lastReviewed: "2026-06-20" } as unknown as CategoryScore;
    const rows = deriveFactorComparison(CAT, [partial]);
    expect(rows[0].scores).toEqual([90]);
    expect(rows[1].scores).toEqual([null]);
  });
});
```

- [ ] **Step 3: Run it, expect FAIL**

Run: `npm run test -- src/lib/scoring.test.ts`
Expected: FAIL — `deriveFactorComparison is not a function` / not exported.

- [ ] **Step 4: Implement** — in `src/lib/scoring.ts`, extend the type import on line 2 to add `FactorComparisonRow`, then append:

```ts
/** Per-factor scores for one category across N countries (cells aligned to the caller's
 *  country order). One row per factor in category source order; scores[i] is cells[i]'s raw
 *  factor sub-score (0..100) or null when that cell is pending/absent or the factor is
 *  missing/pending. Pure — max-per-row highlighting is the caller's concern. */
export function deriveFactorComparison(
  category: Category,
  cells: (CategoryScore | null | undefined)[],
): FactorComparisonRow[] {
  return category.factors.map((factor) => ({
    id: factor.id,
    label: factor.label,
    weight: factor.weight,
    scores: cells.map((cell) => {
      if (!cell || cell.status !== "scored") return null;
      const fs = cell.factors[factor.id];
      return fs && fs.status === "scored" ? fs.score : null;
    }),
  }));
}
```

- [ ] **Step 5: Run it, expect PASS**

Run: `npm run test -- src/lib/scoring.test.ts`
Expected: PASS (existing scoring tests + 3 new).

- [ ] **Step 6: Stage (no commit)**: `git add src/types/index.ts src/lib/scoring.ts src/lib/scoring.test.ts`
  - *Proposed commit:* `feat(scoring): add deriveFactorComparison for cross-country factor scores`

---

### Task 2: `FactorCompareTable` presentational component

**Files:**
- Create: `src/components/compare/FactorCompareTable.tsx`
- Test: `src/components/compare/FactorCompareTable.test.tsx`

**Interfaces:**
- Consumes: `deriveFactorComparison` (Task 1), `categoryScore` from `@/lib/selectors`, `ScoreBadge`, table primitives, `formatPercent`.
- Produces: `FactorCompareTable({ category: Category; countries: ScoredCountry[] })`.

- [ ] **Step 1: Write the failing test** — `src/components/compare/FactorCompareTable.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FactorCompareTable } from "@/components/compare/FactorCompareTable";
import type { Category, ScoredCountry } from "@/types";

const CAT: Category = {
  id: "c", name: "Cat", shortLabel: "Cat", weight: 10, description: "d",
  factors: [
    { id: "f1", label: "Approval rate", description: "", weight: 60 },
    { id: "f2", label: "Processing", description: "", weight: 40 },
  ],
};
const mk = (iso: string, name: string, f1: number | null, f2: number | null, catScore: number | null) =>
  ({
    iso, name, flag: "🏳",
    categories: { c: { status: "scored",
      factors: {
        f1: f1 == null ? { status: "pending" } : { status: "scored", score: f1 },
        f2: f2 == null ? { status: "pending" } : { status: "scored", score: f2 },
      }, summary: "", pros: [], cons: [], links: [], lastReviewed: "2026-06-20" } },
    categoryScores: { c: catScore },
  }) as unknown as ScoredCountry;

describe("FactorCompareTable", () => {
  it("renders factors as rows, countries as columns, — for nulls, footer category score", () => {
    render(<FactorCompareTable category={CAT} countries={[mk("DE", "Germany", 80, 50, 72), mk("NL", "Netherlands", 60, null, 68)]} />);
    expect(screen.getByText("Approval rate")).toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
    expect(screen.getByText("Netherlands")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("Category score")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument(); // footer
    expect(screen.getAllByText("—").length).toBeGreaterThan(0); // NL f2 pending
  });
});
```

- [ ] **Step 2: Run it, expect FAIL**

Run: `npm run test -- src/components/compare/FactorCompareTable.test.tsx`
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Implement** — `src/components/compare/FactorCompareTable.tsx`:

```tsx
// src/components/compare/FactorCompareTable.tsx
import type { Category, ScoredCountry } from "@/types";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { deriveFactorComparison } from "@/lib/scoring";
import { categoryScore } from "@/lib/selectors";
import { formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";

/** Compares one category's factor sub-scores across the chosen countries. Factor scores are
 *  absolute (raw 0–100); the footer category score is the recalibrated display value. */
export function FactorCompareTable({ category, countries }: { category: Category; countries: ScoredCountry[] }) {
  const cells = countries.map((c) => c.categories[category.id] ?? null);
  const rows = deriveFactorComparison(category, cells);
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factor</TableHead>
              <TableHead className="text-right">Weight</TableHead>
              {countries.map((c) => <TableHead key={c.iso} className="text-center">{c.flag} {c.name}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const max = Math.max(...r.scores.map((s) => s ?? -1));
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium whitespace-normal">{r.label}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{formatPercent(r.weight)}</TableCell>
                  {r.scores.map((s, idx) => (
                    <TableCell key={countries[idx].iso} className={cn("text-center", s != null && s === max && "bg-primary/5")}>
                      {s == null ? <span className="text-muted-foreground">—</span> : <ScoreBadge score={s} />}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-medium" colSpan={2}>Category score</TableCell>
              {countries.map((c) => {
                const cs = categoryScore(c, category.id);
                return (
                  <TableCell key={c.iso} className="text-center">
                    {cs == null ? <span className="text-muted-foreground">—</span> : <ScoreBadge score={cs} />}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Factor scores are absolute (0–100%); the category-score row is the recalibrated display value (see Methodology).
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run it, expect PASS**

Run: `npm run test -- src/components/compare/FactorCompareTable.test.tsx`
Expected: PASS.

- [ ] **Step 5: Stage (no commit)**: `git add src/components/compare/FactorCompareTable.tsx src/components/compare/FactorCompareTable.test.tsx`

---

### Task 3: `FactorCompareDialog` wrapper

**Files:**
- Create: `src/components/compare/FactorCompareDialog.tsx`
- Test: `src/components/compare/FactorCompareDialog.test.tsx`

**Interfaces:**
- Consumes: `FactorCompareTable` (Task 2), Dialog primitives, `Button`, `formatPercent`, `Table2` icon.
- Produces: `FactorCompareDialog({ category: Category; countries: ScoredCountry[] })`.

- [ ] **Step 1: Write the failing test** — `src/components/compare/FactorCompareDialog.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { FactorCompareDialog } from "@/components/compare/FactorCompareDialog";
import type { Category, ScoredCountry } from "@/types";

const CAT: Category = {
  id: "c", name: "Visa access", shortLabel: "Visa", weight: 9, description: "Visa accessibility.",
  factors: [{ id: "f1", label: "Approval rate", description: "", weight: 100 }],
};
const mk = (iso: string, name: string, score: number) =>
  ({ iso, name, flag: "🏳",
     categories: { c: { status: "scored", factors: { f1: { status: "scored", score } },
       summary: "", pros: [], cons: [], links: [], lastReviewed: "2026-06-20" } },
     categoryScores: { c: score } }) as unknown as ScoredCountry;

describe("FactorCompareDialog", () => {
  const countries = [mk("DE", "Germany", 80), mk("NL", "Netherlands", 70)];
  it("hides the factor table until the trigger is clicked", () => {
    render(<FactorCompareDialog category={CAT} countries={countries} />);
    expect(screen.getByRole("button", { name: "Compare factors" })).toBeInTheDocument();
    expect(screen.queryByText("Approval rate")).not.toBeInTheDocument();
  });
  it("reveals the factor comparison on click", async () => {
    const user = userEvent.setup();
    render(<FactorCompareDialog category={CAT} countries={countries} />);
    await user.click(screen.getByRole("button", { name: "Compare factors" }));
    expect(await screen.findByText("Approval rate")).toBeInTheDocument();
    expect(screen.getByText("Category score")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it, expect FAIL**

Run: `npm run test -- src/components/compare/FactorCompareDialog.test.tsx`
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Implement** — `src/components/compare/FactorCompareDialog.tsx`:

```tsx
// src/components/compare/FactorCompareDialog.tsx
import type { Category, ScoredCountry } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FactorCompareTable } from "@/components/compare/FactorCompareTable";
import { formatPercent } from "@/lib/formatters";
import { Table2 } from "lucide-react";

/** Per-category "Compare factors" trigger → modal comparing that category's factor sub-scores
 *  across the chosen countries. Compact icon button; the label is its accessible name. */
export function FactorCompareDialog({ category, countries }: { category: Category; countries: ScoredCountry[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7" title="Compare factors" aria-label="Compare factors">
          <Table2 className="size-4" aria-hidden />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {category.name}
            <span className="text-xs font-normal text-muted-foreground">{formatPercent(category.weight)} of overall</span>
          </DialogTitle>
          <DialogDescription>{category.description}</DialogDescription>
        </DialogHeader>
        <FactorCompareTable category={category} countries={countries} />
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Run it, expect PASS**

Run: `npm run test -- src/components/compare/FactorCompareDialog.test.tsx`
Expected: PASS.

- [ ] **Step 5: Stage (no commit)**: `git add src/components/compare/FactorCompareDialog.tsx src/components/compare/FactorCompareDialog.test.tsx`
  - *Proposed commit (Tasks 2+3):* `feat(compare): factor-comparison table and modal`

---

### Task 4: Compare page wiring — dynamic slots, weight-ordered rows, trigger column

**Files:**
- Modify: `src/pages/Compare.tsx` (whole component)
- Test: `src/pages/Compare.test.tsx` (create)

**Interfaces:**
- Consumes: `FactorCompareDialog` (Task 3), `byWeightDesc` from `@/lib/selectors`.
- Produces: updated Compare page (no exported API change).

- [ ] **Step 1: Write the failing test** — `src/pages/Compare.test.tsx`. The page uses `useData()`; test against real data via the router-free default export. Assert dynamic slots:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, it, expect } from "vitest";
import Compare from "@/pages/Compare";

const renderPage = () => render(<MemoryRouter><Compare /></MemoryRouter>);

describe("Compare page slots", () => {
  it("starts with 2 country selects and can add up to 5", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    const add = screen.getByRole("button", { name: /add country/i });
    await user.click(add);
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
    await user.click(add); await user.click(add);
    expect(screen.getAllByRole("combobox")).toHaveLength(5);
    expect(screen.queryByRole("button", { name: /add country/i })).not.toBeInTheDocument(); // capped at 5
  });
  it("removes a slot down to a floor of 2", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /add country/i }));
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
    await user.click(screen.getAllByRole("button", { name: /remove country/i })[0]);
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: /remove country/i })).not.toBeInTheDocument(); // floor 2 → no remove
  });
});
```

- [ ] **Step 2: Run it, expect FAIL**

Run: `npm run test -- src/pages/Compare.test.tsx`
Expected: FAIL — no "Add country" button (still fixed 3 slots).

- [ ] **Step 3: Implement** — replace `src/pages/Compare.tsx` with:

```tsx
// src/pages/Compare.tsx
import { useState, useMemo } from "react";
import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { RadarProfile } from "@/components/charts/RadarProfile";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { FactorCompareDialog } from "@/components/compare/FactorCompareDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { topN, categoryScore, byWeightDesc } from "@/lib/selectors";
import { TOP_N } from "@/lib/config";
import { Radar, Table2, Plus, X } from "lucide-react";

const MAX_COMPARE = 5;

export default function Compare() {
  const { countries, categories } = useData();
  const [selected, setSelected] = useState<string[]>(topN(countries, TOP_N.compare).map((c) => c.iso));

  const chosen = useMemo(
    () => selected.map((iso) => countries.find((c) => c.iso === iso)).filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [selected, countries],
  );
  const orderedCategories = useMemo(() => [...categories].sort(byWeightDesc), [categories]);
  const optionsFor = (i: number) => countries.filter((c) => !selected.includes(c.iso) || selected[i] === c.iso);

  function setSlot(index: number, iso: string) {
    setSelected((prev) => { const next = [...prev]; next[index] = iso; return next; });
  }
  function removeSlot(index: number) {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }
  function addSlot() {
    const next = countries.find((c) => !selected.includes(c.iso));
    if (next) setSelected((prev) => [...prev, next.iso]);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Compare</h1>
        <p className="text-sm text-muted-foreground">Compare up to five countries side by side.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {selected.map((iso, i) => (
          <div key={i} className="flex items-center gap-1">
            <Select value={iso ?? ""} onValueChange={(v) => setSlot(i, v)}>
              <SelectTrigger className="w-48"><SelectValue placeholder={`Country ${i + 1}`} /></SelectTrigger>
              <SelectContent>
                {optionsFor(i).map((c) => <SelectItem key={c.iso} value={c.iso}>{c.flag} {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {selected.length > 2 && (
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" aria-label="Remove country" onClick={() => removeSlot(i)}>
                <X className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        ))}
        {selected.length < MAX_COMPARE && (
          <Button variant="outline" size="sm" onClick={addSlot}>
            <Plus className="size-4" aria-hidden /> Add country
          </Button>
        )}
      </div>

      {chosen.length >= 2 && (
        <>
          <Section title="Profiles" icon={Radar}><RadarProfile countries={chosen} categories={categories} /></Section>
          <Section title="Category scores" icon={Table2}>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    {chosen.map((c) => <TableHead key={c.iso} className="text-center">{c.flag} {c.name}</TableHead>)}
                    <TableHead className="w-10"><span className="sr-only">Factors</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-semibold">
                    <TableCell>Overall</TableCell>
                    {chosen.map((c) => <TableCell key={c.iso} className="text-center"><ScoreBadge score={c.overall} /></TableCell>)}
                    <TableCell />
                  </TableRow>
                  {orderedCategories.map((cat) => {
                    const scores = chosen.map((c) => categoryScore(c, cat.id));
                    const max = Math.max(...scores.map((s) => s ?? -1));
                    return (
                      <TableRow key={cat.id}>
                        <TableCell title={cat.name}>{cat.shortLabel}</TableCell>
                        {chosen.map((c, idx) => {
                          const s = scores[idx];
                          return (
                            <TableCell key={c.iso} className={cn("text-center", s != null && s === max && "bg-primary/5")}>
                              {s == null ? <span className="text-muted-foreground">—</span> : <ScoreBadge score={s} />}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right"><FactorCompareDialog category={cat} countries={chosen} /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run it, expect PASS**

Run: `npm run test -- src/pages/Compare.test.tsx`
Expected: PASS (both slot tests).

- [ ] **Step 5: Stage (no commit)**: `git add src/pages/Compare.tsx src/pages/Compare.test.tsx`
  - *Proposed commit:* `feat(compare): dynamic 2–5 country slots, weight-ordered rows, per-category factor modal`

---

### Task 5: Full quality gate

- [ ] **Step 1:** `npm run test` (standalone) → all pass.
- [ ] **Step 2:** `npm run lint` → no new errors (pre-existing warnings tolerated).
- [ ] **Step 3:** `npm run typecheck` → clean.
- [ ] **Step 4:** `npm run build` → succeeds.
- [ ] **Step 5:** `git status --short src/data` → empty (no data change; no cache regen).
- [ ] **Step 6:** Report results; present the proposed commit grouping; **await explicit approval** before any `git commit`.

---

## Self-Review

**Spec coverage:** FR-1 (trigger per row) → Task 4 trailing cell + Task 3. FR-2 (dialog title+weight/desc) → Task 3. FR-3 (rows=factors, cols) → Task 2. FR-4 (raw score / —) → Task 2. FR-5 (max highlight) → Task 2. FR-6 (footer category score) → Task 2. FR-7 (note) → Task 2. FR-8 (dynamic slots) → Task 4. FR-9 (copy) → Task 4. FR-10 (byWeightDesc rows) → Task 4. Type → Task 1. All covered.

**Placeholder scan:** none — every code step is complete.

**Type consistency:** `FactorComparisonRow { id,label,weight,scores }` defined Task 1, consumed identically Tasks 2. `deriveFactorComparison(category, cells)` signature consistent. `FactorCompareTable({category,countries})` / `FactorCompareDialog({category,countries})` props consistent across Tasks 2–4. `categoryScore(country, id)` matches selectors. OK.
