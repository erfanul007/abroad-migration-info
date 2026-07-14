# German Cities — Opportunity-Card (Chancenkarte) Relocation Scoreboard

**Purpose:** A decision aid for one specific plan — arriving in Germany on the **Opportunity
Card (Chancenkarte, §20a AufenthG)** for up to a year, then running the sequence *city
registration (Anmeldung) → job search → qualifying full-time tech job → switch, from inside
Germany, to an **EU Blue Card (§18g AufenthG)***. Sixteen candidate cities are scored 0–100
across 11 weighted criteria and ranked by a weighted overall, computed live over the app dataset
(the JSON is the single source of truth; this document mirrors it).

**Profile lens:** Bangladeshi mid-level software engineer (4y+ .NET/C#, Python, distributed
systems, AI/RAG, enterprise integration), applying solo first — spouse joins later via family
reunification once the Blue Card is in hand. Every criterion is read through the
*Bangladeshi-applicant* reality: visa/embassy access, English-only job odds, diaspora, halal, and
the far-right/xenophobia climate for a visible-minority Muslim.

**Snapshot date (reviewed):** 2026-07-14 (full conversion/Anmeldung/job-market audit)
**Scale:** absolute 0–100, five tiers — **≥80 excellent · ≥70 good · ≥60 average · ≥50 weak ·
<50 poor**. Overall = weighted mean of the 11 criteria (weights sum to 100), shown to one
decimal; the tier uses the rounded whole number. No display curve.

---

## The visa this is built around (Chancenkarte, §20a AufenthG)

- **Duration:** a residence permit *to look for work*, issued for **up to 1 year** initially.
- **Part-time work:** **up to 20 hours/week** average allowed while you search, plus a **2-week**
  trial employment (*Probebeschäftigung*) per employer.
- **Proof of funds (2026):** **€1,091/month** via a blocked account (*Sperrkonto*), a
  *Verpflichtungserklärung*, or a part-time contract.
- **Points route:** minimum **6 points** (qualification + language + experience + age + shortage
  occupation + prior stay). IT is a recognised shortage field.

## The conversion (why it is the single heaviest criterion)

Once you sign a qualifying contract you apply, *from inside Germany*, for the **EU Blue Card
(§18g)** at the responsible foreigners' authority (Ausländerbehörde). The bottleneck is rarely
the law — it is **how fast that specific authority processes you** before the 12-month clock runs
out.

**Blue Card salary thresholds (2026, confirmed federal):**
- **Standard: €50,700/year** (€4,225/month — 50% of the 2026 pension-contribution ceiling).
- **Shortage/bottleneck occupations incl. IT: €45,934.20/year** (€3,827.85/month — 45.3%).
- IT specialists can qualify **without a degree** via 3+ years of academic-level IT experience in
  the last 7 years (ISCO-08 groups 133/25), subject to Federal Employment Agency (BA) approval.
- A Blue Card **at the general threshold needs no BA approval**; the reduced/IT route does.
- *Most mid-level software offers in this set clear at least the IT/shortage threshold; the
  strong-market cities clear the general threshold comfortably.*

> **July 2026 legal correction (verified against §81 AufenthG and Land guidance).** A timely
> application filed *before* the Chancenkarte expires triggers the **§81(4) Fortgeltungsfiktion**
> — lawful residence continues automatically — **but it carries forward only the old title's work
> scope, i.e. the 20-hour/week cap persists**. Full-time Blue Card work becomes legal only under
> the separate **§81(5a)** mechanism: the future title's employment counts as permitted **"ab
> Veranlassung der Ausstellung"** (from the moment the authority *initiates* eAT issuance, after a
> positive decision) and **must be recorded on the Fiktionsbescheinigung**. So: **filing protects
> residence, not the right to work full-time.** The physical eAT card then takes ~4–6 weeks to
> produce — **card production is never the same as authority processing/decision time**, and the
> scores keep the two separate.

---

## Criteria & weights

| # | Criterion (abbrev.) | Weight | What it measures |
|---|---------------------|-------:|------------------|
| 1 | **Chancenkarte → Blue Card conversion** (Conv) | 22 | Documented local risk from complete application to *lawful full-time* Blue Card employment; stage and evidence confidence are explicit |
| 2 | **Job availability & sponsors** (Jobs) | 18 | Mid-level .NET/Python/AI and enterprise-integration demand + qualifying-salary availability |
| 3 | **City registration (Anmeldung)** (Anm) | 12 | Registration availability; establishes jurisdiction and residence evidence |
| 4 | **Part-time / any-field odd jobs** (PT) | 10 | Availability of ≤20 h/week gastro, logistics, delivery and retail work |
| 5 | **Housing + rent affordability** (Rent) | 6 | New-lease rent and availability for a newcomer without SCHUFA |
| 6 | **English usability** (Eng) | 7 | English across professional work, administration and daily life |
| 7 | **Safety & xenophobia climate** (Safe) | 7 | Physical safety + far-right/anti-Muslim risk |
| 8 | **Competition / your odds** (Comp) | 6 | Applicant saturation for suitable mid-level roles |
| 9 | **Cost of living** (Cost) | 5 | Non-rent burn rate and runway preservation |
| 10 | **Connectivity & facilities** (Conn) | 4 | Dhaka access and public transport |
| 11 | **BD/Muslim community + halal** (Comm) | 3 | Diaspora, mosques and halal food |

The immediate decision core (Conversion 22 + Jobs 18 + Anmeldung 12 = **52%**) governs the
ranking. Naturalisation and settlement-permit queues are **descriptive context only and
unscored** — a naturalisation backlog is never used as a proxy for Blue Card processing.

**Conversion-scoring rubric (recalibrated 2026-07-14 — transparency is not penalised):** the
score reflects the *documented* duration and channel design (digital intake, dedicated
skilled-worker unit, §81(5a) work-bridge), weighted by evidence confidence. An authority that
honestly publishes a slow official time is scored on that real duration — **not** ranked below an
authority that publishes nothing. Non-publication paired with disclosed pressure is scored
conservatively (mid/low), never rewarded for opacity. eAT printing time is never treated as total
processing.

---

## Scoreboard (audited, 16 cities)

Ranked by weighted overall. Higher is better in **every** column (affordability/cost/competition
are scored so that cheaper / less-saturated = higher).

| Rank | City | Overall | Tier | Conv | Jobs | Anm | PT | Rent | Eng | Safe | Comp | Cost | Conn | Comm |
|-----:|------|--------:|------|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | **Hamburg** | 70.7 | Good | 70 | 74 | 62 | 80 | 66 | 72 | 78 | 64 | 60 | 70 | 82 |
| 2 | **Munich** | 66.9 | Average | 46 | 90 | 68 | 80 | 34 | 74 | 78 | 68 | 44 | 80 | 74 |
| 3 | **Karlsruhe** | 66.4 | Average | 63 | 66 | 82 | 58 | 74 | 64 | 72 | 58 | 72 | 58 | 56 |
| 4 | **Nuremberg** | 66.3 | Average | 61 | 68 | 76 | 66 | 80 | 48 | 72 | 62 | 78 | 58 | 58 |
| 5 | **Berlin** | 66.0 | Average | 50 | 88 | 42 | 85 | 46 | 84 | 64 | 66 | 62 | 72 | 84 |
| 6 | **Frankfurt** | 65.6 | Average | 52 | 80 | 50 | 80 | 48 | 74 | 76 | 66 | 52 | 84 | 82 |
| 7 | **Leipzig** | 64.9 | Average | 62 | 57 | 78 | 78 | 88 | 56 | 52 | 56 | 84 | 54 | 44 |
| 8 | **Dortmund** | 64.3 | Average | 55 | 64 | 58 | 80 | 82 | 58 | 66 | 60 | 78 | 64 | 68 |
| 9 | **Hannover** | 64.1 | Average | 62 | 62 | 64 | 70 | 70 | 58 | 72 | 60 | 68 | 62 | 60 |
| 10 | **Cologne** | 63.5 | Average | 56 | 70 | 55 | 76 | 52 | 62 | 74 | 62 | 60 | 70 | 74 |
| 11 | **Stuttgart** | 63.5 | Average | 46 | 78 | 74 | 68 | 56 | 58 | 72 | 64 | 54 | 62 | 72 |
| 12 | **Düsseldorf** | 62.9 | Average | 54 | 62 | 64 | 72 | 58 | 74 | 70 | 60 | 58 | 74 | 66 |
| 13 | **Potsdam** | 61.2 | Average | 60 | 64 | 64 | 66 | 48 | 62 | 62 | 58 | 58 | 68 | 52 |
| 14 | **Darmstadt** | 60.4 | Average | 42 | 70 | 66 | 64 | 50 | 66 | 74 | 58 | 58 | 82 | 58 |
| 15 | **Dresden** | 58.3 | Weak | 48 | 52 | 80 | 60 | 86 | 54 | 42 | 56 | 82 | 48 | 50 |
| 16 | **Aachen** | 56.9 | Weak | 50 | 48 | 56 | 56 | 80 | 66 | 70 | 50 | 78 | 50 | 56 |

**How to read it:** the spread is tight (57–71) — every city is viable; the ranking is about
*fit to this exact plan*, not city quality. **Hamburg leads** on a no-weak-link land-and-convert
core with a published ~4–8-week decision and a dedicated Welcome Center. **Munich rises to #2**
after the audit: its honest official "up to 7 months" ceiling is a genuine negative but no longer
crushes the score below opaque peers, and its elite job market carries it despite brutal cost.
The fast/cheap-admin cities (**Karlsruhe, Nuremberg, Leipzig**) cluster just behind, while
**Berlin (#5)** and **Frankfurt (#6)** are held back by registration/appointment friction despite
top-tier jobs — though Frankfurt's appointment wait has been cut from ~20 months to ~3.

---

## Per-city conversion evidence (what each authority actually publishes)

| City | Conv | Published time (and what it covers) | Confidence |
|------|----:|-------------------------------------|------------|
| Hamburg | 70 | Circa 4–8 weeks (authority decision) | medium |
| Munich | 46 | Up to 7 months (authority decision, worst-case ceiling) | high |
| Karlsruhe | 63 | Circa 4–8 weeks (authority decision) | medium |
| Nuremberg | 61 | Not published (online self-service; invitation-based intake) | low |
| Berlin | 50 | Not published before appointment; 4–6 weeks for eAT (card production) | medium |
| Frankfurt | 52 | ~3 months (average *appointment* wait, Jan 2026; decision unpublished) | medium |
| Leipzig | 62 | About 4 weeks (authority decision, after complete docs) | medium |
| Dortmund | 55 | Not published (appointment-based work-migration team) | low |
| Hannover | 62 | Up to 3 months (authority decision, after complete docs) | medium |
| Cologne | 56 | Not published (dedicated Arbeitsmigration unit; online) | low |
| Stuttgart | 46 | "Longer processing times" (official volume warning; no number) | medium |
| Düsseldorf | 54 | Not published (single online portal; AI completeness pre-check) | low |
| Potsdam | 60 | Not published Blue-Card-specific (2–3-mo figure is a university caseload warning) | low |
| Darmstadt | 42 | Not published (prior "six-month" claim unverified, removed) | low |
| Dresden | 48 | ~3 months to appointment + 6–8 weeks decision (email-only intake) | medium |
| Aachen | 50 | Not published (student-context proxy ~6 weeks; paper form) | low |

In every case the published figure covers the stage stated above only; the appointment/intake
wait and the ~4–6-week Bundesdruckerei eAT production are separate and, where relevant, extra.

---

## Recommendation (consultant view)

For the stated priority — **land a full-time tech job and convert to a Blue Card inside 12
months** — the shortlist by risk appetite:

- **Safest all-rounder — Hamburg.** No weak link in the core, a published ~4–8-week decision, a
  dedicated English-friendly Welcome Center for Professionals, and liveable rents.
- **Max job market, accept the cost — Munich.** Deepest, highest-paying market for this exact
  stack; the honest "up to 7 months" ceiling is real, so target employers and file early. Only
  with savings that absorb Germany's highest rents.
- **Fast/cheap admin — Karlsruhe, Nuremberg or Leipzig.** Published or well-designed conversion
  channels, strong Anmeldung access, and long runway; accept smaller absolute job volume.

**Counter-argument to weigh:** the model rewards operational certainty, so it discounts Berlin
and Frankfurt despite their superior job depth and English access. If you have a strong AI/ML or
platform specialisation and savings, a *fast offer* in Berlin/Frankfurt resets the whole
calculus — landing the job early defuses the 12-month-clock risk that drives half this model.
A specialist with a warm lead should follow the offer.

---

## Methodology

- **Overall** = Σ(criterion score × weight) ÷ 100 over all 11 criteria (weights sum to 100),
  computed live from the app dataset; shown to one decimal, tier from the rounded whole number.
- **Scores are evidence-backed expert synthesis on an absolute 0–100 scale** — each cell is built
  from official processing-time/channel statements, rent indices, job-posting counts and safety
  statistics, all cited in the app dataset. No single index ranks "conversion speed by city".
- **Conversion** separates application intake, authority decision/employment authorisation, and
  physical eAT production; a published printing time is never treated as the total wait. Official
  end-to-end timings earn the highest confidence; official vague warnings or partial-stage
  timings earn medium; unpublished timing earns low and a conservative score.
- **Bangladeshi lens throughout:** English-only job odds, 1-stop-to-Dhaka air links,
  diaspora/halal, and far-right risk to a visible-minority Muslim are first-class criteria.

---

## Caveats & provenance

- **The spread is narrow (56.9–70.7).** Treat this as a tie-break among viable cities. Your
  specialisation, savings, and how fast you land an offer move the needle more than the city.
- **Bureaucracy speed is unevenly evidenced.** Only Munich (up to 7 months), Dresden (~3 months
  to appointment + 6–8 weeks), Hannover (up to 3 months), Hamburg/Karlsruhe (~4–8 weeks) and
  Leipzig (~4 weeks) publish concrete authority-decision figures; most others publish none and are
  scored conservatively. Verify *your* office's current wait before committing.
- **Audit corrections applied 2026-07-14:** Munich's honest "up to 7 months" is no longer
  penalised below silent peers (conv 32→46); Karlsruhe (60→63), Hamburg (68→70), Hannover
  (58→62), Leipzig (kept 62 on the corrected page), Stuttgart (40→46), Frankfurt (42→52) and
  Nuremberg (58→61) reflect verified channel design; Potsdam trimmed (62→60) because its "2–3
  months" was a non-authoritative university caseload warning. Dead or wrong-scope official links
  were replaced for Frankfurt (a law-firm page → the official Ausländerbehörde), Leipzig and
  Dresden (settlement-permit pages → the Blue Card application), and Potsdam, Dortmund, Hannover
  and Darmstadt (404s → live pages). Stale 2024/2025 salary thresholds were purged in favour of
  the 2026 figures. Job scores were re-validated for this specific mid-level profile (Karlsruhe,
  Nuremberg, Leipzig, Dortmund, Darmstadt, Potsdam raised).
- **Naturalisation and settlement queues are unscored context** and are recorded separately in
  each city cell; a naturalisation backlog is never used as a proxy for Blue Card processing.
- **Rents are new-lease/asking figures** (what a newcomer pays); safety is national + regional,
  not street-level; no German airport flies direct to Dhaka (every city is 1-stop at best).

---

## Key sources (official / primary first)

**Law & thresholds:** §81 AufenthG (§81(4) Fortgeltungsfiktion, §81(5a) work permission),
gesetze-im-internet.de · BAMF & Make-it-in-Germany EU Blue Card / Chancenkarte pages · Bundesagentur
für Arbeit (ZAV) Blaue-Karte-EU 2026 thresholds · Hessen/Baden-Württemberg ministry Fiktionsbescheinigung
guidance.

**Per-city authorities:** each city's Ausländerbehörde / Welcome-Center & Bürgeramt portals —
Hamburg Welcome Center for Professionals, KVR München, Stadt Karlsruhe/Leipzig/Nürnberg/Köln/Dresden
service portals, Berlin LEA (service.berlin.de), Frankfurt Ausländerbehörde (+ hessenschau on the
20→3-month cut), Stadt Stuttgart, Düsseldorf, Dortmund Amt für Migration, Hannover Willkommensservice
(Unit 32.33), Migrationsamt Potsdam, StädteRegion Aachen, Digitales Rathaus Darmstadt. (Full
per-claim URLs live in the app dataset's `links`/`sources`.)

**Jobs & rents:** GREIX Rental Price Index, city Mietspiegel, ImmoScout24 · Glassdoor/levels.fyi/
StepStone/jobvector/germantechjobs/englishjobs posting counts and salary bands · employer pages
(DATEV, adesso, Software AG, DeepL, SAP Signavio, Finanz Informatik, etc.).

*No figure in this document was written from memory; each rests on the cited sources recorded in
the app dataset (`src/data/cities/germany.json`), reviewed 2026-07-14.*

---

## Copy-paste block (TSV → Google Sheets)

```
Rank	City	Overall	Tier	Conv	Jobs	Anm	PT	Rent	Eng	Safe	Comp	Cost	Conn	Comm
1	Hamburg	70.7	Good	70	74	62	80	66	72	78	64	60	70	82
2	Munich	66.9	Average	46	90	68	80	34	74	78	68	44	80	74
3	Karlsruhe	66.4	Average	63	66	82	58	74	64	72	58	72	58	56
4	Nuremberg	66.3	Average	61	68	76	66	80	48	72	62	78	58	58
5	Berlin	66.0	Average	50	88	42	85	46	84	64	66	62	72	84
6	Frankfurt	65.6	Average	52	80	50	80	48	74	76	66	52	84	82
7	Leipzig	64.9	Average	62	57	78	78	88	56	52	56	84	54	44
8	Dortmund	64.3	Average	55	64	58	80	82	58	66	60	78	64	68
9	Hannover	64.1	Average	62	62	64	70	70	58	72	60	68	62	60
10	Cologne	63.5	Average	56	70	55	76	52	62	74	62	60	70	74
11	Stuttgart	63.5	Average	46	78	74	68	56	58	72	64	54	62	72
12	Düsseldorf	62.9	Average	54	62	64	72	58	74	70	60	58	74	66
13	Potsdam	61.2	Average	60	64	64	66	48	62	62	58	58	68	52
14	Darmstadt	60.4	Average	42	70	66	64	50	66	74	58	58	82	58
15	Dresden	58.3	Weak	48	52	80	60	86	54	42	56	82	48	50
16	Aachen	56.9	Weak	50	48	56	56	80	66	70	50	78	50	56
```
