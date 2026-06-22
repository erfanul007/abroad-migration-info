import { useMemo } from "react";
import { categories, profile, scoredCountries, getScoredCountry } from "@/lib/data";

export function useData() {
  return useMemo(() => ({ categories, profile, countries: scoredCountries }), []);
}

export function useCountry(iso: string | undefined) {
  return useMemo(() => (iso ? getScoredCountry(iso) : undefined), [iso]);
}
