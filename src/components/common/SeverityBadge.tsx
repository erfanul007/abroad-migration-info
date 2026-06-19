// src/components/common/SeverityBadge.tsx
import { cn } from "@/lib/utils";

export type Severity = "blocker" | "highlight";

// Single source for the wording + colour used on country cells and the methodology page.
const LABEL: Record<Severity, string> = { blocker: "blocker", highlight: "direct-work route" };
const CLASS: Record<Severity, string> = {
  blocker: "text-rose-600 dark:text-rose-400",
  highlight: "text-emerald-600 dark:text-emerald-400",
};

/** Inline label marking a con as a blocker or a pro as a positive (direct-work) highlight. */
export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return <span className={cn("ml-1 font-semibold", CLASS[severity], className)}>({LABEL[severity]})</span>;
}
