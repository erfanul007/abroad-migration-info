// Runtime-derived values for supplementary datasets. Like country scoring, the overall is NEVER
// stored — it is the weight-renormalised mean of the score columns actually present in a row,
// computed here on render. `bestValue` powers per-column "best cell" highlighting, honouring each
// column's betterWhen direction.
import type { ComparativeDataset, DatasetColumn, DatasetRow } from "@/types";
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
