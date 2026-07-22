# German Universities — CS Subject Rankings (EduRank)

**Purpose:** German counterpart to the Italian university shortlist. The application
also layers current English-taught programme fit, intake, application-window, fee,
portal and international-student context over these ranks for Tanima's CSE/software
background. Those admissions facts live in `src/data/universities/germany.json` and
must be checked against the linked official programme page for the chosen intake.

**Source:** [EduRank.org](https://edurank.org) — a citation-based ranking aggregator
(built on a graph of research papers and citations). Each cell is the university's
**global / world rank** in that subject (lower = better; `#1` is the world's top).
**Not** a national government source — see *Caveats*.

**Snapshot date (reviewed):** 2026-07-14
**Scope:** Top 20 German universities, ordered by **Computer Science (CSE)** world rank
(the primary column, matching the Italian sheet's leading column).

> July 2026 suitability correction: LMU's former Data Science degree was discontinued,
> but its current English M.Sc. Statistics and Data Science passes the active shortlist
> rules subject to quantitative prerequisite matching. Charité has no qualifying
> English computing-centred master's and is excluded from the active dataset.

> The active application dataset is the independently audited 56-university census.
> The nationwide ceiling is EduRank overall rank `<= 1000`; a documented regional
> exception permits `<= 3200` for qualifying-programme campuses in any city already
> listed in the German city scoreboard. Every row must still offer a current on-campus,
> computing-centred degree completable in English, accept foreign credentials, and
> charge non-EU tuition `<= €5000` per semester. See the 22 July research scratchpads.

> The app table additionally exposes EduRank's 2026 overall world rank and a numeric
> non-EU tuition-per-semester column. `€0` means no tuition was identified under the
> current policy; it does not include semester contributions or application fees.
> Expanded rows list suitable international intake months and published or recurring
> application dates through calendar 2027 only. Dates that universities have not yet
> published are labelled as such rather than inferred from an older cycle.

## Column legend

| Code | Subject | EduRank page (Germany) |
|------|---------|------------------------|
| CSE | Computer Science | https://edurank.org/cs/de/ |
| AI | Artificial Intelligence | https://edurank.org/cs/ai/de/ |
| ML | Machine Learning | https://edurank.org/cs/machine-learning/de/ |
| DS | Data Science | https://edurank.org/cs/data-science/de/ |
| SWE | Software Engineering | https://edurank.org/cs/software-engineering/de/ |

All figures are **world ranks** as displayed on the pages above on the snapshot date.

## Rankings

| Universities | City | CSE | AI | ML | DS | SWE |
|--------------|------|----:|---:|---:|---:|----:|
| Technical University of Munich (TUM) | Munich | 71 | 54 | 81 | 89 | 17 |
| Heidelberg University | Heidelberg | 80 | 155 | 164 | 151 | 341 |
| University of Munich (LMU) | Munich | 116 | 135 | 127 | 178 | 163 |
| RWTH Aachen University | Aachen | 131 | 88 | 123 | 169 | 35 |
| University of Hamburg | Hamburg | 155 | 195 | 198 | 258 | 164 |
| University of Freiburg | Freiburg im Breisgau | 161 | 120 | 155 | 306 | 237 |
| Karlsruhe Institute of Technology (KIT) | Karlsruhe | 173 | 118 | 229 | 142 | 44 |
| University of Erlangen–Nuremberg (FAU) | Erlangen | 181 | 209 | 287 | 364 | 178 |
| University of Tübingen | Tübingen | 188 | 221 | 300 | 288 | 339 |
| University of Bonn | Bonn | 204 | 213 | 265 | 295 | 452 |
| Goethe University Frankfurt | Frankfurt | 228 | 403 | 359 | 418 | 531 |
| University of Göttingen | Göttingen | 229 | 418 | 420 | 473 | 198 |
| Technical University of Berlin (TU Berlin) | Berlin | 240 | 183 | 208 | 241 | 96 |
| Dresden University of Technology (TU Dresden) | Dresden | 250 | 253 | 431 | 233 | 140 |
| Darmstadt University of Technology (TU Darmstadt) | Darmstadt | 251 | 177 | 312 | 305 | 67 |
| Charité – Medical University of Berlin* | Berlin | 264 | 613 | 505 | 396 | 1219 |
| Ruhr University Bochum | Bochum | 271 | 295 | 407 | 521 | 291 |
| University of Stuttgart | Stuttgart | 273 | 193 | 341 | 194 | 66 |
| Free University of Berlin (FU Berlin) | Berlin | 274 | 306 | 396 | 286 | 446 |
| Humboldt University of Berlin | Berlin | 301 | 330 | 291 | 268 | 355 |

\* Charité is a medical university, not a general/technical CS school. EduRank still
ranks it in these subjects (medical informatics / bioinformatics output), so it is kept
for source fidelity rather than silently dropped. If you want an all-general-university
list, drop Charité and the next row in is **Heinrich Heine University of Düsseldorf**
(CSE #305).

## Caveats & provenance notes

- **What the numbers mean:** global world rank per subject, lower is better. They are
  *ordinal positions*, not scores — a gap of 10 ranks is not a fixed quality gap.
- **Source type:** EduRank is a bibliometric aggregator, not an official government or
  accreditation body. Treat it as one indicator, not ground truth. It is, however, the
  same source as the Italian list, so cross-country comparison within these tables is
  consistent.
- **Currency vs the Italian sheet:** EduRank updates over time. On 2026-07-13 the current
  Italy Computer Science page shows Politecnico di Milano **#159**, Bologna **#122**,
  Sapienza **#110** — versus **154 / 120 / 112** on the supplied Italian sheet. The
  Italian data is therefore a slightly older EduRank snapshot. To keep both tables
  strictly comparable, re-scrape Italy at the same snapshot date.
- **Ordering:** rows are sorted by CSE world rank. Sorting by a different column (e.g.
  SWE) would reorder the list materially — e.g. TU Munich #17, RWTH Aachen #35, KIT #44
  lead on Software Engineering.
- **No missing cells:** all 20 CSE-top universities are also ranked in AI, ML, DS and SWE,
  so every cell is a real figure from the source — none inferred or fabricated.

## Sources (all EduRank.org, reviewed 2026-07-13)

- Computer Science — Germany: https://edurank.org/cs/de/
- Artificial Intelligence — Germany: https://edurank.org/cs/ai/de/
- Machine Learning — Germany: https://edurank.org/cs/machine-learning/de/
- Data Science — Germany: https://edurank.org/cs/data-science/de/
- Software Engineering — Germany: https://edurank.org/cs/software-engineering/de/

## Compare-map campus locations (reviewed 2026-07-14)

The university Compare map uses stored campus coordinates rather than runtime geocoding.
Each pin was resolved in OpenStreetMap from the institution or faculty's published campus
name/address, and the exact OSM node, way or relation is retained as `location.sourceUrl`
in `src/data/universities/germany.json`.

For institutions with more than one campus, the pin represents the campus associated with
the principal shortlisted English CS-related programme: TUM uses Garching; FAU uses the
Technical Faculty in Erlangen; TH Köln uses Südstadt for Data and Information Science;
Humboldt uses Adlershof; FU Berlin uses Dahlem; and Potsdam/HPI uses Griebnitzsee. The
campus label is shown in the map summary and popup so the pin is not presented as covering
every programme location.

The 23 July city-coverage reconciliation added Frankfurt UAS, University of Cologne,
TH Köln and Leipzig University. TH Köln represents only Data and Information Science at
Südstadt; Leipzig represents the specialised Earth System Data Science and Remote Sensing
programme and therefore carries a strict domain-credit warning. Six listed cities have no
qualifying local institution under the same rules: Brandenburg an der Havel, Frankfurt
(Oder), Oranienburg, Falkensee, Bernau bei Berlin and Eberswalde. They remain in the city
scoreboard because city/job/commuting suitability is independent of local university supply.

## Copy-paste block (TSV → Google Sheets)

Select everything inside the block below and paste directly into a Google Sheet — the
tab separators auto-split it into rows and columns (no "Split text to columns" needed).

```
Universities	City	CSE	AI	ML	DS	SWE
Technical University of Munich (TUM)	Munich	71	54	81	89	17
Heidelberg University	Heidelberg	80	155	164	151	341
University of Munich (LMU)	Munich	116	135	127	178	163
RWTH Aachen University	Aachen	131	88	123	169	35
University of Hamburg	Hamburg	155	195	198	258	164
University of Freiburg	Freiburg im Breisgau	161	120	155	306	237
Karlsruhe Institute of Technology (KIT)	Karlsruhe	173	118	229	142	44
University of Erlangen–Nuremberg (FAU)	Erlangen	181	209	287	364	178
University of Tübingen	Tübingen	188	221	300	288	339
University of Bonn	Bonn	204	213	265	295	452
Goethe University Frankfurt	Frankfurt	228	403	359	418	531
University of Göttingen	Göttingen	229	418	420	473	198
Technical University of Berlin (TU Berlin)	Berlin	240	183	208	241	96
Dresden University of Technology (TU Dresden)	Dresden	250	253	431	233	140
Darmstadt University of Technology (TU Darmstadt)	Darmstadt	251	177	312	305	67
Charité – Medical University of Berlin	Berlin	264	613	505	396	1219
Ruhr University Bochum	Bochum	271	295	407	521	291
University of Stuttgart	Stuttgart	273	193	341	194	66
Free University of Berlin (FU Berlin)	Berlin	274	306	396	286	446
Humboldt University of Berlin	Berlin	301	330	291	268	355
```
