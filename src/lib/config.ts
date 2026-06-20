// src/lib/config.ts
// Single source of truth for scoring / layout policy constants. Keep magic numbers
// out of components and out of formatters — import from here so a policy change is
// one edit. (Choropleth pixel/zoom presentation constants stay in their components.)

/** Absolute score tiers (0..100), descending by floor. Five tiers, each a clearly-separable
 *  colour (green → lime → yellow → orange → red) — finer "micro-tiers" blurred together to the
 *  eye. Single source for thresholds, labels, and tier colours (badges derive Tailwind classes
 *  from the `id`; the choropleth + bars fill with `color`). `poor` floors at 0 so every score maps. */
export const TIERS = [
  { id: "excellent", label: "Excellent", min: 80, color: "#15803D" }, // deep green
  { id: "good", label: "Good", min: 70, color: "#84CC16" }, //            lime
  { id: "average", label: "Average", min: 60, color: "#EAB308" }, //      yellow
  { id: "weak", label: "Weak", min: 50, color: "#F97316" }, //           orange
  { id: "poor", label: "Poor", min: 0, color: "#DC2626" }, //            red
] as const;

/** Curation policy: countries scoring below this overall are dropped (surfaced, not auto-deleted). */
export const INCLUSION_MIN = 50;

/** Display recalibration curve: contrast-stretch derived scores around a fixed pivot so
 *  the aggregate scale uses the full tier range. display = clamp(pivot + (raw-pivot)*gain). */
export const RECALIBRATE = { pivot: 55, gain: 1.6 } as const;

/** Top-N sizes used across the UI (podium, dashboard preview, compare default slots). */
export const TOP_N = { podium: 3, dashboard: 5, compare: 2 } as const;
