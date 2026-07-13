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

// --- Supplementary per-country datasets (cities scoreboard, university ranking) ---------------
// Optional, generic tabular datasets attached to a country by id and rendered in a modal. One
// shape serves both kinds; `kind`/`scale` discriminate. Column weights (for score datasets) and
// the runtime overall follow the same "no stored overall" rule as country categories.
export const datasetKindSchema = z.enum(["cities", "universities"]);
export const datasetScaleSchema = z.enum(["score", "rank"]);
export const columnKindSchema = z.enum(["score", "rank", "number", "text"]);
export const betterWhenSchema = z.enum(["high", "low"]);

export const datasetColumnSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  shortLabel: z.string().optional(),
  kind: columnKindSchema,
  weight: z.number().nonnegative().optional(),
  betterWhen: betterWhenSchema.default("high"),
  unit: z.string().optional(),
  description: z.string().optional(),
});

export const datasetRowSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sublabel: z.string().optional(),
  values: z.record(z.string(), z.union([z.number(), z.string()])),
  detail: z
    .object({
      summary: z.string().optional(),
      pros: z.array(proConSchema).optional(),
      cons: z.array(proConSchema).optional(),
      note: z.string().optional(),
      links: z.array(referenceLinkSchema).optional(),
    })
    .optional(),
});

export const comparativeDatasetSchema = z.object({
  kind: datasetKindSchema,
  countryId: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  scale: datasetScaleSchema,
  lastReviewed: z.string(),
  columns: z.array(datasetColumnSchema).min(1),
  rows: z.array(datasetRowSchema).min(1),
  methodology: z.string().optional(),
  caveats: z.array(z.string()).optional(),
  sources: z.array(referenceLinkSchema).optional(),
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
export type DatasetKind = z.infer<typeof datasetKindSchema>;
export type DatasetScale = z.infer<typeof datasetScaleSchema>;
export type ColumnKind = z.infer<typeof columnKindSchema>;
export type BetterWhen = z.infer<typeof betterWhenSchema>;
export type DatasetColumn = z.infer<typeof datasetColumnSchema>;
export type DatasetRow = z.infer<typeof datasetRowSchema>;
export type ComparativeDataset = z.infer<typeof comparativeDatasetSchema>;

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

/** Validate a supplementary dataset (full shape) plus the cross-field rules we own: unique
 *  column/row ids, kind↔scale agreement, score-weight sum, value types match column kind, and
 *  the join key referencing a known country id (needs the catalogue, like validateCountry). */
export function validateDataset(data: unknown, knownCountryIds: string[]): string[] {
  const result = comparativeDatasetSchema.safeParse(data);
  if (!result.success) {
    const id = (data as { countryId?: string })?.countryId ?? "dataset";
    return issues(result.error, `${id}: `);
  }
  const ds = result.data;
  const out: string[] = [];

  if (!knownCountryIds.includes(ds.countryId)) {
    out.push(`${ds.countryId}: countryId does not match a known country.`);
  }

  const colIds = ds.columns.map((c) => c.id);
  if (new Set(colIds).size !== colIds.length) out.push(`${ds.countryId}.${ds.kind}: duplicate column id.`);
  const rowIds = ds.rows.map((r) => r.id);
  if (new Set(rowIds).size !== rowIds.length) out.push(`${ds.countryId}.${ds.kind}: duplicate row id.`);

  if (ds.kind === "cities" && ds.scale !== "score") out.push(`${ds.countryId}.cities: scale must be "score".`);
  if (ds.kind === "universities" && ds.scale !== "rank") out.push(`${ds.countryId}.universities: scale must be "rank".`);

  const colById = new Map(ds.columns.map((c) => [c.id, c]));
  if (ds.scale === "score") {
    const scoreCols = ds.columns.filter((c) => c.kind === "score");
    const missing = scoreCols.filter((c) => c.weight == null).map((c) => c.id);
    if (missing.length) out.push(`${ds.countryId}.${ds.kind}: score column(s) missing weight: ${missing.join(", ")}.`);
    const sum = scoreCols.reduce((a, c) => a + (c.weight ?? 0), 0);
    if (Math.abs(sum - 100) > WEIGHT_TOLERANCE) {
      out.push(`${ds.countryId}.${ds.kind}: score column weights must sum to 100 (got ${sum}).`);
    }
  }

  for (const row of ds.rows) {
    for (const [key, value] of Object.entries(row.values)) {
      const col = colById.get(key);
      if (!col) {
        out.push(`${ds.countryId}.${ds.kind}.${row.id}: unknown column "${key}".`);
        continue;
      }
      const wantsNumber = col.kind === "score" || col.kind === "rank" || col.kind === "number";
      if (wantsNumber && typeof value !== "number") {
        out.push(`${ds.countryId}.${ds.kind}.${row.id}.${key}: expected number for ${col.kind} column.`);
      }
      if (col.kind === "text" && typeof value !== "string") {
        out.push(`${ds.countryId}.${ds.kind}.${row.id}.${key}: expected string for text column.`);
      }
    }
  }
  return out;
}
