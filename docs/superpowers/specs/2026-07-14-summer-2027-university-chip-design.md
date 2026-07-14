# Summer 2027 University Chip Design

## Outcome

Show one compact `Summer ’27` chip beside each university with a Summer 2027 intake whose application deadline has not passed as of the dataset review date. The wording is deliberately neutral because a qualifying window may be open now, upcoming, or not yet fully published.

## Data and rendering

Dataset rows gain an optional `tags: string[]` field. Eligible German university rows receive exactly one `Summer ’27` tag. `DatasetTable` renders row tags inline beside the university label; rows without tags and non-university datasets remain unchanged.

Eligibility is curated from the verified intake records rather than parsed from descriptive application-window prose. A future deadline qualifies. An intake with a confirmed Summer 2027 offering but unpublished dates also qualifies while the dataset review date precedes the intake.

## Testing

A component regression test verifies that a tagged university shows the chip beside its name and an untagged winter-only university does not. Schema/data tests continue to validate the JSON shape.
