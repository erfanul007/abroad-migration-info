// src/lib/config.ts
// Single source of truth for scoring / layout policy constants. Keep magic numbers
// out of components and out of formatters — import from here so a policy change is
// one edit. (Choropleth pixel/zoom presentation constants stay in their components.)

/** Absolute score-tier cutoffs (0..100). ≥excellent / ≥good / ≥fair / else weak. */
export const TIER = { excellent: 80, good: 65, fair: 45 } as const;

/** Choropleth fill band: below `min` → no fill; at/above `max` → deepest shade (capped). */
export const CHOROPLETH = { min: 60, max: 80 } as const;

/** Curation policy: countries scoring below this overall are dropped (surfaced, not auto-deleted). */
export const INCLUSION_MIN = 50;

/** Display recalibration curve: contrast-stretch derived scores around a fixed pivot so
 *  the aggregate scale uses the full tier range. display = clamp(pivot + (raw-pivot)*gain). */
export const RECALIBRATE = { pivot: 55, gain: 1.6 } as const;

/** Top-N sizes used across the UI (podium, dashboard preview, compare default slots). */
export const TOP_N = { podium: 3, dashboard: 5, compare: 2 } as const;
