// src/components/common/PendingBadge.tsx
import { cn } from "@/lib/cn";

export function PendingBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground", className)}>
      pending
    </span>
  );
}
