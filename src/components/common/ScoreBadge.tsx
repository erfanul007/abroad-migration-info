// src/components/common/ScoreBadge.tsx
import { cn } from "@/lib/cn";
import { formatPercent, scoreTier, scoreTierClasses } from "@/lib/formatters";

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const tier = scoreTier(score);
  return (
    <span className={cn("inline-flex min-w-12 items-center justify-center rounded-md px-2 py-0.5 text-sm font-semibold tabular-nums", scoreTierClasses(tier), className)}>
      {formatPercent(score)}
    </span>
  );
}
