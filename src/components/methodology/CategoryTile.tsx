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
