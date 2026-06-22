import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value, badge, hint, icon: Icon }: { label: string; value?: string; badge?: ReactNode; hint?: string; icon?: LucideIcon }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">{label}</div>
          {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
        </div>
        <div className="mt-1 text-2xl font-bold tabular-nums">{badge ?? value}</div>
        {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}
