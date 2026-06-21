// src/lib/palette.ts
// Single source for the literal colour values that chart/map libraries (Recharts,
// Leaflet) need as raw CSS strings — they can't consume Tailwind utility classes.
// Everything else in the app uses theme tokens via Tailwind. Keep this the ONLY place
// chart/map colours are defined, so no component guesses a hex. See design-system §2.

/**
 * Compare / radar overlay series, up to 5 countries (Compare allows 2–5 slots).
 * [0] is the app primary (theme-aware, matches buttons/links); [1]–[4] are fixed, distinct
 * from each other in both themes and chosen to stay separable for common colour-blindness
 * (green / orange / purple / cyan). Always paired with a country label, so colour is never the
 * sole signal.
 */
export const SERIES = ["var(--primary)", "#16a34a", "#ea580c", "#9333ea", "#0891b2"] as const;

/** Choropleth (Leaflet) static fills. Land = neutral grey (unscored / rest of world);
 *  borders = white hairline. Scored countries are filled on the absolute green ramp via
 *  `scoreToGreen()` (formatters.ts) — deepest green highest, faintest lowest. */
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
