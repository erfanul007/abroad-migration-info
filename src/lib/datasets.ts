// Runtime-derived values for supplementary datasets. Like country scoring, the overall is NEVER
// stored — it is the weight-renormalised mean of the score columns actually present in a row,
// computed here on render. `bestValue` powers per-column "best cell" highlighting, honouring each
// column's betterWhen direction.
import type { ComparativeDataset, DatasetColumn, DatasetKind, DatasetRow } from "@/types";
import { scoreTier, type Tier } from "@/lib/formatters";

/** The weighted (score-kind) columns of a dataset, in declared order. */
export function scoreColumns(dataset: ComparativeDataset): DatasetColumn[] {
  return dataset.columns.filter((c) => c.kind === "score");
}

/**
 * Weighted mean over the score columns present (numeric) in this row, renormalised by present
 * weight — mirrors the country overall. Returns null when the row has no score values.
 */
export function rowOverall(dataset: ComparativeDataset, row: DatasetRow): number | null {
  let weighted = 0;
  let weight = 0;
  for (const col of scoreColumns(dataset)) {
    const v = row.values[col.id];
    if (typeof v !== "number" || col.weight == null) continue;
    weighted += v * col.weight;
    weight += col.weight;
  }
  return weight > 0 ? weighted / weight : null;
}

/** Tier for a row's runtime overall (score datasets only); null when no overall. */
export function rowTier(dataset: ComparativeDataset, row: DatasetRow): Tier | null {
  const overall = rowOverall(dataset, row);
  return overall == null ? null : scoreTier(overall);
}

/**
 * The "best" value in a column across all rows — the max when betterWhen==="high", the min when
 * "low". Ignores missing/non-numeric cells. Returns null when the column has no numeric values.
 */
export function bestValue(dataset: ComparativeDataset, columnId: string): number | null {
  const col = dataset.columns.find((c) => c.id === columnId);
  if (!col) return null;
  const nums: number[] = [];
  for (const row of dataset.rows) {
    const v = row.values[columnId];
    if (typeof v === "number") nums.push(v);
  }
  if (nums.length === 0) return null;
  return col.betterWhen === "low" ? Math.min(...nums) : Math.max(...nums);
}

// ── Search & filter ──────────────────────────────────────────────────────────
// Filtering is pure and external to the table (mirrors the leaderboard's byRegion):
// rows are narrowed here, then handed to TanStack for sort/expand. Facets are derived
// from the data — a facet only appears when the dataset actually has >= 2 distinct
// values for it, so a cities dataset (no sublabel city, no tags) yields none.

/** A single-select filter dimension derived from a dataset's rows. */
export interface DatasetFacet {
  id: string;
  label: string;
  options: string[];
  getValues: (row: DatasetRow) => string[];
}

/** Active filter state: free-text query plus a selected value per facet ("" = all). */
export interface DatasetFilter {
  query: string;
  facets: Record<string, string>;
}

/** The city segment of a "City, State" sublabel (before the first comma), trimmed. */
function cityOf(row: DatasetRow): string {
  const first = (row.sublabel ?? "").split(",")[0]?.trim() ?? "";
  return first;
}

/** Distinct non-empty values in first-appearance order. */
function distinct(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

/** Facets available for a dataset, each with >= 2 distinct option values.
 *  City derives from the sublabel; Tags includes ownership and admission row tags. */
export function deriveFacets(dataset: ComparativeDataset): DatasetFacet[] {
  const candidates: DatasetFacet[] = [
    { id: "city", label: "City", options: [], getValues: (r) => (cityOf(r) ? [cityOf(r)] : []) },
    { id: "tags", label: "Tags", options: [], getValues: (r) => r.tags ?? [] },
  ];
  return candidates
    .map((facet) => ({ ...facet, options: distinct(dataset.rows.flatMap(facet.getValues)) }))
    .filter((facet) => facet.options.length >= 2);
}

/** Rows passing the query (case-insensitive substring over label + sublabel) AND every
 *  active facet (selected value must be one of the row's values for that facet). */
export function filterDatasetRows(dataset: ComparativeDataset, filter: DatasetFilter): DatasetRow[] {
  const q = filter.query.trim().toLowerCase();
  const facets = deriveFacets(dataset);
  const active = facets
    .map((facet) => ({ facet, selected: filter.facets[facet.id] ?? "" }))
    .filter((a) => a.selected !== "");

  return dataset.rows.filter((row) => {
    if (q) {
      const haystack = `${row.label} ${row.sublabel ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return active.every(({ facet, selected }) => facet.getValues(row).includes(selected));
  });
}

/** Max characters that read cleanly on a map pin label before we prefer an abbreviation. */
export const MARKER_LABEL_FIT = 18;

/** The on-pin label for a row: city name for cities; for universities the full name when it
 *  fits, otherwise the sourced `abbr` (falling back to the full name when no abbr exists). */
export function markerLabel(row: DatasetRow, kind: DatasetKind): string {
  if (kind !== "universities") return row.label;
  if (row.label.length <= MARKER_LABEL_FIT) return row.label;
  return row.abbr ?? row.label;
}
