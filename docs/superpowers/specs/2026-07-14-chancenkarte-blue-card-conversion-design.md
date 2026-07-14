# Chancenkarte to Blue Card City Evidence — Design

Date: 2026-07-14 · Status: approved by user

## Goal

Help the applicant choose a German city where a suitable software job is realistically available and the local authority is less likely to delay the in-country change from a search Opportunity Card (§20a AufenthG) to an EU Blue Card (§18g AufenthG).

## Scoring model

- Remove `settle` (PR and naturalisation office speed) from scored criteria.
- Raise `conv` from 16 to 22 and rename it to `Chancenkarte → Blue Card conversion`.
- Raise `anm` from 10 to 12 and clarify that it measures the registration step needed to establish local jurisdiction and supply residence evidence.
- Keep `jobs` at 18, reduce `rent` from 8 to 6, and keep the other existing weights unchanged. Removing `settle`, adding eight points across `conv` and `anm`, and removing two from rent keeps the total at 100 while prioritising the immediate land-and-convert risk.
- Naturalisation remains available only as unscored expanded context.

## Conversion evidence model

Every city row will include a structured, expanded conversion assessment:

- `publishedTime`: the responsible authority's current wording or `Not published`.
- `timeScope`: what that estimate actually covers: end-to-end, authority decision, appointment-to-decision, or eAT production only.
- `applicationChannel`: online service, form, email/post, or appointment route.
- `workStart`: conservative guidance on when full-time work may legally begin.
- `confidence`: `high`, `medium`, or `low`.
- `asOf`: verification month.
- `naturalisation`: a separate descriptive sentence, never used in scoring.

The score must not convert eAT printing time into an end-to-end processing estimate. Official but vague wording earns medium confidence; no published timing earns low confidence and a conservative neutral score. Anecdotes can explain risk but cannot establish a city score.

## Legal and UX guidance

The expanded panel will explain that a timely application preserves lawful residence under §81(4), while the existing Opportunity Card's 20-hour restriction normally continues until the authority authorises the new employment. Under §81(5a), future-title employment becomes permitted once issuance has been initiated and must be recorded on the interim certificate. The UI therefore distinguishes application receipt, permission to start full-time work, the decision, and physical card delivery.

Each city will show the conversion assessment near its existing summary, pros, cons, office facts, and official links. Naturalisation is visually separated as longer-term context.

## Research rules

- Prefer the responsible city/region immigration authority and federal legislation or federal skilled-worker guidance.
- Record only claims supported by the linked page.
- Use authority pages updated or accessible in 2025–26 where possible.
- If an authority publishes no complete processing time, state that explicitly.
- Score comparatively from documented delay, digital intake, dedicated skilled-worker routing, and evidence confidence—not from unsupported precise estimates.

## Validation

- Dataset weights equal 100 and no scored `settle` column remains.
- All 16 rows contain complete conversion evidence and separate naturalisation context.
- Tests cover rendering, confidence labels, legal-stage wording, and data completeness.
- Full tests, lint, build, and diff checks pass before completion.
