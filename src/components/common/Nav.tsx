// src/components/common/Nav.tsx
import { NavLink } from "react-router";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/compare", label: "Compare" },
  { to: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <nav className="flex items-center gap-1">
          <span className="mr-3 font-semibold tracking-tight">Migration Feasibility</span>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
