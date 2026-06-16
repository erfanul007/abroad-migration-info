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
