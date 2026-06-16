// src/components/common/Layout.tsx
import { Outlet } from "react-router";
import { Nav } from "@/components/common/Nav";

export function Layout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Nav />
      <main aria-label="Content" className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
