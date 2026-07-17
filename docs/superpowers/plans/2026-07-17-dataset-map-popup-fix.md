# Dataset Map Popup Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make dataset-map pins show concise university information in a smooth, map-anchored popup consistent with the dashboard country map.

**Architecture:** Keep selection and presentation inside Leaflet by rendering one `Popup` as a child of the selected marker. Remove the page-level Radix dialog and its duplicate selection state. Retain permanent short labels, but suppress their pointer events and close the active popup through Leaflet's normal lifecycle.

**Tech Stack:** React 19, TypeScript, Leaflet, react-leaflet, Vitest, Testing Library.

## Global Constraints

- Do not change university data, scores, claims, or citations.
- Do not add dependencies.
- Preserve keyboard-accessible markers.
- Do not commit or push without explicit approval.

---

### Task 1: Replace the page dialog with a marker popup

**Files:**
- Modify: `src/components/dataset/DatasetMap.test.tsx`
- Modify: `src/components/dataset/DatasetMap.tsx`

**Interfaces:**
- Consumes: `ComparativeDataset`, `DatasetRow`, and existing row values.
- Produces: a `MarkerDetail` body rendered inside `react-leaflet`'s `Popup`.

- [x] **Step 1: Write the failing regression test**

Update the `react-leaflet` mock with a `Popup` that exposes `role="dialog"`, remove click-state behavior from the marker mock, and assert that the popup contains the university name, campus, world rank, programme, and tuition.

- [x] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/dataset/DatasetMap.test.tsx`

Expected: FAIL because `DatasetMap` still imports the Radix dialog and does not render the mocked Leaflet `Popup` under each marker.

- [x] **Step 3: Implement the minimal popup change**

In `DatasetMap.tsx`, import `Popup` from `react-leaflet`, remove Radix dialog imports and selected-row state, add `popupAnchor: [0, -38]` to the pin icon, render `MarkerDetail` within a `Popup` under every marker, and make `MarkerDetail` return a compact content container rather than `DialogContent`.

- [x] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/components/dataset/DatasetMap.test.tsx`

Expected: all map tests pass.

- [x] **Step 5: Run the full repository gate**

Run: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

Expected: zero errors, all tests pass, and the production build completes; existing warnings are reported separately.
