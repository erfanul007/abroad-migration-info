# Job-First Germany City Scoreboard — Reassessment Scratchpad

**Started:** 2026-07-21
**Scope:** all 23 city rows; experienced software engineer using either a Chancenkarte or a
student-visa route. No score is changed until it is supported by both the relevant primary evidence
and a second, independent corroborating source where available.

## Evidence policy

Official sources remain decisive for residence law, authority jurisdiction, population, police,
municipal rent indexes, and BA employment/pay series. This pass additionally uses job portals and
labour-market analytics only as a secondary, time-stamped market signal:

- **Stepstone:** current platform result counts and platform-derived salary ranges. Results include
  mixed contract types and may change daily; they are never treated as an official vacancy total,
  a visa-sponsorship count, or a city-wide labour-market census.
- **kununu:** user-reported salary observations; used only to check whether its broad city ordering
  agrees with BA/Stepstone, not as an authoritative pay figure.
- **Cross-check rule:** a portal claim must agree directionally with BA statistics, the BA
  Entgeltatlas, or a city/region economic source before it can influence a score. Where sources
  differ by occupation definition, geography, time or methodology, retain the existing conservative
  score and record the conflict.

## Sources collected

| Area | Primary / official evidence | Independent portal or analytics corroboration | Limitation |
|---|---|---|---|
| German experienced-software pay | BA [Entgeltatlas, software-development experts, 2025](https://web.arbeitsagentur.de/entgeltatlas/tabelle?alter=1&branche=1&dkz=15260&geschlecht=1): national median €6,301/month; Berlin €6,913; Brandenburg €5,694. | [Stepstone Software Developer, national/city comparison](https://www.stepstone.de/gehalt/Software-Developer.html) and [kununu Softwareentwickler:in 2026](https://www.kununu.com/de/gehalt/softwareentwickler-in-15019). | BA uses a high-complexity occupation and social-insurance pay; portals use their own title/search and salary methodologies. They validate ordering, not identical amounts. |
| Berlin jobs | BA’s [April 2026 regional report](https://www.arbeitsagentur.de/vor-ort/datei/arbeitsmarktbericht_april_2026_ba271557.pdf) records city-wide registered vacancies, not software or sponsorship. | [Stepstone Berlin Software Developer](https://www.stepstone.de/gehalt/Software-Developer/city/Berlin.html) showed 2,271 platform results when accessed; the page also includes internships, working-student, part-time and full-time roles. | Current platform result count is not stored as a score input. |
| Munich jobs | BA Entgeltatlas gives a high Bavarian expert-software pay proxy. | [Stepstone Munich Software Developer](https://www.stepstone.de/gehalt/Software-Developer/city/Muenchen.html) showed 1,793 platform results when accessed. | Same title/contract-mix limitation; no city-level BA software series captured yet. |
| Hamburg jobs | BA Entgeltatlas reports Hamburg expert-software median €6,329/month. | [Stepstone Hamburg Software Developer](https://www.stepstone.de/gehalt/Software-Developer/city/Hamburg.html) showed 1,592 platform results; [kununu Hamburg](https://www.kununu.com/de/gehalt/stadt/hamburg/softwareentwickler-in-15019) reports 2,226 submitted salary observations. | Salary measures differ materially, so they are directional corroboration only. |
| Stuttgart jobs | BA Entgeltatlas reports Baden-Württemberg expert-software median €6,602/month. | [Stepstone Stuttgart Software Developer](https://www.stepstone.de/gehalt/Software-Developer/city/Stuttgart.html) showed 1,182 platform results. | City count is platform-specific; pay is state proxy. |
| Brandenburg commuter cities | BA [Berlin-Brandenburg April 2026 report](https://www.arbeitsagentur.de/vor-ort/datei/arbeitsmarktbericht_april_2026_ba271557.pdf) gives city/district all-occupation vacancies and unemployment: Brandenburg an der Havel 792 vacancies, Cottbus 874, Frankfurt (Oder) 431, Potsdam 1,685, Barnim 1,253, and Dahme-Spreewald 1,643. | The portal sources have not produced a comparable, stable city-by-city software series for these small cities. | City and district series must not be compared as if they had the same geography; do not infer local software sponsorship or English demand from all-occupation totals. Berlin commute remains separate evidence. |

## Initial interpretation — no score changes yet

1. The BA and portal/analytics evidence consistently supports keeping Berlin, Munich, Hamburg and
   Stuttgart among the strongest job/deep-pay markets for the target profile. It does not prove the
   same order for visa sponsorship or English-only roles.
2. BA’s €6,913 Berlin versus €5,694 Brandenburg expert-software medians confirms that a new
   `scale-pay` score must distinguish Berlin from commuter-city regional proxies. It does **not**
   support a precise city salary for any Brandenburg commuter city.
3. The existing commuter-city jobs scores already reflect their weaker local markets and reliance
   on reachable Berlin work. No existing score is changed on this evidence alone.

## Portal observations retained for calibration

These are deliberately recorded as observations, not durable dataset facts. They use closely
matching search labels where possible, but the portal itself warns that result sets include mixed
contract types; location radii and adverts can change between access times.

| City | Stepstone signal at access | Cross-check status | Use in reassessment |
|---|---|---|---|
| Berlin | 2,271 `Software Developer` results; its page also shows internships, working-student, part-time and full-time roles. | BA expert-software pay is €6,913/month for Berlin; both sources support a top-tier market, but measure different things. | Supports retaining a high jobs/scale-pay anchor, not a portal-count score. |
| Munich | 1,793 `Software Developer` results. | BA Bavarian expert-software pay proxy is €6,804/month. | Supports retaining a top-tier market; do not compare raw result count to another title page. |
| Hamburg | 1,592 `Software Developer` results. | BA expert-software median €6,329/month; kununu reports 2,226 salary observations and a €62,200 average for the broad title. | Supports a strong jobs/scale-pay market, subject to housing trade-off. |
| Stuttgart | 1,182 `Software Developer` results and €59,500 portal average. | BA Baden-Württemberg expert-software median €6,602/month. | Supports a high scale-pay score; city job depth remains separate from the state pay proxy. |
| Frankfurt am Main | 1,345 `Software-Entwickler/in` results and €51,200 portal average. | BA Hesse expert-software median is €6,364/month (from the same Entgeltatlas table). | Supports strong finance/enterprise depth and scale pay, but language/sponsorship still require separate review. |
| Darmstadt | 1,141 `Software Developer` results within the portal’s city/radius search. | Must be cross-checked against the Frankfurt/Rhine-Main official labour/economic geography before any jobs change. | Evidence is promising but not sufficient for a change. |
| Karlsruhe | 516 `Software Developer` results within the portal’s city/radius search. | Must be cross-checked against the Karlsruhe official labour/economic geography. | Evidence is promising but not sufficient for a change. |
| Cologne | 1,372 `Software Developer` results within the portal’s city/radius search. | Requires NRW official labour/economic cross-check. | Do not lower or raise current jobs score yet. |
| Düsseldorf | 1,389 `Software Developer` results and €53,900 portal average. | Requires NRW official labour/economic cross-check. | Supports a strong regional-market hypothesis only. |
| Dortmund | 704 `Software Entwickler` results; portal reports 413 part-time results under that query. | Requires Ruhr/NRW official labour cross-check and cannot be directly compared with `Software Developer`. | Useful for part-time hypothesis, insufficient for a score change. |
| Leipzig | 511 `Software Developer` results; portal reports 179 part-time results. | Requires Saxony official labour cross-check. | Indicates genuine activity but not an English/sponsorship signal. |
| Dresden | 495 `Software Developer` results; another `Software Entwicklung` query returned 1,382, demonstrating title-query sensitivity. | Requires Saxony official labour cross-check. | Do not use raw portal count for ranking. |

**Portal URLs:** [Berlin](https://www.stepstone.de/gehalt/Software-Developer/city/Berlin.html),
[Munich](https://www.stepstone.de/gehalt/Software-Developer/city/Muenchen.html),
[Hamburg](https://www.stepstone.de/gehalt/Software-Developer/city/Hamburg.html),
[Stuttgart](https://www.stepstone.de/gehalt/Software-Developer/city/Stuttgart.html),
[Frankfurt](https://www.stepstone.de/gehalt/Software-Entwickler-in/city/Frankfurt-am-Main.html),
[Darmstadt](https://www.stepstone.de/jobs/software-developer/in-darmstadt),
[Karlsruhe](https://www.stepstone.de/jobs/software-developer/in-karlsruhe),
[Cologne](https://www.stepstone.de/jobs/software-developer/in-k%C3%B6ln),
[Düsseldorf](https://www.stepstone.de/gehalt/Software-Developer/city/Duesseldorf.html),
[Dortmund](https://www.stepstone.de/jobs/software-entwickler/in-dortmund),
[Leipzig](https://www.stepstone.de/jobs/software-developer/in-leipzig), and
[Dresden](https://www.stepstone.de/jobs/software-developer/in-dresden). All accessed 21 July 2026.

## Official labour cross-checks added

- **Karlsruhe:** BA Karlsruhe-Rastatt reported 4.4% agency-area unemployment in April 2026, but
  also weaker hiring dynamics. This corroborates a comparatively resilient market, not an
  unconditional jobs-score increase. Source: [BA Karlsruhe-Rastatt](https://www.arbeitsagentur.de/vor-ort/karlsruhe-rastatt/presse/2026-18-fruhjahrsbelebung-fallt-im-april-praktisch-aus).
- **Nuremberg:** BA’s April report records 5,002 open jobs, 400,140 social-insurance employees,
  and 6.3% unemployment in the agency district. This is a robust regional-scale signal, but not a
  city-only software-sponsorship measure. Source: [BA Nuremberg April report](https://www.arbeitsagentur.de/vor-ort/datei/arbeitsmarktbericht-april-2026_ba271987.pdf).
- **Leipzig:** BA reports 296,635 social-insurance employees (30 June 2025) and a monthly April
  2026 report; the local report records 5,362 registered vacancies. This supports meaningful
  market scale alongside the portal signal. Sources: [BA Leipzig statistics](https://www.arbeitsagentur.de/vor-ort/leipzig/statistik) and [April report](https://www.arbeitsagentur.de/vor-ort/datei/leipzig_arbeitsmarktreport_arbeitsmarktreport_2026_ba272102.pdf).
- **Dortmund:** BA reported 12.3% unemployment and 4,037 registered vacancies in April 2026, with
  demand falling and most reported roles outside software. This prevents a portal-driven uplift.
  Source: [BA Dortmund April report](https://www.arbeitsagentur.de/vor-ort/dortmund/presse/2026-19-dortmunder-arbeits-und-ausbildungsmarkt-im-april-2026).
- **Cologne:** BA reported a difficult market despite a large employment base: 56,786 unemployed
  and 630,496 social-insurance employees in the agency district in April 2026. Portal visibility
  can support breadth but not a score change without a target-role analysis. Source:
  [BA Cologne April report](https://www.arbeitsagentur.de/vor-ort/koeln/presse/2026-13-fruhjahrsbelebung-bleibt-aus).
- **Düsseldorf:** BA’s April 2026 archive reports an 8.2% city unemployment rate and rising
  reported openings. That is insufficient to overturn the existing ranking until the same
  occupation/sponsorship test is applied. Source: [BA Düsseldorf press archive](https://www.arbeitsagentur.de/vor-ort/duesseldorf/presse/presse-archiv).

## Decision log

The approved job-first restructuring has now been applied. Existing scores were retained unless
the evidence contradicted them; the new `scale-pay` dimension is the only newly introduced score.

## `scale-pay` calibration applied

`scale-pay` uses a conservative 0–100 expert judgement: 60% official expert-software pay proxy,
25% local/metro employment scale, and 15% independent urban scale or audited Berlin access. BA
state values are not misrepresented as city salaries. Portal data checks the direction only.

| Group | Cities and applied score | Basis |
|---|---|---|
| Top national software markets | Munich 92; Berlin 90; Stuttgart 88; Frankfurt 84; Hamburg 83 | BA expert-software pay proxy plus large city market; Stepstone/kununu corroborate broad opportunity and pay ordering. |
| Strong regional markets | Karlsruhe 82; Nuremberg 82; Darmstadt 82; Düsseldorf 78; Cologne 75; Potsdam 75; Hannover 72; Aachen 70; Dortmund 68 | BA regional pay and employment data plus city/metro scale; portal signals only confirm relative market activity. |
| Mid-scale lower-pay markets | Leipzig 62; Dresden 63 | Saxon city scale and portal activity are offset by lower state pay proxy and smaller international hiring depth. |
| Brandenburg commuter cities | Cottbus 50; Brandenburg an der Havel 48; Frankfurt (Oder) 48; Oranienburg 50; Falkensee 52; Bernau 52; Eberswalde 48 | Brandenburg BA expert-pay proxy is €5,694/month. Population, local BA evidence and audited Berlin access differentiate cities modestly; no city salary is claimed. |

No stored overall was added. The recalculated rankings are generated from the declared 11 weights.

## Next research blocks

- Recheck job depth and salary for Karlsruhe, Nuremberg, Frankfurt am Main, Darmstadt, Düsseldorf,
  Cologne, Dortmund, Hannover, Leipzig and Dresden using a matching portal query plus BA/local
  economic evidence.
- Audit the existing `rentM2` and `salary` contextual claims. Remove rather than retain any claim
  that cannot be supported by its underlying source.
- Complete the new `scale-pay` score calibration after every city has a documented official pay
  proxy and city/metro scale source; then run the data-contract TDD cycle before changing JSON.
