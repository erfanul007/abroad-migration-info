# Methodology Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Methodology page's summary table + stacked factor cards with a category-weight pie and compact per-category tiles whose full factor tables open in a modal.

**Architecture:** A shared `categoryColor(index, total)` identity palette colours both the Recharts pie slices and a dot on each tile (tiles are the legend). Each `CategoryTile` is compact (name, meaning, weight, factor *names*) and opens a radix `Dialog` containing the reused `FactorTable`. The old `CategoryWeightTable` and `CategoryFactorCard` are removed.

**Tech Stack:** React 19, TypeScript strict, Vite 8, Tailwind v4 + shadcn/ui, radix-ui (Dialog), Recharts v3, Vitest + Testing Library.

## Global Constraints

- **No data/score changes.** No JSON edits; **do NOT run `npm run cache:scores`**.
- **All numbers via `formatPercent`** (en-GB) from `src/lib/formatters.ts`. **All chart/map colours via `src/lib/palette.ts`** — no hardcoded hex/separators in components.
- **Strict TS, no `any`.** Types from `@/types` (`Category`, `Factor`). Import via `@/`. kebab-case files, PascalCase components. Tailwind + shadcn only, compose with `cn()`.
- **Multi-colour pie is a documented design-system exception** — colour is category identity, always redundant with a text label, used only for this one chart.
- **Commits require explicit user approval** (CLAUDE.md). Commit steps are proposed commands; batch at the gate.
- **Quality gate before done:** `npm run lint && npm run typecheck && npm run test && npm run build` all green.
- Targeted test run: `npm run test -- <path>`.

---

### Task 1: `categoryColor` identity palette + doc

**Files:**
- Modify: `src/lib/palette.ts` (add export)
- Test: `src/lib/palette.test.ts` (create)
- Modify: `docs/design/00-design-system.md` (§2.3 note)

**Interfaces:**
- Produces: `export function categoryColor(index: number, total: number): string` — an `oklch(L C H)` string; evenly-spaced hue `(360/total)*index`, fixed L/C.

- [ ] **Step 1: Write the failing test** — `src/lib/palette.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { categoryColor } from "@/lib/palette";

const hue = (s: string) => Number(s.match(/oklch\([\d.]+ [\d.]+ ([\d.]+)\)/)![1]);

describe("categoryColor", () => {
  it("returns an oklch identity colour", () => {
    expect(categoryColor(0, 15)).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
  });
  it("is deterministic for the same index/total", () => {
    expect(categoryColor(3, 15)).toBe(categoryColor(3, 15));
  });
  it("spaces hues evenly by 360/total", () => {
    expect(hue(categoryColor(1, 15))).toBeCloseTo(360 / 15, 1);
    expect(hue(categoryColor(2, 15))).toBeCloseTo((360 / 15) * 2, 1);
  });
  it("gives distinct colours across the set", () => {
    const set = new Set(Array.from({ length: 15 }, (_, i) => categoryColor(i, 15)));
    expect(set.size).toBe(15);
  });
  it("handles total=0 without NaN", () => {
    expect(categoryColor(0, 0)).toMatch(/^oklch\([\d.]+ [\d.]+ 0\.0\)$/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/lib/palette.test.ts`
Expected: FAIL — `categoryColor is not a function`.

- [ ] **Step 3: Implement** — append to `src/lib/palette.ts`:

```ts
/**
 * Category identity palette for the methodology category-weight pie. 15 categories exceed the
 * ≤3-series chart guideline (§2.3), so this is a deliberate, documented exception: colour is
 * pure category IDENTITY (not a good/bad scale) and is always redundant with a visible text
 * label (pie tooltip + tile name), so it is never the sole signal. Evenly-spaced OKLCH hues at
 * a fixed mid lightness/chroma read distinctly in both light and dark themes.
 */
export function categoryColor(index: number, total: number): string {
  const hue = total > 0 ? ((360 / total) * index) % 360 : 0;
  return `oklch(0.68 0.15 ${hue.toFixed(1)})`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/lib/palette.test.ts`
Expected: PASS.

- [ ] **Step 5: Document the exception** — in `docs/design/00-design-system.md`, replace:

```
single-value charts (`ContributionBars`) use the `var(--primary)` token directly. Everything else uses theme tokens via Tailwind utilities.
```
with:
```
single-value charts (`ContributionBars`) use the `var(--primary)` token directly. Everything else uses theme tokens via Tailwind utilities.

**Category identity palette (methodology pie) — a deliberate exception.** The methodology category-weight pie has 15 slices, more than the ≤3-series guideline above. `categoryColor(index, total)` (in `palette.ts`) generates evenly-spaced OKLCH hues (fixed mid lightness/chroma, legible in both themes) used **only** for that one chart. Sanctioned because the colour encodes category *identity*, not a good/bad value, and is always redundant with a visible text label (pie tooltip + the matching colour dot on each category tile) — colour is never the sole signal. Do not reuse this palette for value-encoding charts.
```

- [ ] **Step 6: Commit (propose for approval)**

```bash
git add src/lib/palette.ts src/lib/palette.test.ts docs/design/00-design-system.md
git commit -m "feat(methodology): add categoryColor identity palette + document exception"
```

---

### Task 2: `Dialog` UI primitive

**Files:**
- Create: `src/components/ui/dialog.tsx`

**Interfaces:**
- Produces: `Dialog`, `DialogTrigger`, `DialogClose`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` — shadcn-style wrappers over radix `Dialog`.

- [ ] **Step 1: Implement** — `src/components/ui/dialog.tsx`:

```tsx
"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className="fixed inset-0 z-50 bg-black/50 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-xl bg-background p-6 shadow-lg ring-1 ring-foreground/10 duration-100 outline-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 rounded-md opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
          <X className="size-4" aria-hidden />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-base font-semibold", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run typecheck`
Expected: PASS (no type errors; radix `Dialog` resolves from the `radix-ui` package).

- [ ] **Step 3: Commit (propose for approval)**

```bash
git add src/components/ui/dialog.tsx
git commit -m "feat(ui): add shadcn-style Dialog wrapper over radix Dialog"
```

---

### Task 3: `CategoryWeightPie`

**Files:**
- Create: `src/components/methodology/CategoryWeightPie.tsx`
- Test: `src/components/methodology/CategoryWeightPie.test.tsx`

**Interfaces:**
- Consumes: `Category` from `@/types`; `formatPercent`; Recharts.
- Produces: `export function CategoryWeightPie({ categories, colorById }: { categories: Category[]; colorById: Record<string, string> })`.

- [ ] **Step 1: Write the failing test** — `src/components/methodology/CategoryWeightPie.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryWeightPie } from "@/components/methodology/CategoryWeightPie";
import { categories } from "@/lib/data";

describe("CategoryWeightPie", () => {
  it("renders a labelled figure for the weight distribution", () => {
    const colorById = Object.fromEntries(categories.map((c, i) => [c.id, `oklch(0.68 0.15 ${i})`]));
    render(<CategoryWeightPie categories={categories} colorById={colorById} />);
    expect(screen.getByRole("img", { name: /weight distribution/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/methodology/CategoryWeightPie.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — `src/components/methodology/CategoryWeightPie.tsx`:

```tsx
// src/components/methodology/CategoryWeightPie.tsx
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Category } from "@/types";
import { formatPercent } from "@/lib/formatters";

/** Multi-colour pie of the category weight distribution (sums to 100%). Slice colours come
 *  from the shared identity palette (colorById) so each slice matches its tile's dot. */
export function CategoryWeightPie({ categories, colorById }: { categories: Category[]; colorById: Record<string, string> }) {
  const data = categories.map((c) => ({ id: c.id, name: c.name, weight: c.weight }));
  return (
    <figure className="m-0" role="img" aria-label="Pie chart of category weight distribution across all categories">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie data={data} dataKey="weight" nameKey="name" innerRadius="45%" outerRadius="80%" paddingAngle={1} stroke="var(--background)" strokeWidth={2}>
            {data.map((d) => <Cell key={d.id} fill={colorById[d.id]} />)}
          </Pie>
          <Tooltip formatter={(value, name) => [formatPercent(Number(value)), name as string]} />
        </PieChart>
      </ResponsiveContainer>
    </figure>
  );
}
```

> Note: `innerRadius="45%"` makes it a donut for a cleaner read; it remains a multi-colour pie. The user asked for a "pie" — this satisfies it while keeping the centre uncluttered.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/methodology/CategoryWeightPie.test.tsx`
Expected: PASS (jsdom may log a Recharts width/height warning — not a failure).

- [ ] **Step 5: Commit (propose for approval)**

```bash
git add src/components/methodology/CategoryWeightPie.tsx src/components/methodology/CategoryWeightPie.test.tsx
git commit -m "feat(methodology): add CategoryWeightPie distribution chart"
```

---

### Task 4: `CategoryTile`

**Files:**
- Create: `src/components/methodology/CategoryTile.tsx`
- Test: `src/components/methodology/CategoryTile.test.tsx`

**Interfaces:**
- Consumes: `Category` from `@/types`; `Card*`, `Badge`, `Button`, `Dialog*` (Task 2); `FactorTable`; `formatPercent`.
- Produces: `export function CategoryTile({ category, color }: { category: Category; color: string })`.

- [ ] **Step 1: Write the failing test** — `src/components/methodology/CategoryTile.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryTile } from "@/components/methodology/CategoryTile";
import { categories } from "@/lib/data";

describe("CategoryTile", () => {
  const cat = categories[0];

  it("shows name, weight and factor labels, but not factor descriptions, by default", () => {
    render(<CategoryTile category={cat} color="oklch(0.68 0.15 0.0)" />);
    expect(screen.getByText(cat.name)).toBeInTheDocument();
    expect(screen.getByText(`${cat.weight}%`)).toBeInTheDocument();
    for (const f of cat.factors) expect(screen.getByText(f.label)).toBeInTheDocument();
    expect(screen.queryByText(cat.factors[0].description)).not.toBeInTheDocument();
  });

  it("opens the factor-detail dialog (revealing descriptions) when the button is clicked", async () => {
    render(<CategoryTile category={cat} color="oklch(0.68 0.15 0.0)" />);
    fireEvent.click(screen.getByRole("button", { name: /view factor details/i }));
    expect(await screen.findByText(cat.factors[0].description)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/methodology/CategoryTile.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — `src/components/methodology/CategoryTile.tsx`:

```tsx
// src/components/methodology/CategoryTile.tsx
import type { Category } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FactorTable } from "@/components/methodology/FactorTable";
import { formatPercent } from "@/lib/formatters";
import { Table2 } from "lucide-react";

/** Compact, drill-down tile for one category: identity dot + name + weight, what it measures,
 *  factor names (labels only), and a button that opens the full factor table in a modal. */
export function CategoryTile({ category, color }: { category: Category; color: string }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: color }} />
            <CardTitle className="text-base">{category.name}</CardTitle>
          </div>
          <Badge variant="secondary" className="tabular-nums">{formatPercent(category.weight)}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </CardHeader>
      <CardContent className="mt-auto space-y-3">
        <ul className="flex flex-wrap gap-1.5">
          {category.factors.map((f) => (
            <li key={f.id}>
              <Badge variant="outline" className="font-normal">{f.label}</Badge>
            </li>
          ))}
        </ul>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Table2 className="size-4" aria-hidden /> View factor details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span aria-hidden className="size-2.5 rounded-full" style={{ background: color }} />
                {category.name}
                <Badge variant="secondary" className="tabular-nums">{formatPercent(category.weight)}</Badge>
              </DialogTitle>
              <DialogDescription>{category.description}</DialogDescription>
            </DialogHeader>
            <FactorTable factors={category.factors} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/methodology/CategoryTile.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit (propose for approval)**

```bash
git add src/components/methodology/CategoryTile.tsx src/components/methodology/CategoryTile.test.tsx
git commit -m "feat(methodology): add compact CategoryTile with factor-detail modal"
```

---

### Task 5: Rework `Methodology` page + retire old components

**Files:**
- Modify: `src/pages/Methodology.tsx`
- Modify: `src/pages/Methodology.test.tsx`
- Delete: `src/components/methodology/CategoryWeightTable.tsx`, `src/components/methodology/CategoryWeightTable.test.tsx`
- Delete: `src/components/methodology/CategoryFactorCard.tsx`, `src/components/methodology/CategoryFactorCard.test.tsx`

**Interfaces:**
- Consumes: `CategoryWeightPie` (Task 3), `CategoryTile` (Task 4), `categoryColor` (Task 1).

- [ ] **Step 1: Update the page test first** — replace the two `it(...)` blocks in `src/pages/Methodology.test.tsx` with:

```tsx
describe("Methodology page", () => {
  it("renders all section headings (no standalone factor breakdown)", () => {
    render(<Methodology />);
    for (const h of ["How the score is built", "Display recalibration", "Score tiers", "Flags", "Category weights"]) {
      expect(screen.getByText(h)).toBeInTheDocument();
    }
    expect(screen.queryByText("Factor breakdown")).not.toBeInTheDocument();
  });
  it("lists every category name", () => {
    render(<Methodology />);
    for (const c of categories) expect(screen.getAllByText(c.name).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the page test to verify it fails**

Run: `npm run test -- src/pages/Methodology.test.tsx`
Expected: FAIL — "Factor breakdown" still rendered by the current page.

- [ ] **Step 3: Rework the page.** In `src/pages/Methodology.tsx`:

(a) Replace the import block's methodology-component + icon imports. Remove:
```tsx
import { CategoryWeightTable } from "@/components/methodology/CategoryWeightTable";
import { CategoryFactorCard } from "@/components/methodology/CategoryFactorCard";
```
and remove `LayoutGrid` from the lucide-react import. Add:
```tsx
import { CategoryWeightPie } from "@/components/methodology/CategoryWeightPie";
import { CategoryTile } from "@/components/methodology/CategoryTile";
import { categoryColor } from "@/lib/palette";
```
So the lucide import becomes:
```tsx
import { Calculator, SlidersHorizontal, Palette, Flag, Scale } from "lucide-react";
```

(b) After the `sortedCategories` memo, add the colour map:
```tsx
  const colorById = useMemo(
    () => Object.fromEntries(categories.map((c, i) => [c.id, categoryColor(i, categories.length)])),
    [categories],
  );
```

(c) Replace BOTH the existing `<Section title="Category weights" ...>…</Section>` and `<Section title="Factor breakdown" ...>…</Section>` blocks with this single section:
```tsx
      <Section title="Category weights" icon={Scale}>
        <p className="max-w-2xl text-sm text-muted-foreground">How the overall {formatPercent(100)} splits across the {categories.length} categories. Hover a slice for its weight; each tile below carries its colour. Open any category for its full factor table.</p>
        <CategoryWeightPie categories={categories} colorById={colorById} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCategories.map((c) => <CategoryTile key={c.id} category={c} color={colorById[c.id]} />)}
        </div>
      </Section>
```

- [ ] **Step 4: Delete the retired components and their tests**

```bash
git rm src/components/methodology/CategoryWeightTable.tsx src/components/methodology/CategoryWeightTable.test.tsx src/components/methodology/CategoryFactorCard.tsx src/components/methodology/CategoryFactorCard.test.tsx
```
(If they are not yet tracked by git — they are untracked from the previous, uncommitted feature work — instead delete the files directly; `git rm` errors on untracked paths. Use `rm` for any untracked one.)

- [ ] **Step 5: Run the page test + typecheck**

Run: `npm run typecheck && npm run test -- src/pages/Methodology.test.tsx`
Expected: PASS — no dangling imports of the deleted components; page renders 5 listed headings, no "Factor breakdown", all category names present (in tiles).

- [ ] **Step 6: Commit (propose for approval)**

```bash
git add src/pages/Methodology.tsx src/pages/Methodology.test.tsx
git rm --cached src/components/methodology/CategoryWeightTable.tsx src/components/methodology/CategoryWeightTable.test.tsx src/components/methodology/CategoryFactorCard.tsx src/components/methodology/CategoryFactorCard.test.tsx 2>/dev/null || true
git commit -m "feat(methodology): pie + drill-down tiles, retire summary table and factor cards"
```

---

### Task 6: Full quality gate

**Files:** none (verification only).

- [ ] **Step 1: Run the full gate**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: lint clean (only pre-existing warnings), typecheck OK, all tests pass, build succeeds.

- [ ] **Step 2: Confirm no data/cache drift**

`git status` shows no changes under `src/data/`. **Do not run `cache:scores`.**

- [ ] **Step 3: Report results** honestly and hand back for review.

---

## Self-Review

**1. Spec coverage:**
- FR1 `categoryColor` + test → Task 1 ✓ · FR2 `Dialog` → Task 2 ✓ · FR3 `CategoryWeightPie` → Task 3 ✓ · FR4 `CategoryTile` (modal, names-only chips, own state) → Task 4 ✓ · FR5 page rework (colorById, pie+tiles, drop factor-breakdown section) → Task 5 ✓ · FR6 remove `CategoryWeightTable`/`CategoryFactorCard` + tests → Task 5 ✓ · FR7 `formatPercent`/palette only → Tasks 3–5 ✓ · FR8 §2.3 doc → Task 1 ✓
- Tests: `categoryColor`, `CategoryWeightPie`, `CategoryTile` (gated-modal assertion), `Methodology` page update → Tasks 1,3,4,5 ✓ · gate → Task 6 ✓ · no cache → Tasks 5,6 ✓

**2. Placeholder scan:** none — every code step shows complete code; tests carry real assertions.

**3. Type consistency:** `CategoryWeightPie({ categories, colorById: Record<string,string> })` and `CategoryTile({ category, color: string })` match their consumers in Task 5; `colorById[c.id]` feeds both `Cell` fills (Task 3) and the tile dot (Task 4); `categoryColor(index, total)` signature consistent across Task 1 and Task 5; `FactorTable({ factors })` reused unchanged from the existing component.
