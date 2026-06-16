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
