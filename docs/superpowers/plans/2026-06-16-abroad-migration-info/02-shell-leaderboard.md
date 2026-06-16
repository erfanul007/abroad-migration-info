# Milestone 2 — App shell, theme & leaderboard

Back to [plan index](./README.md). Tasks 11–16. Output: themed app shell with routing, and a fully interactive leaderboard (search, sort, region filter, column toggle). Follows design-system §5–6 and wireframe §2.

> React Router v7: import from `react-router` (never `react-router-dom`).

---

## Task 11: Theme provider + hook + toggle (light/dark, persisted)

**Files:** Create `src/components/common/ThemeProvider.tsx`, `src/hooks/useTheme.ts`, `src/components/common/ThemeToggle.tsx`

- [ ] **Step 1: Write `ThemeProvider.tsx`**

```tsx
// src/components/common/ThemeProvider.tsx
import { createContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
interface ThemeCtx { theme: Theme; toggle: () => void }
export const ThemeContext = createContext<ThemeCtx | null>(null);

const KEY = "ami-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(KEY) as Theme | null;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

- [ ] **Step 2: Write `useTheme.ts`**

```ts
// src/hooks/useTheme.ts
import { useContext } from "react";
import { ThemeContext } from "@/components/common/ThemeProvider";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
```

- [ ] **Step 3: Write `ThemeToggle.tsx`**

```tsx
// src/components/common/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}
```

- [ ] **Step 4: Typecheck + commit**

```bash
npm run typecheck
git add -A
git commit -m "feat: light/dark theme provider, hook, and toggle"
```

---

## Task 12: ScoreBadge + PendingBadge

**Files:** Create `src/components/common/ScoreBadge.tsx`, `src/components/common/PendingBadge.tsx`, `src/components/common/ScoreBadge.test.tsx`

- [ ] **Step 1: Write the failing render test**

```tsx
// src/components/common/ScoreBadge.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreBadge } from "@/components/common/ScoreBadge";

describe("ScoreBadge", () => {
  it("renders the rounded score", () => {
    render(<ScoreBadge score={67.6} />);
    expect(screen.getByText("68")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/components/common/ScoreBadge.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implement both badges** (design-system §5.1–5.2)

```tsx
// src/components/common/ScoreBadge.tsx
import { cn } from "@/lib/cn";
import { formatScore, scoreTier, scoreTierClasses } from "@/lib/formatters";

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const tier = scoreTier(score);
  return (
    <span className={cn("inline-flex min-w-9 items-center justify-center rounded-md px-2 py-0.5 text-sm font-semibold tabular-nums", scoreTierClasses(tier), className)}>
      {formatScore(score)}
    </span>
  );
}
```

```tsx
// src/components/common/PendingBadge.tsx
import { cn } from "@/lib/cn";

export function PendingBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground", className)}>
      pending
    </span>
  );
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/components/common/ScoreBadge.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: ScoreBadge (tiered colour) and PendingBadge"
```

---

## Task 13: Layout, Nav, routing skeleton

**Files:** Create `src/components/common/Nav.tsx`, `src/components/common/Layout.tsx`, `src/routes/index.tsx`; modify `src/main.tsx`; create page stubs `Dashboard.tsx`, `Leaderboard.tsx`, `Compare.tsx`, `CountryDetail.tsx`, `About.tsx`, `NotFound.tsx`

- [ ] **Step 1: Create minimal page stubs** (filled in later milestones)

```tsx
// src/pages/Dashboard.tsx
export default function Dashboard() { return <h1 className="text-2xl font-bold">Dashboard</h1>; }
```
Create the same one-line stub for `Leaderboard`, `Compare`, `CountryDetail`, `About`, and:
```tsx
// src/pages/NotFound.tsx
export default function NotFound() { return <h1 className="text-2xl font-bold">404 — Not found</h1>; }
```

- [ ] **Step 2: Write `Nav.tsx`** (wireframe shared shell)

```tsx
// src/components/common/Nav.tsx
import { NavLink } from "react-router";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/compare", label: "Compare" },
  { to: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <nav className="flex items-center gap-1">
          <span className="mr-3 font-semibold tracking-tight">Migration Feasibility</span>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Write `Layout.tsx`**

```tsx
// src/components/common/Layout.tsx
import { Outlet } from "react-router";
import { Nav } from "@/components/common/Nav";

export function Layout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Write `routes/index.tsx`**

```tsx
// src/routes/index.tsx
import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/common/Layout";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import Compare from "@/pages/Compare";
import CountryDetail from "@/pages/CountryDetail";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "leaderboard", element: <Leaderboard /> },
        { path: "compare", element: <Compare /> },
        { path: "country/:iso", element: <CountryDetail /> },
        { path: "about", element: <About /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
```

- [ ] **Step 5: Wire `main.tsx`**

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { router } from "@/routes";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
```

- [ ] **Step 6: Verify nav + theme persistence, then commit**

```bash
npm run dev       # click Dashboard/Leaderboard/Compare/About; toggle theme; reload persists; Ctrl+C
npm run typecheck
git add -A
git commit -m "feat: app shell — layout, nav, routing, theme mount"
```

---

## Task 14: `useData` hook

**Files:** Create `src/hooks/useData.ts`

- [ ] **Step 1: Implement** (memoised access to scored data; pages never recompute scores)

```ts
// src/hooks/useData.ts
import { useMemo } from "react";
import { categories, profile, scoredCountries, getScoredCountry } from "@/lib/data";

export function useData() {
  return useMemo(() => ({ categories, profile, countries: scoredCountries }), []);
}

export function useCountry(iso: string | undefined) {
  return useMemo(() => (iso ? getScoredCountry(iso) : undefined), [iso]);
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add -A
git commit -m "feat: useData / useCountry hooks"
```

---

## Task 15: Leaderboard columns + table

**Files:** Create `src/components/leaderboard/columns.tsx`, `src/components/leaderboard/LeaderboardTable.tsx`

- [ ] **Step 1: Write `columns.tsx`** (rank, country, overall, one column per category)

```tsx
// src/components/leaderboard/columns.tsx
import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import type { Category, ScoredCountry } from "@/types";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { PendingBadge } from "@/components/common/PendingBadge";

export function buildColumns(categories: Category[]): ColumnDef<ScoredCountry>[] {
  return [
    {
      id: "rank",
      header: "#",
      accessorKey: "rank",
      cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.original.rank}</span>,
      enableGlobalFilter: false,
    },
    {
      id: "country",
      header: "Country",
      accessorKey: "name",
      cell: ({ row }) => (
        <Link to={`/country/${row.original.iso}`} className="flex items-center gap-2 font-medium hover:underline">
          <span aria-hidden>{row.original.flag}</span>
          <span>{row.original.name}</span>
          {row.original.hasPending && <PendingBadge />}
        </Link>
      ),
    },
    {
      id: "overall",
      header: "Overall",
      accessorFn: (c) => c.overall,
      cell: ({ getValue }) => <ScoreBadge score={getValue<number>()} />,
      enableGlobalFilter: false,
    },
    ...categories.map<ColumnDef<ScoredCountry>>((cat) => ({
      id: cat.id,
      header: cat.shortLabel,
      accessorFn: (c) => c.categories[cat.id]?.score ?? null,
      cell: ({ getValue }) => {
        const v = getValue<number | null>();
        return v == null ? <span className="text-muted-foreground">—</span> : <ScoreBadge score={v} />;
      },
      enableGlobalFilter: false,
      sortUndefined: "last",
    })),
  ];
}
```

- [ ] **Step 2: Write `LeaderboardTable.tsx`** (sort, global filter, column visibility, full-name header tooltips)

```tsx
// src/components/leaderboard/LeaderboardTable.tsx
import { useMemo, useState } from "react";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel,
  useReactTable, type SortingState, type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { Category, ScoredCountry } from "@/types";
import { buildColumns } from "@/components/leaderboard/columns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/cn";

interface Props {
  countries: ScoredCountry[];
  categories: Category[];
  globalFilter: string;
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (v: VisibilityState) => void;
}

export function LeaderboardTable({ countries, categories, globalFilter, columnVisibility, onColumnVisibilityChange }: Props) {
  const columns = useMemo(() => buildColumns(categories), [categories]);
  const [sorting, setSorting] = useState<SortingState>([{ id: "overall", desc: true }]);
  const labelById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const table = useReactTable({
    data: countries,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: (u) =>
      onColumnVisibilityChange(typeof u === "function" ? u(columnVisibility) : u),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => {
                const sortDir = h.column.getIsSorted();
                return (
                  <TableHead
                    key={h.id}
                    title={labelById[h.column.id] ?? undefined}
                    onClick={h.column.getCanSort() ? h.column.getToggleSortingHandler() : undefined}
                    className={cn("whitespace-nowrap", h.column.getCanSort() && "cursor-pointer select-none")}
                  >
                    <span className="inline-flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && (
                        sortDir === "asc" ? <ArrowUp className="size-3" />
                          : sortDir === "desc" ? <ArrowDown className="size-3" />
                          : <ChevronsUpDown className="size-3 opacity-40" />
                      )}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow><TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">No countries match your search.</TableCell></TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

```bash
npm run typecheck
git add -A
git commit -m "feat: leaderboard table (sort, global filter, column visibility)"
```

---

## Task 16: Leaderboard page (search, region filter, column toggle)

**Files:** Create `src/components/leaderboard/SearchBox.tsx`, `src/components/leaderboard/Filters.tsx`; modify `src/pages/Leaderboard.tsx`

- [ ] **Step 1: Write `SearchBox.tsx`**

```tsx
// src/components/leaderboard/SearchBox.tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative max-w-xs">
      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input className="pl-8" placeholder="Search countries…" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
```

- [ ] **Step 2: Write `Filters.tsx`** (region select + column-visibility popover)

```tsx
// src/components/leaderboard/Filters.tsx
import { type VisibilityState } from "@tanstack/react-table";
import type { Category } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  regions: string[];
  region: string;
  onRegionChange: (r: string) => void;
  categories: Category[];
  columnVisibility: VisibilityState;
  onToggleColumn: (id: string, visible: boolean) => void;
}

export function Filters({ regions, region, onRegionChange, categories, columnVisibility, onToggleColumn }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={region} onValueChange={onRegionChange}>
        <SelectTrigger className="w-44"><SelectValue placeholder="All regions" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All regions</SelectItem>
          {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm"><SlidersHorizontal className="mr-2 size-4" />Columns</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{c.shortLabel}</span>
                <Switch
                  checked={columnVisibility[c.id] !== false}
                  onCheckedChange={(v) => onToggleColumn(c.id, v)}
                />
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

- [ ] **Step 3: Write the `Leaderboard.tsx` page** (wireframe §2)

```tsx
// src/pages/Leaderboard.tsx
import { useMemo, useState } from "react";
import { type VisibilityState } from "@tanstack/react-table";
import { useData } from "@/hooks/useData";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { SearchBox } from "@/components/leaderboard/SearchBox";
import { Filters } from "@/components/leaderboard/Filters";

export default function Leaderboard() {
  const { countries, categories } = useData();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const regions = useMemo(() => [...new Set(countries.map((c) => c.region))].sort(), [countries]);
  const filtered = useMemo(
    () => (region === "all" ? countries : countries.filter((c) => c.region === region)),
    [countries, region],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Countries ranked by overall feasibility. Sort any column; search and filter to narrow.</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBox value={search} onChange={setSearch} />
        <Filters
          regions={regions} region={region} onRegionChange={setRegion}
          categories={categories} columnVisibility={columnVisibility}
          onToggleColumn={(id, visible) => setColumnVisibility((v) => ({ ...v, [id]: visible }))}
        />
      </div>
      <LeaderboardTable
        countries={filtered} categories={categories}
        globalFilter={search} columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </div>
  );
}
```

- [ ] **Step 4: Verify in browser, then commit**

```bash
npm run dev    # search filters rows; region select works; column toggle hides/shows; per-category sort works; Ctrl+C
npm run typecheck
git add -A
git commit -m "feat: leaderboard page — search, region filter, column toggle"
```
