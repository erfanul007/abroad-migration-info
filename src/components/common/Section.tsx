// src/components/common/Section.tsx
import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

export function Section({ title, icon: Icon, action, children }: { title: string; icon?: LucideIcon; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          {Icon && <Icon className="size-[18px] shrink-0 text-muted-foreground" aria-hidden />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
