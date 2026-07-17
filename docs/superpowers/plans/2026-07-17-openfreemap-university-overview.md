# OpenFreeMap University Overview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the failed Leaflet–MapLibre bridge with a direct, responsive OpenFreeMap university overview that clusters dense locations and reveals names contextually.

**Architecture:** Route university datasets to a dedicated `UniversityOverviewMap` built with `react-map-gl/maplibre`; retain the existing Leaflet implementation for city datasets. Use MapLibre's native clustered GeoJSON source and interaction layers, hosted OpenFreeMap Positron style, and a compact selected-university popup. Load the university map lazily so GitHub Pages receives static assets and the main application bundle is not penalized.

**Tech Stack:** React 19, TypeScript, `react-map-gl`, MapLibre GL JS, OpenFreeMap, Vitest, Testing Library, Vite/GitHub Pages.

## Global Constraints

- No server, API key, secret, proxy, handcrafted map geometry, or generated map asset.
- Preserve the existing city and comparison maps.
- Use HTTPS resources compatible with the repository's GitHub Pages base path.
- Cluster at overview zoom; reveal individual universities as users zoom in.
- University names appear on hover/focus or in the selected popup, never as permanent overlapping labels.
- Do not commit or push without explicit approval.

---

### Task 1: Direct MapLibre university overview

**Files:**
- Create: `src/components/dataset/UniversityOverviewMap.tsx`
- Create: `src/components/dataset/UniversityOverviewMap.test.tsx`
- Modify: `src/components/dataset/DatasetMap.tsx`
- Modify: `src/components/dataset/DatasetMap.test.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Delete: `src/components/maps/OpenFreeMapLayer.tsx`
- Delete: `src/components/maps/OpenFreeMapLayer.test.tsx`

- [x] Write failing tests for delegation, clustered source configuration, non-permanent labels, and basic popup content.
- [x] Run focused tests and confirm they fail because the direct overview does not exist.
- [x] Install `react-map-gl`, implement the direct OpenFreeMap map, and lazily route university datasets to it.
- [x] Remove `@maplibre/maplibre-gl-leaflet` and the bridge component.
- [x] Run focused tests, full tests, lint, typecheck, and production build.
- [x] Confirm the main GitHub Pages bundle remains separate from the lazy MapLibre chunk.
