# German University City Coverage Design

## Goal

Ensure every city in the Germany city scoreboard is represented by at least one university row offering a relevant English-taught CS, AI, data, software, cyber-security, or information-systems master's suitable for international applicants.

## Selection rules

- Verify programme language, international eligibility, fees, portal, prerequisites, and application timing from official university pages.
- Prefer public research universities, then public universities of applied sciences. Use a private institution only when no qualifying public English option exists in that city and show its tuition prominently.
- Keep EduRank 2026 overall and available subject ranks as comparative indicators. Missing subject ranks render as dashes and are never inferred.
- Use the existing expanded narrative format for programme fit, applicant checks, pros, cons, and official links.
- Add the `Summer ’27` chip only when an official page supports a Summer 2027 intake with a deadline still ahead on 2026-07-14.

## Coverage decisions

Add HHU Düsseldorf, Lancaster University Leipzig, University of Potsdam/HPI, TU Dortmund, Leibniz University Hannover, and TH Köln. Expand FAU's row with its English International Information Systems programme, which is predominantly taught in Nuremberg. This covers all 16 scoreboard cities without misrepresenting Leipzig University's German-required Data Science programme or Potsdam's suspended Data Science programme.

## Verification

Add a data-integrity test asserting every city label occurs in at least one university location. Validate all rows through the existing Zod loader, then run the full tests, lint, and build.
