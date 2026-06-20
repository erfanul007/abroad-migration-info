// src/components/common/TierLegend.tsx
import { orderedTiers, scoreTierClasses, tierLabel, formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";

/** Colour-band legend for the absolute 0–100 score scale, derived from TIERS (via
 *  orderedTiers) so it can never drift from scoreTier. Each band shows its lower bound;
 *  the floor band (Poor) shows the upper bound it falls under. */
export function TierLegend({ className }: { className?: string }) {
  const tiers = orderedTiers();
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tiers.map(({ tier, min }, i) => {
        const isFloor = i === tiers.length - 1;
        const range = isFloor ? `< ${formatPercent(tiers[i - 1].min)}` : `≥ ${formatPercent(min)}`;
        return (
          <li key={tier} className={cn("inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium", scoreTierClasses(tier))}>
            <span>{tierLabel(tier)}</span>
            <span className="tabular-nums opacity-80">{range}</span>
          </li>
        );
      })}
    </ul>
  );
}
