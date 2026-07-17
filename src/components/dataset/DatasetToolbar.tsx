import type { ComparativeDataset } from "@/types";
import type { DatasetFacet, DatasetFilter } from "@/lib/datasets";
import { SearchBox } from "@/components/leaderboard/SearchBox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

// Radix Select forbids an empty-string item value, so "all" uses a sentinel that maps
// back to "" (no constraint) in the filter state — same pattern as the leaderboard region filter.
const ALL = "__all__";

const kindLabel: Record<ComparativeDataset["kind"], string> = {
  universities: "universities",
  cities: "cities",
};

/** Search + facet toolbar for a dataset table. Facets are supplied pre-derived; when the
 *  dataset yields none (e.g. cities) only the search box and result count render. */
export function DatasetToolbar({
  dataset,
  facets,
  filter,
  onFilterChange,
  total,
  matched,
}: {
  dataset: ComparativeDataset;
  facets: DatasetFacet[];
  filter: DatasetFilter;
  onFilterChange: (next: DatasetFilter) => void;
  total: number;
  matched: number;
}) {
  const hasActive = filter.query.trim() !== "" || Object.values(filter.facets).some((v) => v);

  const setFacet = (id: string, value: string) =>
    onFilterChange({ ...filter, facets: { ...filter.facets, [id]: value === ALL ? "" : value } });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchBox
        value={filter.query}
        onChange={(query) => onFilterChange({ ...filter, query })}
        placeholder={`Search ${kindLabel[dataset.kind]}…`}
      />

      {facets.map((facet) => (
        <Select key={facet.id} value={filter.facets[facet.id] || ALL} onValueChange={(v) => setFacet(facet.id, v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={`All ${facet.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All {facet.label.toLowerCase()}</SelectItem>
            {facet.options.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      <span className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
        {matched} of {total}
      </span>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange({ query: "", facets: {} })}
        >
          <X className="size-4" aria-hidden />
          Clear
        </Button>
      )}
    </div>
  );
}
