# University Compare Germany Map Design

**Date:** 2026-07-14
**Status:** Approved direction; awaiting written-spec review

## Goal

Add an interactive Germany-focused map to the university Compare tab. It must pinpoint the two selected universities, show roads and local geography when online map tiles are available, and remain useful as a pin-on-geography map if tiles fail.

## Product decisions

- Use the existing Leaflet and React-Leaflet dependencies.
- Use OpenStreetMap Standard raster tiles as a progressive enhancement. No backend or API key is required for the GitHub Pages deployment.
- Render a bundled Germany geographic layer beneath the tiles. This is the visible fallback when tiles are unavailable.
- Store reviewed coordinates in the university dataset. Do not geocode names or addresses in the user's browser.
- Keep the feature Germany-only. It is part of the German university comparison, not a general-purpose world map.
- Preserve visible OpenStreetMap attribution and normal browser caching. Do not preload, scrape, or offer offline tile downloads.

## Placement and layout

The Compare tab will be ordered as follows:

1. First and second university selectors.
2. A shared map for the two selections.
3. The existing two university summary cards.
4. Subject-rank comparison.
5. Admissions and costs.
6. International-student narratives.

The map will be approximately 400 px high on desktop and 320 px high on smaller screens. It will use the full modal content width. The existing wide modal and scroll behavior remain unchanged.

## Map interaction

- Show exactly two emphasized markers, identified as **A** and **B**, using colors consistent with their comparison positions.
- Selecting a different university updates the corresponding marker without resetting the other selection.
- Fit the viewport to both markers with comfortable padding. When both records resolve to the same or nearly the same location, use a city-level zoom rather than an excessive street-level zoom.
- Constrain panning to Germany plus a small border margin, and cap zoom to useful country/campus levels.
- Clicking or keyboard-activating a marker opens a compact popup with university name, city/campus label, principal programme text, and non-EU tuition per semester.
- The map is contextual, not a route planner. It will not calculate distance, travel time, directions, or nearby accommodation.

## Coordinate data model

Extend the generic dataset-row schema with a structured optional location; Germany university validation will require it for every row:

```ts
location: {
  lat: number;
  lng: number;
  label: string;
  sourceUrl: string;
}
```

`label` identifies the represented campus, not merely the city. `sourceUrl` records the verification reference.

For institutions with multiple campuses, coordinates must represent the campus associated with the shortlisted English CS-related programme when that campus is known. Examples include TH Köln's Cologne/Gummersbach split, FAU's Erlangen/Nuremberg programmes, and TUM's Munich/Garching distribution. Where multiple shortlisted programmes use different campuses, the label will explicitly say that the pin represents the primary shortlisted programme campus; the UI must not imply that every programme is taught at that exact point.

Coordinates will be researched before implementation by pairing an official university programme/campus address with a matching OpenStreetMap location. Runtime geocoding is excluded because it introduces rate limits, inconsistent campus selection, privacy considerations, and a new external dependency.

Dataset validation will require a valid location for every German university row used by this comparison. Latitude and longitude must fall inside a Germany-plus-border bounding box, and source URLs must be valid URLs.

## Components and responsibilities

### `UniversityCompareMap`

A focused component receives the two selected `DatasetRow` records. It owns only map rendering, bounds updates, markers, popups, tile status, and accessible map explanation. It does not own selector or comparison state.

### `UniversityCompare`

The existing component continues to own the two selected university IDs. It passes the resolved rows to the map and retains all existing tables and narrative content.

### Geographic fallback

Reuse the bundled `world-atlas` data to extract Germany's shape and render it as a quiet base layer below road tiles. Selected markers always render above this layer. If tile requests fail, the Germany shape and markers remain visible without requiring a mode switch.

## Tile loading and failure behavior

- Tile URL: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.
- Show the required visible `© OpenStreetMap contributors` attribution.
- Allow the browser to send its normal referrer and honor HTTP caching.
- Do not prefetch tiles outside Leaflet's normal visible-viewport behavior.
- Tile failure must not remove markers or replace the whole Compare tab with an error.
- When tile errors occur, show a subtle non-blocking note: “Street map unavailable; showing university locations.”
- The underlying Germany geography makes the transition graceful, including when the visitor is offline.

The standard OpenStreetMap service is best-effort and has no SLA. If future traffic or reliability needs outgrow it, the tile URL will be isolated behind a small configuration boundary so a managed provider can replace it without changing map behavior.

## Accessibility and usability

- Provide a concise text summary immediately associated with the map, such as “A: TUM in Garching; B: TU Berlin in Berlin.” This ensures the location comparison is available without interacting with the map.
- Markers must have accessible names and keyboard-operable popups.
- Do not rely on color alone; A/B labels remain visible.
- Keep attribution readable and unobscured.
- Disable scroll-wheel zoom by default inside the modal to prevent accidental page trapping. Map controls and deliberate click/drag interaction remain available.
- Respect the modal's existing outside-click protection and ensure Leaflet pointer events do not close the dialog.

## Testing

### Data and schema tests

- Accept the new location object and reject invalid coordinates or URLs.
- Assert that every German university row has a location.
- Assert that each coordinate lies within the allowed Germany-area bounds.

### Component tests

- Render A and B labels for the initial selections.
- Update the corresponding label and popup content when a selection changes.
- Keep both markers and the text summary available when tile loading reports an error.
- Verify programme and tuition popup formatting.
- Verify the map does not alter the existing rank, admissions, or narrative comparisons.

### Integration and build checks

- Run the focused university comparison and data tests.
- Run the full Vitest suite, ESLint, and production build.
- Manually inspect desktop and narrow modal layouts with nearby and distant university pairs.

## Non-goals

- Directions, travel-time calculations, transit overlays, accommodation search, or campus tours.
- Runtime geocoding or user location.
- Satellite imagery, 3D buildings, or custom-hosted map tiles.
- Maps in the university table tab or expanded narrative rows.
- Generalizing the feature to countries other than Germany in this change.

## Success criteria

- GitHub Pages visitors can compare two German university locations on an interactive street map without a backend or API key.
- Both selections remain geographically understandable when OpenStreetMap tiles are blocked, unavailable, or offline.
- All pins represent reviewed campus locations and explain multi-campus ambiguity where applicable.
- Existing Compare-tab functions and modal interaction remain intact.

## References

- [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [OpenStreetMap Standard tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
- [Leaflet reference](https://leafletjs.com/reference)
