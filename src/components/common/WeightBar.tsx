// src/components/common/WeightBar.tsx
import { cn } from "@/lib/utils";

/** A slim proportional bar visualising a weight relative to the largest in its group.
 *  Decorative only (aria-hidden) — the numeric weight is always shown as text alongside. */
export function WeightBar({ weight, max, className }: { weight: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, (weight / max) * 100) : 0;
  return (
    <span aria-hidden className={cn("inline-block h-1.5 w-full max-w-24 overflow-hidden rounded-full bg-muted align-middle", className)}>
      <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
    </span>
  );
}
