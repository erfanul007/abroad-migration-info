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

/**
 * Category identity palette for the methodology category-weight pie. 15 categories exceed the
 * ≤3-series chart guideline (§2.3), so this is a deliberate, documented exception: colour is
 * pure category IDENTITY (not a good/bad scale) and is always redundant with a visible text
 * label (pie tooltip + tile name), so it is never the sole signal. Evenly-spaced OKLCH hues at
 * a fixed mid lightness/chroma read distinctly in both light and dark themes.
 */
export function categoryColor(index: number, total: number): string {
  const hue = total > 0 ? ((360 / total) * index) % 360 : 0;
  return `oklch(0.68 0.15 ${hue.toFixed(1)})`;
}
