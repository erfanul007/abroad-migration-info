// src/lib/palette.ts
// Single source for the literal colour values that chart/map libraries (Recharts,
// Leaflet) need as raw CSS strings — they can't consume Tailwind utility classes.
// Everything else in the app uses theme tokens via Tailwind. Keep this the ONLY place
// chart/map colours are defined, so no component guesses a hex. See design-system §2.

/**
 * Compare / radar overlay series, ≤3 countries.
 * [0] is the app primary (theme-aware, matches buttons/links); [1]/[2] are fixed,
 * distinct from each other in both themes and for common colour-blindness.
 */
export const SERIES = ["var(--primary)", "#16a34a", "#ea580c"] as const;

/** Choropleth (Leaflet) static fills. Land = neutral grey; borders = white hairline.
 *  Scored countries are filled on the green ramp via `scoreToGreen()` (formatters.ts). */
export const MAP_LAND = "#c9ced6";
export const MAP_BORDER = "#ffffff";
