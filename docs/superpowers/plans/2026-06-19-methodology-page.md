# Methodology Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the scoring methodology from the About page into a dedicated, fully data-driven `Methodology` page that explains the factor → category → overall pipeline and exposes every category's factor breakdown.

**Architecture:** A new `/methodology` route renders a `Methodology` page composed from the existing `Section` primitive plus new reusable presentational components. All numbers are read from `categories.json` (weights, descriptions) and `src/lib/config.ts` (`RECALIBRATE`, `INCLUSION_MIN`, `TIER`) — nothing is hardcoded. Cross-page reusable pieces land in `src/components/common/`; page-specific pieces in `src/components/methodology/`.

**Tech Stack:** React 19, TypeScript (strict), Vite 8, React Router 7, Tailwind v4 + shadcn/ui, Recharts, Vitest + Testing Library.

## Global Constraints

- **No hardcoded values in any table or formula** — every weight/threshold/pivot/gain comes from `categories.json` or `src/lib/config.ts`. Route all user-facing numbers through `formatPercent` (en-GB) from `src/lib/formatters.ts`.
- **No data/score changes.** Zero JSON edits. **Do NOT run `npm run cache:scores`** — the score cache is untouched.
- **Strict TS, no `any`.** Derive types from Zod via `@/types` (`Category`, `Factor`). Import via the `@/` alias. kebab-case files, PascalCase components.
- **Styling:** Tailwind + shadcn only, compose with `cn()`. Dark mode is class-based. Preserve accessibility (decorative bars `aria-hidden`, charts `role="img"` + `aria-label`).
- **Commits require explicit user approval** (CLAUDE.md — auto mode never authorises git). The commit step in each task is the *proposed* command: stage and request approval; do not push.
- **Quality gate before "done":** `npm run lint && npm run typecheck && npm run test && npm run build` all green.
- Targeted test run: `npm run test -- <path>` (Vitest passes args after `--` as a filename filter).

---

### Task 1: `orderedTiers()` tier helper

**Files:**
- Modify: `src/lib/formatters.ts` (add export near `scoreTier`)
- Test: `src/lib/formatters.test.ts` (extend)

**Interfaces:**
- Consumes: `TIER` (already imported in formatters.ts), `Tier` type (already exported).
- Produces: `export function orderedTiers(): { tier: Tier; min: number }[]` — the four tiers ordered by lower bound descending; `weak` has `min: 0`.

- [ ] **Step 1: Write the failing test** — append to `src/lib/formatters.test.ts`:

```ts
import { TIER } from "@/lib/config";
import { orderedTiers } from "@/lib/formatters";

describe("orderedTiers", () => {
  it("lists tiers high→low with floors from TIER and weak at 0", () => {
    expect(orderedTiers()).toEqual([
      { tier: "excellent", min: TIER.excellent },
      { tier: "good", min: TIER.good },
      { tier: "fair", min: TIER.fair },
      { tier: "weak", min: 0 },
    ]);
  });
  it("is strictly descending by min", () => {
    const mins = orderedTiers().map((t) => t.min);
    expect(mins).toEqual([...mins].sort((a, b) => b - a));
  });
});
```

> Note: `formatters.test.ts` already imports `scoreTier` etc. from `@/lib/formatters` but does NOT yet import `orderedTiers` or `TIER` — add the two import lines shown above (place them with the existing imports; duplicate-import is a lint error, so if `@/lib/config` is later needed elsewhere keep a single import).

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/lib/formatters.test.ts`
Expected: FAIL — `orderedTiers is not a function` (or import error).

- [ ] **Step 3: Implement** — in `src/lib/formatters.ts`, add immediately after `scoreTier`:

```ts
/** The score tiers ordered by their lower bound (descending); `weak` floors at 0.
 *  Derived from TIER so a tier legend can never drift from scoreTier. */
export function orderedTiers(): { tier: Tier; min: number }[] {
  return [
    { tier: "excellent", min: TIER.excellent },
    { tier: "good", min: TIER.good },
    { tier: "fair", min: TIER.fair },
    { tier: "weak", min: 0 },
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/lib/formatters.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit (propose for approval)**

```bash
git add src/lib/formatters.ts src/lib/formatters.test.ts
git commit -m "feat(methodology): add orderedTiers tier-legend helper"
```

---

### Task 2: `WeightBar` component

**Files:**
- Create: `src/components/common/WeightBar.tsx`
- Test: `src/components/common/WeightBar.test.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`.
- Produces: `export function WeightBar({ weight, max, className }: { weight: number; max: number; className?: string })` — a decorative proportional bar, width = `weight / max` (clamped 0–100%), `aria-hidden`.

- [ ] **Step 1: Write the failing test** — `src/components/common/WeightBar.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { WeightBar } from "@/components/common/WeightBar";

describe("WeightBar", () => {
  it("fills proportionally to weight/max and is decorative", () => {
    const { container } = render(<WeightBar weight={24} max={48} />);
    const fill = container.querySelector("span > span") as HTMLElement;
    expect(fill.style.width).toBe("50%");
    expect(container.querySelector("[aria-hidden]")).toBeTruthy();
  });
  it("clamps and handles max=0 without NaN", () => {
    const { container } = render(<WeightBar weight={5} max={0} />);
    const fill = container.querySelector("span > span") as HTMLElement;
    expect(fill.style.width).toBe("0%");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/common/WeightBar.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — `src/components/common/WeightBar.tsx`:

```tsx
// src/components/common/WeightBar.tsx
import { cn } from "@/lib/utils";

/** A slim proportional bar visualising a weight relative to the largest in its group.
 *  Decorative only (aria-hidden) — the numeric weight is always shown as text alongside. */
export function WeightBar({ weight, max, className }: { weight: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, (weight / max) * 100) : 0;
  return (
    <span aria-hidden className={cn("inline-block h-1.5 w-full max-w-24 overflow-hidden rounded-full bg-muted align-middle", className)}>
      <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/common/WeightBar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit (propose for approval)**

```bash
git add src/components/common/WeightBar.tsx src/components/common/WeightBar.test.tsx
git commit -m "feat(methodology): add reusable WeightBar"
```

---

### Task 3: `SeverityBadge` + refactor CountryDetail

**Files:**
- Create: `src/components/common/SeverityBadge.tsx`
- Test: `src/components/common/SeverityBadge.test.tsx`
- Modify: `src/pages/CountryDetail.tsx` (replace the two inline severity spans)

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`.
- Produces: `export type Severity = "blocker" | "highlight"` and `export function SeverityBadge({ severity, className }: { severity: Severity; className?: string })` — renders `(blocker)` in rose or `(direct-work route)` in emerald.

- [ ] **Step 1: Write the failing test** — `src/components/common/SeverityBadge.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SeverityBadge } from "@/components/common/SeverityBadge";

describe("SeverityBadge", () => {
  it("labels a blocker", () => {
    render(<SeverityBadge severity="blocker" />);
    expect(screen.getByText("(blocker)")).toBeInTheDocument();
  });
  it("labels a highlight as the direct-work route", () => {
    render(<SeverityBadge severity="highlight" />);
    expect(screen.getByText("(direct-work route)")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/common/SeverityBadge.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — `src/components/common/SeverityBadge.tsx`:

```tsx
// src/components/common/SeverityBadge.tsx
import { cn } from "@/lib/utils";

export type Severity = "blocker" | "highlight";

// Single source for the wording + colour used on country cells and the methodology page.
const LABEL: Record<Severity, string> = { blocker: "blocker", highlight: "direct-work route" };
const CLASS: Record<Severity, string> = {
  blocker: "text-rose-600 dark:text-rose-400",
  highlight: "text-emerald-600 dark:text-emerald-400",
};

/** Inline label marking a con as a blocker or a pro as a positive (direct-work) highlight. */
export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return <span className={cn("ml-1 font-semibold", CLASS[severity], className)}>({LABEL[severity]})</span>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/common/SeverityBadge.test.tsx`
Expected: PASS.

- [ ] **Step 5: Refactor CountryDetail to consume it.** In `src/pages/CountryDetail.tsx`:

Add to imports (after the `PendingBadge` import line):
```tsx
import { SeverityBadge } from "@/components/common/SeverityBadge";
```

Replace the highlight span (currently):
```tsx
                            {p.severity === "highlight" && (
                              <span className="ml-1 font-semibold text-emerald-600 dark:text-emerald-400">(direct-work route)</span>
                            )}
```
with:
```tsx
                            {p.severity === "highlight" && <SeverityBadge severity="highlight" />}
```

Replace the blocker span (currently):
```tsx
                            {co.severity === "blocker" && (
                              <span className="ml-1 font-semibold text-rose-600 dark:text-rose-400">(blocker)</span>
                            )}
```
with:
```tsx
                            {co.severity === "blocker" && <SeverityBadge severity="blocker" />}
```

- [ ] **Step 6: Verify the refactor builds and nothing regressed**

Run: `npm run typecheck && npm run test`
Expected: PASS (no behavioural change — same labels render).

- [ ] **Step 7: Commit (propose for approval)**

```bash
git add src/components/common/SeverityBadge.tsx src/components/common/SeverityBadge.test.tsx src/pages/CountryDetail.tsx
git commit -m "refactor(methodology): extract SeverityBadge, reuse in CountryDetail"
```

---

### Task 4: `TierLegend` component

**Files:**
- Create: `src/components/common/TierLegend.tsx`
- Test: `src/components/common/TierLegend.test.tsx`

**Interfaces:**
- Consumes: `orderedTiers`, `scoreTierClasses`, `formatPercent` from `@/lib/formatters`; `cn` from `@/lib/utils`.
- Produces: `export function TierLegend({ className }: { className?: string })` — a row of four labelled colour bands derived from `orderedTiers()`.

- [ ] **Step 1: Write the failing test** — `src/components/common/TierLegend.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TierLegend } from "@/components/common/TierLegend";
import { TIER } from "@/lib/config";

describe("TierLegend", () => {
  it("renders all four tiers with thresholds from TIER", () => {
    render(<TierLegend />);
    expect(screen.getByText("Excellent")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("Fair")).toBeInTheDocument();
    expect(screen.getByText("Weak")).toBeInTheDocument();
    expect(screen.getByText(`≥ ${TIER.excellent}%`)).toBeInTheDocument();
    expect(screen.getByText(`< ${TIER.fair}%`)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/common/TierLegend.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — `src/components/common/TierLegend.tsx`:

```tsx
// src/components/common/TierLegend.tsx
import { orderedTiers, scoreTierClasses, formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const TIER_LABEL: Record<string, string> = { excellent: "Excellent", good: "Good", fair: "Fair", weak: "Weak" };

/** Colour-band legend for the absolute 0–100 score scale, derived from TIER (via
 *  orderedTiers) so it can never drift from scoreTier. Each band shows its lower bound;
 *  the weakest band shows the upper bound it falls under. */
export function TierLegend({ className }: { className?: string }) {
  const tiers = orderedTiers();
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tiers.map(({ tier, min }, i) => {
        const isWeak = i === tiers.length - 1;
        const range = isWeak ? `< ${formatPercent(tiers[i - 1].min)}` : `≥ ${formatPercent(min)}`;
        return (
          <li key={tier} className={cn("inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium", scoreTierClasses(tier))}>
            <span>{TIER_LABEL[tier]}</span>
            <span className="tabular-nums opacity-80">{range}</span>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/common/TierLegend.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit (propose for approval)**

```bash
git add src/components/common/TierLegend.tsx src/components/common/TierLegend.test.tsx
git commit -m "feat(methodology): add reusable TierLegend"
```

---

### Task 5: `CategoryWeightTable` (summary table)

**Files:**
- Create: `src/components/methodology/CategoryWeightTable.tsx`
- Test: `src/components/methodology/CategoryWeightTable.test.tsx`

**Interfaces:**
- Consumes: `Category` from `@/types`; `Table*` from `@/components/ui/table`; `WeightBar` (Task 2); `formatPercent` from `@/lib/formatters`.
- Produces: `export function CategoryWeightTable({ categories }: { categories: Category[] })` — Category · Weight · Share · What it measures, sorted by weight desc.

- [ ] **Step 1: Write the failing test** — `src/components/methodology/CategoryWeightTable.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryWeightTable } from "@/components/methodology/CategoryWeightTable";
import { categories } from "@/lib/data";

describe("CategoryWeightTable", () => {
  it("renders every category name with its weight from data", () => {
    render(<CategoryWeightTable categories={categories} />);
    for (const c of categories) expect(screen.getByText(c.name)).toBeInTheDocument();
    const top = [...categories].sort((a, b) => b.weight - a.weight)[0];
    expect(screen.getAllByText(`${top.weight}%`).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/methodology/CategoryWeightTable.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — `src/components/methodology/CategoryWeightTable.tsx`:

```tsx
// src/components/methodology/CategoryWeightTable.tsx
import { useMemo } from "react";
import type { Category } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WeightBar } from "@/components/common/WeightBar";
import { formatPercent } from "@/lib/formatters";

/** Category-weight summary table: every category, its weight (with a proportional bar),
 *  and what it measures — sorted by weight descending. Fully data-driven. */
export function CategoryWeightTable({ categories }: { categories: Category[] }) {
  const sorted = useMemo(() => [...categories].sort((a, b) => b.weight - a.weight), [categories]);
  const max = useMemo(() => Math.max(...categories.map((c) => c.weight)), [categories]);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Weight</TableHead>
            <TableHead className="w-28">Share</TableHead>
            <TableHead>What it measures</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="text-right tabular-nums">{formatPercent(c.weight)}</TableCell>
              <TableCell><WeightBar weight={c.weight} max={max} /></TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">{c.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/methodology/CategoryWeightTable.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit (propose for approval)**

```bash
git add src/components/methodology/CategoryWeightTable.tsx src/components/methodology/CategoryWeightTable.test.tsx
git commit -m "feat(methodology): add CategoryWeightTable summary"
```

---

### Task 6: `FactorTable` + `CategoryFactorCard`

**Files:**
- Create: `src/components/methodology/FactorTable.tsx`
- Create: `src/components/methodology/CategoryFactorCard.tsx`
- Test: `src/components/methodology/CategoryFactorCard.test.tsx`

**Interfaces:**
- Consumes: `Factor`, `Category` from `@/types`; `Table*` from `@/components/ui/table`; `Card*` from `@/components/ui/card`; `Badge` from `@/components/ui/badge`; `WeightBar` (Task 2); `formatPercent`.
- Produces:
  - `export function FactorTable({ factors }: { factors: Factor[] })` — Factor · Weight · Share · What it measures.
  - `export function CategoryFactorCard({ category }: { category: Category })` — card header (name + weight chip + description) over `FactorTable`.

- [ ] **Step 1: Write the failing test** — `src/components/methodology/CategoryFactorCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryFactorCard } from "@/components/methodology/CategoryFactorCard";
import { categories } from "@/lib/data";

describe("CategoryFactorCard", () => {
  it("renders the category name, weight chip and all its factor labels", () => {
    const cat = categories[0];
    render(<CategoryFactorCard category={cat} />);
    expect(screen.getByText(cat.name)).toBeInTheDocument();
    expect(screen.getByText(`${cat.weight}% of overall`)).toBeInTheDocument();
    for (const f of cat.factors) expect(screen.getByText(f.label)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/methodology/CategoryFactorCard.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3a: Implement `FactorTable`** — `src/components/methodology/FactorTable.tsx`:

```tsx
// src/components/methodology/FactorTable.tsx
import type { Factor } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WeightBar } from "@/components/common/WeightBar";
import { formatPercent } from "@/lib/formatters";

/** Factor sub-table for one category: each factor's label, weight (with a proportional bar
 *  relative to the category's heaviest factor) and description. Data-driven. */
export function FactorTable({ factors }: { factors: Factor[] }) {
  const max = Math.max(...factors.map((f) => f.weight));
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Factor</TableHead>
          <TableHead className="text-right">Weight</TableHead>
          <TableHead className="w-24">Share</TableHead>
          <TableHead>What it measures</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {factors.map((f) => (
          <TableRow key={f.id}>
            <TableCell className="font-medium whitespace-normal">{f.label}</TableCell>
            <TableCell className="text-right tabular-nums">{formatPercent(f.weight)}</TableCell>
            <TableCell><WeightBar weight={f.weight} max={max} /></TableCell>
            <TableCell className="whitespace-normal text-muted-foreground">{f.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 3b: Implement `CategoryFactorCard`** — `src/components/methodology/CategoryFactorCard.tsx`:

```tsx
// src/components/methodology/CategoryFactorCard.tsx
import type { Category } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FactorTable } from "@/components/methodology/FactorTable";
import { formatPercent } from "@/lib/formatters";

/** One category's full factor breakdown: header (name + weight chip + description) and its
 *  factor table. Factor weights within a category sum to 100%. */
export function CategoryFactorCard({ category }: { category: Category }) {
  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">{category.name}</CardTitle>
          <Badge variant="secondary" className="tabular-nums">{formatPercent(category.weight)} of overall</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <FactorTable factors={category.factors} />
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/methodology/CategoryFactorCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit (propose for approval)**

```bash
git add src/components/methodology/FactorTable.tsx src/components/methodology/CategoryFactorCard.tsx src/components/methodology/CategoryFactorCard.test.tsx
git commit -m "feat(methodology): add FactorTable and CategoryFactorCard"
```

---

### Task 7: `RecalibrationCurve` chart

**Files:**
- Create: `src/components/methodology/RecalibrationCurve.tsx`
- Test: `src/components/methodology/RecalibrationCurve.test.tsx`

**Interfaces:**
- Consumes: `recalibrate` from `@/lib/scoring`; `RECALIBRATE` from `@/lib/config`; Recharts.
- Produces: `export function RecalibrationCurve()` — a `figure` (`role="img"`) wrapping a Recharts line of shown-vs-raw sampled from `recalibrate()`, pivot marked.

- [ ] **Step 1: Write the failing test** — `src/components/methodology/RecalibrationCurve.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecalibrationCurve } from "@/components/methodology/RecalibrationCurve";

describe("RecalibrationCurve", () => {
  it("renders a labelled figure for the recalibration curve", () => {
    render(<RecalibrationCurve />);
    expect(screen.getByRole("img", { name: /recalibration/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/methodology/RecalibrationCurve.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — `src/components/methodology/RecalibrationCurve.tsx`:

```tsx
// src/components/methodology/RecalibrationCurve.tsx
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { recalibrate } from "@/lib/scoring";
import { RECALIBRATE } from "@/lib/config";

// Sample the actual recalibrate() across the scale — the curve IS the maths, so it can't drift.
const data = Array.from({ length: 21 }, (_, i) => {
  const raw = i * 5;
  return { raw, shown: Number(recalibrate(raw).toFixed(1)) };
});

/** Visualises the display-only contrast stretch: raw weighted score (x) → shown score (y),
 *  with the pivot (where shown == raw) marked. */
export function RecalibrationCurve() {
  const { pivot } = RECALIBRATE;
  return (
    <figure className="m-0" role="img" aria-label="Display recalibration curve: raw score mapped to shown score">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="raw" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11 }} label={{ value: "Raw weighted score", position: "insideBottom", offset: -4, fontSize: 11 }} />
          <YAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} width={32} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${v}`, "Shown"]} labelFormatter={(l) => `Raw ${l}`} />
          <ReferenceLine x={pivot} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="shown" stroke="var(--primary)" dot={false} strokeWidth={2} />
          <ReferenceDot x={pivot} y={pivot} r={4} fill="var(--primary)" stroke="none" />
        </LineChart>
      </ResponsiveContainer>
    </figure>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/methodology/RecalibrationCurve.test.tsx`
Expected: PASS (jsdom may log a Recharts width/height warning — not a failure).

- [ ] **Step 5: Commit (propose for approval)**

```bash
git add src/components/methodology/RecalibrationCurve.tsx src/components/methodology/RecalibrationCurve.test.tsx
git commit -m "feat(methodology): add RecalibrationCurve chart"
```

---

### Task 8: `Methodology` page

**Files:**
- Create: `src/pages/Methodology.tsx`
- Test: `src/pages/Methodology.test.tsx`

**Interfaces:**
- Consumes: `useData`; `Section`; `TierLegend`; `SeverityBadge`; `CategoryWeightTable`; `CategoryFactorCard`; `RecalibrationCurve`; `RECALIBRATE`, `INCLUSION_MIN` from `@/lib/config`; `formatPercent`; lucide icons.
- Produces: `export default function Methodology()` — seven sections.

- [ ] **Step 1: Write the failing test** — `src/pages/Methodology.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Methodology from "@/pages/Methodology";
import { categories } from "@/lib/data";

describe("Methodology page", () => {
  it("renders all section headings", () => {
    render(<Methodology />);
    for (const h of ["How the score is built", "Display recalibration", "Score tiers", "Flags", "Category weights", "Factor breakdown"]) {
      expect(screen.getByText(h)).toBeInTheDocument();
    }
  });
  it("lists every category name", () => {
    render(<Methodology />);
    for (const c of categories) expect(screen.getAllByText(c.name).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/pages/Methodology.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — `src/pages/Methodology.tsx`:

```tsx
// src/pages/Methodology.tsx
import { useMemo } from "react";
import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { TierLegend } from "@/components/common/TierLegend";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { CategoryWeightTable } from "@/components/methodology/CategoryWeightTable";
import { CategoryFactorCard } from "@/components/methodology/CategoryFactorCard";
import { RecalibrationCurve } from "@/components/methodology/RecalibrationCurve";
import { RECALIBRATE, INCLUSION_MIN } from "@/lib/config";
import { formatPercent } from "@/lib/formatters";
import { Calculator, SlidersHorizontal, Palette, Flag, Scale, LayoutGrid } from "lucide-react";

export default function Methodology() {
  const { categories } = useData();
  const sortedCategories = useMemo(() => [...categories].sort((a, b) => b.weight - a.weight), [categories]);
  const { pivot, gain } = RECALIBRATE;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Methodology</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          How every country's score is built — from individual factor sub-scores up to the overall ranking.
          Each factor is scored 0–100% on an absolute scale; every weight and threshold below is read live from
          the scoring data and configuration, not hardcoded.
        </p>
      </div>

      <Section title="How the score is built" icon={Calculator}>
        <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
          <li><span className="font-medium text-foreground">Factor → category.</span> A category's score is the weighted mean of its factor sub-scores (factor weights sum to {formatPercent(100)} within the category). A category is scored only once all its factors are sourced; otherwise it stays pending.</li>
          <li><span className="font-medium text-foreground">Category → overall.</span> The overall is the weighted mean of category scores (category weights sum to {formatPercent(100)}). Pending or absent categories are excluded and the remaining weights renormalised — never counted as zero.</li>
          <li><span className="font-medium text-foreground">Display recalibration.</span> The overall and each category score pass through a fixed contrast curve so the scale uses its full range (below). Display-only — it never changes the ranking order.</li>
          <li><span className="font-medium text-foreground">Tiering & inclusion.</span> Scores map to colour tiers (below). Countries scoring below {formatPercent(INCLUSION_MIN)} overall are surfaced for removal, not silently dropped.</li>
        </ol>
        <div className="rounded-lg border bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
          category = Σ(factorScore × factorWeight) ÷ Σ(factorWeight)<br />
          overall&nbsp;&nbsp;= Σ(categoryScore × categoryWeight) ÷ Σ(categoryWeight present)
        </div>
      </Section>

      <Section title="Display recalibration" icon={SlidersHorizontal}>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Raw weighted scores cluster toward the middle (an artifact of averaging many factors), so the shown
          score is contrast-stretched around a fixed pivot of {formatPercent(pivot)}:{" "}
          <span className="font-mono text-foreground">shown = clamp(0–100, {pivot} + (raw − {pivot}) × {gain})</span>.
          Scores above the pivot are pushed up, below are pulled down; the pivot is unchanged. The stretch is
          monotonic, so the order of countries never changes.
        </p>
        <RecalibrationCurve />
      </Section>

      <Section title="Score tiers" icon={Palette}>
        <p className="max-w-2xl text-sm text-muted-foreground">The shown score maps to four absolute tiers, used across the whole app:</p>
        <TierLegend />
      </Section>

      <Section title="Flags" icon={Flag}>
        <p className="max-w-2xl text-sm text-muted-foreground">Two flags annotate a country without changing its number — they surface a decisive tradeoff:</p>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="text-emerald-700 dark:text-emerald-300">Open direct work visa for Bangladeshi engineers</span>
            <SeverityBadge severity="highlight" />
            <span className="text-muted-foreground"> — a positive highlight: the country can be entered via a direct skilled-work route, not only the study-first path.</span>
          </li>
          <li>
            <span className="text-muted-foreground">Dual citizenship not retained when naturalising</span>
            <SeverityBadge severity="blocker" />
            <span className="text-muted-foreground"> — a blocker flag: a known hard tradeoff to weigh, not an automatic disqualifier.</span>
          </li>
        </ul>
      </Section>

      <Section title="Category weights" icon={Scale}>
        <p className="max-w-2xl text-sm text-muted-foreground">Each category's weight is its share of the overall (all weights total {formatPercent(100)}), heaviest first.</p>
        <CategoryWeightTable categories={categories} />
      </Section>

      <Section title="Factor breakdown" icon={LayoutGrid}>
        <p className="max-w-2xl text-sm text-muted-foreground">Every category, broken into the factors it is scored on. Factor weights sum to {formatPercent(100)} within each category.</p>
        <div className="grid gap-4">
          {sortedCategories.map((c) => <CategoryFactorCard key={c.id} category={c} />)}
        </div>
      </Section>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/pages/Methodology.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit (propose for approval)**

```bash
git add src/pages/Methodology.tsx src/pages/Methodology.test.tsx
git commit -m "feat(methodology): add Methodology page"
```

---

### Task 9: Wire route + nav, repoint Dashboard, strip About section

**Files:**
- Modify: `src/routes/index.tsx`
- Modify: `src/components/common/Nav.tsx`
- Modify: `src/pages/Dashboard.tsx:26` (the "About the method →" link)
- Modify: `src/pages/About.tsx` (remove the Scoring methodology section + now-dead imports)

**Interfaces:**
- Consumes: `Methodology` default export (Task 8).
- Produces: navigable `/methodology` route; About no longer renders a methodology section.

- [ ] **Step 1: Add the route.** In `src/routes/index.tsx`, add the import with the other page imports:
```tsx
import Methodology from "@/pages/Methodology";
```
and add the route before the `about` route:
```tsx
        { path: "methodology", element: <Methodology /> },
```

- [ ] **Step 2: Add the nav link.** In `src/components/common/Nav.tsx`, change the `links` array to:
```tsx
const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/compare", label: "Compare" },
  { to: "/methodology", label: "Methodology" },
  { to: "/about", label: "About" },
];
```

- [ ] **Step 3: Repoint the Dashboard link.** In `src/pages/Dashboard.tsx`, replace:
```tsx
          <Link to="/about" className="text-primary hover:underline">About the method →</Link>
```
with:
```tsx
          <Link to="/methodology" className="text-primary hover:underline">How scoring works →</Link>
```

- [ ] **Step 4: Strip the methodology section from About.** In `src/pages/About.tsx`:

(a) Remove the entire `Scoring methodology` `<Section ...>…</Section>` block (the one with the category table).

(b) Remove now-unused code:
- the `useMemo` import (line 2) — no longer used;
- the `Table, TableBody, TableCell, TableHead, TableHeader, TableRow` import line;
- `Calculator` from the lucide-react import (keep the others, including `Dot`);
- the `sortedCategories` `useMemo` declaration;
- `categories` from the `useData()` destructure → change `const { profile, categories } = useData();` to `const { profile } = useData();`.

(Leave the `p` alias and all other sections — household, goal & pathway, preferences, feedback — unchanged.)

- [ ] **Step 5: Verify routing, nav and the trimmed About all compile and tests pass**

Run: `npm run typecheck && npm run test`
Expected: PASS — no unused-import/type errors; all existing + new tests green.

- [ ] **Step 6: Manual smoke (optional but recommended)**

Run: `npm run dev` and confirm: nav shows "Methodology"; `/methodology` renders the seven sections; Dashboard "How scoring works →" lands on it; About no longer shows the methodology table.

- [ ] **Step 7: Commit (propose for approval)**

```bash
git add src/routes/index.tsx src/components/common/Nav.tsx src/pages/Dashboard.tsx src/pages/About.tsx
git commit -m "feat(methodology): route + nav, repoint dashboard link, trim About"
```

---

### Task 10: Full quality gate

**Files:** none (verification only).

- [ ] **Step 1: Run the full gate**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: lint clean (only pre-existing warnings, no new), typecheck OK, all tests pass, build succeeds.

- [ ] **Step 2: Confirm no data/cache drift**

Confirm no files under `src/data/` changed (`git status` shows only the new components/page/tests/route/nav/Dashboard/About). **Do not run `cache:scores`** — no scores changed.

- [ ] **Step 3: Report results** honestly (lint/typecheck/test/build outcomes) and hand back for review.

---

## Self-Review

**1. Spec coverage:**
- FR1 route → Task 9 ✓ · FR2 nav → Task 9 ✓ · FR3 Dashboard repoint → Task 9 ✓ · FR4 About strip → Task 9 ✓
- FR5 lead → Task 8 ✓ · FR6 "how built" + config interpolation → Task 8 ✓ · FR7 recalibration curve via `recalibrate()` → Task 7 + Task 8 ✓
- FR8 tiers via `orderedTiers` → Task 1 + Task 4 + Task 8 ✓ · FR9 flags via `SeverityBadge` → Task 3 + Task 8 ✓
- FR10 summary table → Task 5 + Task 8 ✓ · FR11 factor cards → Task 6 + Task 8 ✓ · FR12 `formatPercent` everywhere → Tasks 4–8 ✓
- Components: `TierLegend`/`SeverityBadge`/`WeightBar` (common), `CategoryWeightTable`/`FactorTable`/`CategoryFactorCard`/`RecalibrationCurve` (methodology), `Methodology` page → all have tasks ✓
- Lib `orderedTiers` + test → Task 1 ✓ · No data/cache change → Task 10 ✓

**2. Placeholder scan:** none — every code step shows complete code; every test shows real assertions.

**3. Type consistency:** `Category`/`Factor` from `@/types`; `Severity = "blocker" | "highlight"` used consistently in Task 3 and Task 8; `orderedTiers(): { tier: Tier; min: number }[]` consumed identically by `TierLegend`; `WeightBar({ weight, max })` consumed identically by both tables; `formatPercent` is the single number formatter throughout.
