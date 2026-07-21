# Berlin-Commutable German Cities Expansion Design

**Date:** 2026-07-21
**Status:** Approved design, pending written-spec review
**Scope:** Candidate discovery and evidence plan only; no city scores or production data change in this phase

## 1. Objective

Expand the German cities scoreboard with substantial, officially recognised cities from which a
resident could commute to Berlin regularly. Preserve the existing Chancenkarte-to-EU-Blue-Card
decision lens, the existing eleven scoring criteria and weights, and the Bangladeshi software
engineer profile.

The expansion must avoid filling the scoreboard with small suburbs or station settlements. A
candidate must first pass an official city-size and urban-function gate, then a Berlin-commute
gate, before it is eligible for deep scoring research.

## 2. Non-goals

- Do not add every municipality on the Berlin S-Bahn or regional-rail network.
- Do not change the existing city criteria, weights, score scale, or runtime overall formula.
- Do not treat proximity to Berlin as proof of a practical commute.
- Do not use blogs, forums, commercial aggregators, Wikipedia, crowd-sourced cost databases, or
  SEO immigration sites as evidence.
- Do not edit `src/data/cities/germany.json` until the evidence matrix has been completed and
  reviewed.
- Do not reframe this work as a general ranking of Brandenburg municipalities. The question is
  whether a substantial city is a credible base for the stated Berlin-employment pathway.

## 3. Candidate eligibility gate

A candidate proceeds to commute screening only when all four conditions are met.

### 3.1 Official city status

The place must be officially designated a `Stadt`. Verify this using the municipality's official
portal, an official Landkreis portal, or Amt für Statistik Berlin-Brandenburg. Marketing labels,
postal conventions, and third-party place databases are insufficient.

### 3.2 Population floor

The latest official population must be at least 40,000 residents. Use the most recent published
reference date available from Amt für Statistik Berlin-Brandenburg or the municipality's official
statistics office. Record both the value and reference date.

A population below 40,000 is an exclusion, not a discretionary borderline case. This prevents
small commuter towns from entering merely because they have a convenient station.

### 3.3 Independent urban function

The city must function as more than a Berlin dormitory settlement. Official evidence must show
all of the following:

- its own municipal administration;
- a regional or S-Bahn rail station serving the city;
- an identifiable local employment or economic base; and
- ordinary urban services such as healthcare, retail, education, and local public transport.

The evidence need not prove that the local economy alone suits the applicant. It establishes that
the candidate is a genuine city and a viable place to live independently of Berlin.

### 3.4 Credible Berlin commute

The city must offer a repeatable public-transport journey to at least one major Berlin employment
hub. Direct trains and sensible transfers are both allowed. The assessment is deliberately broad:
longer journeys may qualify as hybrid-commute options when frequency and reliability support that
use.

Target hubs are:

- Berlin Hauptbahnhof/Friedrichstraße;
- Gesundbrunnen;
- Ostkreuz/Ostbahnhof;
- Südkreuz/Potsdamer Platz;
- Spandau; and
- BER/Schöneweide when relevant to the employment corridor.

## 4. Initial candidate set

The research starts with the following cities. Inclusion here means "verify", not "add".

### 4.1 Existing benchmark

- Potsdam

Potsdam remains in the dataset and must be re-audited to the same evidence date as new candidates.
It anchors the interpretation of a large, independent city with strong Berlin connectivity.

### 4.2 Primary candidates

- Brandenburg an der Havel
- Cottbus
- Frankfurt (Oder)
- Oranienburg
- Falkensee
- Bernau bei Berlin
- Eberswalde
- Königs Wusterhausen

### 4.3 Population-borderline verification candidate

- Fürstenwalde/Spree

Fürstenwalde proceeds only if the latest official population meets the fixed 40,000 threshold. It
must not receive a discretionary exception.

### 4.4 Exclusion appendix

The research brief will record why the following discovered options did not pass the city-size
gate: Erkner, Teltow, Kleinmachnow, Hennigsdorf, Birkenwerder, Dallgow-Döberitz, Wildau,
Schönefeld, Blankenfelde-Mahlow, Rangsdorf, Ludwigsfelde, Nauen, Werder (Havel), Michendorf,
Beelitz, Zossen, Luckenwalde, Jüterbog, Bad Belzig, Lübben, Lübbenau, and Neuruppin.

Each exclusion needs only official status and population evidence. Do not spend time scoring an
ineligible place.

## 5. Research process

### Phase A: Eligibility verification

Create a candidate register containing:

- canonical city name and stable proposed JSON row id;
- official `Stadt` evidence;
- official population, reference date, and source;
- official evidence of independent urban function;
- pass/fail decision for each gate; and
- a concise inclusion or exclusion rationale.

Only passing candidates continue.

### Phase B: Commute audit

For each passing city, capture representative weekday journeys to every relevant Berlin hub, not
only the single fastest advertised journey. Record:

- fastest and typical peak journey time;
- station-to-station endpoints;
- direct or connecting service;
- number and location of transfers;
- scheduled peak frequency;
- useful first and last services;
- evening and weekend frequency;
- local city-centre-to-station access;
- alternative route during a disruption;
- current long-running construction or timetable constraints;
- VBB/Deutschlandticket applicability; and
- timetable/evidence reference date.

Classify the result as one of:

- **Daily practical:** credible for a conventional multi-day office schedule.
- **Daily possible with trade-offs:** repeatable, but duration, transfers, or disruption exposure
  materially increase burden.
- **Hybrid practical:** credible for occasional office attendance, not a strong five-day commute.
- **Weak Berlin-commuter proposition:** retained in the research record but excluded from deep
  scoring.

The classification supplements the existing criteria; it does not become a twelfth score column.

### Phase C: Official-source evidence matrix

Deeply research every city that passes Phases A and B. Use the existing eleven score columns and
weights without modification:

| Criterion | ID | Weight |
|---|---|---:|
| Chancenkarte to Blue Card conversion | `conv` | 22 |
| Mid-level job market and sponsors | `jobs` | 18 |
| City registration (Anmeldung) | `anm` | 12 |
| Part-time/any-field jobs | `pt` | 10 |
| Housing and rent affordability | `rent` | 6 |
| English usability | `eng` | 7 |
| Safety and xenophobia climate | `safe` | 7 |
| Competition/individual odds | `comp` | 6 |
| Cost of living | `cost` | 5 |
| Connectivity and facilities | `conn` | 4 |
| Bangladeshi/Muslim community and halal access | `comm` | 3 |

For each criterion, the evidence matrix must contain:

- the proposed score;
- the existing rubric or comparable-city anchor used;
- official facts supporting the score;
- at least two independent authoritative sources when two genuinely independent official sources
  exist;
- source title, URL, publication/update date, and access date;
- a short adversarial check explaining what could make the score too high or too low; and
- an evidence limitation when official data is incomplete.

No score may be copied from a nearby city. Shared Landkreis jurisdiction may support common
immigration-authority evidence, but each city's housing, transport, safety, community, and labour
conditions remain independently assessed.

### Phase D: Calibration and selection

Before changing JSON:

1. Recalculate existing Berlin and Potsdam evidence on the same review date.
2. Compare proposed candidates against Berlin, Potsdam, Leipzig, and other relevant existing
   anchors criterion by criterion.
3. Check that the commute benefit is expressed only through appropriate criteria, primarily
   `jobs`, `comp`, and `conn`.
4. Confirm that living outside Berlin uses the resident city's responsible registration and
   foreigners-authority jurisdictions. Berlin's administrative score must not leak into a
   Brandenburg city.
5. Remove candidates whose evidence shows no distinct decision value relative to a stronger city
   on the same corridor.
6. Present the final additions, exclusions, proposed scores, and ranking effects for approval.

## 6. Source policy

Only official or primary public-sector sources are admissible.

### 6.1 Transport

- Verkehrsverbund Berlin-Brandenburg (VBB)
- Deutsche Bahn and DB Regio
- ODEG and other contracted public-transport operators
- official municipal transport operators
- Berlin and Brandenburg transport ministries and infrastructure programmes

### 6.2 Immigration and administration

- federal statutes at `gesetze-im-internet.de`
- BAMF
- Make it in Germany
- Bundesagentur für Arbeit
- Brandenburg state ministries
- official city, Landkreis, and Ausländerbehörde portals

### 6.3 Population, labour, housing, cost, safety, and community

- Amt für Statistik Berlin-Brandenburg and Destatis
- Bundesagentur für Arbeit statistics and its official job portal
- official municipal statistics, economic-development, housing, and Mietspiegel publications
- municipal or publicly owned housing organisations when no citywide official rent publication
  exists
- official police crime statistics
- federal/state constitutional-protection and anti-discrimination reports
- official integration, religious-community, mosque, and municipal service directories

### 6.4 Evidence gaps

Absence of official evidence is not evidence of a good outcome. When a criterion cannot be
supported precisely:

- record the gap explicitly;
- prefer a cautious score bounded by comparable official evidence;
- lower confidence in the narrative;
- avoid precise timing, rent, vacancy, diaspora, or job-volume claims; and
- do not substitute a prohibited secondary source.

The repository's mandatory `deep-research` workflow remains an execution prerequisite. If that
skill is unavailable during implementation, pause before data editing unless the user explicitly
approves an equivalent official-source research workflow.

## 7. Data and UI impact

The intended production change is data-only:

- modify `src/data/cities/germany.json` with approved rows and refreshed Berlin/Potsdam evidence;
- update `docs/germany-cities.md` to mirror the authoritative JSON;
- add a dated research brief under `docs/research/` containing the eligibility register, commute
  audit, evidence matrix, exclusions, conflicts, and calibration notes.

The existing generic schema, runtime `rowOverall`, table, map, and two-city comparison should
render additional rows without component changes. Any discovered need for schema or UI changes is
out of scope and requires a separate approved design.

## 8. Validation and acceptance

The expansion is acceptable only when:

- every added place passes all four eligibility gates;
- every added place is supported exclusively by official sources;
- every added row has all eleven existing numeric score values;
- the eleven weights remain unchanged and sum to 100;
- row `detail`, `links`, `immigration`, location provenance, and review dates meet the existing
  data standard;
- no runtime `overall` is stored in JSON;
- Berlin and Potsdam have been rechecked to the same evidence date;
- `docs/germany-cities.md` matches runtime-derived rankings;
- the exclusion appendix accounts for all discovered but rejected candidates;
- `npm run cache:scores` is run if any country/scoring data covered by the cache changes;
- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` all pass; and
- the user approves the final evidence matrix and proposed scores before production data is edited.

## 9. Expected deliverables

1. Official-source eligibility register.
2. Berlin commute audit for every eligible city.
3. Eleven-criterion evidence and scoring matrix for every deep-research candidate.
4. Explicit exclusion appendix.
5. Calibration comparison against Berlin, Potsdam, and relevant existing cities.
6. Approval-ready proposed additions and ranking impact.
7. Only after approval, updated Germany city JSON and mirrored documentation.
