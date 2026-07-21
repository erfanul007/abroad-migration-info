# University Rank and Tuition Cutoffs Design

**Goal:** Retain only German universities whose mandatory numeric `overallRank` is at most 3,200 and whose numeric `nonEuTuition` is at most €5,000 per semester.

Both cutoffs are inclusive and conjunctive: a row must satisfy both. The rank pass removed UE (3,208), SRH (6,252), Hochschule Fresenius (7,403), TH Brandenburg (7,663), and Gisma (15,013). The tuition pass additionally removes TUM (€6,000), Hertie (€9,125), and Lancaster Leipzig (€12,500) per semester. BHT remains at rank 3,104 and €0 tuition.

Rows are deleted from `src/data/universities/germany.json`; no hidden UI filter or schema field is added. Tests, methodology counts, ownership/open-intake inventories and the research log must describe the resulting 27 rows. Since the university table and map both consume the same JSON rows, no component-specific deletion is required.

Verification must assert 27 rows, no `overallRank > 3200`, no `nonEuTuition > 5000`, the ownership partition, valid tag vocabulary, complete map locations, and the full lint/typecheck/test/build gate. No commit or push.
