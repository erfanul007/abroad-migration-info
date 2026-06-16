// src/lib/schema.ts
// Single source of truth for the DATA shapes. Zod schemas validate every JSON file
// (categories, countries, profile) at load and `z.infer` produces the TypeScript types
// (re-exported from @/types), so the runtime check and the compile-time type can never
// drift. Schemas cover the FULL shape (status enum, required fields, link {title,url},
// integer 0..100 scores). The two cross-field rules we actually own — category weights
// summing to 100 and a country only referencing known category ids — live here as
// refinements / a helper and are the only things our tests assert (library shape-checking
// is Zod's job, not ours to test).
import { z } from "zod";

const WEIGHT_TOLERANCE = 0.001;

export const referenceLinkSchema = z.object({
  title: z.string(),
  url: z.url(),
});

export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  shortLabel: z.string(),
  weight: z.number().positive(),
  description: z.string(),
  factors: z.array(z.string()),
});

export const cellStatusSchema = z.enum(["scored", "pending"]);

export const categoryScoreSchema = z.object({
  status: cellStatusSchema,
  score: z.number().int().min(0).max(100),
  summary: z.string().optional(),
  reasoning: z.string().optional(),
  evidence: z.array(z.string()).optional(),
  links: z.array(referenceLinkSchema).optional(),
  lastReviewed: z.string().optional(),
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

// Our rule (not pure shape): every category weight is positive AND they sum to 100,
// with no duplicate ids. Expressed as refinements so a single parse enforces them.
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

// Inferred types — the canonical data types for the whole app (re-exported from @/types).
export type ReferenceLink = z.infer<typeof referenceLinkSchema>;
export type Category = z.infer<typeof categorySchema>;
export type CellStatus = z.infer<typeof cellStatusSchema>;
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

/** Validate one country (full shape) and cross-check it only references known category
 *  ids — the one rule that needs the categories list, so it can't be a self-contained
 *  schema refinement. */
export function validateCountry(country: unknown, categories: Category[]): string[] {
  const result = countrySchema.safeParse(country);
  if (!result.success) {
    const id = (country as { id?: string })?.id ?? "country";
    return issues(result.error, `${id}: `);
  }
  const known = new Set(categories.map((c) => c.id));
  return Object.keys(result.data.categories)
    .filter((id) => !known.has(id))
    .map((id) => `${result.data.id}: Unknown category "${id}".`);
}

/** Validate the applicant profile (full shape). */
export function validateProfile(data: unknown): string[] {
  const result = profileSchema.safeParse(data);
  return result.success ? [] : issues(result.error, "profile: ");
}
