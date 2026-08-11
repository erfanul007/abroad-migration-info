# German university dataset — public-only scope and portal-state validation, 11 August 2026

Two changes in one pass: the shortlist is now explicitly public-universities-only, and every one of
the 59 rows was re-checked against its official source for whether the international CS-related
master's application is open today.

## 1. Public-only scope

The `Public` ownership tag was removed from all 59 rows. Nothing was lost: the dataset held 59
`Public` rows and zero `Private` rows, so the tag carried no information — it recorded a gate the
shortlist already applies. The scope is now stated once, in `methodology` and `caveats`, and the
schema test asserts that no row carries an ownership tag at all. Private institutions remain out of
scope regardless of rank or English provision.

## 2. Intake chip vocabulary

The old per-intake chips (`Summer ’27 open`, `Winter ’26 open`, `Winter ’27 open`, `No CS intake ’27`)
are replaced by a status-first set:

- **`Open now`** — the portal was accepting applications on 11 August 2026, confirmed against the
  official page. Four rows.
- **`Opens <Mon> ’YY`** — the university publishes an opening date. 38 rows.
- **no status chip** — no opening date is published, or the sources conflict. 17 rows; the row's
  `applicationWindow` says which, and carries the deadline where one is published.

`Summer ’27` / `Winter ’27` continue to mean only that the intake exists. A projected opening was
never turned into a chip: where a university says the period starts "roughly one month before the
deadline" (Göttingen) or "several weeks before" (Augsburg), the row carries no status chip.

## 3. Open right now (11 August 2026)

| University | Programme | Window |
|---|---|---|
| Heidelberg | M.Sc. Data and Computer Science | Summer 2027 · 1 Aug – 15 Sep 2026 |
| TU Braunschweig | M.Sc. Data Science | Summer 2027 · 1 Aug – 15 Sep 2026 (English/bilingual international window) |
| HTW Berlin | M.Sc. Project Management and Data Science | Summer 2027 · 1 May – 31 Aug 2026 |
| Marburg | M.Sc. Data Science | Winter 2026/27 · uni-assist 1 May – 21 Aug 2026 |

Opening within weeks: Würzburg (end of Aug 2026, closes 31 Oct), Lübeck, Kassel and TH Köln
(1 September / early September 2026).

## 4. Defects found and fixed

- **Würzburg — transposed windows.** The row had summer 23 Jan – 15 Mar and winter late Aug – 31 Oct.
  The programme page assigns end of August – 31 October to the **summer** intake and end of January –
  15 March to the **winter** intake. Corrected; the row now records this.
- **Stuttgart — wrong intake count.** The row described INFOTECH as winter-only. The programme's own
  application page publishes both: winter 15 Nov – 15 Jan, summer 15 May – 15 Jul. `Summer ’27` added.
- **TU Dresden — superseded programme.** The linked `master-informatik` page states the 2010-regulation
  Informatik master no longer enrols and directs applicants to the M.Sc. Computer Science. Link
  replaced with the current programme and admission pages; the note records the change.
- **Four dead or wrong links replaced.** Tübingen's `en/180804` resolved to a 2020 Probabilistic ML
  *course* page, not the master; Göttingen's `en/642287.html` resolved to a conference-room booking
  page; TU Darmstadt's `studiengang_185600` returned 404; Osnabrück's `ikw.uni-osnabrueck.de`
  programme URL 301s to a faculty landing page.
- **Windows filled in.** Rows that previously said dates were unpublished now carry researched
  windows: FU Berlin, Bonn, Kiel, Regensburg, Saarland, RPTU, Greifswald, OVGU, Augsburg, Paderborn,
  Oldenburg, Leipzig, University of Cologne, HWR Berlin, KIT, TU Dortmund.

## 5. Conflicts between official sources

Resolved:

- **Bielefeld.** The central master's page and the international page appeared to disagree on whether
  1 June – 15 July was the winter or the summer international deadline. The international office's own
  table settles it: 1 June – 15 July is the **winter** window for foreign qualifications, 1 December –
  15 January the summer one. Data Science is excepted from that table and needs prior documentation.
  Row tagged `Opens Jun ’27`.

Recorded rather than resolved:
- **Chemnitz** — the central deadlines table lists a restricted-admission international uni-assist
  summer window (1 Oct 2026 – 15 Jan 2027) that the Web Engineering programme page does not confirm.
  The row stays winter-only and flags the discrepancy.
- **Osnabrück** — uni-assist deadlines of 15 Jan / 15 Jul are published alongside the general
  15 Dec / 15 Jun dates for non-German certificates.
- **TUHH** — 1 February (international-programmes page) versus 1 March (dates page), carried over
  from the earlier gap-closure review.
- **FH Dortmund** — 1 March (central dates page, matching DAAD) versus early April (programme pages).

## 6. Verification standard and its limits

A status chip was written only where an official university page fetched **in this session** stated
the portal state or opening date. Where only a search result from an official domain was available,
or the page was unreachable, the row carries no chip and the window text records what is published.

The 17 rows without a status chip break down as follows.

**Opening genuinely unpublished** (deadline known, opening never stated): Göttingen, Saarland, RPTU,
Greifswald, OVGU Magdeburg, Augsburg, Oldenburg, Paderborn, Leipzig, University of Cologne,
Frankfurt UAS, Mannheim (2027 dates not yet released at all).

**Sources in conflict**: Chemnitz, Osnabrück.

**Official page unreadable in this session** — three rows, after repeated attempts: **KIT** (the
deadline table is a PDF whose text layer would not extract, and the linked HTML pages defer to it),
**Kiel** (the international master's deadlines are published only in a PDF leaflet; the department
admission URL 303s to a German faculty landing page), and **Münster** (the Information Systems
application page renders as image data and its detailed application section is German-only). For
these three the July 2026 audit's researched windows were retained rather than overwritten, and no
new claim was invented. They are the first candidates for the next pass.

Four rows flagged as unresolved in the first draft of this ledger were resolved on a second attempt:
Bielefeld, HHU Düsseldorf (HeiCAD states the portal opens early in May and closes 15 July),
BTU Cottbus (summer 2027 uni-assist window 1 Nov 2026 – 15 Jan 2027) and BHT Berlin
(2 May – 15 June).

## 7. Dataset and test changes

- `src/data/universities/germany.json`: ownership tags removed; all 59 rows re-tagged; 39
  `applicationWindow` texts rewritten; 4 links replaced and 15 added; `sources` reconciled with the
  row links and de-duplicated (11 duplicates, all pre-existing); `lastReviewed` 2026-08-11; `methodology` now defines the chip semantics and the
  public-only scope; a public-only caveat added.
- `src/lib/data.test.ts`: ownership assertions replaced by a public-only invariant; the closed intake
  vocabulary replaced by an `Open now` / `Opens <Mon> ’YY` grammar with at most one status chip per
  row, a required intake chip, and a check that an `Open now` row explains itself in its window text.
- `src/components/dataset/DatasetTable.tsx`: `Open now` reuses the emerald "open" badge; `Opens …`
  gets its own sky badge.
