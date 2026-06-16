// src/pages/NotFound.tsx
import { Link } from "react-router";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <Compass className="size-10 text-muted-foreground" aria-hidden />
      <h1 className="text-2xl font-bold tracking-tight">404 — Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">This route doesn’t exist. It may have moved, or the link was mistyped.</p>
      <Link to="/" className="text-primary hover:underline">← Back to dashboard</Link>
    </div>
  );
}
