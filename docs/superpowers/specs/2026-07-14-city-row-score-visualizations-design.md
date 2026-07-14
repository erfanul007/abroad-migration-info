# City row score visualizations

## Goal

Show a city’s weighted category profile and contribution breakdown when its row is expanded in the Cities dataset modal, matching the visual language of the country detail page.

## Scope

- Applies only to score-scale city datasets.
- Renders inside the expanded row, above the existing summary, facts, pros, cons, notes, and links.
- Leaves university and other non-score datasets unchanged.
- Uses the dataset’s score columns as categories, their `weight` values as maximum contribution, and the expanded row’s values as scores.

## Design

Create a focused `DatasetScoreVisuals` component that accepts a dataset and row. It derives weighted score entries once and renders:

1. **Category profile** — a radar chart with axes ordered by descending weight and a 0–100 score domain.
2. **Contribution to overall** — horizontal weighted bars where track width represents category weight and coloured fill represents the score earned. The numeric label shows earned contribution divided by available weight.

The two visuals use the existing country-page chart dimensions, typography, tier colours, tooltip formatting, and accessible figure labels. They sit in a responsive two-column grid on large screens and stack on smaller screens.

`DatasetTable` passes the full dataset into its row-detail renderer. The renderer includes `DatasetScoreVisuals` only when `dataset.kind === "cities"` and `dataset.scale === "score"`.

## Data and calculations

- Include columns with `kind === "score"` and a numeric row value.
- Sort by weight descending.
- Radar value: raw row score on the 0–100 scale.
- Contribution: `(score / 100) * weight`.
- Contribution bar track width is proportional to the largest category weight; fill width is the score percentage.
- A missing score is excluded from both city visuals, consistent with the live overall calculation using present criteria.

## Accessibility and responsive behavior

- Each chart is contained in a semantic `figure` with a city-specific `aria-label`.
- Contribution rows expose progressbar names containing category, contribution, weight, and score.
- The chart grid stacks below the large breakpoint.
- Existing modal and row scrolling behavior remains unchanged.

## Testing

- Component tests verify score labels, calculated contributions, ordering, and accessible chart names.
- Dataset table tests verify charts are absent before expansion, appear for an expanded city row, and do not appear for non-score datasets.
- Run the targeted tests, full test suite, and production build.

## Out of scope

- Changing city weights, scores, or overall calculations.
- Adding charts to university datasets.
- Refactoring the country-page chart components or changing their appearance.
