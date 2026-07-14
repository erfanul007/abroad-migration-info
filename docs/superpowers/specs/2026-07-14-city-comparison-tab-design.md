# City comparison tab

## Goal

Add a Compare tab to score-scale Cities modals for comparing exactly two cities through scores, weighted contributions, and aligned narrative context.

## Interaction

- Show `Compare` immediately after `Table`; do not show it for universities or non-city datasets.
- Default to the two highest-overall cities.
- Provide two city selectors. Each selector excludes the city selected in the other slot.
- Keep both slots populated whenever the dataset has at least two rows.

## Layout

1. A two-city summary strip shows city/state, overall score, and the point difference.
2. An overlaid radar chart compares all scored criteria, ordered by descending weight.
3. A horizontally scrollable score table shows category, weight, both scores, and both earned contributions. Highlight the stronger score in each row.
4. An aligned facts grid compares all non-score columns row by row.
5. Two parallel narrative panels show each city’s summary, pros, cons, note, and source links. Panels stack on narrow screens.

## Calculations

- Overall uses the existing `rowOverall(dataset, row)` utility.
- Earned contribution is `(score / 100) * weight`.
- Missing values render as `—` and do not participate in winner highlighting.

## Accessibility

- Selectors have explicit `aria-label` values.
- Radar chart uses a comparison-specific figure label and Recharts legend/tooltips.
- Tables retain semantic headers and tabular numeric formatting.
- Links open in a new tab with safe relationship attributes.

## Components

- Create `CityCompare.tsx` for selection state and the comparison dashboard.
- Add the conditional Compare trigger/content in `DatasetModal.tsx`.
- Reuse existing Select, ScoreBadge, Table, formatter, palette, tabs, and dataset utilities.

## Testing

- Verify the dashboard defaults to the two best cities, renders scores/contributions/facts/narratives, and updates a selection without allowing duplicates.
- Verify the modal exposes Compare for Cities and not Universities.
- Run targeted tests, the full suite, and production build.

## Out of scope

- Comparing more than two cities.
- Persisting selections outside the modal session.
- Changing city data, weights, or scoring calculations.
