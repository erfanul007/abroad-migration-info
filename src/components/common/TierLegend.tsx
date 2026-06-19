// src/components/common/TierLegend.tsx
import { orderedTiers, scoreTierClasses, formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const TIER_LABEL: Record<string, string> = { excellent: "Excellent", good: "Good", fair: "Fair", weak: "Weak" };

/** Colour-band legend for the absolute 0–100 score scale, derived from TIER (via
 *  orderedTiers) so it can never drift from scoreTier. Each band shows its lower bound;
 *  the weakest band shows the upper bound it falls under. */
export function TierLegend({ className }: { className?: string }) {
  const tiers = orderedTiers();
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tiers.map(({ tier, min }, i) => {
        const isWeak = i === tiers.length - 1;
        const range = isWeak ? `< ${formatPercent(tiers[i - 1].min)}` : `≥ ${formatPercent(min)}`;
        return (
          <li key={tier} className={cn("inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium", scoreTierClasses(tier))}>
            <span>{TIER_LABEL[tier]}</span>
            <span className="tabular-nums opacity-80">{range}</span>
          </li>
        );
      })}
    </ul>
  );
}
