# Germany Top-1,000 English CS Universities Design

> **Supersession note (23 July 2026):** The later listed-city coverage reconciliation confirmed qualifying programmes at the University of Cologne and Leipzig University and admitted TH Köln under the `<=3200` listed-city exception. Candidate language below records the earlier nationwide-census hypothesis; the final decisions live in the university JSON and the 23 July reconciliation plan.

**Goal:** Make the German university dataset a qualifying-only census of institutions that have an EduRank 2026 overall world rank of 1,000 or better, offer at least one on-campus CS-related degree that an international applicant can complete in English, and charge a Bangladeshi/non-EU applicant no more than €5,000 tuition per semester.

## Inclusion contract

All three gates are conjunctive and inclusive:

1. `overallRank <= 1000`, using EduRank 2026 for consistency with the existing dataset.
2. At least one current, degree-seeking, on-campus programme is substantively related to computer science, software engineering, artificial intelligence, machine learning, data science, information systems, robotics, cognitive systems or computational science; the published curriculum must permit completion in English and the official international route must accept foreign credentials.
3. Mandatory programme tuition for a Bangladeshi/non-EU applicant is `<= €5000` per semester. Semester contributions, application charges and living costs remain separate.

An English admission test alone does not establish English delivery. A programme advertised as partly English, dependent on unanimous cohort agreement, discontinued, exchange-only, online-only, or requiring compulsory German-taught modules fails. A mixed-language programme passes only when the university explicitly confirms a complete English study path.

Broad domain programmes qualify only when computing/data methods form the programme's central curriculum and a CSE-related first degree is an accepted admission background. Economics-with-data-science and earth-science programmes do not qualify merely because they use data analysis.

## Research and decision workflow

The audit starts from all 60 institutions in EduRank's 2026 German list with world rank at most 1,000. Each institution receives a scratchpad entry with: rank evidence; official programme and curriculum evidence; official international-admission evidence; official non-EU tuition evidence; location; ownership; programme/intake/application details needed by the existing schema; and a final pass/fail reason.

Programme, admission, tuition, intake and campus claims must come from official university pages or official regulations. DAAD and Hochschulkompass may cross-check discovery and institutional status but do not override current university admissions pages. EduRank is used only for its ranking fields. Conflicts are resolved in favour of the newest official university publication and recorded.

Only after an institution passes all gates will its complete row be added or retained. Existing rows are subject to exactly the same audit. Previously researched values remain untouched only when current evidence confirms them. Unconfirmed fields are not guessed; absent optional subject ranks remain omitted, while mandatory overall rank and tuition must be numeric.

## Candidate census

### Existing rows to re-audit

Heidelberg University; LMU Munich; University of Hamburg; University of Tübingen; Free University Berlin; University of Bonn; University of Göttingen; University of Freiburg; RWTH Aachen; FAU Erlangen-Nürnberg; TU Dresden; KIT; TU Berlin; Ruhr University Bochum; University of Stuttgart; TU Darmstadt; Leibniz University Hannover; Heinrich Heine University Düsseldorf; TU Dortmund; University of Potsdam/HPI; Goethe University Frankfurt; Humboldt University Berlin; and Charité Berlin.

Existing rows ranked above 1,000—TH Köln, BHT Berlin, BTU Cottbus-Senftenberg and HTW Berlin—are automatic rank failures and will be removed after confirming their stored ranks.

### Newly discovered rows to audit

Technical University of Munich; University of Münster; University of Würzburg; Kiel University; University of Marburg; Saarland University; Bielefeld University; University of Bremen; University of Regensburg; Ulm University; University of Konstanz; University of Rostock; TU Braunschweig; University of Bayreuth; University of Mannheim; RPTU Kaiserslautern-Landau; University of Greifswald; Otto von Guericke University Magdeburg; University of Lübeck; University of Kassel; University of Augsburg; University of Wuppertal; Chemnitz University of Technology; University of Oldenburg; Trier University; Paderborn University; University of Siegen; and Osnabrück University.

### Adversarial boundary checks

Leipzig University, Martin Luther University Halle-Wittenberg and the University of Hohenheim are audited but presumed excluded unless official admissions and curriculum evidence shows a computing-centred programme that accepts a CSE-related background. University of Cologne, Johannes Gutenberg University Mainz, Friedrich Schiller University Jena, University of Giessen, University of Duisburg-Essen and Hannover Medical School are audited as likely failures so the census records why they do not qualify.

## Data and UI treatment

No schema change is needed. `src/data/universities/germany.json` remains the sole university source. Every included row must populate the existing identity, tags, map location, ranks, tuition, programmes, intakes, application window/route/portal, language, academic requirements, applicant checks, narrative and official links.

The dataset methodology and caveats will state the new top-1,000 rule and strict English-path rule. Existing table, tag filters, detail panels and map consume the rows automatically. Tests will enforce the new cutoffs, required locations, ownership tags, tuition completeness and absence of known failures.

## Verification

Run focused data tests after each completed audit cohort. At the end regenerate `src/data/cache/scoreboard.json`, run `npm run lint && npm run typecheck && npm run test && npm run build`, run `git diff --check`, and mechanically audit every row for rank, tuition, location, tags and mandatory fields. No commit or push is authorised.
