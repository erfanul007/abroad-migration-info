# City Comparison Map Design

## Outcome

The German city comparison shows a local-road map beside the category-profile radar chart. Each visual occupies half of the available width on desktop and stacks on narrow screens.

## Design

- Add reviewed city-centre coordinates and OpenStreetMap references to all German city rows.
- Render A/B city pins on the same Germany-bounded Leaflet/OpenStreetMap base used by university comparison.
- Fit the viewport to the selected pair, capped at a city-area zoom level.
- Pair the map and radar chart in a responsive two-column grid.
- If street tiles fail, retain the Germany outline and pins with a visible status message.
- Keep score tables, practical context, and narratives below the visual row.

## Verification

Component tests cover map presence, pins, fallback behavior, and the side-by-side visual structure. Data tests require a valid Germany coordinate and HTTPS reference for every city.
