import type { Category, ComparativeDataset, Country, Profile, ScoredCountry } from "@/types";
import { validateCategories, validateCountry, validateDataset, validateProfile } from "@/lib/schema";
import { rankCountries } from "@/lib/scoring";
import categoriesJson from "@/data/categories.json";
import profileJson from "@/data/profile.json";

export const categories = categoriesJson as Category[];
export const profile = profileJson as Profile;

const modules = import.meta.glob<{ default: Country }>("@/data/countries/*.json", { eager: true });
export const countries: Country[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.name.localeCompare(b.name));

// Optional supplementary datasets, discovered by glob like countries and joined to a country by
// its `countryId`. A country may have zero, one, or both kinds.
const cityModules = import.meta.glob<{ default: ComparativeDataset }>("@/data/cities/*.json", { eager: true });
const universityModules = import.meta.glob<{ default: ComparativeDataset }>("@/data/universities/*.json", { eager: true });
export const datasets: ComparativeDataset[] = [
  ...Object.values(cityModules).map((m) => m.default),
  ...Object.values(universityModules).map((m) => m.default),
];

type CountryDatasetBundle = { cities?: ComparativeDataset; universities?: ComparativeDataset };
const datasetsByCountry = new Map<string, CountryDatasetBundle>();
for (const d of datasets) {
  const bundle = datasetsByCountry.get(d.countryId) ?? {};
  bundle[d.kind] = d;
  datasetsByCountry.set(d.countryId, bundle);
}

// Validation gate — throws in dev/test if data is malformed.
const countryIds = countries.map((c) => c.id);
const errors = [
  ...validateCategories(categories),
  ...validateProfile(profile),
  ...countries.flatMap((c) => validateCountry(c, categories)),
  ...datasets.flatMap((d) => validateDataset(d, countryIds)),
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

/** The supplementary datasets attached to a country (resolved by iso or id). `{}` when none. */
export function getDatasets(iso: string): CountryDatasetBundle {
  const country = getScoredCountry(iso);
  const id = country?.id ?? iso.toLowerCase();
  return datasetsByCountry.get(id) ?? {};
}
