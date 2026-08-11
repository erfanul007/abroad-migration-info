---
name: researching-migration-evidence
description: Use before changing any score, summary, pro/con, link, tuition figure, deadline or factual claim in src/data, and when researching visa, post-study-work, PR, citizenship or university-programme facts for this project.
---

# Researching Migration Evidence

CLAUDE.md carries the data-change protocol (research first, official sources, ≥2 cross-checks, provenance, `lastReviewed`). This skill carries only what it does not: which specific sources lie, and how to reach official pages that block you.

## Banned sources

Blogs, forums, Reddit, SEO listicles, AI-generated summaries, and these aggregators: **mygermanuniversity, shiksha, collegedunia, yocket, standyou, mastersportal, globaladmissions, unirank, 4icu, beyondthestates**.

They routinely render a German-taught programme as English-taught. The common failure: a university states *"Deutsch, weitere Sprachen: Englisch"* (German-taught, some English), and the aggregator reports "taught in both English and German" — which reads like a pass and is a fail.

**A language-of-instruction claim from an aggregator is not evidence.** Use aggregators only to discover a programme may exist, then verify officially.

## Source ranking beyond CLAUDE.md's rule

- **DAAD** (`www2.daad.de/.../international-programmes/en/detail/<id>/`) — reliable and consistently structured; yields language, tuition, deadlines, intakes and requirements in one fetch. Cross-check only; never overrides a current official page.
- **EduRank** — ranking figures only. Never authoritative on programme, language, fee or admission facts.
- For an institution's English offering, prefer its **own list of fully-English degrees** (usually on the international-office pages) over inferring from individual programme pages.

## When official sites block you

German university sites commonly return 403, 404 on stale URLs, or an Anubis bot-protection interstitial. A blocked fetch is **not** evidence, and never licenses inferring the answer from a search snippet.

Before concluding a site is blocked, try: the **faculty/department subdomain** (`cs.hm.edu`, `informatik.*`) — these often resolve and redirect to a working canonical page; then the **DAAD detail page**; then the **international-office / English-programmes catalogue**. Only after those, record **unresolved**.

EduRank `/uni/<slug>/rankings/` slugs are not guessable and 404 often. Navigate via `edurank.org/geo/<city>/`. Where current- and prior-year figures both appear, use the current one and state which.

## Reporting

State which claims you verified to source standard and which you did not. Verified 2 of 10 → say "2 of 10". Distinguish confirmed, unresolved, and not attempted.

## Red flags

- Citing an aggregator for language of instruction, fees or admission rules
- Reading "further languages: English" as English-completable
- Treating a 403, 404 or bot-protection page as a finding, or as proof the site is unreachable, before trying the faculty subdomain
- Quoting a search snippet as though it were the page
- Presenting a partial sweep as exhaustive
