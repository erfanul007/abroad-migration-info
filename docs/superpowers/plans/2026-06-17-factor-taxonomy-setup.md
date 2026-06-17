# Factor Taxonomy Setup — Implementation Plan (Phase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `categories.json` factors from plain strings into weighted, described sub-categories (each with a research+scoring rubric), and tighten the Zod schema so factor weights sum to 100, factor ids are unique per category, and every category has an `other` factor.

**Architecture:** Pure data + schema change in `src/lib/schema.ts` and `src/data/categories.json`. Country files and `scoring.ts` are NOT touched (factors are not yet consumed at runtime — they were already unused metadata, so there is no behaviour change). The schema and the data are mutually dependent (the new schema rejects old string factors and vice-versa), so both change in one coordinated, single-commit task.

**Tech Stack:** TypeScript (strict), Zod 4, Vitest. Package manager: npm.

## Global Constraints

- Strict TS, no `any`; derive types from Zod via `z.infer`, re-export from `@/types`.
- Factor weights within a category sum to exactly **100** (±0.001), same discipline as category weights.
- Every category MUST contain a factor with `id: "other"`.
- Factor `description` = a research + scoring rubric (verbatim source: `docs/superpowers/specs/factor-taxonomy-proposal.md`), including the single-owner boundary sentence where the spec's Section 4 requires it.
- Do NOT change `countrySchema` / `categoryScoreSchema` / any `src/data/countries/*.json` in this phase.
- Quality gate before "done": `npm run lint && npm run typecheck && npm run test && npm run build` all green.
- Conventional Commits; do not commit without explicit user approval.

## File Structure

- Modify: `src/lib/schema.ts` — add `factorSchema`, export `Factor` type, change `categorySchema.factors` to `z.array(factorSchema)`, add per-category refinements (unique factor ids, weights sum to 100, mandatory `other`).
- Modify: `src/types/index.ts` — re-export `Factor`.
- Modify: `src/data/categories.json` — replace each category's `factors: string[]` with `factors: Factor[]` per the weight table below + rubrics from the proposal doc.
- Modify/Create test: `src/lib/schema.test.ts` — add factor-validation tests.

---

## Task 1: Factor schema + refinements + categories.json migration

**Files:**
- Modify: `src/lib/schema.ts`
- Modify: `src/types/index.ts`
- Modify: `src/data/categories.json`
- Test: `src/lib/schema.test.ts`

**Interfaces:**
- Produces: `factorSchema` (Zod), `export type Factor = z.infer<typeof factorSchema>` = `{ id: string; label: string; description: string; weight: number }`. `categorySchema.factors: Factor[]` with refinements. Consumed in Phase 2 by `scoring.ts` (category-from-factors derivation) and by country-cell validation.

- [ ] **Step 1: Write the failing tests** in `src/lib/schema.test.ts` (add to the existing file; reuse its imports). Use a small valid-category fixture and mutate it per case:

```ts
import { describe, it, expect } from "vitest";
import { validateCategories } from "./schema";

const validCat = {
  id: "x",
  name: "X",
  shortLabel: "X",
  weight: 100,
  description: "d",
  factors: [
    { id: "a", label: "A", description: "rubric a", weight: 60 },
    { id: "other", label: "Other", description: "catch-all rubric", weight: 40 },
  ],
};

describe("factor validation", () => {
  it("accepts object factors that sum to 100 with an 'other' factor", () => {
    expect(validateCategories([validCat])).toEqual([]);
  });
  it("rejects factor weights that do not sum to 100", () => {
    const bad = { ...validCat, factors: [{ id: "a", label: "A", description: "r", weight: 50 }, { id: "other", label: "Other", description: "r", weight: 40 }] };
    expect(validateCategories([bad]).length).toBeGreaterThan(0);
  });
  it("rejects duplicate factor ids", () => {
    const bad = { ...validCat, factors: [{ id: "a", label: "A", description: "r", weight: 50 }, { id: "a", label: "A2", description: "r", weight: 50 }] };
    expect(validateCategories([bad]).length).toBeGreaterThan(0);
  });
  it("rejects a category with no 'other' factor", () => {
    const bad = { ...validCat, factors: [{ id: "a", label: "A", description: "r", weight: 60 }, { id: "b", label: "B", description: "r", weight: 40 }] };
    expect(validateCategories([bad]).length).toBeGreaterThan(0);
  });
  it("rejects string factors (old shape)", () => {
    const bad = { ...validCat, factors: ["a", "b"] };
    expect(validateCategories([bad as unknown as typeof validCat]).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the new tests, verify they fail**

Run: `npm run test -- schema`
Expected: the five new cases FAIL (current schema treats `factors` as `string[]`, so object factors error and the bad-weight/dup/other cases pass through).

- [ ] **Step 3: Implement the schema** in `src/lib/schema.ts`. Add `factorSchema` above `categorySchema`, swap the `factors` field, and add per-category refinements:

```ts
const WEIGHT_TOLERANCE = 0.001; // already present

export const factorSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  description: z.string(),
  weight: z.number().positive(),
});

export const categorySchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    shortLabel: z.string(),
    weight: z.number().positive(),
    description: z.string(),
    factors: z.array(factorSchema),
  })
  .refine(
    (c) => Math.abs(c.factors.reduce((a, f) => a + f.weight, 0) - 100) <= WEIGHT_TOLERANCE,
    { message: "Factor weights must sum to 100." },
  )
  .refine((c) => new Set(c.factors.map((f) => f.id)).size === c.factors.length, {
    message: "Duplicate factor id within category.",
  })
  .refine((c) => c.factors.some((f) => f.id === "other"), {
    message: "Category must contain an 'other' factor.",
  });
```

Add the inferred type near the other `z.infer` exports:

```ts
export type Factor = z.infer<typeof factorSchema>;
```

(Existing `export type Category = z.infer<typeof categorySchema>;` now carries `factors: Factor[]` automatically. `categoriesSchema` and `validateCategories` are unchanged — refinements live on `categorySchema`.)

- [ ] **Step 4: Re-export the type** in `src/types/index.ts` — add `Factor` to the existing re-export from `@/lib/schema` (match the file's current export style):

```ts
export type { Factor } from "@/lib/schema";
```

- [ ] **Step 5: Run the new tests, verify they pass**

Run: `npm run test -- schema`
Expected: all five new cases PASS. (`src/data/categories.json` is still stale, so other suites may fail — fixed in Step 6.)

- [ ] **Step 6: Migrate `src/data/categories.json`** — replace each category's `factors` array with the objects below. **Weights are authoritative (each category sums to 100, includes `other`).** For each factor's `description`, copy verbatim the matching factor's `description` from `docs/superpowers/specs/factor-taxonomy-proposal.md`; where spec Section 4 names a single-owner boundary for that factor, ensure the boundary sentence is included. Keep each category's `id/name/shortLabel/weight/description` unchanged.

Factor ids + weights per category (each row sums to 100):

```
job-market(12):       sw-demand-depth 22 | ai-ml-specialisation 14 | salary-levels 16 | sponsorship-work-authorisation 20 | foreign-grad-bd-hireability 12 | dual-earner-depth 8 | other 8
visa-access(10):      approval-refusal-rate 22 | dhaka-mission-appointment-capacity 20 | in-queue-processing-schemes 13 | financial-bars 13 | credibility-genuineness-scrutiny 12 | heightened-scrutiny-policy-risk 12 | other 8
citizenship(10):      time-to-citizenship 26 | naturalisation-requirements 22 | dual-citizenship-retention 13 | citizenship-attainability 11 | policy-stability 12 | passport-strength 9 | other 7
post-study-work(9):   psw-duration-runway 24 | eligibility-openness-bd 18 | transition-to-skilled-work 18 | work-freedom-during-psw 16 | dual-graduate-spouse-psw 12 | psw-policy-stability 7 | other 5
spouse-family(9):     spouse-work-rights 30 | dependent-visa-bd-access 26 | family-reunification-children 20 | spouse-path-to-independence 16 | other 8
msc-study(8):         affordability-funding 28 | english-program-depth 24 | admission-credential-access 18 | student-work-rights 14 | study-pathway-fit 10 | other 6
pr-pathway(8):        years-to-pr 24 | route-clarity-accessibility 18 | eligibility-bars 17 | language-integration-requirement 13 | continuity-retention 12 | policy-predictability 11 | other 5
income-cost(7):       household-net-surplus 30 | housing-cost-availability 20 | savings-remittance 18 | student-phase-affordability 14 | upfront-relocation-cash 10 | other 8
healthcare(6):        newcomer-eligibility-barrier 24 | health-quality-access 22 | cost-coverage-by-status 18 | social-insurance-safety-net 16 | family-childcare-benefits 12 | other 8
culture-language(6):  english-usability 26 | language-burden-citizenship 24 | integration-support 16 | social-acceptance-south-asian 16 | worklife-livability 8 | cultural-distance-adaptation 4 | other 6
safety-law(5):        personal-crime-safety 18 | lived-discrimination-hatecrime 17 | rule-of-law-corruption-civil-justice 17 | women-safety-gbv 14 | immigration-enforcement-due-process 14 | antidiscrimination-law-enforcement 13 | other 7
politics(4):          immigration-policy-volatility 26 | non-eu-skilled-policy-direction 18 | anti-immigration-electoral-power 16 | societal-sentiment-trend 13 | institutional-governance-stability 11 | targeted-risk-south-asian-muslim 10 | other 6
tax(3):               effective-deduction-wedge 30 | expat-foreign-worker-relief 22 | household-dual-earner-treatment 18 | student-phase-tax-exposure 10 | bd-treaty-repatriation 10 | other 10
muslim-diaspora(3):   bangladeshi-diaspora 24 | religious-practice-infrastructure 22 | sentiment-safety 22 | legal-religious-accommodation 14 | south-asian-cultural-ecosystem 10 | other 8
```

Shape of each factor entry (job-market `salary-levels` shown; `label` and `description` come from the proposal doc):

```jsonc
{
  "id": "salary-levels",
  "label": "Software / AI salary levels (purchasing-power aware)",
  "description": "<verbatim rubric from factor-taxonomy-proposal.md>",
  "weight": 16
}
```

- [ ] **Step 7: Run the full quality gate, verify green**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: lint 0 errors; typecheck OK; all tests pass (incl. `data.test.ts` — still 14 categories, now with object factors validated by the new schema); build OK.

- [ ] **Step 8: Commit** (after user approval)

```bash
git add src/lib/schema.ts src/types/index.ts src/data/categories.json src/lib/schema.test.ts docs/superpowers/
git commit -m "feat(taxonomy): weighted, described factors per category with strict validation"
```

---

## Self-review

- **Spec coverage:** §3.1 (factor schema) → Task 1 Steps 3-4. §5 (validation: unique ids, sum-100, mandatory `other`) → Steps 1-3. §4 (taxonomy + rubrics + single-owner boundaries) → Step 6. §9 Phase-1 testing → Steps 1-2,5,7. Country-cell / scoring / UI / de-hardcode are explicitly Phase 2-3 (out of this plan).
- **Placeholders:** none — schema + test code is concrete; rubric `description` text is sourced verbatim from the proposal doc (authored, not TBD); weights are explicit.
- **Type consistency:** `Factor = {id,label,description,weight}` used consistently in schema, type export, tests, and data shape; `categorySchema.factors: z.array(factorSchema)`.
