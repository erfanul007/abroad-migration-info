# University Ownership and Open-Intake Tags Design

**Date:** 2026-07-22

## Goal

Make university ownership and live application availability visible and filterable without changing the dataset schema. Every German university row receives exactly one ownership tag, and an intake tag says `open` only when an official source confirms that the relevant application route is accepting applications on 22 July 2026.

## Tag vocabulary

Ownership tags:

- `Public`
- `Private`

Admission tags:

- `Winter ’26 open`
- `Summer ’27 open`
- `Winter ’27 open`
- `Summer ’27`
- `Winter ’27`
- `No CS intake ’27`

An `open` tag replaces the corresponding plain intake tag for that season; a row must never carry both `Summer ’27` and `Summer ’27 open`, or both `Winter ’27` and `Winter ’27 open`. `Winter ’26 open` is additional because it describes an earlier intake. No plain `Winter ’26` tag is needed: closed 2026 cycles remain in `applicationWindow` only.

Open means the reviewed official programme or admissions source explicitly confirms an active dated window, an active application form for that intake, or year-round/anytime/rolling applications. A generic `Apply now` button without a confirmed target intake is insufficient. When a private provider accepts applications anytime but does not publish which 2027 intake is selectable, retain plain 2027 intake tags and explain the uncertainty in `applicationWindow`.

## Colour semantics

- `Public`: blue, matching the existing ownership treatment.
- `Private`: violet, visually related to ownership but clearly distinct from public.
- Any tag ending in `open`: green, communicating an actionable current state.
- Plain `Summer ’27`: teal, communicating a confirmed future summer intake.
- Plain `Winter ’27`: amber, communicating a confirmed future winter intake.
- `No CS intake ’27`: rose, communicating exclusion/caution.

Colour is supplemental: every state remains understandable from text, and dark-mode contrast must be tested.

## Filtering

The current tag-derived facet is renamed from `Intake` to `Tags`, producing `All tags` in the toolbar. It remains a single-select facet backed by the existing `tags[]` array, so users can filter by ownership or any intake/open state without a schema change or a third picker. The city facet remains unchanged.

## Research and data rules

Audit all 35 German university rows. Use official university programme, admissions, application-deadline or application-portal pages as the primary evidence. For every live-window conclusion:

1. Confirm the selected English CS-related programme still offers the intake.
2. Confirm the applicable route for an international applicant with a Bangladeshi degree.
3. Compare the published closing date with 22 July 2026.
4. Cross-check with a second official page when one is available.
5. Update `applicationWindow`, supporting `detail.links`, and the research log when the existing row is incomplete or incorrect.

All six non-public institutions—Lancaster University Leipzig, Hochschule Fresenius, University of Europe for Applied Sciences, Gisma, SRH and Hertie—receive `Private`. The other 29 rows retain `Public`.

## Components and data flow

- `src/data/universities/germany.json` remains the source of truth for tags and application-window prose.
- `deriveFacets` continues deriving options from `row.tags`, but exposes the facet id and label as `tags` / `Tags`.
- `DatasetToolbar` needs no university-specific condition; its existing label interpolation renders `All tags`.
- `DatasetTable` maps tag strings to the colour semantics above.

## Testing

- Unit-test that the facet is named `Tags`, includes ownership and intake/open options, and filters rows by either kind.
- Component-test `All tags` copy and every colour family in light/dark-compatible utility classes.
- Data-test exactly one ownership tag per row, the exact public/private partition, the allowed admission vocabulary, no duplicate plain/open season tags, and no obsolete `upcoming` text.
- Run `npm run cache:scores`, then `npm run lint && npm run typecheck && npm run test && npm run build`, followed by `git diff --check` and a JSON tag audit.

## Non-goals

- No schema change or separate ownership field.
- No multi-select filtering.
- No inferred future deadline from an older cycle.
- No claim that an intake is open merely because its programme exists.
- No commit or push as part of this work.
