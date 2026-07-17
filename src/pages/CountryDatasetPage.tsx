import { Link, useParams } from "react-router";
import { useCountry } from "@/hooks/useData";
import { getDatasets } from "@/lib/data";
import { DatasetMap } from "@/components/dataset/DatasetMap";
import { DatasetView } from "@/components/dataset/DatasetView";
import { formatDate } from "@/lib/formatters";

/** A dedicated page for one country's supplementary dataset (cities or universities): an
 *  all-markers overview map above the searchable/sortable dataset view. One component serves
 *  both routes via the `kind` prop. */
export default function CountryDatasetPage({ kind }: { kind: "cities" | "universities" }) {
  const { iso } = useParams();
  const country = useCountry(iso);
  const dataset = iso ? getDatasets(iso)[kind] : undefined;

  if (!country) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold tracking-tight">Country not found</h1>
        <Link to="/leaderboard" className="text-primary hover:underline">← Back to leaderboard</Link>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold tracking-tight">No {kind} data for {country.name}</h1>
        <Link to={`/country/${iso}`} className="text-primary hover:underline">← Back to {country.name}</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Link to={`/country/${iso}`} className="text-sm text-primary hover:underline">← Back to {country.name}</Link>
        <h1 className="text-2xl font-bold tracking-tight">{dataset.title}</h1>
        {dataset.subtitle && <p className="max-w-2xl text-sm text-muted-foreground">{dataset.subtitle}</p>}
        <p className="text-xs text-muted-foreground">Reviewed {formatDate(dataset.lastReviewed)}</p>
      </div>
      <DatasetMap dataset={dataset} />
      <DatasetView dataset={dataset} />
    </div>
  );
}
