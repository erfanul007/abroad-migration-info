import type { FactorBreakdown } from "@/types";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { formatNumber, formatPercent } from "@/lib/formatters";

/** Factor breakdown: points = score/100 × weight; footer = raw weighted mean = category score (displayScore), no display curve. */
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
        This factor-weighted mean is the exact category score ({formatPercent(displayScore)}); the overall is the weighted mean of all categories — no display curve is applied (see Methodology).
      </p>
    </div>
  );
}
