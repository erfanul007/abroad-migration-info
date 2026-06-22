// Single source of truth for the DATA shapes. Zod schemas validate every JSON file at load and
// `z.infer` produces the TS types (re-exported from @/types), so runtime check and compile-time
// type can't drift. The cross-field rules we own — weights summing to 100, integer 0..100 scores,
// countries referencing only known category ids — live here and are the only things our tests
// assert (shape-checking is Zod's job).
import { z } from "zod";

const WEIGHT_TOLERANCE = 0.001;

export const referenceLinkSchema = z.object({
  title: z.string(),
  url: z.url(),
});

export const factorSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  description: z.string(),
  weight: z.number().positive(),
});

// Our rules (not pure shape), as refinements so a single parse enforces them: factor weights
// sum to 100 and factor ids are unique.
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
  });

export const cellStatusSchema = z.enum(["scored", "pending"]);

// A pro/con bullet; severity "blocker" flags a con, "highlight" flags a pro.
export const proConSchema = z.object({
  text: z.string(),
  severity: z.enum(["normal", "blocker", "highlight"]).optional(),
  link: referenceLinkSchema.optional(),
});

// A factor sub-score (0..100); pending factors carry no meaningful score.
export const factorScoreSchema = z.object({
  status: cellStatusSchema,
  score: z.number().int().min(0).max(100),
});

// A category cell. The category score is DERIVED from these factor sub-scores (scoring.ts),
// never stored here. A scored cell must score every factor of its category (enforced in
// validateCountry, which needs the category list).
export const categoryScoreSchema = z.object({
  status: cellStatusSchema,
  factors: z.record(z.string(), factorScoreSchema),
  summary: z.string(),
  pros: z.array(proConSchema),
  cons: z.array(proConSchema),
  links: z.array(referenceLinkSchema),
  lastReviewed: z.string(),
});

export const countrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  iso: z.string(),
  iso3: z.string(),
  flag: z.string(),
  region: z.string(),
  summary: z.string(),
  lastReviewed: z.string(),
  links: z.array(referenceLinkSchema),
  categories: z.record(z.string(), categoryScoreSchema),
});

// Our rules (not pure shape), as refinements: category weights are positive and sum to 100,
// with no duplicate ids.
export const categoriesSchema = z
  .array(categorySchema)
  .refine(
    (cats) => Math.abs(cats.reduce((a, c) => a + c.weight, 0) - 100) <= WEIGHT_TOLERANCE,
    { message: "Category weights must sum to 100." },
  )
  .refine((cats) => new Set(cats.map((c) => c.id)).size === cats.length, {
    message: "Duplicate category id.",
  });

const personSchema = z.object({
  name: z.string(),
  role: z.string(),
  company: z.string(),
  location: z.string(),
  links: z.object({ portfolio: z.url(), linkedin: z.url() }),
});

const preferencesSchema = z.object({
  regions: z.array(z.string()),
  fasterCitizenship: z.boolean(),
  dualCitizenship: z.string(),
  professionPriority: z.string(),
  relocateTogether: z.boolean(),
});

export const profileSchema = z.object({
  household: z.object({ people: z.array(personSchema) }),
  education: z.object({ degree: z.string(), institution: z.string(), completed: z.string() }),
  goal: z.string(),
  pathway: z.array(z.string()),
  preferences: preferencesSchema,
});

// Inferred types — the canonical data types for the app (re-exported from @/types).
export type ReferenceLink = z.infer<typeof referenceLinkSchema>;
export type Factor = z.infer<typeof factorSchema>;
export type Category = z.infer<typeof categorySchema>;
export type CellStatus = z.infer<typeof cellStatusSchema>;
export type ProCon = z.infer<typeof proConSchema>;
export type FactorScore = z.infer<typeof factorScoreSchema>;
export type CategoryScore = z.infer<typeof categoryScoreSchema>;
export type Country = z.infer<typeof countrySchema>;
export type Person = z.infer<typeof personSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type Profile = z.infer<typeof profileSchema>;

/** Flatten a failed parse into `path: message` lines (joined path for nested fields). */
function issues(error: z.ZodError, prefix = ""): string[] {
  return error.issues.map((i) => {
    const path = i.path.join(".");
    return `${prefix}${path ? `${path}: ` : ""}${i.message}`;
  });
}

/** Validate the categories array (full shape + our weights-sum/duplicate rules). */
export function validateCategories(data: unknown): string[] {
  const result = categoriesSchema.safeParse(data);
  return result.success ? [] : issues(result.error);
}

/** Validate one country (full shape) and cross-check it references only known category ids —
 *  the one rule needing the categories list, so it can't be a self-contained refinement. */
export function validateCountry(country: unknown, categories: Category[]): string[] {
  const result = countrySchema.safeParse(country);
  if (!result.success) {
    const id = (country as { id?: string })?.id ?? "country";
    return issues(result.error, `${id}: `);
  }
  const byId = new Map(categories.map((c) => [c.id, c]));
  const errors: string[] = [];
  for (const [catId, cell] of Object.entries(result.data.categories)) {
    const category = byId.get(catId);
    if (!category) {
      errors.push(`${result.data.id}: Unknown category "${catId}".`);
      continue;
    }
    const known = new Set(category.factors.map((f) => f.id));
    for (const fid of Object.keys(cell.factors)) {
      if (!known.has(fid)) errors.push(`${result.data.id}.${catId}: Unknown factor "${fid}".`);
    }
    // Strict: a scored cell must score every one of its category's factors.
    if (cell.status === "scored") {
      for (const f of category.factors) {
        const fs = cell.factors[f.id];
        if (!fs || fs.status !== "scored") {
          errors.push(
            `${result.data.id}.${catId}: scored cell must score every factor ("${f.id}" missing or pending).`,
          );
        }
      }
    }
  }
  return errors;
}

/** Validate the applicant profile (full shape). */
export function validateProfile(data: unknown): string[] {
  const result = profileSchema.safeParse(data);
  return result.success ? [] : issues(result.error, "profile: ");
}
