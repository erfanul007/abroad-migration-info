// Single source of truth for scoring/layout policy constants, so a policy change is one edit.

/** Absolute score tiers (0..100), descending by floor. Single source for thresholds, labels,
 *  and tier colours (badges derive Tailwind classes from `id`; choropleth + bars fill with
 *  `color`). `poor` floors at 0 so every score maps. */
export const TIERS = [
  { id: "excellent", label: "Excellent", min: 80, color: "#15803D" },
  { id: "good", label: "Good", min: 70, color: "#84CC16" },
  { id: "average", label: "Average", min: 60, color: "#EAB308" },
  { id: "weak", label: "Weak", min: 50, color: "#F97316" },
  { id: "poor", label: "Poor", min: 0, color: "#DC2626" },
] as const;

/** Curation policy: countries scoring below this overall are dropped (surfaced, not auto-deleted). */
export const INCLUSION_MIN = 50;

/** Top-N sizes used across the UI (podium, dashboard preview, compare default slots). */
export const TOP_N = { podium: 3, dashboard: 5, compare: 2 } as const;
