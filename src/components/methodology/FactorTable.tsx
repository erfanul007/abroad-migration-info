import type { Factor } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WeightBar } from "@/components/common/WeightBar";
import { formatPercent } from "@/lib/formatters";

/** Per-category factor table; weight bar is proportional to the category's heaviest factor. */
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
