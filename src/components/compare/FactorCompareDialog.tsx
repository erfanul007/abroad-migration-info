import type { Category, ScoredCountry } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FactorCompareTable } from "@/components/compare/FactorCompareTable";
import { formatPercent } from "@/lib/formatters";
import { Table2 } from "lucide-react";

/** Modal comparing one category's factor sub-scores across countries; icon-button label is its accessible name. */
export function FactorCompareDialog({ category, countries }: { category: Category; countries: ScoredCountry[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" title="Compare factors" aria-label="Compare factors">
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
