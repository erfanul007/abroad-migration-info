// src/components/common/Nav.tsx
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Compass, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/compare", label: "Compare" },
  { to: "/about", label: "About" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
    isActive ? "bg-muted text-foreground" : "text-muted-foreground",
  );

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="mr-3 flex items-center gap-2 font-semibold tracking-tight transition-colors hover:text-primary"
          >
            <Compass className="size-5 text-primary" aria-hidden />Migration Feasibility
          </Link>
          {/* Inline links on tablet/desktop */}
          <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Collapsible menu on mobile */}
      {open && (
        <nav aria-label="Mobile" className="border-t sm:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
