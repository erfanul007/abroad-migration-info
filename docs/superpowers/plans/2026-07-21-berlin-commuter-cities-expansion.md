# Berlin-Commutable German Cities Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox syntax for tracking.

**Goal:** Research, approve, and add substantial officially recognised cities with credible Berlin
commutes to the German Chancenkarte city scoreboard, including complete evidence, scoring, maps,
comparisons, documentation, and verification.

**Architecture:** Keep the implementation data-driven. First produce an official-source candidate
register, commute audit, and eleven-criterion evidence matrix; stop for score approval; then add
approved rows to the existing Germany city JSON. Existing generic dataset components calculate
overalls and render table, overview-map, and comparison-map content from those rows, so UI code
changes are permitted only if verification exposes a concrete defect.

**Tech Stack:** Markdown research records, official German public-sector web sources, JSON, Zod 4,
TypeScript 6, React 19, MapLibre, Leaflet, Vitest, Testing Library, npm.

## Global Constraints

- Use the Bangladeshi mid-level software-engineer Chancenkarte → full-time work → EU Blue Card
  profile throughout.
- Trust only official or primary public-sector sources. Reject blogs, forums, Wikipedia,
  crowd-sourced cost databases, commercial aggregators, and SEO immigration sites.
- A candidate must be officially designated Stadt, have at least 40,000 residents in the latest
  official population release, function as an independent urban centre, and support a credible
  recurring public-transport commute to Berlin.
- Preserve the existing criteria and weights exactly: conv 22, jobs 18, anm 12, pt 10, rent 6,
  eng 7, safe 7, comp 6, cost 5, conn 4, comm 3.
- Never store overall; derive it at runtime with rowOverall.
- For every factual change, update narrative provenance, links, and review dates.
- Re-audit Berlin and Potsdam to the same evidence date used for new rows.
- Do not change production data until the user approves the completed evidence matrix and proposed
  scores.
- Do not commit or push without separate explicit approval.
- Before declaring completion, run npm run lint, npm run typecheck, npm run test, and npm run build.

---

## File map

- Create docs/research/2026-07-21-berlin-commuter-cities-expansion.md: eligibility, commute
  evidence, scoring matrices, conflicts, exclusions, calibration, and approvals.
- Modify src/data/cities/germany.json: add only approved rows; refresh Berlin and Potsdam; update
  dataset-level review date, methodology, caveats, and sources.
- Modify src/lib/data.test.ts: enforce complete evidence and the approved city set.
- Modify src/components/dataset/DatasetOverviewMap.test.tsx: prove approved locations enter the
  overview map source.
- Modify src/components/dataset/CityCompare.test.tsx: prove a new city is selectable and receives
  the existing comparison treatment.
- Modify src/components/dataset/CityCompareMap.test.tsx only if a Berlin-region pair exposes a
  bounds or marker regression not covered by the generic test.
- Modify docs/germany-cities.md: mirror the final runtime ranking, conversion evidence,
  recommendations, caveats, and official-source policy.
- No component or schema change is expected. Any such need requires a separate approved design.

---

### Task 1: Establish the verified baseline

**Files:**
- Read: package-lock.json
- Read: src/data/cities/germany.json
- Read: src/lib/data.test.ts
- Read: src/components/dataset/DatasetOverviewMap.test.tsx
- Read: src/components/dataset/CityCompare.test.tsx

**Interfaces:**
- Consumes: ComparativeDataset, DatasetRow, validateDataset, and rowOverall.
- Produces: a recorded worktree baseline and working dependency/test environment.

- [ ] **Step 1: Preserve the user's worktree state**

Run:

    git status --short
    git diff -- src/data/cities/germany.json docs/germany-cities.md src/lib/data.test.ts

Expected: record existing changes; do not overwrite unrelated work. The added AGENTS.md and approved
spec remain untouched.

- [ ] **Step 2: Install locked dependencies if absent**

Run:

    npm ci

Expected: dependencies matching package-lock.json are installed. If restricted network access
blocks this, request approval rather than using another package manager.

- [ ] **Step 3: Run focused baseline tests**

Run:

    npm run test -- src/lib/schema.test.ts src/lib/data.test.ts src/lib/datasets.test.ts src/components/dataset/DatasetOverviewMap.test.tsx src/components/dataset/CityCompare.test.tsx src/components/dataset/CityCompareMap.test.tsx

Expected: all focused tests pass. If one fails, invoke superpowers:systematic-debugging and treat it
as pre-existing until proven otherwise.

---

### Task 2: Build the official eligibility register

**Files:**
- Create: docs/research/2026-07-21-berlin-commuter-cities-expansion.md
- Reference: docs/superpowers/specs/2026-07-21-berlin-commuter-cities-expansion-design.md

**Interfaces:**
- Consumes: the fixed candidate pool and four eligibility gates.
- Produces: the explicit eligible city set permitted into commute research.

- [ ] **Step 1: Create the research brief structure**

Create these exact sections:

    ## Method and source restrictions
    ## Eligibility register
    | Candidate | Proposed row id | Official Stadt evidence | Official population | Reference date | Independent urban functions | Decision | Reason |
    ## Exclusion appendix
    ## Commute audit
    ## Evidence matrices
    ## Calibration and proposed scores
    ## Source conflicts and limitations
    ## Approval record

Expected: no score or conclusion appears before its official evidence.

- [ ] **Step 2: Verify primary candidates**

Research Potsdam, Brandenburg an der Havel, Cottbus, Frankfurt (Oder), Oranienburg, Falkensee,
Bernau bei Berlin, Eberswalde, Königs Wusterhausen, and Fürstenwalde/Spree.

Use this hierarchy:

1. Amt für Statistik Berlin-Brandenburg population tables.
2. Official municipality portal.
3. Official Landkreis portal when it is the competent authority.

Record official title, exact population, reference date, publication/update date, access date, and
direct URL. Expected: every pass is officially a Stadt with population at least 40,000; failures
move to the exclusion appendix without exceptions.

- [ ] **Step 3: Verify independent urban function**

Collect official evidence for municipal administration, a rail station, local economic/employment
base, and healthcare/retail/education/local-transport services.

Expected: a concise pass/fail paragraph per city. A rail-connected dormitory without complete
urban-function evidence is excluded.

- [ ] **Step 4: Verify pre-identified exclusions efficiently**

Check Erkner, Teltow, Kleinmachnow, Hennigsdorf, Birkenwerder, Dallgow-Döberitz, Wildau,
Schönefeld, Blankenfelde-Mahlow, Rangsdorf, Ludwigsfelde, Nauen, Werder (Havel), Michendorf,
Beelitz, Zossen, Luckenwalde, Jüterbog, Bad Belzig, Lübben, Lübbenau, and Neuruppin.

Expected: each exclusion has a direct official citation and one-line reason; no eleven-factor work
is spent on an ineligible place.

- [ ] **Step 5: Adversarially review eligibility**

Check that no population is a district total, forecast, tourism count, or undated rounded figure.
Check that Frankfurt means Frankfurt (Oder).

Expected: the brief contains a locked eligibility list for Task 3.

---

### Task 3: Audit Berlin commuting

**Files:**
- Modify: docs/research/2026-07-21-berlin-commuter-cities-expansion.md

**Interfaces:**
- Consumes: the locked eligible city set.
- Produces: the cities allowed into full scoring research.

- [ ] **Step 1: Identify official rail corridors and hubs**

Use the current VBB map and official line pages to associate every city with RE/RB/S services and
Hbf/Friedrichstraße, Gesundbrunnen, Ostkreuz/Ostbahnhof, Südkreuz/Potsdamer Platz, Spandau, or
BER/Schöneweide as appropriate.

Expected: every corridor is cited; temporary construction is separated from normal service.

- [ ] **Step 2: Capture representative journeys**

For each city, query official VBB or Deutsche Bahn timetable information for weekday arrival around
08:30, weekday return around 18:00, late return around 22:30, and weekend daytime travel. Use one
consistent future non-holiday working week and state the dates.

Record fastest and typical duration, endpoints, transfers, peak frequency, first/last useful
service, and local centre-to-station leg.

Expected: no exceptional express is presented as the normal commute.

- [ ] **Step 3: Record resilience and fares**

Use VBB, DB, operator, and public-infrastructure notices for construction, alternative routes,
frequency, and VBB/Deutschlandticket applicability.

Expected: disruption exposure and lack of alternatives remain visible.

- [ ] **Step 4: Classify every commute**

Assign exactly one: Daily practical, Daily possible with trade-offs, Hybrid practical, or Weak
Berlin-commuter proposition.

Expected: weak propositions stop here; the remainder enters deep research.

- [ ] **Step 5: Cross-check commute claims**

Cross-check timetable results against the official network map and operator timetable. Prefer the
dated timetable when official materials conflict and record construction explanations.

Expected: each conclusion has two official evidence points when independent evidence exists.

---

### Task 4: Deeply research all eleven criteria

**Files:**
- Modify: docs/research/2026-07-21-berlin-commuter-cities-expansion.md
- Read: src/data/cities/germany.json
- Read: docs/germany-cities.md

**Interfaces:**
- Consumes: the deep-research city set and unchanged weights.
- Produces: complete evidence matrices and proposed JSON-shaped rows, plus refreshed Berlin and
  Potsdam matrices.

- [ ] **Step 1: Record existing calibration anchors**

For each criterion, record relevant Berlin, Potsdam, Leipzig, and nearest comparable city scores,
claims, and source quality. Existing scores are calibration anchors, not evidence.

- [ ] **Step 2: Research conv and anm by residence jurisdiction**

Use the competent Ausländerbehörde, Landkreis/city portal, Brandenburg ministry, federal statute,
BAMF, Make it in Germany, and Bundesagentur für Arbeit. Separate intake, appointment,
decision/employment authorisation, §81(4) residence continuation, §81(5a) full-time work
permission, and eAT production.

Expected: every city has publishedTime, timeScope, applicationChannel, workStart, confidence, asOf,
and unscored naturalisation. Unpublished timing is never high confidence.

- [ ] **Step 3: Research jobs, pt, and comp**

Use Bundesagentur für Arbeit job search/statistics, official labour reports, municipal
economic-development agencies, and official employer/business-location directories. Separate local
jobs from reachable Berlin jobs and account for travel burden.

Expected: no commercial job-board counts. Berlin opportunity benefits only jobs reachable by the
audited commute; comp reflects applicant pool and travel friction.

- [ ] **Step 4: Research rent and cost**

Use official Mietspiegel, municipal housing reports, Amt für Statistik Berlin-Brandenburg, Destatis,
and public housing providers. Separate existing-rent statistics from newcomer-accessible new-lease
evidence where official data permits.

Expected: missing new-lease evidence is disclosed; no commercial or crowd-sourced substitute.

- [ ] **Step 5: Research eng, safe, conn, and comm**

Use official municipal English/integration services; police crime, anti-discrimination,
constitutional-protection, and election publications; VBB/DB/airport sources; and official
integration/religious-community directories.

Expected: no fabricated diaspora precision. Berlin community access benefits comm only when the
commute makes it realistic.

- [ ] **Step 6: Write complete proposed rows in the brief**

For every candidate include id, label, sublabel, official location source, eleven scores, seven
context values, summary, pros, cons, links, immigration evidence, criterion rationales,
limitations, and proposed lastReviewed.

Expected: every score has adjacent reasoning and official citations.

- [ ] **Step 7: Re-audit Berlin and Potsdam**

Repeat the same official-source procedure rather than advancing dates.

Expected: every change has old-to-new reasoning; unchanged scores have current verification notes.

- [ ] **Step 8: Adversarial calibration review**

For each score, state why it might be too high and too low. Check jurisdiction leakage, duplicated
commute benefits, publication dates, decision versus card-printing time, city versus Landkreis
statistics, and population denominators.

Expected: source conflicts are recorded and the newest competent official source wins.

---

### Task 5: Obtain factual and score approval

**Files:**
- Read: docs/research/2026-07-21-berlin-commuter-cities-expansion.md

**Interfaces:**
- Consumes: completed evidence matrices.
- Produces: approved city ids, scores, narratives, and review date.

- [ ] **Step 1: Calculate proposed overalls without editing JSON**

Use:

    overall = sum(score multiplied by weight) divided by 100

Expected: show proposed overall to two decimals, absolute tier, comparison with Berlin/Potsdam, and
ranking impact. Do not store overalls.

- [ ] **Step 2: Present the approval packet**

Present additions, commute classes, eleven scores, derived overalls, confidence warnings,
Berlin/Potsdam changes, and exclusions.

Expected: individual scores can be challenged without reading raw JSON.

- [ ] **Step 3: Stop for explicit approval**

Expected: src/data/cities/germany.json remains unchanged until approval.

---

### Task 6: Add failing integrity and map tests

**Files:**
- Modify: src/lib/data.test.ts
- Modify: src/components/dataset/DatasetOverviewMap.test.tsx
- Modify: src/components/dataset/CityCompare.test.tsx
- Modify if needed: src/components/dataset/CityCompareMap.test.tsx

**Interfaces:**
- Consumes: exact approved ids from Task 5.
- Produces: regression coverage for complete rows, evidence, map locations, and comparison.

- [ ] **Step 1: Write a failing real-data integrity test**

Define approved ids explicitly. Assert the loaded dataset contains them, every row has all eleven
numeric score ids, scores are 0..100, ids are unique, each location has an HTTPS source, each row
has summary, links and immigration evidence, and review dates equal the approved audit date.

Core assertions:

    expect(cities.rows.map((row) => row.id)).toEqual(expect.arrayContaining(approvedIds));
    expect(Object.keys(row.values)).toEqual(expect.arrayContaining(scoreColumnIds));
    expect(scoreColumnIds.every((id) => typeof row.values[id] === "number")).toBe(true);
    expect(row.location?.sourceUrl).toMatch(/^https:\/\//);
    expect(row.detail?.summary).toEqual(expect.any(String));
    expect(row.detail?.links?.length).toBeGreaterThan(0);
    expect(row.detail?.immigration).toBeDefined();

- [ ] **Step 2: Verify the integrity test fails**

Run:

    npm run test -- src/lib/data.test.ts

Expected: FAIL because approved rows and refreshed review dates are absent.

- [ ] **Step 3: Add an overview-map source test**

Capture the MapLibre Source data in the existing mock, render the real Germany cities dataset, and
assert each approved row appears exactly once with id, label, and [lng, lat].

- [ ] **Step 4: Add a comparison availability test**

Render CityCompare, choose one new city against Berlin, and assert both names, overall comparison,
criterion rows, context facts, narrative, and two map locations.

- [ ] **Step 5: Verify focused component tests fail for missing data only**

Run:

    npm run test -- src/components/dataset/DatasetOverviewMap.test.tsx src/components/dataset/CityCompare.test.tsx src/components/dataset/CityCompareMap.test.tsx

Expected: new-city assertions fail; existing generic behavior remains green.

---

### Task 7: Apply approved data and map-backed expansion

**Files:**
- Modify: src/data/cities/germany.json

**Interfaces:**
- Consumes: approved JSON-shaped rows.
- Produces: rows consumed automatically by the table, overview map, and comparison.

- [ ] **Step 1: Add approved rows exactly once**

Add id, label, sublabel, location, values, and detail following existing order/style.

Expected: no overall; exactly eleven score values plus context columns supported by official
evidence.

- [ ] **Step 2: Refresh Berlin and Potsdam**

Apply only approved score, narrative, source, context, immigration, and review-date changes.

Expected: no date-only refresh and no uncited change.

- [ ] **Step 3: Update dataset-level provenance**

Update lastReviewed, methodology, caveats, and sources for the population gate, commute classes,
official-only policy, Berlin-job access treatment, and limitations.

- [ ] **Step 4: Validate JSON and data**

Run:

    jq empty src/data/cities/germany.json
    npm run test -- src/lib/schema.test.ts src/lib/data.test.ts

Expected: valid JSON and passing schema/data tests.

- [ ] **Step 5: Verify overview and comparison maps**

Run:

    npm run test -- src/components/dataset/DatasetOverviewMap.test.tsx src/components/dataset/CityCompare.test.tsx src/components/dataset/CityCompareMap.test.tsx

Expected: approved locations appear in map GeoJSON; a new city compares with Berlin; the two-marker
map fits both. No component edit should be necessary because maps are row-driven.

---

### Task 8: Synchronise documentation and rankings

**Files:**
- Modify: docs/germany-cities.md
- Modify: docs/research/2026-07-21-berlin-commuter-cities-expansion.md

**Interfaces:**
- Consumes: final JSON and rowOverall.
- Produces: documentation exactly mirroring source data.

- [ ] **Step 1: Compute final ranking through project logic**

Use rowOverall through the TypeScript environment; do not copy proposal overalls or calculate
manually.

Expected: deterministic descending ranking with values matching application formatting.

- [ ] **Step 2: Rewrite mirrored documentation**

Update city count, snapshot, ranking table, conversion table, recommendations, methodology,
caveats, audit log, official sources, and TSV block.

Expected: every score matches JSON; recommendations distinguish daily and hybrid commutes and do
not assign Berlin jurisdiction to Brandenburg residents.

- [ ] **Step 3: Finalise the research brief**

Record approvals, included/excluded ids, final scores, ranking, conflicts, limitations, and
deviations.

- [ ] **Step 4: Check for stale counts**

Run:

    rg -n "16 cities|audited, 16|Potsdam|Berlin" docs/germany-cities.md docs/research/2026-07-21-berlin-commuter-cities-expansion.md

Expected: no stale 16-city claim; Berlin and Potsdam text agrees with refreshed rows.

---

### Task 9: Complete quality gate and diff review

**Files:**
- Verify every file changed by Tasks 2 through 8.

**Interfaces:**
- Consumes: final research, data, tests, maps, and docs.
- Produces: verified uncommitted worktree ready for review.

- [ ] **Step 1: Decide whether score cache regeneration applies**

The city dataset does not feed src/data/cache/scoreboard.json. Run npm run cache:scores only if
country-category data or scoring logic changed outside this plan.

Expected: no unnecessary cache rewrite for city-only changes.

- [ ] **Step 2: Run the complete gate**

Run:

    npm run lint && npm run typecheck && npm run test && npm run build

Expected: all exit 0. Capture test counts and bundle warnings honestly.

- [ ] **Step 3: Audit provenance and invariants**

Check for stored overalls, non-official domains, duplicate ids, missing scores, and stale dates.
Inspect every changed summary, pro, con, link, and immigration field against the brief.

Expected: no uncited claim; all scores 0..100; all approved rows have locations; every exclusion is
accounted for.

- [ ] **Step 4: Review final diff**

Run:

    git status --short
    git diff --check
    git diff --stat
    git diff -- docs/research/2026-07-21-berlin-commuter-cities-expansion.md src/data/cities/germany.json src/lib/data.test.ts src/components/dataset/DatasetOverviewMap.test.tsx src/components/dataset/CityCompare.test.tsx src/components/dataset/CityCompareMap.test.tsx docs/germany-cities.md

Expected: only approved scope changed; no unrelated edits overwritten.

- [ ] **Step 5: Hand off without committing**

Report included/excluded cities, score movements, map verification, test/build results, evidence
limitations, and exact changed files. Ask separately whether the user wants staging or a commit.
