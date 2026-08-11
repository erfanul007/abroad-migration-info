# German university gap closure — 11 August 2026

Decision ledger for the candidates carried over from the prior German university audit. Every
programme, fee, deadline, admission and campus fact below was re-researched from official sources
in this session; nothing was carried over from the earlier draft rows, whose link URLs were invented
and are not reused here.

Gates applied (see `.claude/skills/auditing-university-candidates`): (1) EduRank overall world rank
≤1,000 nationwide or ≤3,200 in a city listed in `src/data/cities/germany.json`; (2) a current,
on-campus, computing-centred degree completable entirely in English with no German certificate
required for admission; (3) admits a foreign (Bangladeshi) CSE bachelor; (4) non-EU tuition
≤€5,000 per semester; (5) official programme, admission, fee, campus and rank evidence.

## Passes — added to `src/data/universities/germany.json`

### TUHH — Hamburg University of Technology (`tuhh`)

PASS on the M.Sc. Data Science. Hamburg is a listed city, so the ≤3,200 exception applies to the
EduRank 2026 overall rank of #1,057; the programme is English with no German requirement, carries no
tuition (€400.00 semester contribution for Winter 2026/27), and admits a foreign bachelor with a
strong computer-science and mathematics background. Application is direct in the TUHH portal — no
uni-assist, no handling fee — and APS is required only for Chinese, Indian and Vietnamese degrees.

Open question resolved as instructed: the M.Sc. Computer Science is **not** claimed. Its admission
page frames qualifying bachelors in terms of German universities and TUHH publishes only the
1 June – 15 July window for it, with no non-EU equivalent, so foreign-credential eligibility there is
unresolved. The row is qualified on Data Science alone and says so.

Deadline conflict recorded in the row: the international-programmes page gives 1 December – 1 February
for the international master's programmes (Winter 2026/27), while the university's dates page states
the deadline for international master's courses "expires on March 1". Winter 2027 dates are unpublished.

### HAW Hamburg — Hamburg University of Applied Sciences (`haw-hamburg`)

PASS only on the M.Sc. Information and Communications Engineering — 100% English, English B2, no
German requirement, both intakes, €0 tuition, €397.00 semester contribution, uni-assist VPD then
myHAW (€75.00 first course of study). EduRank 2026 overall #1,622 under the Hamburg listed-city
exception. Same basis as the existing Stuttgart INFOTECH row: adjacent discipline, computing method core.

FAIL confirmed on the flagship M.Sc. Computer Science: language of instruction German, and
"International applicants are required to demonstrate proficiency in the German language at level C1".

Caveat carried into the row: the subject profile is communications and electrical engineering
(ANSI C, signal and system theory, Matlab/Simulink), and a 180-credit-point bachelor must earn 30
additional credit points within the first two semesters.

### FH Dortmund — Dortmund University of Applied Sciences and Arts (`fh-dortmund`)

PASS on two programmes: M.Eng. Embedded Systems Engineering and M.Sc. Digital Transformation. Both
are 100% English with no German requirement, €0 tuition, €346.80 per semester, and accept a CS,
electrical-engineering or IT bachelor of ≥180 ECTS at grade 2.5 or better. Winter intake only.
Application is a mandatory pre-check at precheck.go-study-europe.de followed by a direct application
in portal.fh-dortmund.de; uni-assist applies only to the MA International Management, so no handling
fee arises.

Rank question resolved: the row uses EduRank's **2026** edition figure, **#2,866**; the 2025 edition
showed #3,035. Both clear the ≤3,200 Dortmund listed-city ceiling; the row records which year was used.
EduRank publishes no Data Science topic rank for this institution.

Deadline conflict recorded in the row: the central dates page gives 1 March – 15 June for the
English-language master's programmes for non-EU applicants (matching DAAD), while both programme pages
state early April – 15 June. Both close on 15 June.

Language check beyond the summary line: the Embedded Systems Engineering module handbook lists every
compulsory module as "Englisch"; the single German item is an elective research seminar with an
alternative elective module, so the degree stays English-completable.

## Fails — not added

- **HKA Karlsruhe** (#3,070, rank-eligible under the Karlsruhe listed-city exception). FAIL on gate 2.
  Its own list of fully English degree programmes contains one bachelor and three masters — Geomatics,
  Sensor Systems Technology, Tricontinental Master in Global Studies — none computing-centred. The
  M.Sc. Computer Science sits under "study in German" with language of instruction German. Sensor
  Systems Technology is sensor and electrical engineering, admits on electronics, instrumentation and
  automation profiles rather than a CS bachelor, and additionally charges non-EU students €1,500 per
  semester with a summer-only intake; it is not a computing degree for this profile.
- **Hochschule München**. Not re-opened; the prior confirmed FAIL stands per the brief.

## Unresolved

- **FH Aachen** (#1,318, would be rank-eligible under the Aachen listed-city exception, and would
  clear it nationwide only if the nationwide gate applied, which it does not at #1,318). The M.Sc.
  Information Systems is reported to be completable entirely in English with a Data Science
  specialisation, but every official host — `www.fh-aachen.de` on both the English and German paths,
  and the university's OPUS document repository — returns a Cloudflare bot-protection 403 to automated
  fetches, and there is no DAAD International Programmes entry for the programme (the DAAD
  "International Information Systems" record is FAU Erlangen-Nürnberg; DAAD's "Master of Science in
  Information Systems" record is Passau). No language, admission, fee or deadline claim could be taken
  to source standard, so no row was added. This is the best remaining lead; it needs a human or a
  browser session that can pass the interstitial.

## Sweep coverage

This session was scoped to the candidates named in the brief. Axis coverage: prior audit findings
re-verified (TUHH, HAW Hamburg, FH Dortmund, FH Aachen, HKA) and one prior FAIL re-confirmed via its
current catalogue (HAW Hamburg Computer Science). A fresh nationwide ≤1,000 sweep and a fresh
≤3,200 sweep of every listed city were **not** run here.

## Dataset changes

- Three rows added to `src/data/universities/germany.json`; their evidence links appended to the
  dataset `sources` list; dataset `lastReviewed` set to 2026-08-11.
- The dataset `subtitle` said "top-3,200 Berlin-region exception", which contradicted `methodology`
  and the existing Frankfurt UAS, TH Köln and Leipzig rows. Corrected to the listed-city wording.
- `src/lib/data.test.ts`: row count and Public-tag count 56 → 59, and both rank-exception allowlists
  extended with `tuhh`, `haw-hamburg` and `fh-dortmund`. No researched rank was altered.
