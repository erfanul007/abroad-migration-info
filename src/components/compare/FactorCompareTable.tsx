// src/components/compare/FactorCompareTable.tsx
import type { Category, ScoredCountry } from "@/types";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { deriveFactorComparison } from "@/lib/scoring";
import { categoryScore } from "@/lib/selectors";
import { formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";

/** Compares one category's factor sub-scores across the chosen countries. Factor scores are
 *  absolute (raw 0–100); the footer category-score row is the exact rule-based category score. The
 *  highest non-null score in each row is highlighted (same idiom as the main category table). */
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
        Factor, category and overall scores are all exact rule-based values (0–100%) — no display curve is applied (see Methodology).
      </p>
    </div>
  );
}
