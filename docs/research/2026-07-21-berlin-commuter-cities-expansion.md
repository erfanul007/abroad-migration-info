# Berlin-Commutable Cities Expansion — Scratchpad

**Started:** 2026-07-21
**Execution mode:** Current worktree and branch authorised by user; no commits, staging, or pushes.
**Source rule:** Official or primary public-sector sources only. Commercial, crowd-sourced, blog,
forum, Wikipedia, and SEO sources are excluded.
**Data-edit gate:** No score, factual JSON, map-data, or documentation claim changes until the
evidence matrix and proposed scores are complete and explicitly approved.

## Progress ledger

| Time | Task | Status | Finding / next action |
|---|---|---|---|
| 2026-07-21 | Setup | Complete | Current checkout on main authorised; staged files preserved; no git commit permitted. |
| 2026-07-21 | Baseline | Complete | Network-enabled locked install completed after sandbox DNS failure. Focused suite: 6 files, 76 tests passed. |
| 2026-07-21 | Eligibility | Complete | Eight cities, including existing Potsdam, pass official Stadt/city status, >=40,000 residents, and independent-urban-function screening. |
| 2026-07-21 | Commute | Complete (corridor level) | Official VBB line/frequency and temporary-works audit complete. Exact door-to-door times are deliberately not inferred from line maps; city classification is limited to daily-practical / hybrid-practical. |
| 2026-07-21 | Deep evidence | Complete | Official immigration, registration, labour, housing and integration evidence is recorded; city-specific evidence gaps remain explicit. |
| 2026-07-21 | Approval gate | Complete | User authorised publication and end-to-end execution without a separate score-approval pause. |
| 2026-07-21 | Implementation | Complete | Seven rows, documentation, generated score cache and data-driven map/comparison availability updated; no component changes were needed. |
| 2026-07-21 | Verification | Complete | `npm run cache:scores`, lint (0 errors; 6 pre-existing warnings), typecheck, 180 tests and production build succeeded. |
| 2026-07-21 | Official-source refresh | Complete | Re-checked the population gate against Amt für Statistik Berlin-Brandenburg’s 2025 municipality release and the transport classification against current VBB RE1, RE2, RB24/RE3 network material. The published figures and corridor classifications used for the seven additions remain supported; temporary 2026 construction notices remain caveats, not permanent score inputs. |
| 2026-07-21 | Fresh quality gate | Complete | `npm run lint && npm run typecheck && npm run test && npm run build`: lint finished with 0 errors and 6 pre-existing warnings; type-check passed; 33 files / 181 tests passed; production build passed with the existing >500 kB chunk-size warnings. No score, city row, or ranking was changed in this audit. |
| 2026-07-21 | Deep-research closure | Complete | Added a city-by-city criterion cross-check from current Federal Employment Agency, VBB, municipal and federal-law sources. Residual gaps are documented as unavailable official statistics, not inferred scores. |

## Candidate register

| Candidate | Official Stadt evidence | Official population + reference date | Independent urban function | Eligibility decision | Notes |
|---|---|---|---|---|---|
| Potsdam | Kreisfreie Stadt | 185,137, 31 Dec 2025 | Existing capital-city administration, services and rail hub | Pass | Existing row. |
| Brandenburg an der Havel | Kreisfreie Stadt | 73,945, 31 Dec 2025 | City reports regional rail hub, local transport, two higher-education institutions and broad education/culture service base | Pass | New candidate. |
| Cottbus | Kreisfreie Stadt | 95,140, 31 Dec 2025 | City administration, Welcome Center, public transport planning and stated science/economic function | Pass | New candidate. |
| Frankfurt (Oder) | Kreisfreie Stadt | 56,586, 31 Dec 2025 | City administration and regional public-service/education centre; detail evidence retained for full matrix | Pass | New candidate. |
| Oranienburg | Stadt | 49,824, 31 Dec 2025 | Municipal administration, local bus/rail network, and city-documented industrial/employment clusters | Pass | New candidate. |
| Falkensee | Stadt | 46,213, 31 Dec 2025 | Amtsfreie city administration, three rail stops, municipal housing company, schools and local business zones | Pass | New candidate. |
| Bernau bei Berlin | Stadt | 44,706, 31 Dec 2025 | Municipal administration, S-Bahn/regional rail and Barnim regional services; detail evidence retained for full matrix | Pass | New candidate. |
| Eberswalde | Stadt | 41,867, 31 Dec 2025 | Barnim county seat/Mittelzentrum, local trolleybuses, rail, university and municipal economic-development function | Pass | New candidate. |
| Königs Wusterhausen | Stadt | 39,590, 31 Dec 2025 | Not assessed further | Exclude | 410 below fixed threshold. |
| Fürstenwalde/Spree | Stadt | 31,981, 31 Dec 2025 | Not assessed further | Exclude | Below fixed threshold. |

**Population/source:** Amt für Statistik Berlin-Brandenburg, *Bevölkerungsentwicklung und Flächen
der kreisfreien Städte, Landkreise und Gemeinden im Land Brandenburg 2025 — Basis Zensus 2022*,
published June 2026; population reference date 31 December 2025. The report’s municipal labels are
the authoritative city-status evidence. Direct PDF: https://download.statistik-berlin-brandenburg.de/722c93f3928e984f/b897b3745f7d/SB_A01-04_00_2025j01_BB.pdf

**Independent-function cross-checks:** City of Brandenburg's 2025 city statistics and transport
pages; City of Cottbus economic-development and administration pages; City of Oranienburg's
economic and transport pages; City of Falkensee's structural, transport and economic pages; City
of Eberswalde's city-information and economic-development pages. Frankfurt (Oder) and Bernau are
included on the basis of their municipal status plus city/transport/education evidence to be
completed in the criterion matrix; no criterion score is implied by this screening finding.

## Exclusion appendix

Record official status/population evidence for discovered municipalities and cities below the threshold.
No deep scoring occurs for an excluded place.

### Confirmed exclusions from the rail discovery pool

- **Below 40,000 despite Stadt status:** Königs Wusterhausen (39,590), Fürstenwalde/Spree
  (31,981), Ludwigsfelde (29,635), Hennigsdorf (26,602), Zossen (21,558), Luckenwalde (21,077),
  Nauen (19,854), Lübben (Spreewald) (13,992), Jüterbog (12,961), Erkner (11,523).
- **Not formally Stadt and/or below 40,000:** Blankenfelde-Mahlow (29,280; not Stadt),
  Schönefeld (19,351; not Stadt), Rangsdorf (11,768; not Stadt), Dallgow-Döberitz (10,860; not
  Stadt), Birkenwerder (7,958; not Stadt).
- **Below 40,000 in the remaining discovery set:** Neuruppin, Stadt (31,962); Teltow, Stadt
  (27,682); Werder (Havel), Stadt (27,065); Kleinmachnow (19,274; not Stadt); Lübbenau/Spreewald,
  Stadt (15,778); Beelitz, Stadt (13,879); Michendorf (13,708; not Stadt); Bad Belzig, Stadt
  (11,118); and Wildau, Stadt (10,717).

All figures above are the 31 December 2025 municipal counts in the same official annual
municipality report cited for the register. Formal `Stadt` labels are transcribed where that
publication supplies them; municipality status otherwise independently fails the city-status gate.
No excluded place was scored.

## Commute audit

To be completed only for eligibility-pass cities. Record a normal weekday arrival, evening return,
late return, weekend service, frequency, transfer count, construction exposure, alternative routes,
and VBB/Deutschlandticket applicability.

### Initial official corridor findings (screening only)

| City | Normal-service corridor | Preliminary commute class | Temporary 2026 caveat | Official evidence |
|---|---|---|---|---|
| Potsdam | RE1 and RB23; up to 3 RE1/hour in weekday peaks, 2/hour day/weekend, hourly late; VBB also states 4/hour Potsdam–Ostbahnhof with RB23 in weekday peaks. | Daily practical | Stadtbahn closure through 12 December 2026 cuts RE1 at Charlottenburg; central/east hubs need S-Bahn onward. | VBB RE1; VBB Stadtbahn works |
| Brandenburg an der Havel | RE1 direct corridor. | Daily practical with longer travel burden | Same temporary RE1 cut-back at Charlottenburg. | VBB RE1; VBB Stadtbahn works |
| Fürstenwalde/Spree | RE1 direct corridor. | Daily practical | During works it remains direct to Ostbahnhof/Ostkreuz, but Hbf/western hubs need S-Bahn onward. | VBB RE1; VBB Stadtbahn works |
| Frankfurt (Oder) | RE1 direct corridor. | Daily possible with trade-offs; strong hybrid | Same temporary eastern RE1 split. | VBB RE1; VBB Stadtbahn works |
| Cottbus | RE2 direct; selected RE20 extensions. VBB describes the Berlin journey as about 90 minutes. | Hybrid practical | RE2 is temporarily diverted via Gesundbrunnen, Ostkreuz and Schöneweide during Stadtbahn works. | VBB RE2; VBB BER/RE20 information; VBB Stadtbahn works |
| Falkensee | RE2 and RB14. | Daily practical | RB14 is temporarily cut back to Charlottenburg; RE2 is diverted away from Stadtbahn. | VBB RE2; VBB Stadtbahn works |
| Oranienburg | RE5, RB32 and S1. | Daily practical | Do not rely on temporary RE85 diversion service that ended April 2026. | VBB RE5; VBB RB32/BER information; VBB S1 profile |
| Bernau bei Berlin | RE3, RB24 and S2. | Daily practical | Journey-specific works still need checking. | VBB RE3; VBB RB24; VBB S2 profile |
| Eberswalde | RE3 and RB24. | Daily practical, lower resilience than Bernau | Journey-specific works still need checking. | VBB RE3; VBB RB24; VBB RB24 timetable |
| Königs Wusterhausen | RE20, RE2 and RB22. RE20 is daily hourly around 04:00–21:00 through Hbf, Potsdamer Platz, Südkreuz and BER. | Daily practical | Stadtbahn closure does not remove RE20's north–south route. | VBB BER/RE20 information; VBB RB22; VBB Stadtbahn works |

**Evidence interpretation:** These are published route and frequency facts, not final door-to-door
commute claims. The full audit must query dated weekday/weekend journeys and local station access.
The current 14 June–12 December 2026 Stadtbahn closure is explicitly treated as temporary rather
than normal service.

## Evidence matrix

To be completed only after eligibility and commute screening. The eleven existing columns and weights
are immutable: jobs 22, conv 18, anm 12, pt 10, eng 7, safe 7, rent 6, comp 6, cost 5, conn 4,
comm 3.

### Official-source inventory — eastern/outer cities (not yet scores)

| City | Immigration and registration | Labour/housing | Key conclusion and evidence gap |
|---|---|---|---|
| Brandenburg an der Havel | City Ausländerbehörde uses appointment/contact-form service; city registration requires action within two weeks, but no wait is published. | BA March 2026: 9.0% unemployment and 802 registered social-insurance vacancies; city published Mietspiegel 2026. | Direct RE1 is a meaningful commute asset, but no official city-specific software/English/sponsor count or Blue Card decision time exists. |
| Cottbus | City Ausländerbehörde has appointment/e-mail channels; city office is primarily appointment-based and directs users elsewhere if no slot is visible six weeks ahead. | BA March 2026 reports 5,292 vacancies across the wider agency district; city administration states lower regional wages/SME capacity can make Blue Card salary and English hiring harder. Qualified Mietspiegel 2024 remains operative while a 2026 survey runs. | Treat as hybrid Berlin commute; do not treat student service as proof of general English usability or derive a local Blue Card processing time. |
| Frankfurt (Oder) | Municipal Ausländerbehörde exists at Marktplatz 1, but no dedicated Blue Card channel/timing located. Registration is required within two weeks; Bürgerbüro has appointment and walk-in periods. | BA March 2026: 10.0% unemployment and 423 registered social-insurance vacancies. Qualified Mietspiegel 2026 values are net cold comparable rents as at 1 Sep 2025. | Direct RE1 supports a hybrid/trade-off Berlin proposition; official sources do not establish software sponsorship, available housing, English-job depth or city-specific anti-Muslim evidence. |

**Key eastern sources:**

- Brandenburg an der Havel Ausländerbehörde: https://www.stadt-brandenburg.de/struktur/auslaenderbehoerde
- Brandenburg an der Havel Anmeldung: https://service.stadt-brandenburg.de/dienstleistungen/-/egov-bis-detail/dienstleistung/4832/show
- Brandenburg an der Havel Mietspiegel: https://www.stadt-brandenburg.de/mietspiegel
- Cottbus Ausländerbehörde: https://cottbus.de/verwaltung/gb-3/dz-3-1/fb-33-buergerservice/auslaenderbehoerde/
- Cottbus registration service: https://cottbus.de/verwaltung/gb-3/dz-3-1/fb-33-buergerservice/stadtbuero/
- Cottbus Mietspiegel: https://cottbus.de/verwaltung/gb-3/dz-3-1/fb-33-buergerservice/mietspiegel-2024-der-kreisfreien-stadt-cottbus-chosebuz/
- Frankfurt (Oder) municipal office directory: https://www.frankfurt-oder.de/Verwaltung-Stadtpolitik/Verwaltung/%C3%84mterverzeichnis/index.php?KatID=1.100&La=1&ModID=9&NavID=2616.16&TypSel=1.100&k_sub=1&kat=1.100&kuo=1&object=tx%7C4071.1.1&ofs_1=25&sfort=1
- Frankfurt (Oder) Mietspiegel: https://www.frankfurt-oder.de/Verwaltung-Politik/Verwaltung/Stadtentwicklung/Wohnen-in-Frankfurt-Oder-/Mietspiegel/

### Final criterion cross-check — official evidence only

The following closes the expansion-specific evidence pass. It deliberately does not manufacture
city-level figures where the competent public source only publishes a district or agency-region
series. All entries were accessed 21 July 2026.

| City | Jobs, part-time work and competition | Conversion and registration | Housing, cost, connectivity, English, safety and community | Scoring conclusion |
|---|---|---|---|---|
| Brandenburg an der Havel | BA April 2026 records 792 registered social-insurance vacancies in the city; this is materially below Potsdam’s 1,685. The source is all occupations, not software sponsorship. | City authority and registration services are published; no initial EU Blue Card service level is published. Federal §81 remains the work-authorisation baseline. | Municipal Mietspiegel and local VBB network exist; RE1 is frequent but long. No official English-software, anti-Muslim, or Bangladeshi count was found. | Retain a conservative lower jobs/English/community score and a higher affordability/connectivity score; no change justified. |
| Cottbus | BA’s April regional report shows 5,265 vacancies in the agency district and identifies broad non-software occupations; it does not establish software sponsorship in the city. | City channels are published, but neither initial conversion time nor full-time-authorisation time is published. | Qualified municipal Mietspiegel and city transport are published; VBB states RE2 reaches Berlin in about 90 minutes. No official count supports a larger English or Bangladeshi/Muslim score. | Retain hybrid-commute, low-cost calibration; no change justified. |
| Frankfurt (Oder) | BA’s April city series records 431 registered social-insurance vacancies and a weak regional recovery; neither is a software-vacancy count. | City authority/registration channels are published; no specialised Blue Card decision SLA was located. | Qualified municipal Mietspiegel and RE1 corridor are published. Border-city services do not prove English-first employment or community depth. | Retain a low jobs score, strong affordability score, and hybrid-commute interpretation. |
| Oranienburg | The competent BA office is local, but public evidence does not isolate experienced software demand; Berlin access is therefore not treated as local demand. | Oberhavel publishes the migration service and Blue Card form, not an initial-decision time; Oranienburg publishes registration rules. | RE5/RB32/S1 provide several official rail corridors. No official current newcomer-rent, English-job, safety, or community count was found. | Retain cautious mid-range administrative/connectivity scores and low evidence confidence. |
| Falkensee | Havelland regional labour evidence cannot be equated with city-specific software hiring; the daily Berlin corridor supplies access, not a local labour-market claim. | The responsible authority is Havelland, not the Bürgeramt; its published form includes the EU Blue Card but no decision time. | VBB and city sources support rail access. The city says it has no Mietspiegel, so affordability stays deliberately weak; no official city community count exists. | Retain the strongest western access but cautious housing/conversion scores. |
| Bernau bei Berlin | BA April 2026 reports 4.1% unemployment in the Bernau business-office area, versus 9.1% in Eberswalde; this supports a relative, not software-specific, job advantage. | Barnim is the responsible authority in Eberswalde. Its published 6–8 week reference concerns extensions, not an initial conversion. | S2/RE3/RB24 offer independent official corridors. Barnim integration contacts exist, but no official city English-job or Bangladeshi/Muslim count exists. | Retain the highest new daily-commute/jobs/connectivity position; do not infer a fast conversion. |
| Eberswalde | BA April 2026 reports 9.1% unemployment in Eberswalde and 1,253 Barnim vacancies, below Bernau’s relative local position; neither figure measures software roles. | Barnim authority is in Eberswalde and publishes residence services, not an initial EU Blue Card SLA. | University/trolleybus and RE3/RB24 support an independent-city and connectivity assessment. Barnim accommodation guidance supports relative affordability only; no official current newcomer-rent or community count exists. | Retain a low local-jobs/English/community score, high affordability, and below-Bernau commute resilience. |

**Cross-check sources:** Federal Employment Agency, [Berlin-Brandenburg April 2026 labour-market
report](https://www.arbeitsagentur.de/vor-ort/datei/arbeitsmarktbericht_april_2026_ba271557.pdf);
[Cottbus April 2026 report](https://www.arbeitsagentur.de/vor-ort/cottbus/presse/2026-9-arbeits-und-ausbildungsmarkt-im-april-2026);
[Eberswalde April 2026 report](https://www.arbeitsagentur.de/vor-ort/eberswalde/presse/2026-19-der-arbeitsmarkt-im-april-2026);
[Potsdam April 2026 report](https://www.arbeitsagentur.de/vor-ort/potsdam/presse/2026-7-der-arbeits-und-ausbildungsmarkt-in-der-region-potsdam-im-april-2026);
and [BA Entgeltatlas, software-development experts, 2025](https://web.arbeitsagentur.de/entgeltatlas/tabelle?alter=1&branche=1&dkz=15260&geschlecht=1).
The Entgeltatlas gives a state-level median of €6,913/month in Berlin and €5,694 in Brandenburg;
it is a state proxy, not a city salary or a new score input in this unchanged expansion model.

**Completion decision:** The expansion research is complete to the permitted official-source
standard. Remaining evidence gaps are structural publication gaps, not incomplete searches: no
official source located publishes city-level experienced-software sponsor volume, English-language
vacancy volume, initial Opportunity-Card-to-Blue-Card service levels, newcomer housing availability,
or Bangladeshi/Muslim population counts for these seven cities. Scores remain conservative and no
score was revised solely to create false precision.
- BA March 2026 city labour report: https://www.arbeitsagentur.de/vor-ort/datei/arbeitsmarktbericht_maerz_2026_ba269107.pdf
- VBB RE1: https://www.vbb.de/unterwegs-im-vbb/regionalbahnlinien/re1/
- VBB RE2: https://www.vbb.de/unterwegs-im-vbb/regionalbahnlinien/re2/

## Sources, conflicts, and limitations

- The mandatory deep-research skill is unavailable in this session. Fallback: official-source-only
  searches, two independent authoritative sources per claim where available, and explicit
  conflict/limitation logging.
- **Population reconciliation:** municipal registration counts can differ from the state annual
  census-based population progression. For eligibility, the fixed rule uses the latest Amt für
  Statistik Berlin-Brandenburg annual municipal report, not a municipal register count. Examples:
  Oranienburg reported 50,068 residents in its local register on 3 April 2025, and Falkensee
  reported 46,906 on 7 November 2025, while the state annual figures at 31 December 2025 are
  49,824 and 46,213 respectively. This is a source-method difference, not a reason to mix counts.
- **Housing evidence gap:** Falkensee confirms it has no Mietspiegel; Eberswalde's city service
  page confirms its 2016 Mietspiegel remains published while a 2026 municipal review addresses an
  update. These facts support caution, not a current newcomer-rent number. Oranienburg links a
  2017 Mietspiegel and major landlords. All later rent scoring requires current official evidence
  or an explicit limitation.
- **Jurisdiction screen:** Brandenburg's official service guidance states that a resident of a
  kreisangehörige city/municipality uses the Landkreis Ausländerbehörde, while a resident of a
  kreisfreie city uses the city administration. This keeps Berlin administration out of the scores
  for Brandenburg commuter cities. Barnim's Ausländerbehörde explicitly handles Blue Card EU
  applications in Eberswalde; Oberhavel's application form explicitly includes issue/extension of
  a Blue Card EU in Oranienburg; Dahme-Spreewald confirms a specialist-migration office and
  Welcome Center in Königs Wusterhausen but that city fails the population gate.

## Conservative scoring proposal — published 2026-07-21; recalculated 2026-07-21

This is an expert-synthesis proposal only, **not a data change**. It preserves the live eleven
criteria and their weights. Where an official source does not publish a city-specific measure
(notably English-language software vacancies, newcomer housing availability, and Bangladeshi or
Muslim population), the proposed score is deliberately modest and the gap must remain visible in
the eventual row note. It must not be converted into an invented statistic.

| City | Jobs | Conv | Anm | PT | Eng | Safe | Rent | Comp | Cost | Conn | Comm | Derived overall | Consultant interpretation |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Brandenburg an der Havel | 40 | 52 | 60 | 52 | 32 | 45 | 72 | 62 | 78 | 64 | 32 | 51.4 | Direct RE1 makes a Berlin job feasible; local market and English/community depth are materially thinner than Potsdam. |
| Cottbus | 46 | 50 | 50 | 54 | 36 | 42 | 86 | 60 | 84 | 52 | 38 | 52.2 | Low-cost, institutionally meaningful regional city; VBB's c.90-minute Berlin trip makes this a hybrid, not routine-daily, proposition. |
| Frankfurt (Oder) | 38 | 50 | 58 | 48 | 38 | 40 | 88 | 64 | 84 | 60 | 44 | 51.6 | Very affordable direct-RE1 option, but the small local labour market and state-border location create clear employment and service trade-offs. |
| Oranienburg | 46 | 55 | 60 | 56 | 38 | 48 | 66 | 60 | 68 | 68 | 34 | 53.5 | Most balanced northern commuter option: several rail modes and local services, but county-level immigration administration and limited English evidence. |
| Falkensee | 48 | 50 | 60 | 56 | 50 | 50 | 42 | 54 | 54 | 76 | 42 | 52.1 | Best western Berlin access after Potsdam, but no municipal rent index and an Ausl\u00e4nderbeh\u00f6rde outside the city prevent an optimistic score. |
| Bernau bei Berlin | 50 | 54 | 58 | 55 | 48 | 50 | 60 | 58 | 64 | 78 | 38 | 54.6 | Strongest new daily-commute candidate: S2 plus RE3/RB24; Barnim administration is shared with Eberswalde and publishes only an extension-time indication. |
| Eberswalde | 42 | 54 | 60 | 48 | 32 | 44 | 82 | 64 | 80 | 66 | 28 | 52.5 | Cheap regional centre with university and two rail corridors; lower English/community depth and longer, less resilient commute than Bernau. |

**Benchmark (same underlying scores; recalculated weights):** Potsdam is 61.4 overall. Its
current evidence requires a refresh because it predates this expansion, but no proposed score
change is justified by this candidate-screening work alone.

### Score rationale and source boundaries

- **Conv / Anmeldung:** scoring follows only the stated authority channel, appointment design and
  published duration. None of the seven authorities publishes a city-specific initial Blue Card
  decision time. Barnim's 6–8-week statement applies to an extension service, not a new
  Chancenkarte conversion, so it supports a modest channel score rather than a promised outcome.
- **Jobs / PT / Comp / English:** BA city or county vacancy/unemployment information establishes
  market scale only; it does not disclose sponsored .NET/Python/AI vacancies or English-language
  counts. Scores therefore favour the Berlin-accessible places, but stay below Potsdam/Berlin.
- **Rent / cost:** a qualified/current municipal Mietspiegel supports Brandenburg an der Havel,
  Cottbus and Frankfurt (Oder). The Barnim accommodation-guideline values are a public,
  administrative affordability reference, not advertised-market rents; they support relative
  caution for Bernau/Eberswalde. Falkensee, Oranienburg and Eberswalde have no current municipal
  Mietspiegel suitable for a precise new-lease figure.
- **Safe / Comm:** Brandenburg-wide police/election evidence cannot establish an individual-city
  anti-Muslim experience. No official municipality-level Bangladeshi/Muslim counts were located.
  Scores therefore avoid a claim of a documented local diaspora and retain a Brandenburg-wide
  far-right-risk discount. Berlin access is treated as a facility, not as a local community.

**Additional primary sources used in this completion pass:**

- Bundesagentur f\u00fcr Arbeit, regional monthly reports index (2026): https://www.arbeitsagentur.de/vor-ort/rd-bb/statistik/arbeitsmarktberichte-2026
- Landkreis Barnim, accommodation-cost guideline, updated 12 March 2025 and valid from 1 April
  2025 (contains separate Bernau/Eberswalde reference values): https://www.barnim.de/fileadmin/barnim_upload/00_Bereich_Landrat/Kreisrecht/5_Soziales_Jugend_und_Gesundheit/50_Soziales/50-40_KdU_2025.pdf
- Landkreis Barnim Ausl\u00e4nderbeh\u00f6rde: https://www.barnim.de/sicherheit-ordnung/auslaenderangelegenheiten/aufenthalt-aufenthaltserlaubnis
- Landkreis Oberhavel service point, Oranienburg: https://www.oberhavel.de/B%C3%BCrgerservice/Kontakt/Kontaktdetails/Servicepunkt-Migration.php?FID=2244.7303.1&KatID=1.100&La=1&ModID=9&NavID=2244.3345&alpha=S&object=tx%2C2244.6907.1&ort=Oranienburg
