# Country Detail — Category factor breakdown & pros/cons labels — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add factor-level score visibility (a weighted-contribution modal) and labelled Pros/Cons to the CountryDetail "Category detail" cards.

**Architecture:** A new pure `deriveFactorBreakdown` in `scoring.ts` (TDD) feeds a presentational `CategoryFactorScores` table, wrapped by a `CategoryFactorDialog` button+modal, dropped into each scored card. Mirrors the Methodology FactorTable/CategoryTile split.

**Tech Stack:** React 19, TS strict, Vitest + Testing Library, Tailwind v4, radix Dialog (`ui/dialog.tsx`).

## Global Constraints

- No data/scoring-value change → no `scoreboard.json` regen.
- All user-facing numbers via `src/lib/formatters.ts` (`formatPercent`, `formatNumber`).
- Strict TS, no `any`; derive types from Zod/`@/types`; `@/` import alias; kebab-case files.
- Gate before done: `npm run lint && npm run typecheck && npm run test && npm run build` (run `test` standalone to avoid the transform-cache race).

---

### Task 1: `deriveFactorBreakdown` (pure logic + types)

**Files:**
- Modify: `src/types/index.ts` (add `FactorBreakdownRow`, `FactorBreakdown`)
- Modify: `src/lib/scoring.ts` (add `deriveFactorBreakdown`)
- Test: `src/lib/scoring.test.ts` (extend)

**Interfaces — Produces:**
```ts
export interface FactorBreakdownRow { id: string; label: string; weight: number; score: number; points: number; }
export interface FactorBreakdown { rows: FactorBreakdownRow[]; total: number; }
export function deriveFactorBreakdown(cell: CategoryScore | null | undefined, category: Category): FactorBreakdown | null;
```

- [ ] **Step 1: Write failing tests** — append to `src/lib/scoring.test.ts` (reuses existing `cats`, `cell`, `sc`; `cats[0]` has factors `a1` w50, `other` w50):

```ts
import { deriveFactorBreakdown } from "@/lib/scoring";

describe("deriveFactorBreakdown", () => {
  it("returns one row per factor with points = score/100 * weight, summing to the category score", () => {
    const bd = deriveFactorBreakdown(cell({ a1: sc(80), other: sc(60) }), cats[0]);
    expect(bd).not.toBeNull();
    expect(bd!.rows).toHaveLength(2);
    expect(bd!.rows[0]).toMatchObject({ id: "a1", label: "a1", weight: 50, score: 80, points: 40 });
    expect(bd!.rows[1]).toMatchObject({ id: "other", weight: 50, score: 60, points: 30 });
    expect(bd!.total).toBe(70);
  });
  it("total equals deriveCategoryScore for a complete scored cell", () => {
    const c = cell({ a1: sc(72), other: sc(58) });
    expect(deriveFactorBreakdown(c, cats[0])!.total).toBeCloseTo(deriveCategoryScore(c, cats[0])!);
  });
  it("is null when a factor is missing or pending, or the cell is pending/absent", () => {
    expect(deriveFactorBreakdown(cell({ a1: sc(80) }), cats[0])).toBeNull();
    expect(deriveFactorBreakdown(cell({ a1: { status: "pending", score: 0 }, other: sc(60) }), cats[0])).toBeNull();
    expect(deriveFactorBreakdown(cell({}, "pending"), cats[0])).toBeNull();
    expect(deriveFactorBreakdown(null, cats[0])).toBeNull();
  });
});
```

- [ ] **Step 2: Run, verify fail** — `npm run test -- src/lib/scoring.test.ts` → FAIL (`deriveFactorBreakdown` not exported).

- [ ] **Step 3: Add types** to `src/types/index.ts` (after the `ScoredCategory`/`ScoredCountry` block):

```ts
// Factor-level contribution breakdown for one category cell (CountryDetail modal).
export interface FactorBreakdownRow {
  id: string;
  label: string;
  weight: number;  // factor weight within the category (sums to 100)
  score: number;   // obtained factor sub-score, 0..100
  points: number;  // (score/100) * weight — contribution to the category score
}
export interface FactorBreakdown {
  rows: FactorBreakdownRow[];
  total: number; // Σ points = raw weighted mean (0..100)
}
```

- [ ] **Step 4: Implement** in `src/lib/scoring.ts` — extend the type import and add the function after `deriveCategoryScore`:

```ts
import type { Category, CategoryScore, Country, FactorBreakdown, FactorBreakdownRow, ScoredCategory, ScoredCountry } from "@/types";
```
```ts
/** Per-factor contribution breakdown for one category cell: each factor's obtained score and
 *  its points (= score/100 × weight). Returns null on the same non-derivability rule as
 *  deriveCategoryScore (pending/absent cell or any missing/pending factor). total = Σ points,
 *  which equals deriveCategoryScore when the category's factor weights sum to 100. */
export function deriveFactorBreakdown(
  cell: CategoryScore | null | undefined,
  category: Category,
): FactorBreakdown | null {
  if (!cell || cell.status !== "scored") return null;
  const rows: FactorBreakdownRow[] = [];
  let total = 0;
  for (const factor of category.factors) {
    const fs = cell.factors[factor.id];
    if (!fs || fs.status !== "scored") return null;
    const points = (fs.score / 100) * factor.weight;
    rows.push({ id: factor.id, label: factor.label, weight: factor.weight, score: fs.score, points });
    total += points;
  }
  if (rows.length === 0) return null;
  return { rows, total };
}
```

- [ ] **Step 5: Run, verify pass** — `npm run test -- src/lib/scoring.test.ts` → PASS.

---

### Task 2: `CategoryFactorScores` (presentational table)

**Files:**
- Create: `src/components/country/CategoryFactorScores.tsx`
- Test: `src/components/country/CategoryFactorScores.test.tsx`

**Interfaces — Consumes:** `FactorBreakdown` (Task 1). **Produces:** `CategoryFactorScores({ breakdown, displayScore })`.

- [ ] **Step 1: Write failing test:**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryFactorScores } from "@/components/country/CategoryFactorScores";
import type { FactorBreakdown } from "@/types";

const breakdown: FactorBreakdown = {
  rows: [
    { id: "visa", label: "Visa approval rate", weight: 30, score: 72, points: 21.6 },
    { id: "proc", label: "Processing time", weight: 25, score: 65, points: 16.25 },
  ],
  total: 37.85,
};

describe("CategoryFactorScores", () => {
  it("renders a row per factor with weight, score badge and points, plus the weighted-mean footer", () => {
    render(<CategoryFactorScores breakdown={breakdown} displayScore={70} />);
    expect(screen.getByText("Visa approval rate")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();        // ScoreBadge
    expect(screen.getByText("21.6")).toBeInTheDocument();        // points
    expect(screen.getByText("37.9")).toBeInTheDocument();        // footer total (1 dp)
    expect(screen.getByText(/Weighted mean/i)).toBeInTheDocument();
  });
  it("notes the recalibrated display score", () => {
    render(<CategoryFactorScores breakdown={breakdown} displayScore={70} />);
    expect(screen.getByText(/shown as 70% after display recalibration/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail** — `npm run test -- src/components/country/CategoryFactorScores.test.tsx` → FAIL (module not found).

- [ ] **Step 3: Implement** `src/components/country/CategoryFactorScores.tsx`:

```tsx
// src/components/country/CategoryFactorScores.tsx
import type { FactorBreakdown } from "@/types";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { formatNumber, formatPercent } from "@/lib/formatters";

/** This country's obtained factor scores for one category and how they sum to the score:
 *  points = score/100 × weight (out of the factor's weight); the footer totals to the raw
 *  weighted mean. displayScore is the recalibrated value shown on the category badge. */
export function CategoryFactorScores({ breakdown, displayScore }: { breakdown: FactorBreakdown; displayScore: number }) {
  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Factor</TableHead>
            <TableHead className="text-right">Weight</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breakdown.rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium whitespace-normal">{r.label}</TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">{formatPercent(r.weight)}</TableCell>
              <TableCell className="text-right"><ScoreBadge score={r.score} /></TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(r.points, 1)} <span className="text-muted-foreground">/ {formatNumber(r.weight)}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-medium" colSpan={3}>Weighted mean</TableCell>
            <TableCell className="text-right tabular-nums font-semibold">
              {formatNumber(breakdown.total, 1)} <span className="font-normal text-muted-foreground">/ 100</span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <p className="text-xs text-muted-foreground">
        Raw weighted mean of the factor scores; shown as {formatPercent(displayScore)} after display recalibration (see Methodology).
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run, verify pass** — `npm run test -- src/components/country/CategoryFactorScores.test.tsx` → PASS.

---

### Task 3: `CategoryFactorDialog` (button + modal)

**Files:**
- Create: `src/components/country/CategoryFactorDialog.tsx`
- Test: `src/components/country/CategoryFactorDialog.test.tsx`

**Interfaces — Consumes:** `deriveFactorBreakdown` (T1), `CategoryFactorScores` (T2), `ui/dialog.tsx`. **Produces:** `CategoryFactorDialog({ category, cell, score })`.

- [ ] **Step 1: Write failing test** (mirrors `CategoryTile.test.tsx`; builds a scored cell covering every factor of `categories[0]`):

```tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryFactorDialog } from "@/components/country/CategoryFactorDialog";
import { categories } from "@/lib/data";
import type { CategoryScore } from "@/types";

const cat = categories[0];
const cell: CategoryScore = {
  status: "scored",
  factors: Object.fromEntries(cat.factors.map((f) => [f.id, { status: "scored" as const, score: 70 }])),
  summary: "", pros: [], cons: [], links: [], lastReviewed: "2026-06-20",
};

describe("CategoryFactorDialog", () => {
  it("shows the trigger button but no factor rows until opened", () => {
    render(<CategoryFactorDialog category={cat} cell={cell} score={70} />);
    expect(screen.getByRole("button", { name: /view factor details/i })).toBeInTheDocument();
    expect(screen.queryByText(cat.factors[0].label)).not.toBeInTheDocument();
  });
  it("opens the modal revealing the factor breakdown when clicked", async () => {
    render(<CategoryFactorDialog category={cat} cell={cell} score={70} />);
    fireEvent.click(screen.getByRole("button", { name: /view factor details/i }));
    expect(await screen.findByText(cat.factors[0].label)).toBeInTheDocument();
    expect(screen.getByText(/Weighted mean/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail** — `npm run test -- src/components/country/CategoryFactorDialog.test.tsx` → FAIL (module not found).

- [ ] **Step 3: Implement** `src/components/country/CategoryFactorDialog.tsx`:

```tsx
// src/components/country/CategoryFactorDialog.tsx
import type { Category, CategoryScore } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { CategoryFactorScores } from "@/components/country/CategoryFactorScores";
import { deriveFactorBreakdown } from "@/lib/scoring";
import { Table2 } from "lucide-react";

/** "View factor details" button that opens this country's factor-contribution breakdown for
 *  one (scored) category in a modal. Renders nothing if the breakdown is non-derivable. */
export function CategoryFactorDialog({ category, cell, score }: { category: Category; cell: CategoryScore; score: number }) {
  const breakdown = deriveFactorBreakdown(cell, category);
  if (!breakdown) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Table2 className="size-4" aria-hidden /> View factor details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {category.name}
            <ScoreBadge score={score} />
          </DialogTitle>
          <DialogDescription>{category.description}</DialogDescription>
        </DialogHeader>
        <CategoryFactorScores breakdown={breakdown} displayScore={score} />
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Run, verify pass** — `npm run test -- src/components/country/CategoryFactorDialog.test.tsx` → PASS.

---

### Task 4: Wire into CountryDetail (Pros/Cons labels + dialog button)

**Files:**
- Modify: `src/pages/CountryDetail.tsx`

- [ ] **Step 1: Add import** near the other component imports:

```tsx
import { CategoryFactorDialog } from "@/components/country/CategoryFactorDialog";
```

- [ ] **Step 2: Replace the pros/cons blocks** (current lines ~73–92) with labelled groups (foreground bullets, label carries colour) and add the dialog button after the cons:

```tsx
                    {cell.pros.length > 0 && (
                      <div>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Pros</div>
                        <ul className="list-inside list-disc space-y-0.5">
                          {cell.pros.map((p) => (
                            <li key={p.text}>
                              {p.text}
                              {p.severity === "highlight" && <SeverityBadge severity="highlight" />}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {cell.cons.length > 0 && (
                      <div>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">Cons</div>
                        <ul className="list-inside list-disc space-y-0.5">
                          {cell.cons.map((co) => (
                            <li key={co.text}>
                              {co.text}
                              {co.severity === "blocker" && <SeverityBadge severity="blocker" />}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {score !== null && (
                      <div className="pt-1">
                        <CategoryFactorDialog category={category} cell={cell} score={score} />
                      </div>
                    )}
```

- [ ] **Step 3: Typecheck** — `npm run typecheck` → OK (`score` narrowed to `number` inside the guard; `cell` is the scored cell).

---

### Task 5: Quality gate

- [ ] **Step 1:** `npm run lint` → 0 errors.
- [ ] **Step 2:** `npm run typecheck` → OK.
- [ ] **Step 3:** `npm run test` (standalone) → all green.
- [ ] **Step 4:** `npm run build` → OK.
- [ ] **Step 5:** Confirm no `src/data` change (`git status --short src/data`) → empty; no cache regen.
- [ ] **Step 6:** Stop. Present grouped commit proposal; await explicit commit approval.

## Self-review

- Spec coverage: F1–F3 → T1; F4–F5 → T2; F6 → T3; F7 → T4. ✓
- Type consistency: `FactorBreakdown`/`FactorBreakdownRow` defined T1, consumed T2/T3; `deriveFactorBreakdown` signature identical across tasks. ✓
- No placeholders; every code step is complete. ✓
