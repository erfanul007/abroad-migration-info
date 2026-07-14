# University Compare Germany Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Germany-focused, road-capable comparison map for two selected universities with verified campus pins and a resilient pin-on-geography fallback.

**Architecture:** Extend generic dataset rows with optional reviewed map locations while requiring them for every German university. A focused `UniversityCompareMap` renders a bundled Germany GeoJSON base, progressive OpenStreetMap tiles, two accessible A/B markers, automatic bounds, popups, and non-blocking tile failure status; `UniversityCompare` retains selection state and composes the map.

**Tech Stack:** React 19, TypeScript 6, React-Leaflet 5, Leaflet 1.9, world-atlas/topojson-client, Zod 4, Vitest, Testing Library, Tailwind CSS.

## Global Constraints

- Do not create a commit.
- Remain compatible with a static GitHub Pages deployment; no backend and no runtime geocoding.
- Use `https://tile.openstreetmap.org/{z}/{x}/{y}.png` with visible `© OpenStreetMap contributors` attribution.
- Always render selected pins and bundled Germany geography when street tiles fail.
- Show only the selected two universities and keep the viewport constrained to Germany plus a small border margin.
- Store a reviewed campus label, coordinates, and source URL for every German university.
- Multi-campus pins represent the campus of the primary shortlisted English CS-related programme and must be labeled accordingly.

---

### Task 1: Location schema and validation

**Files:**
- Modify: `src/lib/schema.ts`
- Modify: `src/lib/schema.test.ts`

**Interfaces:**
- Produces: `DatasetRow["location"]` with `{ lat: number; lng: number; label: string; sourceUrl: string }`.
- Produces: German university validation errors for missing or out-of-bounds locations.

- [ ] Add schema tests proving a valid German university location passes, a missing one fails, invalid URLs fail, and coordinates outside latitude `47.0..55.2` or longitude `5.5..15.6` fail.
- [ ] Run `npm.cmd test -- src/lib/schema.test.ts` and confirm the new tests fail before production changes.
- [ ] Add `datasetLocationSchema`; attach it optionally to generic rows; in `validateDataset`, require it for `countryId === "germany" && kind === "universities"` and enforce the stated bounds.
- [ ] Run `npm.cmd test -- src/lib/schema.test.ts` and confirm it passes.

### Task 2: Reviewed German university campus coordinates

**Files:**
- Modify: `src/data/universities/germany.json`
- Modify: `src/lib/data.test.ts`
- Modify: `docs/germany-universities.md`

**Interfaces:**
- Consumes: `DatasetRow.location` from Task 1.
- Produces: a location for all 26 German university rows.

- [ ] Research every row using an official campus/programme address and a matching OpenStreetMap place; choose the relevant English CS programme campus when institutions span cities.
- [ ] Add a data test that reports IDs missing location, duplicate row IDs, invalid bounds, or invalid `https://` source URLs.
- [ ] Run `npm.cmd test -- src/lib/data.test.ts` and confirm it fails with the currently missing location records.
- [ ] Add `location` objects to all 26 rows and document the location methodology and multi-campus choices.
- [ ] Run `npm.cmd test -- src/lib/data.test.ts src/lib/schema.test.ts` and confirm all location records validate.

### Task 3: Interactive map and geographic fallback

**Files:**
- Create: `src/components/dataset/UniversityCompareMap.tsx`
- Create: `src/components/dataset/UniversityCompareMap.test.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `{ first: DatasetRow; second: DatasetRow }`.
- Produces: `UniversityCompareMap({ first, second }): JSX.Element`.

- [ ] Add component tests that mock React-Leaflet and verify the A/B text summary, popup facts, Germany fallback layer, exact OSM tile URL and attribution, bounds updates, and non-blocking tile-error message.
- [ ] Run `npm.cmd test -- src/components/dataset/UniversityCompareMap.test.tsx` and confirm it fails because the component is absent.
- [ ] Implement a Germany feature extracted from `world-atlas/countries-110m.json`, an underlying `GeoJSON`, an optional `TileLayer`, custom `DivIcon` A/B markers, `fitBounds` updates, Germany max bounds, keyboard-readable popups, and a tile-event failure state.
- [ ] Add narrowly scoped marker and fallback styling without changing the existing choropleth styles.
- [ ] Run `npm.cmd test -- src/components/dataset/UniversityCompareMap.test.tsx` and confirm it passes.

### Task 4: Compare-tab integration and responsive UX

**Files:**
- Modify: `src/components/dataset/UniversityCompare.tsx`
- Modify: `src/components/dataset/UniversityCompare.test.tsx`

**Interfaces:**
- Consumes: `UniversityCompareMap` from Task 3.
- Preserves: existing selectors, subject ranks, admissions/costs, and international-student narratives.

- [ ] Extend the existing comparison test to require the map immediately after the selectors, confirm selection changes update map inputs, and retain all current table/narrative assertions.
- [ ] Run `npm.cmd test -- src/components/dataset/UniversityCompare.test.tsx` and confirm the map assertions fail.
- [ ] Render `UniversityCompareMap` with the resolved rows between selectors and summary cards; preserve selection filtering and modal behavior.
- [ ] Run both university comparison component test files and confirm they pass.

### Task 5: Full verification

**Files:**
- Review only: all changed files

- [ ] Run `npm.cmd test` and require all test files and tests to pass.
- [ ] Run `npm.cmd run lint` and require zero errors.
- [ ] Run `npm.cmd run build` and require a successful production bundle.
- [ ] Audit `germany.json` to require 26 locations, 26 HTTPS source URLs, and zero out-of-bounds coordinates.
- [ ] Review the diff for unintended changes, exposed credentials, missing attribution, runtime geocoding, or regressions in the existing university comparison.

## Plan self-review

- The plan covers schema, research, all records, multi-campus semantics, road tiles, fallback geography, A/B interaction, accessibility, failure behavior, responsive integration, and verification.
- `DatasetRow.location` and `UniversityCompareMap` names are consistent across tasks.
- No API key, backend, runtime geocoder, route planning, satellite layer, or unrelated refactor is introduced.
