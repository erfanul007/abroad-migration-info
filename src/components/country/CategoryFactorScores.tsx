// src/components/country/CategoryFactorScores.tsx
import type { FactorBreakdown } from "@/types";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { formatNumber, formatPercent } from "@/lib/formatters";

/** This country's obtained factor scores for one category and how they sum to the score:
 *  points = score/100 × weight (out of the factor's weight); the footer totals to the raw
 *  weighted mean — which is the category score (displayScore). Recalibration applies to the overall only. */
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
        This factor-weighted mean is the category score ({formatPercent(displayScore)}); only the overall score is recalibrated for ranking (see Methodology).
      </p>
    </div>
  );
}
