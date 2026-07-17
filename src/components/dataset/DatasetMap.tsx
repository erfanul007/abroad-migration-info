import { lazy, Suspense } from "react";
import type { ComparativeDataset } from "@/types";

const DatasetOverviewMap = lazy(() => import("@/components/dataset/DatasetOverviewMap").then((module) => ({
  default: module.DatasetOverviewMap,
})));

/** Lazy, static-host-compatible geographic overview shared by city and university datasets. */
export function DatasetMap({ dataset }: { dataset: ComparativeDataset }) {
  const noun = dataset.kind === "cities" ? "city" : "university";
  return (
    <Suspense
      fallback={(
        <div
          role="status"
          className="h-[320px] animate-pulse rounded-lg border bg-muted sm:h-[400px]"
          aria-label={`Loading ${noun} map`}
        />
      )}
    >
      <DatasetOverviewMap dataset={dataset} />
    </Suspense>
  );
}
