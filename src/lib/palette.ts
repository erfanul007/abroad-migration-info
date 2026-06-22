// Single source for literal colour values that chart/map libraries (Recharts, Leaflet) need as
// raw CSS strings — they can't consume Tailwind classes. Keep this the ONLY place they're defined
// so no component guesses a hex. See design-system §2.

/**
 * Compare / radar overlay series, up to 5 countries. [0] is the app primary (theme-aware);
 * [1]–[4] are fixed, distinct in both themes and chosen to stay separable for common colour-
 * blindness. Always paired with a country label, so colour is never the sole signal.
 */
export const SERIES = ["var(--primary)", "#16a34a", "#ea580c", "#9333ea", "#0891b2"] as const;

/** Choropleth (Leaflet) static fills: land = neutral grey (unscored / rest of world), borders =
 *  white hairline. Scored countries fill on the green ramp via `scoreToGreen()` (formatters.ts). */
export const MAP_LAND = "#c9ced6";
export const MAP_BORDER = "#ffffff";

/**
 * Category identity palette for the methodology weight pie. 15 categories exceed the ≤3-series
 * guideline (§2.3) — a deliberate exception: colour is pure IDENTITY (not a good/bad scale) and
 * always redundant with a visible label, so never the sole signal. Evenly-spaced OKLCH hues at
 * fixed mid lightness/chroma read distinctly in both themes.
 */
export function categoryColor(index: number, total: number): string {
  const hue = total > 0 ? ((360 / total) * index) % 360 : 0;
  return `oklch(0.68 0.15 ${hue.toFixed(1)})`;
}
