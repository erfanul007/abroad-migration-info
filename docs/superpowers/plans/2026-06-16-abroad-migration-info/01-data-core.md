# Milestone 1 — Data & core logic (TDD)

Back to [plan index](./README.md). Tasks 4–10. Output: typed domain model, seed JSON data, and a unit-tested core (validation, scoring, formatters, data assembly). `lib/` follows strict TDD: write failing test → run red → implement → run green → commit.

---

## Task 4: Domain TypeScript interfaces

**Files:** Create `src/types/index.ts`

- [ ] **Step 1: Write the domain types**

```ts
// src/types/index.ts
export type CategoryId = string;
export type CellStatus = "scored" | "pending";

export interface ReferenceLink {
  title: string;
  url: string;
}

export interface Category {
  id: CategoryId;
  name: string;        // canonical, shown everywhere except dense table headers
  shortLabel: string;  // dense leaderboard column headers only
  weight: number;      // 0..100; all categories sum to 100
  description: string;
  factors: string[];
}

export interface CategoryScore {
  status: CellStatus;
  score: number;       // 0..100
  summary?: string;
  reasoning?: string;
  evidence?: string[];
  links?: ReferenceLink[];
  lastReviewed?: string; // ISO 8601
}

export interface Country {
  id: string;
  name: string;
  iso: string;   // ISO alpha-2 (flag, routing)
  iso3: string;  // ISO alpha-3 (retained for future use)
  flag: string;  // emoji
  region: string;
  summary: string;
  lastReviewed: string; // ISO 8601
  links: ReferenceLink[];
  categories: Record<CategoryId, CategoryScore>;
}

export interface Preferences {
  regions: string[];
  fasterCitizenship: boolean;
  dualCitizenship: string;
  professionPriority: string;
  relocateTogether: boolean; // household of two — both partners move together
}

/** A household member. Both partners are peers — either can be the primary
 *  applicant and the other the dependent, so no role hierarchy is encoded. */
export interface Person {
  name: string;
  role: string;
  company: string;
  location: string;
  links: { portfolio: string; linkedin: string };
}

export interface Profile {
  household: { people: Person[] };
  education: { degree: string; institution: string; completed: string };
  goal: string;
  pathway: string[];
  preferences: Preferences;
}

// Derived (runtime only)
export interface ScoredCategory {
  category: Category;
  cell: CategoryScore | null; // null = category missing for this country
  contribution: number;       // (score/100) * weight, 0 if missing
}

export interface ScoredCountry extends Country {
  overall: number;     // 0..100, renormalised over present categories
  rank: number;        // 1-based by overall desc
  hasPending: boolean; // any cell status === "pending"
  isComplete: boolean; // all categories present and scored
  scored: ScoredCategory[];
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck
git add -A
git commit -m "feat: domain types for profile, category, country, scored model"
```

---

## Task 5: Author `categories.json` and `profile.json`

**Files:** Create `src/data/categories.json`, `src/data/profile.json`

- [ ] **Step 1: Write `categories.json`** (14 entries, weights sum to 100 — from PRD §5.3)

```json
[
  { "id": "job-market", "name": "Software & AI Job Market", "shortLabel": "Job Market", "weight": 12, "description": "Demand, salary, sponsorship, and market size for software/AI engineers.", "factors": ["Demand for SW/AI engineers", "Salary levels", "Visa sponsorship norms", "Remote acceptance", "Market size for both spouses"] },
  { "id": "visa-access", "name": "Visa Accessibility (Bangladesh)", "shortLabel": "Visa Access", "weight": 10, "description": "Bangladeshi-national lens: acceptance vs refusal, Dhaka mission, processing, financial bars, diplomatic ties, bans.", "factors": ["Acceptance vs refusal rate for BD applicants", "Embassy in Dhaka vs travel (e.g. New Delhi)", "Processing time & complexity", "Financial-proof / blocked-account bars", "Document scrutiny burden", "Diplomatic ties BD <-> country", "History of bans / heightened scrutiny"] },
  { "id": "citizenship", "name": "Citizenship & Passport Strength", "shortLabel": "Citizenship", "weight": 10, "description": "Years to citizenship, dual citizenship, requirements, passport strength.", "factors": ["Years to citizenship", "Dual citizenship allowed", "Residency/language requirements", "Passport visa-free access"] },
  { "id": "post-study-work", "name": "Post-Study Work Permit", "shortLabel": "Post-Study Work", "weight": 9, "description": "PSW duration, eligibility, job-search window, transition to skilled work, spouse rights.", "factors": ["PSW permit duration", "Eligibility ease", "Job-search window", "Transition to skilled-work visa", "Spouse work rights during PSW"] },
  { "id": "spouse-family", "name": "Spouse Work & Family", "shortLabel": "Spouse & Family", "weight": 9, "description": "Dependent visa, spouse work rights during/after study, family reunification, schooling.", "factors": ["Dependent visa availability", "Spouse work permit during study", "Spouse work permit after study/work", "Family reunification", "Children's schooling"] },
  { "id": "msc-study", "name": "Master's Study Access", "shortLabel": "MSc Study", "weight": 8, "description": "English-taught programs, cost, scholarships, duration, student work rights, spouse accompany.", "factors": ["English-taught program availability", "Tuition/study cost", "Scholarship availability", "Typical program duration", "Student part-time work rights (hrs/week)", "Spouse can accompany", "Intake flexibility"] },
  { "id": "pr-pathway", "name": "Permanent Residency Pathway", "shortLabel": "PR Pathway", "weight": 8, "description": "Years to PR, clarity of route, criteria difficulty, policy predictability.", "factors": ["Years to PR eligibility", "Clarity of route", "Points/criteria difficulty", "Predictability of policy"] },
  { "id": "income-cost", "name": "Income & Cost of Living", "shortLabel": "Income & Cost", "weight": 7, "description": "Net salary vs cost, savings potential, housing availability.", "factors": ["Net salary vs rent & living cost", "Savings potential", "Housing availability"] },
  { "id": "healthcare", "name": "Healthcare & Welfare", "shortLabel": "Healthcare", "weight": 6, "description": "Healthcare access/quality/cost & coverage, unemployment support, parental benefits, pensions.", "factors": ["Healthcare access & quality", "Cost & coverage for students/residents", "Unemployment support", "Parental benefits", "Pensions / safety net"] },
  { "id": "culture-language", "name": "Culture & Language", "shortLabel": "Culture/Lang", "weight": 6, "description": "English usability, local-language requirements, integration, work-life balance, livability.", "factors": ["English usability day-to-day", "Local-language requirement for PR/citizenship", "Integration support", "Work-life balance", "Openness/diversity", "Climate & livability"] },
  { "id": "safety-law", "name": "Safety & Rule of Law", "shortLabel": "Safety & Law", "weight": 5, "description": "Crime, rule of law, treatment of immigrants, judicial fairness.", "factors": ["Crime levels", "Rule of law", "Treatment of immigrants", "Judicial fairness"] },
  { "id": "politics", "name": "Political Stability", "shortLabel": "Politics", "weight": 4, "description": "Government stability, immigration-policy volatility, anti-immigrant sentiment trend.", "factors": ["Government stability", "Immigration-policy volatility", "Anti-immigrant sentiment trend"] },
  { "id": "tax", "name": "Tax Burden", "shortLabel": "Tax", "weight": 3, "description": "Income tax burden, treatment of students/foreign workers, take-home pay.", "factors": ["Income tax burden", "Treatment of students/foreign workers", "Take-home pay"] },
  { "id": "muslim-diaspora", "name": "Muslim Diaspora", "shortLabel": "Muslim", "weight": 3, "description": "Muslim & South-Asian community, halal food, mosques, religious accommodation, sentiment trend.", "factors": ["Muslim & South-Asian community size", "Halal food availability", "Mosques/prayer facilities", "Religious accommodation", "Anti-Muslim sentiment trend"] }
]
```

> Verify sum: 12+10+10+9+9+8+8+7+6+6+5+4+3+3 = **100**. The validator (Task 10) fails the build otherwise.

- [ ] **Step 2: Write `profile.json`** (PRD §9.1)

```json
{
  "household": {
    "people": [
      { "name": "Erfanul Bhuiyan", "role": "Software Engineer", "company": "Netpower", "location": "Dhaka, Bangladesh", "links": { "portfolio": "https://erfanul007.github.io/portfolio-ai/", "linkedin": "https://www.linkedin.com/in/erfanul007/" } },
      { "name": "Tanima Hossain", "role": "Software Engineer", "company": "Optimizely", "location": "Dhaka, Bangladesh", "links": { "portfolio": "https://tanimahossain.github.io/", "linkedin": "https://www.linkedin.com/in/tanimahossain/" } }
    ]
  },
  "education": { "degree": "BSc in CSE", "institution": "Daffodil International University", "completed": "2022-02" },
  "goal": "MSc studies -> post-study work -> permanent residency -> citizenship -> passport",
  "pathway": ["MSc studies", "Post-study work permit", "Permanent residency", "Citizenship", "Passport"],
  "preferences": {
    "regions": ["Europe", "Australia", "First-world"],
    "fasterCitizenship": true,
    "dualCitizenship": "preferred",
    "professionPriority": "IT / Software / AI Engineering",
    "relocateTogether": true
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: seed categories.json (14, sum=100) and profile.json"
```

---

## Task 6: Author country JSONs (3 flagship sourced + 10 pending)

**Files:** Create `src/data/countries/germany.json`, `canada.json`, `australia.json` (full); `netherlands.json`, `sweden.json`, `norway.json`, `denmark.json`, `finland.json`, `ireland.json`, `austria.json`, `france.json`, `portugal.json`, `new-zealand.json` (pending)

This is a **research task with a fixed schema**. Each flagship needs all 14 cells `status:"scored"` with integer `score` (0–100), one-line `summary`, a `reasoning` sentence, 1–3 `evidence` bullets, ≥1 `links` entry. The four policy categories (`visa-access`, `post-study-work`, `citizenship`, `pr-pathway`) **must** cite an official/government source (PRD §5.3 scoring-rigor). Use WebSearch to confirm current policy before scoring — do not rely on memory for visa/PR rules.

- [ ] **Step 1: Write `germany.json`** as the canonical worked example (complete, all 14 cells)

```json
{
  "id": "germany",
  "name": "Germany",
  "iso": "DE",
  "iso3": "DEU",
  "flag": "🇩🇪",
  "region": "Europe",
  "summary": "Strong software/AI market, no tuition at public universities, clear study->work->PR route; German needed for fast citizenship.",
  "lastReviewed": "2026-06-16",
  "links": [
    { "title": "Make it in Germany (official portal)", "url": "https://www.make-it-in-germany.com/en/" }
  ],
  "categories": {
    "job-market": { "status": "scored", "score": 88, "summary": "Deep demand for software/AI engineers across industry.", "reasoning": "Large tech and industrial software sector; EU Blue Card eases hiring of CS graduates.", "evidence": ["EU Blue Card salary thresholds widely met by SW roles", "Strong demand in Berlin/Munich/Hamburg"], "links": [{ "title": "EU Blue Card Germany (official)", "url": "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card" }], "lastReviewed": "2026-06-16" },
    "visa-access": { "status": "scored", "score": 70, "summary": "Embassy in Dhaka; structured student-visa process with blocked account.", "reasoning": "German Embassy Dhaka processes national visas; requires blocked account and APS certificate for Bangladeshi students.", "evidence": ["German Mission Dhaka issues student visas", "APS certificate required for BD applicants", "Blocked account financial proof"], "links": [{ "title": "German Missions in Bangladesh (official)", "url": "https://dhaka.diplo.de/" }], "lastReviewed": "2026-06-16" },
    "citizenship": { "status": "scored", "score": 78, "summary": "Naturalisation possible in ~5 years; dual citizenship allowed since 2024.", "reasoning": "2024 reform cut standard naturalisation to 5 years and permits dual citizenship; B1 German required.", "evidence": ["StAG reform effective 2024", "Dual citizenship now permitted", "B1 German + life test"], "links": [{ "title": "German nationality law (BMI, official)", "url": "https://www.bmi.bund.de/EN/topics/constitution/nationality-law/nationality-law-node.html" }], "lastReviewed": "2026-06-16" },
    "post-study-work": { "status": "scored", "score": 85, "summary": "18-month job-search residence permit after graduation.", "reasoning": "Graduates get an 18-month permit to seek qualified work; may work without restriction during it.", "evidence": ["18-month post-study job-search permit", "Unrestricted work during search"], "links": [{ "title": "Jobs after studies (Make it in Germany)", "url": "https://www.make-it-in-germany.com/en/study-training/studying/jobs-after-studies" }], "lastReviewed": "2026-06-16" },
    "spouse-family": { "status": "scored", "score": 75, "summary": "Spouse reunification with broad work rights.", "reasoning": "Dependent spouses of students/workers can join; spouses of skilled workers generally get unrestricted labour-market access.", "evidence": ["Family reunification visa available", "Spouse of skilled worker may work without restriction"], "links": [{ "title": "Family reunification (Make it in Germany)", "url": "https://www.make-it-in-germany.com/en/visa-residence/family" }], "lastReviewed": "2026-06-16" },
    "msc-study": { "status": "scored", "score": 90, "summary": "No tuition at public universities; many English MSc programs.", "reasoning": "Public universities charge no tuition (semester fee only); broad English-taught MSc catalogue; 120 full days/year work.", "evidence": ["No tuition at public universities", "DAAD catalogue of English programs", "120 full / 240 half work days per year"], "links": [{ "title": "DAAD international programmes", "url": "https://www2.daad.de/deutschland/studienangebote/international-programmes/en/" }], "lastReviewed": "2026-06-16" },
    "pr-pathway": { "status": "scored", "score": 80, "summary": "Settlement permit in ~21-33 months on Blue Card with German.", "reasoning": "EU Blue Card holders reach permanent settlement in 21 months (B1) or 27-33 months (A1), faster than most.", "evidence": ["Settlement permit in 21 months with B1 German on Blue Card"], "links": [{ "title": "Settlement permit (Make it in Germany)", "url": "https://www.make-it-in-germany.com/en/visa-residence/types/settlement-permit" }], "lastReviewed": "2026-06-16" },
    "income-cost": { "status": "scored", "score": 72, "summary": "Solid net salaries; housing tight in major cities.", "reasoning": "Good engineering salaries; rents high in Munich/Berlin but overall savings possible.", "evidence": ["Competitive SW salaries", "High rent in metro areas"], "links": [{ "title": "Salary information (Make it in Germany)", "url": "https://www.make-it-in-germany.com/en/working-in-germany/salary" }], "lastReviewed": "2026-06-16" },
    "healthcare": { "status": "scored", "score": 85, "summary": "Universal statutory health insurance; strong welfare.", "reasoning": "Mandatory statutory health insurance covers residents and students; comprehensive welfare and parental benefits.", "evidence": ["Statutory health insurance (GKV)", "Parental allowance (Elterngeld)"], "links": [{ "title": "Health insurance (Make it in Germany)", "url": "https://www.make-it-in-germany.com/en/living-in-germany/health-insurance" }], "lastReviewed": "2026-06-16" },
    "culture-language": { "status": "scored", "score": 62, "summary": "English works in tech, but German needed for PR/citizenship and daily life.", "reasoning": "Tech workplaces often English; German required for bureaucracy, fast PR (B1) and citizenship.", "evidence": ["English common in tech", "German needed for officialdom and naturalisation"], "links": [{ "title": "Learning German (Make it in Germany)", "url": "https://www.make-it-in-germany.com/en/living-in-germany/learn-german" }], "lastReviewed": "2026-06-16" },
    "safety-law": { "status": "scored", "score": 82, "summary": "Strong rule of law and low violent crime.", "reasoning": "High rule-of-law ranking; generally safe; established anti-discrimination protections.", "evidence": ["High WJP Rule of Law index", "Low violent crime rate"], "links": [{ "title": "WJP Rule of Law Index", "url": "https://worldjusticeproject.org/rule-of-law-index/" }], "lastReviewed": "2026-06-16" },
    "politics": { "status": "scored", "score": 72, "summary": "Stable democracy; some rise in anti-immigration politics.", "reasoning": "Stable institutions but growing far-right vote share adds modest policy uncertainty.", "evidence": ["Stable federal democracy", "Rising AfD vote share"], "links": [{ "title": "Germany country profile (BBC)", "url": "https://www.bbc.com/news/world-europe-17299607" }], "lastReviewed": "2026-06-16" },
    "tax": { "status": "scored", "score": 55, "summary": "High income tax and social contributions.", "reasoning": "Progressive tax plus social contributions reduce take-home pay; some student relief.", "evidence": ["Top marginal rate 42-45%", "Significant social contributions"], "links": [{ "title": "Taxes (Make it in Germany)", "url": "https://www.make-it-in-germany.com/en/working-in-germany/taxes-finances" }], "lastReviewed": "2026-06-16" },
    "muslim-diaspora": { "status": "scored", "score": 80, "summary": "Large Muslim and South-Asian communities; halal widely available.", "reasoning": "Several million Muslims; mosques and halal food common in cities; some anti-Muslim sentiment exists.", "evidence": ["Large established Muslim population", "Halal food and mosques in major cities"], "links": [{ "title": "Religion in Germany (Pew Research)", "url": "https://www.pewresearch.org/religion/" }], "lastReviewed": "2026-06-16" }
  }
}
```

- [ ] **Step 2: Write `canada.json`** — all 14 `status:"scored"`, germany.json shape exactly. Header `iso:"CA"`, `iso3:"CAN"`, `flag:"🇨🇦"`, `region:"North America"`. Required official sources for the policy categories:
  - `visa-access` → IRCC study permit: `https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html`
  - `post-study-work` → PGWP: `https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html`
  - `pr-pathway` → Express Entry: `https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html`
  - `citizenship` → Citizenship (3 of 5 years): `https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship.html`

- [ ] **Step 3: Write `australia.json`** — all 14 `status:"scored"`, germany.json shape. Header `iso:"AU"`, `iso3:"AUS"`, `flag:"🇦🇺"`, `region:"Oceania"`. Required official sources:
  - `visa-access` → Subclass 500: `https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500`
  - `post-study-work` → Subclass 485: `https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485`
  - `pr-pathway` → SkillSelect: `https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect`
  - `citizenship` → Citizenship: `https://immi.homeaffairs.gov.au/citizenship`

- [ ] **Step 4: Write the 10 pending countries from this template** (all 14 cells `status:"pending"`, neutral score 60, empty narrative). Example `netherlands.json`:

```json
{
  "id": "netherlands",
  "name": "Netherlands",
  "iso": "NL",
  "iso3": "NLD",
  "flag": "🇳🇱",
  "region": "Europe",
  "summary": "Not yet assessed.",
  "lastReviewed": "2026-06-16",
  "links": [],
  "categories": {
    "job-market": { "status": "pending", "score": 60 },
    "visa-access": { "status": "pending", "score": 60 },
    "citizenship": { "status": "pending", "score": 60 },
    "post-study-work": { "status": "pending", "score": 60 },
    "spouse-family": { "status": "pending", "score": 60 },
    "msc-study": { "status": "pending", "score": 60 },
    "pr-pathway": { "status": "pending", "score": 60 },
    "income-cost": { "status": "pending", "score": 60 },
    "healthcare": { "status": "pending", "score": 60 },
    "culture-language": { "status": "pending", "score": 60 },
    "safety-law": { "status": "pending", "score": 60 },
    "politics": { "status": "pending", "score": 60 },
    "tax": { "status": "pending", "score": 60 },
    "muslim-diaspora": { "status": "pending", "score": 60 }
  }
}
```

Repeat for the other 9 — id / iso / iso3 / flag / region (names must match Natural Earth for the map join):
- sweden — SE / SWE / 🇸🇪 / Europe
- norway — NO / NOR / 🇳🇴 / Europe
- denmark — DK / DNK / 🇩🇰 / Europe
- finland — FI / FIN / 🇫🇮 / Europe
- ireland — IE / IRL / 🇮🇪 / Europe
- austria — AT / AUT / 🇦🇹 / Europe
- france — FR / FRA / 🇫🇷 / Europe
- portugal — PT / PRT / 🇵🇹 / Europe
- new-zealand — NZ / NZL / 🇳🇿 / Oceania

> `name` field must read "New Zealand" (matches the Natural Earth name used by the choropleth join).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: seed country data — 3 flagship sourced, 10 pending placeholders"
```

---

## Task 7: Validation module

**Files:** Create `src/lib/validation.ts`, `src/lib/validation.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/validation.test.ts
import { describe, it, expect } from "vitest";
import { validateCategories, validateCountry } from "@/lib/validation";
import type { Category, Country } from "@/types";

const cats: Category[] = [
  { id: "a", name: "A", shortLabel: "A", weight: 60, description: "", factors: [] },
  { id: "b", name: "B", shortLabel: "B", weight: 40, description: "", factors: [] },
];

describe("validateCategories", () => {
  it("passes when weights sum to 100 and ids are unique", () => {
    expect(validateCategories(cats)).toEqual([]);
  });
  it("flags when weights do not sum to 100", () => {
    const bad = [{ ...cats[0], weight: 50 }, cats[1]];
    expect(validateCategories(bad)).toContainEqual(expect.stringContaining("sum to 100"));
  });
  it("flags duplicate ids", () => {
    const dup = [cats[0], { ...cats[1], id: "a" }];
    expect(validateCategories(dup)).toContainEqual(expect.stringContaining("Duplicate"));
  });
});

describe("validateCountry", () => {
  const country: Country = {
    id: "x", name: "X", iso: "XX", iso3: "XXX", flag: "", region: "R",
    summary: "", lastReviewed: "2026-06-16", links: [],
    categories: { a: { status: "scored", score: 90 }, b: { status: "pending", score: 60 } },
  };
  it("passes a well-formed country", () => {
    expect(validateCountry(country, cats)).toEqual([]);
  });
  it("flags scores out of range", () => {
    const bad = { ...country, categories: { ...country.categories, a: { status: "scored" as const, score: 150 } } };
    expect(validateCountry(bad, cats)).toContainEqual(expect.stringContaining("0..100"));
  });
  it("flags unknown category ids", () => {
    const bad = { ...country, categories: { ...country.categories, zzz: { status: "scored" as const, score: 10 } } };
    expect(validateCountry(bad, cats)).toContainEqual(expect.stringContaining("Unknown category"));
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/lib/validation.test.ts
```
Expected: FAIL (`validateCategories`/`validateCountry` not exported).

- [ ] **Step 3: Implement `validation.ts`**

```ts
// src/lib/validation.ts
import type { Category, Country } from "@/types";

const WEIGHT_TOLERANCE = 0.001;

export function validateCategories(categories: Category[]): string[] {
  const errors: string[] = [];
  const sum = categories.reduce((acc, c) => acc + c.weight, 0);
  if (Math.abs(sum - 100) > WEIGHT_TOLERANCE) {
    errors.push(`Category weights must sum to 100 (got ${sum}).`);
  }
  const seen = new Set<string>();
  for (const c of categories) {
    if (seen.has(c.id)) errors.push(`Duplicate category id: ${c.id}.`);
    seen.add(c.id);
    if (c.weight <= 0) errors.push(`Category ${c.id} weight must be > 0.`);
  }
  return errors;
}

export function validateCountry(country: Country, categories: Category[]): string[] {
  const errors: string[] = [];
  const known = new Set(categories.map((c) => c.id));
  for (const [id, cell] of Object.entries(country.categories)) {
    if (!known.has(id)) errors.push(`${country.id}: Unknown category "${id}".`);
    if (cell.score < 0 || cell.score > 100) {
      errors.push(`${country.id}.${id}: score ${cell.score} out of range 0..100.`);
    }
  }
  return errors;
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/lib/validation.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: data validation (weights sum to 100, score range, ids)"
```

---

## Task 8: Scoring module

**Files:** Create `src/lib/scoring.ts`, `src/lib/scoring.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/scoring.test.ts
import { describe, it, expect } from "vitest";
import { computeOverall, scoreCountry, rankCountries } from "@/lib/scoring";
import type { Category, Country } from "@/types";

const cats: Category[] = [
  { id: "a", name: "A", shortLabel: "A", weight: 60, description: "", factors: [] },
  { id: "b", name: "B", shortLabel: "B", weight: 40, description: "", factors: [] },
];

function country(id: string, a: number, b: number): Country {
  return {
    id, name: id, iso: id.toUpperCase(), iso3: id.toUpperCase() + "X", flag: "", region: "R",
    summary: "", lastReviewed: "2026-06-16", links: [],
    categories: { a: { status: "scored", score: a }, b: { status: "scored", score: b } },
  };
}

describe("computeOverall", () => {
  it("computes weighted sum as a direct percentage when all present (weights sum 100)", () => {
    expect(computeOverall(country("x", 80, 50), cats)).toBeCloseTo(68); // 48 + 20
  });
  it("returns 100 for all-100 and 0 for all-0", () => {
    expect(computeOverall(country("x", 100, 100), cats)).toBeCloseTo(100);
    expect(computeOverall(country("x", 0, 0), cats)).toBeCloseTo(0);
  });
  it("renormalises over present categories when one is missing (not treated as 0)", () => {
    const partial = country("x", 80, 0);
    delete (partial.categories as Record<string, unknown>).b;
    expect(computeOverall(partial, cats)).toBeCloseTo(80); // (80*0.6)/0.6
  });
  it("returns 0 when no categories present", () => {
    const empty = country("x", 0, 0);
    empty.categories = {};
    expect(computeOverall(empty, cats)).toBe(0);
  });
});

describe("scoreCountry", () => {
  it("marks hasPending and isComplete correctly", () => {
    const c = country("x", 80, 50);
    c.categories.b = { status: "pending", score: 50 };
    const scored = scoreCountry(c, cats);
    expect(scored.hasPending).toBe(true);
    expect(scored.isComplete).toBe(false);
    expect(scored.scored).toHaveLength(2);
  });
});

describe("rankCountries", () => {
  it("ranks by overall descending, stable on ties by name", () => {
    const ranked = rankCountries([country("low", 10, 10), country("high", 90, 90)], cats);
    expect(ranked.map((c) => c.id)).toEqual(["high", "low"]);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/lib/scoring.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implement `scoring.ts`**

```ts
// src/lib/scoring.ts
import type { Category, Country, ScoredCategory, ScoredCountry } from "@/types";

/** Weighted sum, renormalised over categories that have a numeric score.
 *  Missing categories are excluded (not treated as 0); result is 0..100. */
export function computeOverall(country: Country, categories: Category[]): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const cat of categories) {
    const cell = country.categories[cat.id];
    if (!cell || typeof cell.score !== "number") continue;
    weightedSum += (cell.score / 100) * cat.weight;
    totalWeight += cat.weight;
  }
  if (totalWeight === 0) return 0;
  return (weightedSum / totalWeight) * 100;
}

export function scoreCountry(country: Country, categories: Category[]): ScoredCountry {
  const scored: ScoredCategory[] = categories.map((category) => {
    const cell = country.categories[category.id] ?? null;
    const contribution = cell ? (cell.score / 100) * category.weight : 0;
    return { category, cell, contribution };
  });
  const present = scored.filter((s) => s.cell !== null);
  const hasPending = present.some((s) => s.cell!.status === "pending");
  const isComplete = present.length === categories.length && !hasPending;
  return {
    ...country,
    overall: computeOverall(country, categories),
    rank: 0,
    hasPending,
    isComplete,
    scored,
  };
}

export function rankCountries(countries: Country[], categories: Category[]): ScoredCountry[] {
  return countries
    .map((c) => scoreCountry(c, categories))
    .sort((a, b) => b.overall - a.overall || a.name.localeCompare(b.name))
    .map((c, i) => ({ ...c, rank: i + 1 }));
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/lib/scoring.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: scoring module (weighted overall, renormalised, ranking)"
```

---

## Task 9: Formatters module (locale-aware)

**Files:** Create `src/lib/formatters.ts`, `src/lib/formatters.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/formatters.test.ts
import { describe, it, expect } from "vitest";
import { formatScore, formatDate, scoreTier } from "@/lib/formatters";

describe("formatScore", () => {
  it("rounds to a whole number", () => {
    expect(formatScore(67.6)).toBe("68");
    expect(formatScore(100)).toBe("100");
  });
});

describe("formatDate", () => {
  it("renders ISO date as en-GB DD/MM/YYYY", () => {
    expect(formatDate("2026-06-16")).toBe("16/06/2026");
  });
});

describe("scoreTier", () => {
  it("maps score to a tier label", () => {
    expect(scoreTier(90)).toBe("excellent");
    expect(scoreTier(70)).toBe("good");
    expect(scoreTier(50)).toBe("fair");
    expect(scoreTier(30)).toBe("weak");
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/lib/formatters.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implement `formatters.ts`** (tiers + classes match design-system §2.2)

```ts
// src/lib/formatters.ts
const LOCALE = "en-GB"; // org default for user-facing en (point decimal, DD/MM/YYYY)

export function formatScore(score: number): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(Math.round(score));
}

export function formatNumber(n: number, fractionDigits = 0): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: fractionDigits }).format(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

export type Tier = "excellent" | "good" | "fair" | "weak";

export function scoreTier(score: number): Tier {
  if (score >= 80) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "fair";
  return "weak";
}

/** Tailwind classes for the score colour scale (used by ScoreBadge). */
export function scoreTierClasses(tier: Tier): string {
  switch (tier) {
    case "excellent": return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "good": return "bg-lime-500/15 text-lime-700 dark:text-lime-300";
    case "fair": return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
    case "weak": return "bg-rose-500/15 text-rose-700 dark:text-rose-300";
  }
}

/** Hex fills for the choropleth (design-system §2.2). */
export function scoreTierFill(tier: Tier): string {
  switch (tier) {
    case "excellent": return "#16a34a";
    case "good": return "#65a30d";
    case "fair": return "#d97706";
    case "weak": return "#e11d48";
  }
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/lib/formatters.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: locale-aware formatters (score, date en-GB, tiers)"
```

---

## Task 10: Data assembly + validation gate

**Files:** Create `src/lib/data.ts`, `src/lib/data.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/data.test.ts
import { describe, it, expect } from "vitest";
import { categories, countries, profile, scoredCountries } from "@/lib/data";

describe("data integrity", () => {
  it("loads 14 categories summing to 100", () => {
    expect(categories).toHaveLength(14);
    expect(categories.reduce((a, c) => a + c.weight, 0)).toBe(100);
  });
  it("loads 13 countries", () => {
    expect(countries).toHaveLength(13);
  });
  it("every country references known category ids with in-range scores", () => {
    const known = new Set(categories.map((c) => c.id));
    for (const c of countries) {
      for (const [id, cell] of Object.entries(c.categories)) {
        expect(known.has(id)).toBe(true);
        expect(cell.score).toBeGreaterThanOrEqual(0);
        expect(cell.score).toBeLessThanOrEqual(100);
      }
    }
  });
  it("exposes ranked, scored countries with 1-based ranks", () => {
    expect(scoredCountries[0].rank).toBe(1);
    expect(scoredCountries.every((c) => c.overall >= 0 && c.overall <= 100)).toBe(true);
  });
  it("has a profile with a pathway", () => {
    expect(profile.pathway.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/lib/data.test.ts
```
Expected: FAIL (`@/lib/data` not found).

- [ ] **Step 3: Implement `data.ts`** (glob-import countries, validate, expose typed + scored)

```ts
// src/lib/data.ts
import type { Category, Country, Profile, ScoredCountry } from "@/types";
import { validateCategories, validateCountry } from "@/lib/validation";
import { rankCountries } from "@/lib/scoring";
import categoriesJson from "@/data/categories.json";
import profileJson from "@/data/profile.json";

export const categories = categoriesJson as Category[];
export const profile = profileJson as Profile;

// Eagerly import every country JSON file.
const modules = import.meta.glob<{ default: Country }>("@/data/countries/*.json", { eager: true });
export const countries: Country[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.name.localeCompare(b.name));

// Validation gate — throws in dev/test if data is malformed.
const errors = [
  ...validateCategories(categories),
  ...countries.flatMap((c) => validateCountry(c, categories)),
];
if (errors.length > 0) {
  const msg = `Data validation failed:\n- ${errors.join("\n- ")}`;
  if (import.meta.env?.DEV || import.meta.env?.MODE === "test") throw new Error(msg);
  else console.error(msg);
}

export const scoredCountries: ScoredCountry[] = rankCountries(countries, categories);

export function getScoredCountry(iso: string): ScoredCountry | undefined {
  const target = iso.toLowerCase();
  return scoredCountries.find(
    (c) => c.iso.toLowerCase() === target || c.id.toLowerCase() === target,
  );
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/lib/data.test.ts
```
Expected: PASS. If it fails on weights/ids/count, fix the JSON data — not the test.

- [ ] **Step 5: Full suite + typecheck, then commit**

```bash
npm run test
npm run typecheck
git add -A
git commit -m "feat: data assembly with validation gate + ranked countries"
```
