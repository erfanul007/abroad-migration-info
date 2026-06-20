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
