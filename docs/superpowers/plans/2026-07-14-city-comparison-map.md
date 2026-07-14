# City Comparison Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive German city-location map beside the city category-profile radar chart.

**Architecture:** A focused `CityCompareMap` owns Leaflet rendering, Germany bounds, pair fitting, markers, and tile fallback. `CityCompare` composes it with the existing radar chart in a responsive equal-width grid; city coordinates remain dataset-owned.

**Tech Stack:** React, TypeScript, React Leaflet, Leaflet, Recharts, Vitest, Testing Library.

## Global Constraints

- Use OpenStreetMap tiles and attribution with no API key or backend.
- Constrain navigation to Germany and disable scroll-wheel zoom.
- Stack map and chart below the desktop breakpoint.

---

### Task 1: City map and data contract

**Files:**
- Create: `src/components/dataset/CityCompareMap.tsx`
- Create: `src/components/dataset/CityCompareMap.test.tsx`
- Modify: `src/data/cities/germany.json`
- Modify: `src/lib/data.test.ts`

- [ ] Write tests requiring two markers, OSM tiles, fallback copy, and valid locations for every city.
- [ ] Run the focused tests and confirm they fail because the component and locations do not exist.
- [ ] Implement the map and add all 16 reviewed city-centre locations.
- [ ] Run the focused tests and confirm they pass.

### Task 2: Side-by-side comparison layout

**Files:**
- Modify: `src/components/dataset/CityCompare.tsx`
- Modify: `src/components/dataset/CityCompare.test.tsx`

- [ ] Write a test requiring the city map and radar to share the comparison-visuals grid.
- [ ] Run it and confirm it fails because the map is absent.
- [ ] Render both visuals in an equal-width responsive grid and use compact matching heights.
- [ ] Run component tests and confirm they pass.

### Task 3: Full verification

- [ ] Run `npm.cmd test` and require zero failures.
- [ ] Run `npm.cmd run lint` and require zero errors.
- [ ] Run `npm.cmd run build` and require a successful production build.
