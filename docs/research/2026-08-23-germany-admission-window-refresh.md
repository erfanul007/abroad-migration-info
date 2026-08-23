# Germany admission-window refresh — research findings

Batch-by-batch re-verification of `src/data/universities/germany.json` admission-status rows against current (2026-08-23) official sources. Dataset was last verified 2026-08-11.

## B1

### heidelberg

DACS's own official window matches the dataset exactly (Aug 1–Sep 15 2026 for Summer 2027, Feb 1–Mar 15 2027 for Winter 2027/28, same for German/international per the university's central key-dates table) and is currently open, but the row's second listed programme, M.Sc. Scientific Computing, runs on a materially different window (broad official window Oct 1 2026–Mar 31 2027 for Summer 2027 / Apr 1–Sep 30 2027 for Winter 2027/28) with non-EU-specific *recommended* earlier deadlines (15 Nov 2026 and 15 Jun 2027 respectively) that the current one-size-fits-all sentence doesn't capture, and as of today Scientific Computing's Summer-2027 window hasn't opened yet (opens 1 Oct 2026).

```json
{
  "id": "heidelberg",
  "currentTagsInDataset": ["Open now", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Open now",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Open now for M.Sc. Data and Computer Science — Summer 2027: 1 August – 15 September 2026; Winter 2027/28: 1 February – 15 March 2027 (the university's published master's table applies the same dates to German and international nationals). M.Sc. Scientific Computing runs a separate, wider window: Summer 2027 applications open 1 October 2026 (recommended non-EU deadline 15 November 2026, final 1 January 2027; EU/German deadlines later, up to 1 March 2027); Winter 2027/28 applications open 1 April 2027 (recommended non-EU deadline 15 June 2027, final 31 July 2027). As of 23 August 2026, Scientific Computing's next window has not opened yet — only DACS is open now.",
  "verifiedSemesterFee": "€189.80 per semester (current Heidelberg University semester fee, per the university's own semester-fees page)",
  "sources": [
    {"title": "Application deadlines for the 1st semester of the Master's degree programmes - Heidelberg University", "url": "https://www.uni-heidelberg.de/en/study/management-of-studies/key-dates-deadlines/application-deadlines-for-the-1st-semester-of-the-masters-degree-programmes"},
    {"title": "Computer Science - Informatik Uni Heidelberg (DACS application page)", "url": "https://www.informatik.uni-heidelberg.de/studium/master/dacs/application?lang=en"},
    {"title": "Application & Admission - International Master Scientific Computing", "url": "https://mastersc.iwr.uni-heidelberg.de/application-admission"},
    {"title": "How to Apply - Scientific Computing - Heidelberg University", "url": "https://mastersc.iwr.uni-heidelberg.de/application-admission/how-to-apply"},
    {"title": "Study \"Scientific Computing\" (Master) in Germany - Heidelberg University - DAAD (cross-check only)", "url": "https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/detail/heidelberg-university-scientific-computing-w28686/?hec-id=w28686"},
    {"title": "Semester Fees - Heidelberg University", "url": "https://www.uni-heidelberg.de/en/study/management-of-studies/semester-fees"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "DACS's window/status is confirmed unchanged and still open now, but the row's applicationWindow text incorrectly implies Scientific Computing shares the same dates and nationality-neutral treatment — Scientific Computing has its own later-opening window with non-EU-specific recommended deadlines, worth splitting out in the applied edit; also refined the semester fee to the precise current €189.80 figure."
}
```

### lmu

Confirmed unchanged: the Department of Statistics' own page and LMU's central International Office deadlines page both corroborate the recorded pattern — Summer semester portal opens 2 October (department deadline 15 November, International Office deadline 15 January), Winter semester portal opens 1 April (department deadline 15 May, International Office deadline 15 July). As of 23 August 2026 the Summer-2027 portal has not opened yet (opens 2 Oct 2026).

```json
{
  "id": "lmu",
  "currentTagsInDataset": ["Opens Oct ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Oct ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · portal opens 2 October 2026, programme deadline 15 November 2026, International Office deadline 15 January 2027; Winter 2027/28 · portal opens 1 April 2027, programme deadline 15 May 2027, International Office deadline 15 July 2027",
  "sources": [
    {"title": "Interested Master - Department of Statistics - LMU Munich", "url": "https://www.stat.lmu.de/en/studies/interested-master/"},
    {"title": "Dates and deadlines - LMU Munich", "url": "https://www.lmu.de/en/study/degree-students/dates-and-deadlines/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Both the department page and LMU's central International Office deadlines page confirm the recorded portal-open, programme-deadline, and International-Office-deadline dates verbatim; no change."
}
```

### tum

Confirmed unchanged: TUM's own programme page (cit.tum.de) states the standard windows — Wintersemester 1 Feb–31 May, Sommersemester 1 Oct–30 Nov — with a recommended earlier visa-applicant deadline, matching the recorded text (Winter 2026/27 closed, Summer 2027 window 1 Oct–30 Nov 2026, Winter 2027/28 window 1 Feb–31 May 2027). As of 23 August 2026 the Summer-2027 window has not opened yet.

```json
{
  "id": "tum",
  "currentTagsInDataset": ["Opens Oct ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Oct ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Winter 2026/27 closed · 1 February–31 May 2026; Summer 2027 · 1 October–30 November 2026; Winter 2027/28 · 1 February–31 May 2027",
  "sources": [
    {"title": "Master Informatics: Games Engineering - TUM School of Computation, Information and Technology", "url": "https://www.cit.tum.de/en/cit/studies/degree-programs/master-informatics-games-engineering/"},
    {"title": "Dates, Periods and Deadlines - TUM", "url": "https://www.tum.de/en/studies/application/application-info-portal/dates-periods-and-deadlines"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "TUM's own CIT school programme page confirms the exact recorded date ranges (1 Feb–31 May winter; 1 Oct–30 Nov summer) with no changes; the central TUM dates page defers to programme-level pages, consistent with this."
}
```

### hamburg

Confirmed unchanged: the University of Hamburg's central campuscenter deadlines page corroborates the programme page's implication — international/IAS-style master's programmes run 15 February–31 March for winter semester with no distinction between German and international applicants, and the programme is winter-only. Found a more current, precise semester-contribution figure than what's on record.

```json
{
  "id": "hamburg",
  "currentTagsInDataset": ["Opens Feb ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Feb ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027 · 15 February – 31 March 2027; the programme states there is no summer or late intake and does not distinguish between German and international applicants",
  "verifiedSemesterFee": "€402 for Winter Semester 2026/27 (up from €384 in Summer 2026), per the University of Hamburg's own semester-contribution announcement; includes the public-transport semester ticket",
  "sources": [
    {"title": "MSc Intelligent Adaptive Systems : Department of Informatics : University of Hamburg", "url": "https://www.inf.uni-hamburg.de/en/studies/master/ias.html"},
    {"title": "Dates and deadlines : UHH : University of Hamburg", "url": "https://www.uni-hamburg.de/en/campuscenter/bewerbung/fristen-termine.html"},
    {"title": "Semesterbeitrag Wintersemester 2026/27 : UHH : Universität Hamburg", "url": "https://www.uni-hamburg.de/campuscenter/aktuelles/2026-07-23-semesterbeitrag-wise-2026.html"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Status/window/no-summer-intake claim all confirmed unchanged via the university's central deadlines page; refined the semester fee to the current precise €402 (Winter 2026/27) figure, replacing the approximate €380 on record."
}
```

### tuebingen

Confirmed unchanged: both the university's central winter-semester opening/closing-dates page and the Machine Learning programme's own admission-and-application page state the same single deadline (portal opens early February, closes 30 April) applying equally to EU and non-EU applicants, with no summer intake.

```json
{
  "id": "tuebingen",
  "currentTagsInDataset": ["Opens Feb ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Feb ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027 · portal opens early February 2027, deadline 30 April 2027; the same deadline applies to EU and non-EU applicants; the programme runs winter intake only",
  "sources": [
    {"title": "Opening/Closing Dates/Deadlines for Applications for the Master's programmes - Winter semester | University of Tübingen", "url": "https://uni-tuebingen.de/en/study/application-and-enrollment/masters-degree/openingclosing-datesdeadlines-for-applications-for-the-masters-programmes-winter-semester/"},
    {"title": "Machine Learning Admission and Application | Universität Tübingen", "url": "https://uni-tuebingen.de/fakultaeten/mathematisch-naturwissenschaftliche-fakultaet/fachbereiche/informatik/studium/studierende/lehre-studienorganisation/studiengaenge/machine-learning/admission-and-application/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Both the central university deadlines page and the Machine Learning programme's own admission page confirm the exact recorded early-Feb-open/30-Apr-close single deadline; no change."
}
```

### fu-berlin

Confirmed unchanged: the Data Science programme's own timeline FAQ page and the central FU Berlin deadlines page both confirm the recurring mid/15–20-April to 31 May winter-only application window, and the uni-assist VPD requirement (valid one year) for bachelor's degrees obtained outside Germany.

```json
{
  "id": "fu-berlin",
  "currentTagsInDataset": ["Opens Apr ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Apr ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027/28 · mid-April – 31 May 2027; winter entry only, summer admission exists solely for higher semesters. A uni-assist VPD is required for a bachelor obtained outside Germany and is valid for one year",
  "sources": [
    {"title": "M.Sc. Data Science prospective students - FU Berlin", "url": "https://www.mi.fu-berlin.de/en/data-science/prospective-students/index.html"},
    {"title": "What is the timeline / the important dates? • Master Program Data Science • FU Berlin", "url": "https://www.mi.fu-berlin.de/en/data-science/prospective-students/students_prospective/Application-FAQ/What-is-the-timeline-_-the-important-dates_.html"},
    {"title": "Deadlines • Education • Freie Universität Berlin", "url": "https://www.fu-berlin.de/en/studium/bewerbung/bewerbungsfristen/index.html"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Programme timeline FAQ and the central FU Berlin deadlines page both confirm the recurring mid-April–31 May winter-only window (central page shows 20.04–31.05 for the 2026/27 cycle, consistent with 'mid-April' framing) and the VPD requirement; no change."
}
```

## B2

### bonn

Confirmed unchanged: the department's own deadlines-at-a-glance page states verbatim the recorded round structure for Summer 2027 — round one (all applicants) 15 October–1 November 2026, round two (EEA-only) 15 December 2026–15 January 2027, with non-EEA decisions targeted for 15 December. As of 23 August 2026 round one has not opened yet.

```json
{
  "id": "bonn",
  "currentTagsInDataset": ["Opens Oct ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Oct ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · round one, open to all applicants, 15 October – 1 November 2026; round two is EEA-only, 15 December 2026 – 15 January 2027. Non-EEA decisions are targeted for 15 December. Winter 2027/28 deadlines for M.Sc. Computer Science had not yet been published as of this check.",
  "verifiedSemesterFee": "€345.07 per semester (covers the Deutschlandticket and administrative/student-service costs)",
  "sources": [
    {"title": "Deadlines at a Glance - Examination Office - Institute of Computer Science, University of Bonn", "url": "https://www.informatik.uni-bonn.de/en/studies/examination-office/deadlines-at-a-glance"},
    {"title": "Master Computer Science - Institute of Computer Science, University of Bonn", "url": "https://www.informatik.uni-bonn.de/en/studies/master-programs/master-computer-science"},
    {"title": "Master Program Application - Institute of Computer Science, University of Bonn", "url": "https://www.informatik.uni-bonn.de/en/studies/master-programs/master-program-application"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Department deadlines page confirms the exact recorded round-one/round-two dates and non-EEA decision target verbatim; no change, only added a precise current semester-fee figure."
}
```

### goettingen

Row previously had no status chip at all. Verified via the programme page and the international-applicants portal page: the Summer 2027 deadline is confirmed as 1 November 2026 and the application period opens only "roughly one month before" that (i.e. around 1 October 2026) — the university does not publish an exact opening date, but as of 23 August 2026 the portal is explicitly stated as "not yet open," so the correct status chip is "Opens Oct '26," which was missing from the row.

```json
{
  "id": "goettingen",
  "currentTagsInDataset": ["Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Oct ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · deadline 1 November 2026; the application period is stated only as starting roughly one month before the deadline (around 1 October 2026), so no exact opening date is published, and as of 23 August 2026 the portal is confirmed not yet open. Non-EU applicants use a separate portal from EU/EEA applicants and, from Summer 2027, may submit external dMAT Data Science test results in place of (or alongside) the university's own online aptitude test. Winter semester deadline is 1 May, though winter entry is the recommended track",
  "sources": [
    {"title": "M.Sc. Applied Data Science - Georg-August-Universität Göttingen", "url": "https://www.uni-goettingen.de/en/applied+data+science+m.sc./642405.html"},
    {"title": "Application - Georg-August-Universität Göttingen", "url": "https://www.uni-goettingen.de/en/642406.html"},
    {"title": "Application deadlines - Georg-August-Universität Göttingen", "url": "https://www.uni-goettingen.de/en/51427.html"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "The recorded applicationWindow text (deadline-only, no opening date) is accurate per the official programme and application pages, but the row was missing its required status chip; added 'Opens Oct ’26' since the portal is confirmed not yet open and opens roughly one month before the 1 November 2026 deadline."
}
```

### freiburg

Confirmed unchanged: the faculty's own M.Sc. Computer Science programme page states the exact recorded non-EU windows — Summer 2027 1 November–15 December 2026, Winter 2027/28 15 April–31 May 2027 — as recurring official dates. As of 23 August 2026 the Summer-2027 window has not opened yet.

```json
{
  "id": "freiburg",
  "currentTagsInDataset": ["Opens Nov ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Nov ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · 1 November 2026–15 December 2026 (non-EU); Winter 2027/28 · 15 April 2027–31 May 2027 (non-EU; official recurring windows). EU/EEA nationals get extended deadlines (15 January and 15 July respectively)",
  "sources": [
    {"title": "Computer Science (Master of Science) — Faculty of Engineering, University of Freiburg", "url": "https://www.tf.uni-freiburg.de/en/study-programs/computer-science/m-sc-computer-science"},
    {"title": "Dates and Deadlines – University of Freiburg", "url": "https://uni-freiburg.de/en/studies/applying/dates-and-deadlines/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Faculty programme page confirms the exact recorded non-EU windows for both intakes verbatim (1 Nov–15 Dec summer; 15 Apr–31 May winter); no change."
}
```

### rwth-aachen

Confirmed unchanged: the programme's own application-for-admission page states non-EU/EEA applicants apply December 2026–1 March 2027 and EU/EEA applicants June–15 July 2027, for first-semester Winter 2027/28 entry only (no summer intake). As of 23 August 2026 the non-EU window has not opened yet.

```json
{
  "id": "rwth-aachen",
  "currentTagsInDataset": ["Opens Dec ’26", "Winter ’27"],
  "verifiedStatusTag": "Opens Dec ’26",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027/28 · non-EU/EEA applicants apply between December 2026 and 1 March 2027 (hard deadline); EU/EEA applicants between June and 15 July 2027. There is no first-semester summer intake; the programme starts each winter term around October",
  "sources": [
    {"title": "M.Sc. Software Systems Engineering - RWTH Aachen", "url": "https://sc.informatik.rwth-aachen.de/studium/master/sse/"},
    {"title": "Application for Admission - Software Systems Engineering, RWTH Aachen", "url": "https://sc.informatik.rwth-aachen.de/de/studium/master/sse/application-for-admission/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Programme's own application-for-admission page confirms the exact recorded non-EU (Dec–1 Mar) and EU (Jun–15 Jul) windows and winter-only, no-summer-intake status verbatim; no change."
}
```

### fau

Confirmed unchanged across all three FAU programmes on record: the AI programme's own application page confirms the standard Winter cycle runs 15 February–31 May, with Winter 2026/27 shortened to 15 April–31 May 2026 by an examination-regulation change and Winter 2027/28 dates not yet separately published (defaulting to the standard 15 Feb opening). The IIS programme (fau.eu degree page) confirms a 31 May winter-only deadline, and Computational Engineering (ce.studium.fau.eu) confirms a 15 April non-EU / 15 July EU deadline pattern for Winter 2027/28 — all winter-only, consistent with the recorded row.

```json
{
  "id": "fau",
  "currentTagsInDataset": ["Opens Feb ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Feb ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027/28 · AI applications run 15 February – 31 May 2027 in campo (standard cycle; Winter 2027/28 not yet separately confirmed, defaults to standard dates); the Winter 2026/27 cycle was shortened to 15 April – 31 May 2026 by an examination-regulation change. International Information Systems has a 31 May winter-only deadline; Computational Engineering's Winter 2027/28 deadline is 15 April (non-EU) / 15 July (EU). Master entry is normally winter-only across all three programmes",
  "sources": [
    {"title": "Application - Artificial Intelligence (B.Sc./M.Sc.) - FAU", "url": "https://www.ai.study.fau.eu/prospective-students/master-ai/application-master/"},
    {"title": "International Information Systems (IIS) (M.Sc.) - FAU", "url": "https://www.fau.eu/degree-program/international-information-systems-iis-m-sc"},
    {"title": "Application Master - Computational Engineering - FAU", "url": "https://www.ce.studium.fau.eu/prospective-students/application-master/"},
    {"title": "Application deadlines - FAU Erlangen-Nürnberg", "url": "https://www.fau.eu/studying/applications-and-admissions/application-deadlines/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "All three named programmes' own pages confirm winter-only entry and deadlines consistent with the recorded 15 Feb–31 May AI-led window and the Winter-2026/27-shortened-cycle claim; no change."
}
```

### tu-dresden

Confirmed unchanged: TU Dresden's own admission page for M.Sc. Computer Science states verbatim the recorded non-EU windows — Summer 2027 1 October–30 November 2026, Winter 2027/28 1 April–31 May 2027. As of 23 August 2026 the Summer-2027 window has not opened yet.

```json
{
  "id": "tu-dresden",
  "currentTagsInDataset": ["Opens Oct ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Oct ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · 1 October 2026–30 November 2026 (non-EU); Winter 2027/28 · 1 April 2027–31 May 2027 (non-EU). A two-step application (general admission portal, then a separate aptitude-assessment portal using the same email) is required, and GRE results are strongly recommended for international applicants",
  "sources": [
    {"title": "M.Sc. Computer Science - Admission - TU Dresden", "url": "https://tu-dresden.de/ing/informatik/studium/studienangebot/master-studiengaenge/m-sc-computer-science/admission?set_language=en"},
    {"title": "M.Sc. Computer Science - TU Dresden", "url": "https://tu-dresden.de/ing/informatik/studium/studienangebot/master-studiengaenge/m-sc-computer-science?set_language=en"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Programme's own admission page confirms the exact recorded non-EU windows for both intakes verbatim (1 Oct–30 Nov summer; 1 Apr–31 May winter); no change."
}
```

## B3

### kit

Row previously had no status chip. KIT's own programme page (Computer Science M.Sc. (INT)) confirms the recorded deadlines verbatim — 15 June winter / 15 January summer — and the sle.kit.edu FAQ page gives the (only) official portal-opening guidance found anywhere on KIT's site: portals open "voraussichtlich Ende November" (expected end of November) for a summer-semester application and "voraussichtlich Mitte/Ende Mai" (expected mid/end of May) for a winter-semester one. As of 23 August 2026 neither window is open; the next to open is the Summer-2027 one, around end of November 2026, so the correct status chip is "Opens Nov '26."

```json
{
  "id": "kit",
  "currentTagsInDataset": ["Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Nov ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Computer Science M.Sc. (INT) deadlines: 15 January for summer-term entry (Summer 2027) and 15 June for winter-term entry (Winter 2027/28); KIT's general capacity-limited-programme table separately lists 15 January / 15 July for other Informatics-family master's programmes. No exact portal-opening day is published for this specific programme, but KIT's central admissions FAQ states application portals open 'voraussichtlich Ende November' (expected end of November) ahead of a summer-semester deadline and 'voraussichtlich Mitte/Ende Mai' (expected mid/end of May) ahead of a winter-semester one — so the Summer-2027 portal is expected to open around end of November 2026, not yet open as of 23 August 2026",
  "sources": [
    {"title": "KIT – Department of Informatics – Admission Master Computer Science (INT)", "url": "https://www.informatik.kit.edu/english/14346.php"},
    {"title": "KIT - Business unit Studying and Teaching - Before Your Studies - Application and Admission - FAQ", "url": "https://www.sle.kit.edu/english/vorstudium/3928.php"},
    {"title": "KIT – Department of Informatics – Academic Affairs", "url": "https://www.informatik.kit.edu/english/1323.php"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Deadlines (15 Jan summer / 15 Jun winter) confirmed unchanged, but the row was missing its required status chip; added 'Opens Nov ’26' using KIT's central FAQ page, the only official source found stating an (approximate) portal-opening period, and updated the applicationWindow text to cite it instead of stating no opening date is published anywhere."
}
```

### muenster

Significant finding: the Department of Information Systems' own programme page (in both its English and German versions) states the M.Sc. Information Systems programme admits in **both** semesters — winter-semester applications run 10 May–15 July, summer-semester applications run 10 November–15 January — contradicting the dataset's winter-only "Winter '27" tag. This is corroborated by the university-wide NC-master's deadline pattern (early-May–15-July winter / early-Nov–15-Jan summer) on the central admissions-office page. As of 23 August 2026 neither window is open; the next to open is the Summer-2027 one on 10 November 2026.

```json
{
  "id": "muenster",
  "currentTagsInDataset": ["Winter ’27"],
  "verifiedStatusTag": "Opens Nov ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "The Department of Information Systems' own admissions page states M.Sc. Information Systems admits in both semesters: summer-semester-intake applications run 10 November – 15 January (Summer 2027: 10 Nov 2026 – 15 Jan 2027, the next window to open); winter-semester-intake applications run 10 May – 15 July (Winter 2027/28: 10 May – 15 Jul 2027). This is consistent with the university-wide pattern for local-NC master's programmes published by the central admissions office (early May–15 July winter / early Nov–15 Jan summer). As of 23 August 2026 no window is open",
  "sources": [
    {"title": "Master of Science Information Systems | Department of Information Systems (application deadlines: 10th Nov–15th Jan / 10th May–15th Jul)", "url": "https://www.wi.uni-muenster.de/prospective-students/our-courses-study/master-science-information-systems"},
    {"title": "Master of Science Information Systems | Institut für Wirtschaftsinformatik (German mirror, same dates)", "url": "https://www.wi.uni-muenster.de/de/studieninteressierte/unsere-studiengaenge/master-science-information-systems"},
    {"title": "Application deadlines (Fristen und Termine) - University of Münster", "url": "https://www.uni-muenster.de/studieninteressierte/bewerbung/fristenundtermine.shtml"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Found and confirmed a concrete, sourced application window (was previously 'portal-dependent and not publicly specified'), added the missing status chip, and — most importantly — discovered the programme also admits for Summer '27, which the dataset's tags currently omit entirely."
}
```

### tu-berlin

Confirmed unchanged: TU Berlin's central dates-and-deadlines page states verbatim the recorded Summer-2027 windows — 1 December 2026–15 January 2027 for restricted-admission master's programmes, 1 December 2026–28 February 2027 for open-admission ones — and Winter 2027/28 dates remain unpublished. The M.Sc. Computer Science programme page confirms the curriculum is now simply "taught in English" with no further transition caveat surfaced (the earlier "English curriculum from summer 2026; verify transition rules" note appears resolved — no residual dual-track admission distinction was found). As of 23 August 2026 the Summer-2027 window has not opened yet.

```json
{
  "id": "tu-berlin",
  "currentTagsInDataset": ["Opens Dec ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Dec ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · 1 December 2026 – 15 January 2027 for restricted-admission master's programmes (1 December 2026 – 28 February 2027 for open-admission ones); Winter 2027/28 dates are not yet published. A uni-assist VPD is required for a foreign first degree, requested as early as possible since processing can take several weeks. The M.Sc. Computer Science programme is now described simply as taught in English with no residual transition caveat",
  "sources": [
    {"title": "Dates & Deadlines for Application and Enrollment at TU Berlin", "url": "https://www.tu.berlin/en/studierendensekretariat/dates-deadlines-for-application-and-enrollment-at-tu-berlin"},
    {"title": "M.Sc. Computer Science (Informatik) - Application/Admission - TU Berlin", "url": "https://www.tu.berlin/en/eecs/academics-teaching/study-offer/masters-programs/msc-computer-science-informatik/msc-cs-in-application-admission"},
    {"title": "M.Sc. Computer Science (Informatik) - TU Berlin", "url": "https://www.tu.berlin/en/eecs/academics-teaching/study-offer/masters-programs/msc-computer-science-informatik"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Central dates-and-deadlines page confirms the exact recorded Summer-2027 windows verbatim and that Winter 2027/28 dates remain unpublished; the English-curriculum transition appears complete with no further caveat needed, but this doesn't change any tracked field."
}
```

### wuerzburg

**High-priority finding**: two independent official Würzburg pages (the Institute of Computer Science's own application page, and the university-wide international-students master's-deadlines table) both state the Summer-semester opening only as "end of Aug." — neither publishes an exact day. No SS2027-specific deadlines PDF has been issued yet either (the university's dates-and-deadlines page only lists PDFs through Winter 2026/27). Since "end of August" most naturally reads as the last handful of days of the month and 23 August is not yet there, and no source states or implies the portal has already opened, the status chip stays "Opens Aug '26" — but the exact day cannot be pinned down from official sources.

```json
{
  "id": "wuerzburg",
  "currentTagsInDataset": ["Opens Aug ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Aug ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · end of August 2026 – 31 October 2026; Winter 2027/28 · 23 January – 15 March 2027 (per the university's international-students master's-programme deadline table, which lists Computer Science's row as 'end of Aug.–31.10.' for summer and '23.1.–15.3.' for winter). No official Würzburg source publishes an exact day within 'end of August' — the Institute of Computer Science's own application page and the university-wide table both stop at that granularity, and no Summer-2027-specific deadlines PDF has been published yet (only cycles through Winter 2026/27 are). As of 23 August 2026 there is no evidence the window has opened; the uni-assist VPD must be issued for the University of Würzburg and be under one year old",
  "sources": [
    {"title": "Application - Institute of Computer Science, University of Würzburg", "url": "https://www.informatik.uni-wuerzburg.de/en/studies/degree-programmes/master-computer-science/application/"},
    {"title": "Application (Master's and LL.M. programmes for international degree-seeking students) - University of Würzburg", "url": "https://www.uni-wuerzburg.de/en/studying-at-jmu/studienangelegenheiten/application-and-enrolment/international-degree-seeking-students/application/master-and-llm/"},
    {"title": "Dates and deadlines - Studierendenkanzlei - University of Würzburg", "url": "https://www.uni-wuerzburg.de/en/studying-at-jmu/studienangelegenheiten/dates-and-deadlines/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Cross-checked two independent official Würzburg pages: both cap out at 'end of Aug.' with no specific day, and no Summer-2027 deadlines PDF exists yet, so the portal cannot be confirmed as already open — 'Opens Aug ’26' stands, but the exact opening day remains unpublished by the university itself (not an unresolved verdict — the absence of a specific day is itself the confirmed official state, not a research gap)."
}
```

### ruhr-bochum

Confirmed unchanged: the programme's own application page states verbatim, in English, "Next opening of the application portal: beginning of November 2026" and "Next application deadline: December 15th, 2026, 23:59 UTC+1" for Winter 2027/28 (start October 2027), and confirms non-EU applicants can only start in winter semester. Cross-checked against a general search of RUB's international-applicant deadline pages, which corroborate that programme-level deadlines (not a university-wide standard) govern, consistent with the December-15 date.

```json
{
  "id": "ruhr-bochum",
  "currentTagsInDataset": ["Opens Nov ’26", "Winter ’27"],
  "verifiedStatusTag": "Opens Nov ’26",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027/28 · portal opens beginning of November 2026 and closes 15 December 2026, 23:59 UTC+1. Non-EU applicants can only start in the winter semester",
  "sources": [
    {"title": "Master Of Computer Science – Application – Fakultät für Informatik, Ruhr-Universität Bochum ('Next opening of the application portal: beginning of November 2026'; 'Next application deadline: December 15th, 2026, 23:59 UTC+1')", "url": "https://informatik.rub.de/en/studies/application/msc-cs/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Programme's own application page states the exact recorded opening (beginning of November 2026) and deadline (15 December 2026, 23:59 UTC+1) verbatim, plus the non-EU winter-only rule; no change."
}
```

### kiel

Row previously had no status chip. CAU Kiel's central uni-assist deadlines page (studium.uni-kiel.de) confirms the recurring pattern for non-NC (zulassungsfrei) programmes: winter-semester-intake applications run to 15 July, summer-semester-intake applications run to 15 January (with a separate, earlier 1 July / 2 January pair for NC-restricted programmes) — consistent with the dataset's "beginning of May to 15 July" / "beginning of November to 15 January" recorded pattern; the M.Sc. Computer Science programme page itself still doesn't publish cycle-specific 2027 dates. As of 23 August 2026 neither window is open; the next to open is the Summer-2027 one, beginning of November 2026.

```json
{
  "id": "kiel",
  "currentTagsInDataset": ["Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Nov ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Published recurring windows via uni-assist: winter-semester intake from the beginning of May to 15 July (Winter 2027/28: May–15 July 2027); summer-semester intake from the beginning of November to 15 January (Summer 2027: 1 Nov 2026 – 15 Jan 2027, the next window to open). CAU Kiel's central deadlines page separately lists earlier 1 July / 2 January cut-offs for NC-restricted programmes. The M.Sc. Computer Science programme page itself states no cycle-specific 2027 dates. As of 23 August 2026 no window is open",
  "sources": [
    {"title": "Fristen - Bewerbung über uni-assist - Christian-Albrechts-Universität zu Kiel", "url": "https://www.studium.uni-kiel.de/de/bewerbung-einschreibung/bewerbung/uni-assist/fristen"},
    {"title": "Study Master Computer Science - Kiel University", "url": "https://www.uni-kiel.de/en/tf/study/ma-computer-science"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Recorded recurring-window pattern is confirmed via CAU Kiel's own uni-assist deadlines page (matching the non-NC 15 July / 15 January cut-offs), but the row was missing its required status chip; added 'Opens Nov ’26' since the Summer-2027 window (opening beginning of November 2026) is the next one to open."
}
```

## B4

### stuttgart

Confirmed unchanged: INFOTECH's own application page states the exact recorded recurring windows verbatim — winter semester 15 November–15 January (semester begins 1 October), summer semester 15 May–15 July (semester begins 1 April) — with the page itself noting "application periods are ca. 9 months before the semester begins." As of 23 August 2026 the Summer-2027 window (which would have run 15 May–15 July 2026) has already closed, and the next window to open is Winter 2027/28 on 15 November 2026, matching the dataset's "Opens Nov '26" tag.

```json
{
  "id": "stuttgart",
  "currentTagsInDataset": ["Opens Nov ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Nov ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "INFOTECH recurring windows: winter semester 15 November–15 January (semester begins 1 October), summer semester 15 May–15 July (semester begins 1 April); application periods run roughly 9 months before the semester begins. The Summer 2027 window (15 May–15 July 2026) has already closed as of 23 August 2026; the Winter 2027/28 window opens 15 November 2026",
  "sources": [
    {"title": "INFOTECH - University of Stuttgart", "url": "https://www.infotech.uni-stuttgart.de/"},
    {"title": "Application - INFOTECH - University of Stuttgart", "url": "https://www.infotech.uni-stuttgart.de/application/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "INFOTECH's own application page confirms the exact recorded recurring windows (15 Nov–15 Jan winter; 15 May–15 Jul summer) and the ~9-month-lead-time framing verbatim; no change."
}
```

### marburg

**High-priority finding confirmed stale, revised to unresolved on re-check**: the University of Marburg's own master-application-deadlines page states the Winter 2026/27 uni-assist (foreign-degree) window ran 1 May – 21 August 2026 — exactly as recorded — and today (23 August 2026) is after that window's own stated close date, so it has definitively closed; "Open now" is no longer accurate. However, on a harder re-search specifically for a stated recurring-cycle policy (not just one past instance), no such statement was found: the master-application-deadlines page itself was quoted in full and contains no language like "these deadlines apply each year" / "annually" / "jedes Jahr" / "jährlich" — it presents only two concrete past cycles ("Application period for the 2026/2027 winter semester", "Application period for the 2026 summer semester") without asserting they repeat. The general "Application for a Master's Programme" overview page, the About Uni-assist page, and a German-language search for a recurring-policy statement all likewise turned up nothing beyond the one Summer-2026-cycle data point used in the original (now-retracted) extrapolation. Per the single-instance-precedent rule, this is downgraded to unresolved rather than kept as a sourced month estimate.

```json
{
  "id": "marburg",
  "currentTagsInDataset": ["Open now", "Summer ’27", "Winter ’27"],
  "sources": [
    {"title": "Application Deadlines for Master Programs - Application for a Masters Program - Philipps-Universität Marburg", "url": "https://www.uni-marburg.de/en/studying/after-your-first-degree/masters-programs/application-for-a-masters-programme/master-application-deadlines"},
    {"title": "Application for a Master's Programme - Philipps-Universität Marburg", "url": "https://www.uni-marburg.de/en/studying/after-your-first-degree/masters-programs/application-for-a-masters-programme"},
    {"title": "About Uni-assist - Philipps-Universität Marburg", "url": "https://www.uni-marburg.de/en/studying/admissions/uni-assist"},
    {"title": "M.Sc. Data Science - Degree Programs - Mathematics and Computer Science - Philipps-Universität Marburg", "url": "https://www.uni-marburg.de/en/fb12/studying/degree-programs/m-sc-data-science"}
  ],
  "changed": true,
  "unresolved": true,
  "note": "Window closed 21 Aug 2026 per its own stated end date; no 2027 cycle or recurring-policy statement found — leaving dataset's current 'Open now' text for a human to address, since it is now confirmed stale but no reliable replacement date exists."
}
```

### tu-darmstadt

Confirmed unchanged: TU Darmstadt's own Computer Science M.Sc. programme page states verbatim "Summer term: 01.12.–15.01. | Winter term: 01.06.–15.07.", matching the recorded pattern exactly, and the Artificial Intelligence and Machine Learning M.Sc. programme follows the identical 01.12–15.01 / 01.06–15.07 pattern per its own programme page. The central TU Darmstadt deadlines page corroborates the general opening-month framing (winter applications open 1 June, summer applications open 1 December) without giving year-specific dates. As of 23 August 2026 the Winter 2026/27 window (1 June–15 July 2026) has closed and the next window, Summer 2027, opens 1 December 2026.

```json
{
  "id": "tu-darmstadt",
  "currentTagsInDataset": ["Opens Dec ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Dec ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "M.Sc. Computer Science and M.Sc. Artificial Intelligence and Machine Learning both run: Summer term 1 December–15 January; Winter term 1 June–15 July. The Winter 2026/27 window (1 June–15 July 2026) has closed as of 23 August 2026; the Summer 2027 window opens 1 December 2026. Certified documents are required on paper by the deadline",
  "sources": [
    {"title": "M.Sc. Computer Science – TU Darmstadt", "url": "https://www.informatik.tu-darmstadt.de/studium_fb20/im_studium/studiengaenge_liste/computer_science_msc.en.jsp"},
    {"title": "Artificial Intelligence and Machine Learning M.Sc. – Computer Science – TU Darmstadt", "url": "https://www.informatik.tu-darmstadt.de/studium_fb20/im_studium/studiengaenge_liste/aim_msc.en.jsp"},
    {"title": "Application Deadlines – TU Darmstadt", "url": "https://www.tu-darmstadt.de/studieren/studieninteressierte/bewerbung_zulassung_tu/bewerbungsfristen/index.en.jsp"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Both named programmes' own pages confirm the exact recorded 01.12–15.01 (summer) / 01.06–15.07 (winter) pattern verbatim, and the central deadlines page corroborates the 1 December / 1 June opening-month framing; no change."
}
```

### saarland

Row previously had no status chip. Original pass reasoned "Open now" purely from the absence of a published portal-opening date across seven official/quasi-official pages — but absence of an opening date is not evidence of rolling admission. Re-searched specifically for an affirmative statement (on uni-saarland.de itself, not the joint saarland-informatics-campus.de site) that applications are accepted year-round / on a rolling basis / with no fixed period: none found. The uni-saarland.de FAQ page on application-and-enrolment procedures was quoted in full and only discusses "designated application period[s]" for undergraduate programmes, with no rolling-admission language for master's; the master's application overview page (uni-saarland.de/en/study/application/master.html) and the Computer Science programme page likewise state only "should normally be received by" a deadline, never asserting continuous acceptance. Per the requirement for affirmative evidence (not absence-of-evidence), this is downgraded to unresolved. Also fixed per the source-domain note: the two saarland-informatics-campus.de citations (a joint DFKI/Max-Planck/Saarland-University site, not uni-saarland.de itself) are dropped; the deadline facts they supported are already covered by the genuine uni-saarland.de programme page.

```json
{
  "id": "saarland",
  "currentTagsInDataset": ["Summer ’27", "Winter ’27"],
  "sources": [
    {"title": "Computer Science (M.Sc.) | Universität des Saarlandes", "url": "https://www.uni-saarland.de/en/study/programmes/master/informatics.html"},
    {"title": "Applying for admission to a Master's degree programme | Universität des Saarlandes", "url": "https://www.uni-saarland.de/en/study/application/master.html"},
    {"title": "FAQs covering the application and enrolment procedures | Universität des Saarlandes", "url": "https://www.uni-saarland.de/en/study/application/faqs/application-and-enrolment-procedures.html"},
    {"title": "Application deadlines for the summer semester 2026 | Universität des Saarlandes", "url": "https://www.uni-saarland.de/en/study/application/deadlines-summer.html"}
  ],
  "changed": false,
  "unresolved": true,
  "note": "No affirmative rolling-admission statement found on an official uni-saarland.de page — absence of a published opening date is not sufficient evidence; leaving dataset's current state (no status chip) for a human to resolve."
}
```

### leibniz-hannover

Confirmed unchanged: cross-checked via two independent official uni-hannover.de sources — LUH's own programme detail page and LUH's central "Bewerbungszeiten" (application-periods) page — both give the identical non-EU/international first-degree Computer Science M.Sc. deadline of 15 October–30 November 2026 for Summer 2027 (the central page phrases it as "15.10.-30.11. des Vorjahres zum Sommersemester") and 15 April–31 May 2027 for Winter 2027/28, plus the uni-assist VPD requirement (request at least eight weeks before the deadline). As of 23 August 2026 this window has not opened yet. (Fixed per source-domain review: the earlier studieren-in-niedersachsen.de citation — a Lower Saxony state study portal, not a uni-hannover.de page — is replaced with this genuine second official LUH source.)

```json
{
  "id": "leibniz-hannover",
  "currentTagsInDataset": ["Opens Oct ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Oct ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · 15 October–30 November 2026 for non-EU first-degree applicants (not yet open as of 23 August 2026); Winter 2027/28 · 15 April–31 May 2027. A uni-assist VPD is required and must be requested at least eight weeks before the deadline. Note: LUH's central Bewerbungszeiten page states not all master's programmes have this early non-EU deadline — some instead follow the regular 01.06–15.07 (winter) / 01.12–15.01 (summer) pattern — but the programme's own detail page confirms Computer Science uses the early non-EU dates",
  "sources": [
    {"title": "M.Sc. Computer Science - Leibniz University Hannover", "url": "https://www.uni-hannover.de/en/studium/studienangebot/info/studiengang/detail/computer-science-1?limit=all"},
    {"title": "Bewerbungszeiten - Leibniz Universität Hannover", "url": "https://www.uni-hannover.de/studium/vor-dem-studium/bewerbung-zulassung/voraussetzungen-zum-studium/bewerbungszeiten"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "LUH's own programme detail page and LUH's own central Bewerbungszeiten page both confirm the exact recorded 15 Oct–30 Nov 2026 (Summer 2027) and 15 Apr–31 May 2027 (Winter 2027/28) windows plus the VPD requirement; no change."
}
```

### hhu-duesseldorf

Confirmed unchanged: HeiCAD's own master's-programme page states verbatim "the next application period (for the programme starting October 2026) will open May 5, with deadline July 15th 2026" — matching the recorded Winter 2026/27 cycle (5 May–15 July 2026) exactly. As of 23 August 2026 that window has closed, and no Winter 2027/28-specific dates are yet published on any official HHU/HeiCAD page checked, consistent with the recurring "opens in spring, early in May" pattern the dataset already projects forward to "Opens May '27."

```json
{
  "id": "hhu-duesseldorf",
  "currentTagsInDataset": ["Opens May ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens May ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter-only entry. The Winter 2026/27 cycle ran 5 May–15 July 2026 (HeiCAD's own programme page: 'the next application period ... will open May 5, with deadline July 15th 2026') and has closed as of 23 August 2026; no application is possible after the deadline, with no advantage to early applications. Winter 2027/28-specific dates are not yet published on any official HHU/HeiCAD page checked, consistent with the recurring spring/early-May portal-opening pattern. A uni-assist VPD may be required and takes six weeks or more, so start it early",
  "sources": [
    {"title": "Master's programme AI and Data Science - HeiCAD", "url": "https://www.heicad.hhu.de/lehre/masters-programme-ai-and-data-science"},
    {"title": "Application - Master's programme AI and Data Science - HeiCAD", "url": "https://www.heicad.hhu.de/lehre/masters-programme-ai-and-data-science/application"},
    {"title": "Artificial Intelligence and Data Science - Master of Science - HHU", "url": "https://www.hhu.de/studium/studienangebot/studiengang-informationen/artificial-intelligence-and-data-science-master"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "HeiCAD's own programme page confirms the exact recorded Winter 2026/27 window (5 May–15 July 2026) verbatim, and no Winter 2027/28-specific dates are published anywhere official yet; the dataset's forward-looking 'Opens May ’27' projection from the recurring pattern stands unchanged."
}
```

## B5

### bielefeld

Confirmed unchanged: Bielefeld's central international-office deadlines page states the recurring non-EU/foreign-qualification window verbatim — "01.06.–15.07." for winter semester and "01.12.–15.01." for summer semester — with the Winter 2026/27 instance (1 June–15 July 2026) already closed as of 23 August 2026, so the next window is Winter 2027/28 opening 1 June 2027. The Data Science faculty page confirms it follows the same 1 June–15 July window but additionally requires a uni-assist VPD requested at least eight weeks ahead (VPD not possible after the 15 July deadline) — consistent with the recorded "excepted from that table, requires prior documentation" framing (the "exception" is the VPD prerequisite, not a different date range).

```json
{
  "id": "bielefeld",
  "currentTagsInDataset": ["Opens Jun ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Jun ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter-only entry for this programme. The international-office deadline table gives 1 June–15 July for the winter semester and 1 December–15 January for the summer semester for applicants with foreign qualifications, so Winter 2027/28 opens 1 June 2027 (Winter 2026/27's 1 June–15 July 2026 window has already closed as of 23 August 2026). M.Sc. Data Science follows the identical 1 June–15 July window but additionally requires a uni-assist VPD, which must be requested at least eight weeks before the deadline and cannot be obtained after it",
  "sources": [
    {"title": "Application Deadlines: Master's programmes (M.A./M.Sc.) - Bielefeld University", "url": "https://www.uni-bielefeld.de/international/come-in/studium/studium-mit-abschluss/fristen/"},
    {"title": "Application procedure Master Data Science - Bielefeld University", "url": "https://www.uni-bielefeld.de/fakultaeten/wirtschaftswissenschaften/studium-und-lehre/studieninteressierte/master_ds/ds_info.xml"},
    {"title": "M.Sc. Intelligent Systems - Bielefeld University (Technische Fakultät)", "url": "https://www.uni-bielefeld.de/fakultaeten/technische-fakultaet/studium/master/MA-Intelligente-Systeme/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Central deadlines page and the Data Science faculty page both confirm the exact recorded 1 June–15 July (winter) / 1 December–15 January (summer) recurring pattern and the VPD-exception framing for Data Science; no change."
}
```

### bremen

Confirmed unchanged: the University of Bremen's own programme page states the winter-semester beginner application period as "01.02.–15.03." (1 February–15 March), stated as the standard recurring window rather than tied to one past year. Winter 2026/27's instance (1 Feb–15 Mar 2026) has closed as of 23 August 2026, so the next window is Winter 2027/28, opening 1 February 2027, matching the recorded tag exactly.

```json
{
  "id": "bremen",
  "currentTagsInDataset": ["Opens Feb ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Feb ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2026/27 closed · 1 February–15 March 2026; Winter 2027/28 · 1 February–15 March 2027",
  "sources": [
    {"title": "Artificial Intelligence and Intelligent Systems (Master) - Universität Bremen", "url": "https://www.uni-bremen.de/en/studies/orientation-application/offered-study-program/dbs/study/artificial-intelligence-and-intelligent-systems-master"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Programme's own page states the 1 Feb–15 Mar window as the standing beginner-application period for the winter semester (not tied to one instance); matches the recorded pattern and projected Winter 2027/28 opening exactly."
}
```

### regensburg

Confirmed unchanged, with one conflicting low-quality source disregarded: the Faculty of Informatics and Data Science's own English programme page states the M.Sc. Computer Science programme starts every year in both October and April, with the winter-term (October start) application window running mid/late April to 1 June and the summer-term (April start) window running mid/late October to 1 December — matching the recorded row exactly. A separate WebSearch AI-summary (sourced from a mix of an official-looking snippet and third-party aggregator search results) inverted which deadline belongs to which term, but that summary was not a direct fetch of an official page and contradicts the directly-fetched uni-regensburg.de page, so it was disregarded per the "prefer official direct source" rule. As of 23 August 2026 the Summer-2027 window (mid/late October 2026–1 December 2026) has not opened yet.

```json
{
  "id": "regensburg",
  "currentTagsInDataset": ["Opens Oct ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Oct ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · mid-to-late October 2026 – 1 December 2026; Winter 2027/28 · mid-to-late April 2027 – 1 June 2027. The programme starts every year in both October and April",
  "sources": [
    {"title": "MSc Computer Science - Faculty of Informatics and Data Science - Universität Regensburg", "url": "https://www.uni-regensburg.de/en/informatics-data-science/study/prospective-students/msc-computer-science"},
    {"title": "Application & Admission - Faculty of Informatics and Data Science - Universität Regensburg", "url": "https://www.uni-regensburg.de/en/informatics-data-science/study/prospective-students/msc-computer-science/application-amp-admission"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "The faculty's own English programme page confirms the exact recorded mid/late-October–1-December (summer) and mid/late-April–1-June (winter) windows verbatim; a conflicting non-direct-fetch search summary that swapped the terms was checked against and rejected as unreliable."
}
```

### ulm

Cognitive Systems confirmed unchanged: Ulm's own programme application page states a single 1 April–15 May window applying identically via both the Campusportal and uni-assist routes, winter-only. Mathematical Data Science, however, differs from what the recorded text implies: its own application page (checked in both English and German) gives a longer window for the uni-assist route — 1 April–15 July — versus 1 April–15 May (then a second slot 1 June–15 July) via the Campusportal route; since a Bangladeshi applicant with a non-German bachelor's degree must use uni-assist, the operative deadline for this profile is 15 July, not 15 May as the single shared applicationWindow sentence currently states. Both programmes remain winter-only with no summer entry. As of 23 August 2026 neither window has opened yet (opens 1 April 2027).

```json
{
  "id": "ulm",
  "currentTagsInDataset": ["Opens Apr ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Apr ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027/28 · no summer entry for either programme. M.Sc. Cognitive Systems: 1 April – 15 May 2027, identical deadline via the Campusportal and uni-assist routes. M.Sc. Mathematical Data Science: 1 April – 15 May 2027 via the Campusportal, but 1 April – 15 July 2027 via uni-assist — the route required for applicants with a bachelor's degree obtained outside Germany, so Bangladeshi applicants should use the 15 July deadline, not 15 May",
  "sources": [
    {"title": "Cognitive Systems Master - Application and enrolment - Universität Ulm", "url": "https://www.uni-ulm.de/en/study/application-and-enrolment/masters-programmes/cognitive-systems-master/"},
    {"title": "Cognitive Systems Master (German) - Bewerbung und Immatrikulation - Universität Ulm", "url": "https://www.uni-ulm.de/studium/bewerbung-und-immatrikulation/masterstudiengaenge/cognitive-systems-master/"},
    {"title": "Master of Science in Mathematical Data Science - Application and enrolment - Universität Ulm", "url": "https://www.uni-ulm.de/en/study/application-and-enrolment/masters-programmes/master-of-science-in-mathematical-data-science/"},
    {"title": "Mathematical Data Science Master (German) - Bewerbung und Immatrikulation - Universität Ulm", "url": "https://www.uni-ulm.de/studium/bewerbung-und-immatrikulation/masterstudiengaenge/mathematical-data-science-master/"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Cognitive Systems' 1 April–15 May single deadline is confirmed unchanged, but Mathematical Data Science's own page (checked in English and German) shows a longer uni-assist-route deadline of 15 July that the current shared applicationWindow sentence omits — the correct deadline for a Bangladeshi (non-German-degree) applicant to that programme is 15 July, not 15 May."
}
```

### konstanz

Confirmed unchanged: the department's own M.Sc. Computer and Information Science programme page states application periods of 18 March–15 April (visa-required applicants) / 18 March–15 June (non-visa-required applicants) for the winter semester, and 29 November–15 January for the summer semester (restricted to applicants who do not need a German visa) — matching the recorded row exactly, including the visa-required-applicants-winter-only rule. As of 23 August 2026 the Winter 2027/28 window (18 March–15 April 2027) has not opened yet.

```json
{
  "id": "konstanz",
  "currentTagsInDataset": ["Opens Mar ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Mar ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Visa-required applicants: Winter 2027/28 · 18 March – 15 April 2027 (applicants without a visa requirement have until 15 June). The summer window, 29 November – 15 January, is open only to applicants without a visa requirement",
  "sources": [
    {"title": "M.Sc. Computer and Information Science - Department of Computer and Information Science, University of Konstanz", "url": "https://www.informatik.uni-konstanz.de/studium/master-of-science/msc-computer-and-information-science/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Programme's own department page confirms the exact recorded 18 March–15 April (visa-required) / 18 March–15 June (non-visa) winter window and the 29 November–15 January visa-exempt-only summer window verbatim; the two deeper sub-pages cited in the recorded links (admission-procedure, prospective-students-and-application) both 404 as of this check, but the parent programme page carries the same information and is used instead."
}
```

### rostock

Confirmed unchanged: the programme's own page states the international/non-German applicant application periods verbatim — winter-term entry applications run 1 April–31 May, summer-term entry applications run 1 October–30 November, via UniAssist. Winter 2026/27's window (1 April–31 May 2026) has closed as of 23 August 2026, so the next window is Summer 2027, opening 1 October 2026, matching the recorded row exactly.

```json
{
  "id": "rostock",
  "currentTagsInDataset": ["Opens Oct ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Oct ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Winter 2026/27 closed · 1 April–31 May 2026; Summer 2027 · 1 October–30 November 2026; Winter 2027/28 · 1 April–31 May 2027",
  "sources": [
    {"title": "Computer Science International - University of Rostock", "url": "https://www.uni-rostock.de/en/computer-science-international-master/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Programme's own page confirms the exact recorded 1 April–31 May (winter) / 1 October–30 November (summer) international-applicant windows via UniAssist verbatim; no change."
}
```

## B6

### tu-dortmund

Confirmed unchanged: the Faculty of Statistics' own admission page states verbatim the recorded non-EU/EEA windows for the current cycle — early November 2026–15 January 2027 for Summer 2027, early January–15 May for winter (Winter 2026/27's deadline extended to 15 June 2026) — and explicitly does not yet publish Winter 2027/28 or later cycle dates. As of 23 August 2026 the Summer-2027 window (opening "early November 2026") has not opened yet, matching the recorded "Opens Nov '26" status.

```json
{
  "id": "tu-dortmund",
  "currentTagsInDataset": ["Opens Nov ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Nov ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Non-EU applicants: early November 2026 – 15 January 2027 for Summer 2027; early January – 15 May for a winter semester, with the Winter 2026/27 deadline extended to 15 June 2026. The 2027/28 cycle is not yet published",
  "sources": [
    {"title": "Admission - Fakultät Statistik - TU Dortmund", "url": "https://statistik.tu-dortmund.de/en/studies/degrees/data-science-msc/admission/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "The department's own admission page confirms the exact recorded early-Nov-2026–15-Jan-2027 (summer) and early-Jan–15-May, extended-to-15-Jun-2026 (winter) windows verbatim, and still does not publish 2027/28 cycle dates; no change."
}
```

### potsdam-hpi

Confirmed unchanged: HPI's own application page for the Computer Science M.Sc. (fetched via a readability proxy after the direct hpi.de fetch returned HTTP 403; content is HPI's own text, not a third party) states applications open 1 November and close 1 December for the summer semester and open 1 April, close 1 June for the winter semester, explicitly noting these dates "apply annually" — matching the recorded row exactly for Summer 2027 (1 Nov–1 Dec 2026) and Winter 2027/28 (1 Apr–1 Jun 2027). A prior WebSearch summary independently reported the identical Nov 1/Dec 1 and Apr 1/Jun 1 pattern, corroborating the proxy-fetched page. As of 23 August 2026 the Summer-2027 window has not opened yet.

```json
{
  "id": "potsdam-hpi",
  "currentTagsInDataset": ["Opens Nov ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Nov ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · 1 November–1 December 2026; Winter 2027 · 1 April–1 June 2027. HPI's own application page states these application periods apply annually on the same dates",
  "sources": [
    {"title": "Application Computer Science (M.Sc.) | Hasso-Plattner-Institut (fetched via readability proxy after direct 403; content originates from hpi.de)", "url": "https://hpi.de/en/studies/application/application-computer-science-msc/"},
    {"title": "Computer Science (M.Sc.) | Hasso Plattner Institute", "url": "https://hpi.de/en/studies/computer-science-msc/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "hpi.de's own application page (accessed through a readability proxy because direct fetches were blocked with HTTP 403) confirms the exact recorded 1 Nov–1 Dec (summer) / 1 Apr–1 Jun (winter) windows verbatim and states they recur annually; corroborated by an independent web search of the same official page; no change."
}
```

### tu-braunschweig

**Priority check confirmed**: TU Braunschweig's own central application page (tu-braunschweig.de/en/application, fetched directly, HTTP 200) states verbatim that international master's programmes taught in English or bilingually — as opposed to the general TU Braunschweig windows of 1 June–15 July (winter) and 1 December–15 January (summer) — instead use 1 August–15 September (summer) and 1 February–15 March (winter), exactly matching the recorded Data Science windows. Today (23 August 2026) falls inside the 1 August–15 September 2026 window, so "Open now" is reconfirmed directly rather than assumed. Cross-checked the M.Sc. Computational Sciences in Engineering (CSE) programme specifically: a search-indexed snippet of TU Braunschweig's own CSE pages gives a matching non-EU winter deadline of 1 February–15 March, but CSE's own programme page states "Start of programme: winter semester" with no summer intake mentioned — the recorded applicationWindow text's implication that both listed programmes share a Summer 2027 window is only confirmed for Data Science; CSE itself appears winter-entry only.

```json
{
  "id": "tu-braunschweig",
  "currentTagsInDataset": ["Open now", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Open now",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Open now for Summer 2027 · the English-language/bilingual international master's window runs 1 August–15 September 2026 (confirmed directly via TU Braunschweig's own central application page, today 23 August 2026 falls inside it); Winter 2027/28 · 1 February–15 March 2027. TU Braunschweig's general international master's windows (1 December–15 January and 1 June–15 July) do not apply to these programmes. M.Sc. Computational Sciences in Engineering's own programme page states it begins in the winter semester only, with no summer intake mentioned — the Summer 2027 window applies to M.Sc. Data Science",
  "sources": [
    {"title": "Application - TU Braunschweig (states the special 1 Aug–15 Sep / 1 Feb–15 Mar windows for English-language/bilingual international master's programmes, vs. the general 1 Jun–15 Jul / 1 Dec–15 Jan windows)", "url": "https://www.tu-braunschweig.de/en/application"},
    {"title": "Data Science (Master) - TU Braunschweig", "url": "https://www.tu-braunschweig.de/en/degree-programmes/data-science-master"},
    {"title": "CSE: Computational Sciences in Engineering (Master) - TU Braunschweig", "url": "https://www.tu-braunschweig.de/en/degree-programmes/cse-computational-sciences-in-engineering-master"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Status/window reconfirmed unchanged and genuinely 'Open now' via a direct fetch of the official page (not assumed from the old text merely covering today's date); new finding worth flagging for the applied edit: CSE's own page states winter-semester start only, so the row's Summer 2027 window is driven by Data Science, not both listed programmes as the current text implies."
}
```

### bayreuth

Confirmed unchanged: the Computer Science M.Sc. programme's own page and the International Office's central non-EU deadlines page both state the recurring windows verbatim — non-EU Summer semester 15 October–15 January, non-EU Winter semester 15 April–15 July — described as applying "consistently each year." Winter 2026/27's window (15 April–15 July 2026) has closed as of 23 August 2026, so the next window is Summer 2027, opening 15 October 2026, matching the recorded row exactly.

```json
{
  "id": "bayreuth",
  "currentTagsInDataset": ["Opens Oct ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Oct ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Winter 2026/27 closed · 15 April–15 July 2026; Summer 2027 · 15 October 2026–15 January 2027; Winter 2027/28 · 15 April–15 July 2027",
  "sources": [
    {"title": "Computer Science, Master of Science (M.Sc.) - University of Bayreuth", "url": "https://www.uni-bayreuth.de/en/master/computer-science"},
    {"title": "Periods and Deadlines - Application for Master's - University of Bayreuth International Office", "url": "https://www.international-office.uni-bayreuth.de/en/degree-programmes/4-periods-and-deadlines-for-masters/index.php"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Both the programme's own page and the International Office's central deadlines page confirm the exact recorded 15 Oct–15 Jan (summer) / 15 Apr–15 Jul (winter) recurring non-EU windows verbatim; no change."
}
```

### mannheim

**Downgraded to unresolved on close inspection of conflicting evidence.** The Mannheim Master in Data Science's own programme page states, without a year attached, "For spring semesters, application is possible from 15 October until 15 November" — read in isolation this looks like a recurring policy. But the university's central application-deadlines page (uni-mannheim.de/en/academics/dates/application-deadlines/), fetched separately and quoted in full, ties the *identical* 15 October–15 November dates specifically to "the spring semester 2026" cycle ("planned to begin on 15 October and end on 15 November 2025") and states fall-semester deadlines "vary" without asserting the spring pattern repeats. That page also confirms Fall 2026/2027's deadline (1 April–15 May 2026, closed) and states Spring 2027/Fall 2027 dates are not yet published — matching the recorded text exactly. Since the only evidence for a recurring spring policy is an undated restatement of what the dated central page shows was a single (2026-specific) instance, this doesn't clear the recurring-policy bar, per the same reasoning previously applied to the marburg and saarland rows in this file.

```json
{
  "id": "mannheim",
  "currentTagsInDataset": ["Summer ’27", "Winter ’27"],
  "sources": [
    {"title": "Mannheim Master in Data Science - University of Mannheim (undated 'For spring semesters, application is possible from 15 October until 15 November')", "url": "https://www.uni-mannheim.de/en/academics/before-your-studies/programs/mannheim-master-in-data-science/"},
    {"title": "Application Deadlines - University of Mannheim (ties the same 15 Oct–15 Nov dates to 'the spring semester 2026' specifically; Fall 2026/2027 1 Apr–15 May 2026; Spring/Fall 2027 not yet published)", "url": "https://www.uni-mannheim.de/en/academics/dates/application-deadlines/"},
    {"title": "Mannheim Master in Data Science - School of Business Informatics and Mathematics (checked for corroboration, no deadline info found)", "url": "https://www.wim.uni-mannheim.de/en/academics/organizing-your-studies/mannheim-master-in-data-science/"}
  ],
  "changed": false,
  "unresolved": true,
  "note": "Recorded 'not yet officially published' state for Spring/Fall 2027 is reconfirmed unchanged via the central deadlines page; the program page's undated 15 Oct–15 Nov phrasing initially looked like a recurring policy but the central page reveals it as a restatement of the single Spring-2026 cycle, so it does not meet the recurring-policy bar — leaving the row's missing status chip unresolved rather than projecting 'Opens Oct '26' from a single instance."
}
```

### rptu-kaiserslautern

**Changed — new opening-date evidence found for one of the two listed programmes.** M.Sc. Computer Science's own portals (applymsc.cs.rptu.de, and the CS department's how-to-apply page) confirm the recorded deadlines exactly — Summer 2027 · 31 October 2026, Winter 2027/28 · 30 April 2027 — but state no opening date, as recorded. However, M.Sc. Embedded Computing Systems uses a *separate* portal run by the Dept. of Electrical and Computer Engineering (applymsc.eit.rptu.de), which explicitly states its application windows as "for the summer semester: from May 1 until October 31 of the year before" and "for the winter semester: from November 1 of the year before until April 30" — i.e. Summer 2027 · 1 May–31 October 2026, Winter 2027/28 · 1 November 2026–30 April 2027 — phrased as a standing (relative-year) rule, not a one-off date. Today, 23 August 2026, falls inside that 1 May–31 October 2026 window, so the Embedded Computing Systems portal is confirmed open now. Cross-checked the closing dates against RPTU's official International Affairs (RefIntA) PDF flyer, dated 08/2026 (this month) and covering "Electrical & Computer Engineering" generally: it confirms the same 31 October (summer) / 30 April (winter) deadlines but does not itself mention an opening date (the flyer's scope is deadlines only, so this is not a contradiction, just narrower scope than the portal's own text).

```json
{
  "id": "rptu-kaiserslautern",
  "currentTagsInDataset": ["Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Open now",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Open now for Summer 2027 via the Dept. of Electrical and Computer Engineering's M.Sc. Embedded Computing Systems portal, which states a standing window 'for the summer semester: from May 1 until October 31 of the year before' (i.e. Summer 2027 · 1 May–31 October 2026) and 'for the winter semester: from November 1 of the year before until April 30' (Winter 2027/28 · 1 November 2026–30 April 2027). M.Sc. Computer Science, on the Dept. of Computer Science's separate portal, has the same deadlines — Summer 2027 · 31 October 2026; Winter 2027/28 · 30 April 2027 — but that portal still states no opening date",
  "sources": [
    {"title": "M.Sc. Application Dept. of Electrical and Computer Engineering - RPTU ('for the summer semester: from May 1 until October 31 of the year before'; 'for the winter semester: from November 1 of the year before until April 30')", "url": "https://applymsc.eit.rptu.de/"},
    {"title": "M.Sc. Application TUK-CS - RPTU (Dept. of Computer Science portal; redirected from applymsc.informatik.uni-kl.de)", "url": "https://applymsc.cs.rptu.de/"},
    {"title": "Dept. of Computer Sci.: How To Apply (Master) - RPTU", "url": "https://www.cs.rptu.de/en/studium/studiengaenge/bm-inf/how_to_apply.ma/"},
    {"title": "Infoblatt - Application Deadlines Int. Master Programs - RPTU International Affairs (RefIntA), dated 08/2026", "url": "https://rptu.de/fileadmin/isgs/pdf/Infobl_tter/Infoblatt_-_Application_Deadlines_Int._Master_Programs.pdf"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "New finding: the recorded 'no portal opening date is published' claim held for M.Sc. Computer Science's own portal but missed that M.Sc. Embedded Computing Systems uses a separate departmental portal (applymsc.eit.rptu.de) that does publish a standing opening date, currently placing the row inside an open window — added the previously-missing status chip 'Open now' on that basis."
}
```

## B7

### greifswald

**Ruling (coordinator-reviewed): ship as `changed: true`, not `unresolved`.** The dataset's current "by 31 May" claim is affirmatively wrong — it does not appear on any official Greifswald page checked — so it's worth correcting even though a Winter-2027/28-specific date can't be confirmed. University of Greifswald's central International Office deadline page (fetched directly) states, for non-EU/EEA applicants to Winter Semester 2026/2027, "all other Master's programmes" (Data Science is not the excepted Landscape Ecology programme) run **01.05.2026–15.07.2026** — the nearest published cycle, and the closest verified stand-in for the recurring non-EU window. The general "Dates and Deadlines" page shows a closely related category (1st subject semester incl. Master, admission-restricted/EU track) at 12 May 2025–15 July 2025 for WS2025/26 and 11 May 2026–15 July 2026 for WS2026/27 — two consecutive years of a similar ~"early/mid-May to 15 July" pattern, but that's a *different* applicant category from the non-EU one relevant to a Bangladeshi applicant, for which only one year (WS2026/27: 01.05–15.07) was found stated explicitly — not enough to assert a month-level status chip, so no `verifiedStatusTag` is set (that stays unasserted, per the same recurring-policy bar used elsewhere in this file, e.g. tu-braunschweig/hpi). **Note for the apply-edits step:** the *current* dataset row already has no status chip (tags: `["Winter '27"]` only) — this finding corrects the applicationWindow prose, it does not resolve that pre-existing missing-chip gap. Do not infer or invent a status chip from this row's `changed: true`; either leave the row chip-less (known pre-existing gap, separate from this correction) or flag it for a human.

```json
{
  "id": "greifswald",
  "currentTagsInDataset": ["Winter ’27"],
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter-only entry; the confirmed non-EU Master's application window for the nearest published cycle (Winter 2026/27) is 1 May – 15 July via uni-assist — the dataset's prior '31 May' deadline claim does not appear on any official page and should be treated as superseded. Winter 2027/28-specific dates are not yet separately announced.",
  "sources": [
    {"title": "Application Procedure for International Applicants - University of Greifswald (non-EU/EEA, 'all other Master's programmes': 01.05.2026–15.07.2026 for Winter Semester 2026/2027; Summer Semester 2027: 1 Nov 2026–15 Jan 2027)", "url": "https://www.uni-greifswald.de/en/international/incoming/degree-seeking-students/application-procedure-for-international-applicants/"},
    {"title": "Dates and Deadlines - University of Greifswald (general/EU-track '1st subject semester incl. Master' category: 12 May 2025–15 Jul 2025 for WS2025/26; 11 May 2026–15 Jul 2026 for WS2026/27)", "url": "https://www.uni-greifswald.de/en/study/prior-to-studies/dates-and-deadlines/"},
    {"title": "Data Science - University of Greifswald (programme page; states winter-only start, no deadline dates)", "url": "https://www.uni-greifswald.de/en/study/prior-to-studies/study-opportunities/courses-and-degrees/d/data-science/"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "The recorded '31 May' deadline does not appear on any official Greifswald page and is corrected here to the confirmed 1 May–15 July non-EU window (verified for the nearest published cycle, Winter 2026/27; Winter 2027/28-specific dates remain unannounced). No verifiedStatusTag is set — evidence doesn't clear the recurring-policy bar for a month-level chip. IMPORTANT: the row's current dataset tags already have no status chip (only 'Winter '27'), so this change is a prose/window correction only — it does not resolve that pre-existing missing-chip gap, and the apply step must not invent a chip from this row's changed:true; leave it chip-less or flag for a human."
}
```

### ovgu-magdeburg

Confirmed unchanged: OVGU's own Data and Knowledge Engineering programme page states the uni-assist (international applicant) deadlines verbatim — Winter semester 15 May, Summer semester 15 November — exactly matching the recorded "Summer 2027 · uni-assist deadline 15 November 2026; Winter 2027/28 · uni-assist deadline 15 May 2027." A general OVGU admissions FAQ page (isp.ovgu.de) mentions a different-sounding "application period generally begins by April 15" with June/July deadlines, but that page is not programme-specific and conflicts with the DKE programme's own stated 15 May/15 November dates, so it's treated as not applicable to this row rather than a basis for change. No official source states a portal-opening date for DKE specifically, consistent with the row's current no-chip state.

```json
{
  "id": "ovgu-magdeburg",
  "currentTagsInDataset": ["Summer ’27", "Winter ’27"],
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · uni-assist deadline 15 November 2026; Winter 2027/28 · uni-assist deadline 15 May 2027. No portal opening date is published",
  "sources": [
    {"title": "Data and Knowledge Engineering (Master) - OVGU (uni-assist/international deadlines: Winter semester 15 May, Summer semester 15 November)", "url": "https://www.ovgu.de/en/Study/Study%2BProgrammes/Master/Data%2Band%2BKnowledge%2BEngineering.html"},
    {"title": "International Study Programs Application FAQ - isp@ovgu.de (general, non-programme-specific dates; not used as basis for this row)", "url": "https://www.isp.ovgu.de/FAQ/Application.html"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Programme's own page confirms the exact recorded 15 May (winter) / 15 November (summer) uni-assist deadlines verbatim and still publishes no portal-opening date; no change. No verifiedStatusTag: the row has no status chip on record and none is being added — confirmed absence of a published opening date, not an unresolved determination."
}
```

### luebeck

**Priority check confirmed.** University of Lübeck's own M.Sc. Robotics and Autonomous Systems programme page (fetched directly) states the non-EU/uni-assist deadlines verbatim, presented as standing recurring periods with no year attached — Summer semester 01.09–15.10, Winter semester 15.02–01.04 — exactly matching the recorded Summer 2027 (1 Sep–15 Oct 2026) and Winter 2027/28 (15 Feb–1 Apr 2027) windows. The 1 September 2026 opening date for the Summer 2027 window is reconfirmed live on the official page; no change or drift found.

```json
{
  "id": "luebeck",
  "currentTagsInDataset": ["Opens Sep ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Sep ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Winter 2026/27 closed · 15 February–1 April 2026; Summer 2027 · 1 September–15 October 2026; Winter 2027/28 · 15 February–1 April 2027",
  "sources": [
    {"title": "Master's degree program Robotics and Autonomous Systems - University Lübeck (non-EU/uni-assist deadlines: Summer semester 01.09–15.10; Winter semester 15.02–01.04)", "url": "https://www2.uni-luebeck.de/en/study-program/technology/robotics-and-autonomous-systems/masters-degree-program-robotics-and-autonomous-systems/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Priority check passed: the programme's own live page still states the recurring 01.09–15.10 (summer) / 15.02–01.04 (winter) non-EU windows verbatim, confirming the imminent 1 September 2026 opening is accurate and not stale; no change."
}
```

### kassel

**Priority check confirmed.** University of Kassel's own M.Sc. Computer Science application-and-admission page (fetched directly) states the deadlines for applicants with foreign certificates explicitly as recurring ("annually") — Summer semester "annually 01.09.–15.01." and Winter semester "annually 01.03.–15.07." — exactly matching the recorded Summer 2027 (1 Sep 2026–15 Jan 2027) and Winter 2027/28 (1 Mar–15 Jul 2027) windows. The 1 September 2026 opening date for the Summer 2027 window is reconfirmed live and explicitly labelled as an annually-recurring date; no change or drift found.

```json
{
  "id": "kassel",
  "currentTagsInDataset": ["Opens Sep ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Sep ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · 1 September 2026–15 January 2027 for applicants with foreign certificates (stated as recurring 'annually 01.09.–15.01.'); Winter 2027/28 · 1 March–15 July 2027 (stated as recurring 'annually 01.03.–15.07.')",
  "sources": [
    {"title": "Application and admission - Computer Science (Master) - University of Kassel (foreign-certificate deadlines explicitly labelled 'annually 01.09.–15.01.' summer / 'annually 01.03.–15.07.' winter)", "url": "https://www.uni-kassel.de/uni/en/studium/computer-science-master/application-and-admission.html"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Priority check passed: the programme's own live page states the deadlines as explicitly recurring ('annually') and unchanged from the recorded 1 Sep–15 Jan (summer) / 1 Mar–15 Jul (winter) windows, confirming the imminent 1 September 2026 opening is accurate; no change."
}
```

### augsburg

**Changed — found a sourced opening-date statement that was previously missing.** University of Augsburg's own M.Sc. Data Science programme page (fetched directly and quoted verbatim) confirms the recorded deadlines exactly — Winter semester 1 September, Summer semester 1 March, both stated without a specific year (recurring), plus the same non-EU recommended-earlier-deadline framing (1 May winter / 1 December summer) already on record. Crucially, the same page also states explicitly, as a standing rule: "the portal will open for applications targeting the winter semester in mid-March, while applications for the summer semester will be possible from mid-September." This is an affirmative, general (non-year-specific) recurring-policy statement, meeting the bar for a status chip. Since today is 23 August 2026 and the Summer 2027 portal opens "mid-September" (i.e., mid-September 2026, about three weeks from now), the correct new status chip is "Opens Sep '26" — a genuine finding, not previously reflected in the row (which currently has no status chip at all).

```json
{
  "id": "augsburg",
  "currentTagsInDataset": ["Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Sep ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · portal opens mid-September 2026, official deadline 1 March 2027; non-EU applicants advised to apply by 1 December 2026 for visa processing. Winter 2027/28 · portal opens mid-March 2027, official deadline 1 September 2027; non-EU applicants advised to apply by 1 May 2027. Both the deadlines and the mid-March/mid-September portal-opening pattern are stated by the programme's own page as standing (non-year-specific) rules",
  "sources": [
    {"title": "Master degree programme: Data Science - University of Augsburg ('the portal will open for applications targeting the winter semester in mid-March, while applications for the summer semester will be possible from mid-September'; deadlines '01. March' / '01. September'; non-EU recommended 'May 1st for winter, December 1st for summer')", "url": "https://www.uni-augsburg.de/en/fakultaet/fai/informatik/studienangebot/msc-dsc/"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Deadlines and non-EU recommended dates confirmed unchanged, but the row was missing its status chip despite the programme's own page stating a general recurring portal-opening rule ('mid-September' for summer semester); added 'Opens Sep '26' since that falls about three weeks from today (23 Aug 2026)."
}
```

### wuppertal

Confirmed unchanged: the CSiS programme's own application page (csis.uni-wuppertal.de) states verbatim "Apply for start in winter semester 2027/28 – from November 15th, 2026 to March 31st, 2027!" and explicitly frames this as following the same schedule every year, matching the recorded window (15 November 2026–31 March 2027) and the "Opens Nov '26" status chip exactly. The programme is winter-entry only, consistent with the recorded single "Winter '27" intake tag.

```json
{
  "id": "wuppertal",
  "currentTagsInDataset": ["Opens Nov ’26", "Winter ’27"],
  "verifiedStatusTag": "Opens Nov ’26",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027/28 · 15 November 2026–31 March 2027, stated on the programme's own application page (\"Apply for start in winter semester 2027/28 – from November 15th, 2026 to March 31st, 2027!\"), which also states the application process usually follows the same deadlines every year; studies begin only in the winter semester. German-bachelor's-degree holders may submit directly to the CSiS office by 15 September 2026",
  "sources": [
    {"title": "Application - CSiS - University of Wuppertal (\"Apply for start in winter semester 2027/28 – from November 15th, 2026 to March 31st, 2027!\"; states the process usually follows the same deadlines every year)", "url": "https://www.csis.uni-wuppertal.de/en/application/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "The programme's own application page confirms the exact recorded 15 Nov 2026–31 Mar 2027 window and 'Opens Nov ’26' status verbatim, and explicitly states the schedule recurs annually; no change."
}
```

## B8

### chemnitz

Checked the department's own Web Engineering programme page directly (not just the central table), as instructed. It states, verbatim: admission status "free admission" (zulassungsfrei, i.e. no local NC/restriction), start of studies "usually winter term" (not "winter only" — no explicit exclusion of summer), and defers all specific deadlines to TU Chemnitz's central calendar. Fetching that central calendar in full (distinguishing the two parallel tracks it runs) shows Web Engineering, as an admission-free programme, falls under the "without restrictions of admission" track — Summer Semester 2027: 09.11.2026–12.03.2027 (extended enrolment to 30.04.2027); Winter Semester 2026/2027: 25.05.2026–18.09.2026 (extended to 31.10.2026) — which is a *different* track from the "restricted-admission via uni-assist" dates (01.04–15.07 / 01.10–15.01) that the row's currently-recorded text cites as Web Engineering's Winter-2026/27 window. This is a real conflict I could not cleanly resolve: the department page's plain-language "free admission" status points to the admission-free track, but the already-recorded text's 1 Apr–15 Jul 2026 figure exactly matches the *restricted*-admission uni-assist row instead, and I found no single official page that explicitly states which track governs *international/uni-assist* applicants to a *specific admission-free* programme like this one — German "zulassungsfrei" programmes often still route foreign-certificate applicants through an earlier uni-assist-specific cut-off distinct from the general domestic admission-free window, and I could not confirm one way or the other for Web Engineering specifically. DAAD's programme detail page adds (cross-check only, not sole basis) that "enrolment is also possible for the summer semester" with examination-board approval, consistent with "usually" (not "only") winter — but frames it as a discretionary exception, not a standard second intake. The operative question a Bangladeshi/non-EU applicant actually needs answered — which of the two deadline tracks applies to them — is precisely what I could not confirm from any official source, so this ships as unresolved rather than as a written-out pair of candidate tracks that could read as settled guidance.

```json
{
  "id": "chemnitz",
  "currentTagsInDataset": ["Winter ’27"],
  "sources": [
    {"title": "Degree Program Web Engineering (M.Sc.) - Faculty of Computer Science - TU Chemnitz", "url": "https://www.tu-chemnitz.de/informatik/studium/studiengaenge/ma_web_engineering.php.en"},
    {"title": "FAQs - DigiAssist - TU Chemnitz International Office", "url": "https://www.tu-chemnitz.de/international/digiassist/Digi_FAQs.php.en"},
    {"title": "Academic Calendar - Student Service and Central Course Guidance Service - TU Chemnitz", "url": "https://www.tu-chemnitz.de/studierendenservice/termine.php.en"},
    {"title": "Information on application procedures - Student Service - TU Chemnitz", "url": "https://www.tu-chemnitz.de/studierendenservice/studserv/bewerbung/inform_bewerbungsverf.php"},
    {"title": "Study \"Web Engineering\" (Master) in Germany - Chemnitz University of Technology - DAAD (cross-check only)", "url": "https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/detail/chemnitz-university-of-technology-web-engineering-w49156/?hec-id=w49156"}
  ],
  "changed": true,
  "unresolved": true,
  "note": "Confirmed Web Engineering is officially 'free admission' (zulassungsfrei) and starts 'usually' rather than exclusively in winter — establishing the recorded 'Winter 2026/27 ran 1 April–15 July 2026, closed' framing is incomplete/misleading, since that figure actually matches TU Chemnitz's separate *restricted*-admission-via-uni-assist track (01.04–15.07 winter / 01.10–15.01 summer), not the *admission-free* track (25.05–18.09 winter, extended to 31.10; 09.11–12.03 summer, extended to 30.04) that 'free admission' status points to. Could not confirm from any official source which of the two tracks governs a non-EU/uni-assist applicant to this specific admission-free programme, nor confirm or rule out a genuine Summer intake (DAAD mentions summer enrolment as a discretionary board-approval exception only). Recommend the department be contacted directly (email) to confirm which track a non-EU/uni-assist applicant to Web Engineering should use; leaving dataset's current text in place until then."
}
```

### oldenburg

Confirmed unchanged in substance: the programme's own page states winter-only entry ("application is only possible in the winter semester") with a non-EU/third-country deadline of 30 April, matching the recorded text. I found one additional page (the programme's international-applicant subpage) giving a specific opening date, "First day of application: March 15th, 2026," but that same page explicitly warns "this degree programme is still in the planning stage and deadlines may therefore change" and gives no recurring-policy language — a single, self-flagged-as-provisional instance, which fails the evidence-strength bar for projecting an "Opens Mar '27" chip forward to the Winter 2027/28 cycle. No opening date is stated anywhere else, official or otherwise, so the row correctly carries no status chip.

```json
{
  "id": "oldenburg",
  "currentTagsInDataset": ["Winter ’27"],
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter-only entry; the non-EU/third-country deadline is 30 April, so Winter 2027/28 closes 30 April 2027 (EU/German-certificate applicants have a later 15 July deadline). One programme subpage states a 'first day of application' of 15 March for the current (2026) cycle, but the same page flags the programme as 'still in the planning stage' with deadlines liable to change and gives no recurring-policy language, so this single instance is not projected forward to Winter 2027/28; no reliable opening date is published",
  "sources": [
    {"title": "Data Science and Machine Learning - Master's Programme - University of Oldenburg", "url": "https://uol.de/en/course-of-study/data-science-and-machine-learning-master-635"},
    {"title": "How to apply: Data Science and Machine Learning - Master's Programme (international) - University of Oldenburg", "url": "https://uol.de/en/course-of-study/application/data-science-and-machine-learning-master-635/freshman/international"},
    {"title": "Application deadline for Master's programmes - University of Oldenburg", "url": "https://uol.de/en/students/application/deadline/masters"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Non-EU 30 April deadline and winter-only entry confirmed verbatim; the one opening-date data point found (15 March 2026) is explicitly self-described as provisional/planning-stage with no recurring-policy statement, so it does not clear the bar for a status chip — dataset's lack of a chip stands as correct, not a gap."
}
```

### trier

Confirmed unchanged: both the programme's own Data Science page and the university's central English-taught-master's-programmes application page corroborate the recorded windows and PORTA opening pattern verbatim — Summer 2027 · 15 December 2026–15 January 2027 (PORTA opens mid-December); Winter 2027/28 · 1–31 May 2027 (PORTA opens beginning of May). This is presented as the university's standing recurring schedule, not a one-off. As of 23 August 2026 neither window is open; the next to open is Summer 2027 on 15 December 2026, matching the "Opens Dec '26" tag.

```json
{
  "id": "trier",
  "currentTagsInDataset": ["Opens Dec ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Dec ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · 15 December 2026 – 15 January 2027 for non-EU applicants (EU applicants: 15 December 2026 – 15 July 2027, per the central table); Winter 2027/28 · 1 – 31 May 2027 (non-EU); EU: 1 May – 15 July 2027. PORTA, the application portal, opens mid-December for summer-semester applications and beginning of May for winter-semester applications — stated as the recurring pattern, not cycle-specific. The university recommends winter entry as optimal for programme design, though summer admission is possible",
  "sources": [
    {"title": "Application - English-taught Master's programmes - Trier University", "url": "https://www.uni-trier.de/en/studies/application-admission/application-english-taught-masters-courses"},
    {"title": "M.Sc. Data Science (1-Subject) Study Information - Trier University", "url": "https://www.uni-trier.de/en/studium/studienangebot/studiengaenge-von-a-z/english-taught-masters-courses/data-science-master-of-science-1-subject-study-information-en"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Both the central English-taught-master's application page and the Data Science programme page confirm the exact recorded windows and PORTA opening months verbatim, framed as the recurring schedule; no change."
}
```

### paderborn

Confirmed unchanged: both the Computer Science department's own international-students page and its application page state the recorded deadlines verbatim — Summer semester (from April) until 30 November [previous year]; Winter semester (from October) until 31 May — with no opening date published anywhere on either page. As of 23 August 2026 no status chip is supportable; the row correctly carries none.

```json
{
  "id": "paderborn",
  "currentTagsInDataset": ["Summer ’27", "Winter ’27"],
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · deadline 30 November 2026; Winter 2027/28 · deadline 31 May 2027. Applications for international students are submitted via uni-assist. No portal opening date is published on the department's international-students page or its dedicated application page",
  "sources": [
    {"title": "Information for international students - Department of Computer Science - Paderborn University", "url": "https://cs.uni-paderborn.de/en/studies/getting-started/information-for-international-students"},
    {"title": "Application - Department of Computer Science - Paderborn University", "url": "https://cs.uni-paderborn.de/en/studies/getting-started/application"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Both department pages confirm the exact recorded 30 November (summer) / 31 May (winter) deadlines verbatim, with no opening date published anywhere; no change."
}
```

### siegen

Confirmed unchanged: the programme's own \"How to Apply\" page states verbatim that the online application portal for the ETI International Master in Computer Science \"opens on January 1st\" and closes \"April 30th,\" winter-intake only, exclusively for non-EU applicants — matching the recorded 1 January–30 April window and its every-cycle framing exactly. As of 23 August 2026 the Winter-2027/28 window (1 Jan–30 Apr 2027) has not opened yet, matching the \"Opens Jan '27\" tag.

```json
{
  "id": "siegen",
  "currentTagsInDataset": ["Opens Jan ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Jan ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter-only entry, exclusively for non-EU applicants. The programme's own application page states the online portal 'opens on January 1st' and the deadline is '30 April' each cycle. Winter 2026/27 (1 January–30 April 2026) is closed; Winter 2027/28 opens 1 January 2027 and closes 30 April 2027",
  "sources": [
    {"title": "ETI International Master in Computer Science - University of Siegen", "url": "https://www.uni-siegen.de/eti-international-master-in-computer-science"},
    {"title": "ETI International Master in Computer Science - How to Apply - University of Siegen", "url": "https://www.uni-siegen.de/en/eti-international-master-in-computer-science-how-to-apply"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Programme's own pages confirm the exact recorded 1 January–30 April window (stated as the portal's opening/closing pattern) and winter-only, non-EU-only framing verbatim; no change."
}
```

### osnabrueck

**High-priority correction**: re-checked which deadline pair governs non-EU/uni-assist applicants (the route Bangladeshi applicants must use) versus which applies to the direct HISinOne portal (for applicants who don't need uni-assist, e.g. German nationals or those already studying in Germany) — and found the row's recorded text has the pairing backwards. Two independent official Osnabrück pages (the central non-European-applicants page and the uni-assist-specific application page) state, identically: uni-assist deadlines are 15 June (winter semester) and 15 December (summer semester); the 15 January/15 July pair belongs to the direct HISinOne track, not uni-assist. Since \"international applicants for Master's programmes are required to submit their application exclusively via uni-assist\" per the university's own page, the 15 June/15 December pair is the one that actually applies to a Bangladeshi applicant — the opposite of what the recorded text implied. The uni-assist page additionally gives a concrete current-cycle opening date: \"the application process for summer semester 2027 will approximately begin on 15th September 2026,\" clearing the evidence bar for a status chip.

```json
{
  "id": "osnabrueck",
  "currentTagsInDataset": ["Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Sep ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Cognitive Science admits in both semesters. Two independent official pages (the university's central non-European-applicants page and its uni-assist application page) confirm, identically, that international applicants — required to apply exclusively via uni-assist — face deadlines of 15 June for winter-semester entry (Winter 2027/28) and 15 December for summer-semester entry (Summer 2027). This is the reverse of the 15 January/15 July pair, which applies only to the direct HISinOne-Studienorganisation portal used by applicants who don't need uni-assist (German nationals or those already studying in Germany). The uni-assist page states the Summer 2027 application process will 'approximately begin on 15th September 2026'; no opening date is published for the Winter 2027/28 (15 June 2027) deadline",
  "sources": [
    {"title": "International students from non-European countries - Osnabrück University", "url": "https://www.uni-osnabrueck.de/en/studying/application-and-start-of-studies/application-admission-and-enrollment/application-information-for-international-students/international-students-from-non-european-countries"},
    {"title": "Application at Osnabrück University via uni-assist e.V. - Osnabrück University", "url": "https://www.uni-osnabrueck.de/en/studying/application-and-start-of-studies/application-admission-and-enrollment/application-information-for-international-students/application-via-uni-assist-ev"},
    {"title": "Cognitive Science (Master of Science) - Study Programs A-Z - Osnabrück University", "url": "https://www.uni-osnabrueck.de/en/studying/our-study-programs/study-programs-from-a-z/cognitive-science-master-of-science"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Resolved the internal conflict flagged in the recorded text: for non-EU/uni-assist applicants (the Bangladeshi-applicant route), the correct deadline pair is 15 June (winter) / 15 December (summer) — the recorded text had this backwards, attributing 15 Jan/15 Jul to uni-assist when that pair actually belongs to the German/already-in-Germany direct-portal track. Also added a sourced 'Opens Sep '26' status chip from the uni-assist page's stated Summer-2027 opening estimate (~15 September 2026), previously absent."
}
```
## B9

### btu-cottbus

Confirmed unchanged for the recorded chip: BTU's own AI-programme FAQ gives exact current-and-future uni-Assist dates that match the record verbatim (Winter 2026/27 foreign-degree window 1 March–15 July 2026, closed; Summer 2027 window 1 November 2026–15 January 2027, not yet open). New nuance found: the row's second programme, Cyber Security M.Sc., has no Summer intake at all and runs its own, earlier-closing Winter 2026/27 uni-Assist window (1 March–15 May 2026 for non-EU/EEA, 1 March–15 August 2026 for EU/EEA) that the current one-size-fits-all "Winter 2026/27 ... closed on 15 July 2026" sentence incorrectly implies also covers Cyber Security; Cyber Security's Winter 2027/28 dates are not yet published.

```json
{
  "id": "btu-cottbus",
  "currentTagsInDataset": ["Opens Nov ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Nov ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Artificial Intelligence M.Sc. (uni-Assist, foreign qualifications) — Summer 2027: 1 November 2026 – 15 January 2027 (not yet open); Winter 2026/27 window closed 15 July 2026; Winter 2027/28 not yet published. Cyber Security M.Sc. has no Summer intake; its own Winter 2026/27 window for foreign qualifications ran 1 March – 15 May 2026 (non-EU/EEA) / 1 March – 15 August 2026 (EU/EEA) via uni-Assist — a different, earlier-closing window than the AI programme's — and Winter 2027/28 dates are not yet published. As of 23 August 2026 neither programme's window is open; the next confirmed opening is AI's Summer 2027 window on 1 November 2026.",
  "sources": [
    {"title": "Artificial Intelligence (M.Sc.) - BTU Cottbus-Senftenberg", "url": "https://www.b-tu.de/en/artificial-intelligence-ms/page"},
    {"title": "Artificial Intelligence (M.Sc.) FAQ - BTU Cottbus-Senftenberg", "url": "https://www.b-tu.de/en/artificial-intelligence-ms/faq"},
    {"title": "Cyber Security (M.Sc.) Admission - BTU Cottbus-Senftenberg", "url": "https://www.b-tu.de/en/cybersecurity-ms/admission"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Status chip and intake tags confirmed unchanged (AI programme's dates match the record exactly), but the applicationWindow text incorrectly generalises the AI programme's 15 July 2026 Winter-closure date to the whole row — Cyber Security has its own separate, earlier Winter 2026/27 window (1 March–15 May/15 August 2026) and no Summer intake at all, worth splitting out in the applied edit."
}
```

### htw-berlin

Priority check confirmed directly on the live applying page: as of 23 August 2026 the Summer 2027 window is still open exactly as recorded (1 May–31 August 2026, closing in 8 days, no early closure or extension noted), and the Winter 2027/28 window (1 November 2026–28 February 2027) is confirmed not yet open.

```json
{
  "id": "htw-berlin",
  "currentTagsInDataset": ["Open now", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Open now",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Open now for Summer 2027 · 1 May – 31 August 2026 (as of 23 August 2026, eight days from the stated close, with no extension or early-closure notice found); Winter 2027/28 · 1 November 2026 – 28 February 2027 (not yet open)",
  "sources": [
    {"title": "MPMD — Applying - HTW Berlin", "url": "https://mpmd.htw-berlin.de/applying/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Priority-checked given the 8-day margin to the window's own stated end date; the live applying page confirms the Summer 2027 window is still open exactly as recorded, with no sign of early closure or extension; no change."
}
```

### hwr-berlin

Confirmed unchanged: two independent official HWR pages (the programme page and the department's applying-FAQ) both give the same non-German-degree (uni-assist) window of 15 March–15 May, stated generically without a tied year, consistent with the record's projected Winter 2027/28 dates; German-degree applicants use a separate 15 April–15 June window via HWR's own S.A.M. platform, and the programme remains October-intake only.

```json
{
  "id": "hwr-berlin",
  "currentTagsInDataset": ["Opens Mar ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Mar ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027/28 · 15 March – 15 May 2027 for applicants with a non-German degree, who apply through uni-assist rather than the HWR platform (this window is stated generically on HWR's own pages, without a tied year, and projects forward to Winter 2027/28); applicants with a German degree apply 15 April – 15 June directly via HWR's S.A.M. platform. Only an October start is offered.",
  "sources": [
    {"title": "Business Intelligence and Process Management - HWR Berlin", "url": "https://www.hwr-berlin.de/en/study/degree-programme/detail/13-business-intelligence-and-process-management"},
    {"title": "FAQs — Applying for Master degree programmes - Department 1, HWR Berlin", "url": "https://www.hwr-berlin.de/en/hwr-berlin/departments-and-bps/department-1-business-and-economics/studying-at-the-department/faqs-applying-for-master-degree-programmes/"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Both the programme page and the department FAQ corroborate the recorded 15 March–15 May (non-German-degree/uni-assist) window verbatim; no change."
}
```

### bht-berlin

Confirmed unchanged: BHT's own programme page states the recurring winter-intake window as "02 May – 15 June" without a tied year, matching the record's Winter 2027/28 projection; the separate studiengang-subdomain admission page adds only generic uni-assist routing info and a "two months after start" note that doesn't contradict the specific window on the main programme page.

```json
{
  "id": "bht-berlin",
  "currentTagsInDataset": ["Opens May ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens May ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027/28 · 2 May – 15 June 2027 on the programme page's recurring window (stated generically as '02 May – 15 June' without a tied year); the Winter 2026/27 cycle closed on 15 June 2026. No separate international deadline is published; foreign-degree applicants route through uni-assist.",
  "sources": [
    {"title": "M.Sc. Data Science - BHT Berlin", "url": "https://www.bht-berlin.de/en/m-ds"},
    {"title": "Admission & Application - Data Science Master - BHT Berlin", "url": "https://studiengang.bht-berlin.de/en/ds-master/admission-application"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Main programme page confirms the recorded '2 May – 15 June' recurring window verbatim; the admission-application subpage adds no conflicting dates, only generic uni-assist process notes; no change."
}
```

### frankfurt-uas

Both programme pages confirm the recorded 15 April closing deadline for foreign-qualification/uni-assist applicants (Winter 2026/27 closed 15 April 2026, domestic 15 September 2026) but state no opening date themselves, and neither page nor the university's general master's-application table contains an explicit "annually"/"each year"/"recurring" assertion — the table's "January – 15 April" range is an undated instance, not a quoted repeat-assertion, the same pattern already rejected for marburg/mannheim elsewhere in this file. No status chip is added; the table's category placement is kept as informational cross-reference only.

```json
{
  "id": "frankfurt-uas",
  "currentTagsInDataset": ["Winter ’27"],
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2026/27 closed for international/foreign-qualification applicants on 15 April 2026 (domestic/German-qualification deadline 15 September 2026); Winter 2027/28 dates are not separately published on either programme's own page. For informational context only (not a chip-level claim): the university's general master's-application table places English-taught programmes — a category that includes High Integrity Systems M.Sc. and the 4-semester Information Technology M.Eng. track recommended for international students — in a 'January – 15 April' winter-semester window for uni-assist/foreign-qualification applicants, matching both programmes' own individually published 15 April deadline; domestic applicants apply 1 April – 15 September. This table range is undated and carries no quoted 'annually'/'each year' language, so it is not treated as a confirmed recurring policy.",
  "sources": [
    {"title": "High Integrity Systems (M.Sc.) - For Prospective Students - Frankfurt UAS", "url": "https://www.frankfurt-university.de/de/studium/master-studiengange/high-integrity-systems-msc/fuer-studieninteressierte/"},
    {"title": "Information Technology (M.Eng.) - For Prospective Students - Frankfurt UAS", "url": "https://www.frankfurt-university.de/en/studies/master-programs/information-technology-meng/for-prospective-students/"},
    {"title": "Application for Master studies - Frankfurt UAS", "url": "https://www.frankfurt-university.de/en/studies/study-at-frankfurt-uas/application-for-master-studies/"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "No status chip added: the general master's-application table's 'January – 15 April' range for English-taught programmes is an undated single/current instance, not a quoted recurring-policy statement, so it doesn't clear the chip evidence bar (same standard already applied to marburg/mannheim). Still a genuine new finding worth recording in prose: the table independently corroborates both programmes' 15 April deadline and supplies the informal category context, even without licensing a chip."
}
```

### university-cologne

Both master's programmes' own pages state their application windows without a year attached to the date range itself (only past-cohort references appear), but neither page contains an explicit "annually"/"each year"/"recurring" assertion — an undated date range alone is the same pattern already rejected for marburg/mannheim elsewhere in this file, not proof of a recurring policy. Business Analytics & Econometrics runs mid-April–15 June via KLIPS; Computational Sciences runs a separate, later 15 June–15 July window. No status chip is added; both windows are recorded as confirmed but undated/possibly-recurring facts only.

```json
{
  "id": "university-cologne",
  "currentTagsInDataset": ["Winter ’27"],
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Business Analytics & Econometrics M.Sc. — applications run mid-April to 15 June via KLIPS, per the official application page ('From mid-April until 15 June, you apply exclusively online via the campus management system [KLIPS]'), with no year attached to the date range itself and no quoted 'annually'/'each year' language, so this is recorded as the currently-published window rather than a confirmed recurring policy. Computational Sciences M.Sc. — the department's prospective-students page states a separate, later 'Application Period: June 15 – July 15', likewise undated and without a repeat-assertion. Neither track's window is open as of 23 August 2026; no chip-level opening claim is made for either.",
  "sources": [
    {"title": "Master Business Analytics & Econometrics - WiSo Faculty, University of Cologne", "url": "https://wiso.uni-koeln.de/en/studies/master/master-business-analytics-econometrics"},
    {"title": "Application - Master Business Analytics and Econometrics - WiSo Faculty, University of Cologne", "url": "https://wiso.uni-koeln.de/en/studies/application/master/master-business-analytics-and-econometrics"},
    {"title": "For Prospective Students - Computational Sciences, University of Cologne", "url": "https://computationalsciences.uni-koeln.de/for-prospective-students"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "No status chip added: both programmes' date ranges are undated on their official pages with no quoted 'annually'/'each year' language, so neither clears the recurring-policy bar (same standard already applied to marburg/mannheim). Still a genuine correction worth recording: Computational Sciences' window was previously framed as a single past 2026 instance ('ran 15 June–15 July 2026') — it's now correctly framed as an undated, possibly-recurring-but-unconfirmed window, same evidentiary status as Business Analytics & Econometrics, rather than treated as stale."
}
```

## B10

### th-koeln

**Priority check confirmed unchanged**: TH Köln's own Digital Sciences "How to Apply" page (fetched fresh, full text) states verbatim, for non-EU/EEA applicants via uni-assist, "Application period for the summer semester 2027: Early September – October 31, 2026" — an exact match for the dataset's recorded window and status chip — and separately confirms "Application period for the winter semester 2026/2027: Early March 2026 – April 30, 2026" for the same non-EU/EEA category, matching the recorded "Winter 2026/27 equivalent ran early March – 30 April 2026" verbatim. No more precise day than "early September" is published anywhere official (the page structurally states periods only as "Early [month]" for every applicant category, German/EU/non-EU alike), so the exact opening day cannot be pinned down further, but the month-level chip is solidly confirmed current.

```json
{
  "id": "th-koeln",
  "currentTagsInDataset": ["Opens Sep ’26", "Summer ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Sep ’26",
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · early September – 31 October 2026 for applicants whose school and first degree are both from outside the EU/EEA (applying via uni-assist); the Winter 2026/27 equivalent ran early March 2026 – 30 April 2026. EU/EEA applicants (via uni-assist) get a later Summer 2027 window (early September 2026 – 15 December 2026) and German/CaMS applicants get early December 2026 – 15 January 2027. No exact day within 'early September' is published on any official TH Köln page — every applicant category on the how-to-apply page is stated only at 'Early [month]' granularity.",
  "sources": [
    {"title": "Digital Sciences (Master's program) – How to Apply - TH Köln", "url": "https://www.th-koeln.de/en/academics/digital-sciences-masters-program--how-to-apply_84162.php"},
    {"title": "Digital Sciences (Master's Program) - TH Köln", "url": "https://www.th-koeln.de/en/academics/digital-sciences-masters-program_83005.php"},
    {"title": "Application deadlines - TH Köln", "url": "https://www.th-koeln.de/en/academics/application-deadlines_6001.php"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "TH Köln's own programme 'How to Apply' page confirms both the current Summer-2027 non-EU window ('Early September – October 31, 2026') and the prior Winter-2026/27 non-EU window ('Early March 2026 – April 30, 2026') verbatim against the recorded text; no exact day beyond 'early September' exists on any official page, so the month-level chip stands unchanged."
}
```

### leipzig-university

Confirmed unchanged: both the department's own programme page and the university's central degree-programme page state a single undated deadline — applicants (including those with foreign degrees, via uni-assist) apply by 31 May for a winter-semester start, admission is winter-only, and no opening date is published anywhere. The date carries no year attached and no explicit "annually"/"each year" language, so per the file's evidence standard (already applied to marburg/mannheim/university-cologne) this does not clear the bar for a status chip — consistent with the row's current no-chip state, which is correct and stays unchanged.

```json
{
  "id": "leipzig-university",
  "currentTagsInDataset": [],
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Applicants with foreign degrees apply through uni-assist by 31 May for a start in the winter semester (Winter 2027/28 closes 31 May 2027); German-degree applicants use the same 31 May deadline via AlmaWeb. Admission is winter-only; no summer intake exists. No opening date is published on either the department's or the university's own pages, and the 31 May deadline is stated without a year attached (no explicit 'annually'/'each year' language)",
  "sources": [
    {"title": "Master Earth System Data Science and Remote Sensing - Faculty of Physics and Earth System Sciences, Leipzig University", "url": "https://www.physes.uni-leipzig.de/en/studying/courses-of-study/master-earth-system-data-science-and-remote-sensing"},
    {"title": "Earth System Data Science and Remote Sensing (M.Sc.) - Leipzig University", "url": "https://www.uni-leipzig.de/en/studying/prospective-students/courses-of-study/degree-programme/course/show/earth-system-data-science-and-remote-sensing-m-sc"}
  ],
  "changed": false,
  "unresolved": false,
  "note": "Both official Leipzig pages confirm the recorded 31-May-deadline, winter-only, no-opening-date facts verbatim; the deadline is undated (no year, no recurring-language), so no status chip is added — consistent with the row's existing no-chip state."
}
```

### tuhh

**Priority conflict resolved on the date, chip removed on re-review**: fetched the Data Science programme's own admission page directly (not just the admission-requirements sub-page) and found the exact sentence governing non-EU applicants: pre-check runs "from December 1st until March 1st" and the online application likewise runs "from December 1st and ends on March 1st." This directly reconciles the row's internal conflict — the dataset's recorded "1 February" close date for the Data Science pre-check/application was incorrect (apparently inherited from the general international-study-programs page's description of the *typical* Winter-2026/27 cycle, "1 December 2025 – 1 February 2026," which does not in fact govern Data Science specifically); the programme's own page confirms the non-EU window actually closes 1 March, matching TUHH's separately-cited "expires on 1 March" figure exactly. That date correction stands. On re-review against the tightened evidence bar, however, this "1 December–1 March" statement is a bare, undated standing sentence — searched the Data Science page itself, TUHH's central "Dates & Respites" page, and the general "How to Apply" PDF for any "every year"/"jedes Jahr"/annual-recurrence language; none was found anywhere on tuhh.de. This is the same undated-single-instance pattern already rejected for marburg/mannheim/frankfurt-uas/university-cologne, so the status chip is removed. EU/EU-resident applicants to Data Science remain on the separate 1 June–15 July window, likewise undated, confirmed unchanged in substance.

```json
{
  "id": "tuhh",
  "currentTagsInDataset": ["Opens Dec ’26", "Winter ’27"],
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027 · the Data Science programme's own page states the non-EU pre-check and online application both run 1 December 2026 – 1 March 2027 (verbatim: pre-check 'from December 1st until March 1st', online application 'from December 1st and ends on March 1st') — this resolves the row's prior internal conflict; TUHH's general dates page's '1 March' figure was correct and the previously recorded '1 February' close (drawn from the general international-study-programs page's description of the typical cycle, not Data Science specifically) is superseded. EU nationals and EU residents applying to Data Science use a separate window: 1 June – 15 July 2027. Neither window carries a year on its own page, and no TUHH page found (Data Science page, central Dates & Respites page, or the general How-to-Apply PDF) states these dates repeat annually",
  "sources": [
    {"title": "TUHH: Data Science - Application timeline (International Study Programs)", "url": "https://www.tuhh.de/tuhh/en/studying/before-studying/degree-courses/international-study-programs/data-science"},
    {"title": "TUHH: Data Science - Admission Requirements", "url": "https://www.tuhh.de/tuhh/en/studying/before-studying/degree-courses/international-study-programs/data-science/admission-requirements"},
    {"title": "TUHH: FAQs Master", "url": "https://www.tuhh.de/tuhh/en/studying/before-studying/application/faqs/faqs-master"},
    {"title": "TUHH: Dates & Respites", "url": "https://www.tuhh.de/tuhh/en/education/students/organisational-details-about-your-studies/dates-respites"},
    {"title": "How To Apply For The International Master's Programs At TUHH (general guide, 2026)", "url": "https://www.tuhh.de/t3resources/tuhh/download/studium/studieninteressierte/How-to-apply-at-TUHH-general-2026.pdf"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Close-date correction stands: non-EU pre-check/online application run 1 December–1 March (not 1 December–1 February as previously recorded). On re-review, no page on tuhh.de states these dates recur annually — the 1 March close and 1 December open are each bare, undated single-instance statements, so 'Opens Dec ’26' is removed under the tightened evidence bar (same standard already applied to marburg/mannheim/frankfurt-uas/university-cologne); intake facts remain confirmed and reported as facts, not a chip claim. No PDF-parsing caveat applies here — the operative facts came from the Data Science programme's own HTML page, not from a PDF."
}
```

### haw-hamburg

Confirmed factually but chip removed on re-review: the programme's own page states verbatim "Winter Semester: 1 June–15 July" and "Summer Semester: 1 December–15 January," which — mapped onto the dataset's semester-year labelling — is an exact match for the recorded "Summer 2027 · 1 December 2026 – 15 January 2027; Winter 2027/28 · 1 June – 15 July 2027." Searched specifically for a recurring-policy statement — HAW Hamburg's "Applying for a Master's degree course" page, its general "International applicants" page, and its uni-assist page — none contain "every year"/"jedes Jahr"/"annually" language; the programme page's dates are bare MM-DD text with no year and no recurrence assertion, the same pattern already rejected for marburg/mannheim/frankfurt-uas/university-cologne. Status chip removed accordingly; the uni-assist page confirms uni-assist itself accepts submissions year-round for the pre-check step (not the programme deadline), which doesn't supply the missing recurrence language either.

```json
{
  "id": "haw-hamburg",
  "currentTagsInDataset": ["Opens Dec ’26", "Summer ’27", "Winter ’27"],
  "verifiedIntakeTags": ["Summer ’27", "Winter ’27"],
  "verifiedApplicationWindow": "Summer 2027 · 1 December 2026 – 15 January 2027; Winter 2027/28 · 1 June – 15 July 2027, per the programme's own page (verbatim: 'Winter Semester: 1 June–15 July', 'Summer Semester: 1 December–15 January'). These are bare, undated MM-DD statements — no page found on haw-hamburg.de (the programme page, the general Master's-application page, the international-applicants page, or the uni-assist page) states the dates repeat annually. The uni-assist preliminary review takes four to six weeks, so documents must be submitted well before those dates; uni-assist itself accepts submissions at any time year-round for the pre-check step, per HAW Hamburg's uni-assist guidance page",
  "sources": [
    {"title": "Master Information and Communications Engineering - HAW Hamburg", "url": "https://www.haw-hamburg.de/en/master-information-and-communications-engineering/"},
    {"title": "uni-assist for international applicants - HAW Hamburg", "url": "https://www.haw-hamburg.de/en/study/applications/international-applicants/uni-assist/"},
    {"title": "Applying for a Master's degree course - HAW Hamburg", "url": "https://www.haw-hamburg.de/en/study/applications/applying-for-a-masters-degree-course/"},
    {"title": "International applicants - HAW Hamburg", "url": "https://www.haw-hamburg.de/en/study/applications/international-applicants/"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Programme's own page confirms the exact recorded 1 Dec–15 Jan (Summer 2027) and 1 Jun–15 Jul (Winter 2027/28) date ranges verbatim, but on re-review under the tightened evidence bar no haw-hamburg.de page states these dates recur annually — an undated single-instance pattern, so 'Opens Dec ’26' is removed (same standard already applied to marburg/mannheim/frankfurt-uas/university-cologne); intake facts remain confirmed and reported as facts, not a chip claim."
}
```

### fh-dortmund

**Priority conflict addressed, chip revised**: found a third, more specific and explicitly recurring source. FH Dortmund's own non-EU-master's-applicants page (nicht-eu-master.php) states verbatim, specifically about the pre-check step for the English-language master's programmes (which include Embedded Systems Engineering and Digital Transformation): "Der pre-check startet jedes Jahr im Februar und endet im Juni" ("The pre-check starts every year in February and ends in June") — this is genuine dated-and-recurring policy language (contains "jedes Jahr"/"every year"), clearing the evidence bar the central-dates-page (1 March, undated single instance) and the two programme pages (early April, undated single instance) do not individually clear on their own. Since the pre-check is applicants' actual required first step and its start month is the only piece of this row's timeline carrying explicit annual-recurrence language, the status chip is revised from "Opens Mar '27" to "Opens Feb '27." The 15 June close date is corroborated across all three sources (central table, both programme pages, and the non-EU-applicants page's "endet im Juni"), so it stands unchanged; the discrepancy between the central table's 1 March portal-open figure and the programme pages' "beginning of April" remains unresolved as to which governs the subsequent online-application (as opposed to pre-check) stage specifically.

```json
{
  "id": "fh-dortmund",
  "currentTagsInDataset": ["Opens Mar ’27", "Winter ’27"],
  "verifiedStatusTag": "Opens Feb ’27",
  "verifiedIntakeTags": ["Winter ’27"],
  "verifiedApplicationWindow": "Winter 2027/28 · FH Dortmund's own non-EU-applicants page states, specifically for the English-language master's programmes (Embedded Systems Engineering, Digital Transformation): 'Der pre-check startet jedes Jahr im Februar und endet im Juni' (the pre-check starts every year in February and ends in June) — explicit recurring-policy language confirming a February opening. The central dates page separately gives 1 March–15 June for 'Non-EU English-language Master's programmes' (undated single 2026 instance), while both programme pages state early April–15 June (also undated single instance); it remains unresolved which of March or April governs the subsequent online-application submission stage specifically, but all three sources agree the window closes 15 June, and the pre-check's February opening carries the only source with explicit annual-recurrence wording",
  "sources": [
    {"title": "Bewerben als Nicht-EU-Angehörige*r - Master | Fachhochschule Dortmund ('Der pre-check startet jedes Jahr im Februar und endet im Juni')", "url": "https://www.fh-dortmund.de/studieren/bewerben-einschreiben/bewerben-aus-dem-ausland/nicht-eu-master.php"},
    {"title": "Fristen und Termine | Fachhochschule Dortmund", "url": "https://www.fh-dortmund.de/studieren/bewerben-einschreiben/fristen-und-termine.php?loc=en"},
    {"title": "Embedded Systems Engineering - Fachhochschule Dortmund", "url": "https://www.fh-dortmund.de/studiengaenge/embedded-systems-engineering-master.php?loc=en"},
    {"title": "Digital transformation - Fachhochschule Dortmund", "url": "https://www.fh-dortmund.de/studiengaenge/digital-transformation-master-4.php?loc=en"}
  ],
  "changed": true,
  "unresolved": false,
  "note": "Found a third official source (non-EU-applicants page) with explicit 'jedes Jahr' (every year) recurring-policy language pinning the pre-check start to February — the only source in this row's evidence set that clears the recurring-policy bar — so the status chip moves from 'Opens Mar ’27' to 'Opens Feb ’27'; the March-vs-April conflict for the subsequent online-application stage remains only partially resolved, but the 15 June close is corroborated by all sources."
}
```
