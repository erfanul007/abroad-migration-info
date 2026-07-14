import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import type { ComparativeDataset } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TierLegend } from "@/components/common/TierLegend";
import { DatasetTable } from "@/components/dataset/DatasetTable";
import { CityCompare } from "@/components/dataset/CityCompare";
import { UniversityCompare } from "@/components/dataset/UniversityCompare";
import { scoreColumns } from "@/lib/datasets";
import { formatDate, formatPercent } from "@/lib/formatters";

/** A large modal presenting one supplementary dataset: a sortable table, plus optional
 *  methodology and sources/caveats tabs. `trigger` is the element that opens it. */
export function DatasetModal({ dataset, trigger }: { dataset: ComparativeDataset; trigger: ReactNode }) {
  const isScore = dataset.scale === "score";
  const showMethodology = Boolean(dataset.methodology) || isScore;
  const showSources = Boolean(dataset.sources?.length) || Boolean(dataset.caveats?.length);
  const showCompare = dataset.rows.length >= 2 && (
    (dataset.kind === "cities" && isScore) ||
    (dataset.kind === "universities" && dataset.scale === "rank")
  );
  const weighted = scoreColumns(dataset);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-7xl"
        data-outside-dismiss="disabled"
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{dataset.title}</DialogTitle>
          <DialogDescription>
            {dataset.subtitle ? `${dataset.subtitle} · ` : ""}Reviewed {formatDate(dataset.lastReviewed)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            {showCompare && <TabsTrigger value="compare">Compare</TabsTrigger>}
            {showMethodology && <TabsTrigger value="methodology">Methodology</TabsTrigger>}
            {showSources && <TabsTrigger value="sources">Sources</TabsTrigger>}
          </TabsList>

          <TabsContent value="table" className="mt-4">
            <DatasetTable dataset={dataset} />
            <p className="mt-2 text-xs text-muted-foreground">
              {isScore
                ? "Overall is the weighted mean of the scored criteria (0–100), computed live. Click a row to expand its detail; click a header to sort."
                : "Lower rank = better. Click a row to expand its detail; click a header to sort."}
            </p>
          </TabsContent>

          {showCompare && (
            <TabsContent value="compare" className="mt-4">
              {dataset.kind === "cities"
                ? <CityCompare dataset={dataset} />
                : <UniversityCompare dataset={dataset} />}
            </TabsContent>
          )}

          {showMethodology && (
            <TabsContent value="methodology" className="mt-4 space-y-4">
              {isScore && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scoring scale</div>
                  <TierLegend />
                </div>
              )}
              {weighted.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Criteria &amp; weights</div>
                  <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                    {weighted.map((c) => (
                      <li key={c.id} className="flex items-baseline justify-between gap-2">
                        <span>{c.label}</span>
                        <span className="tabular-nums text-muted-foreground">{formatPercent(c.weight ?? 0)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {dataset.methodology && (
                <p className="max-w-3xl whitespace-pre-line text-sm text-muted-foreground">{dataset.methodology}</p>
              )}
            </TabsContent>
          )}

          {showSources && (
            <TabsContent value="sources" className="mt-4 space-y-4">
              {dataset.caveats && dataset.caveats.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Caveats</div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {dataset.caveats.map((c, i) => (
                      <li key={i} className="flex gap-2"><span aria-hidden>•</span><span>{c}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {dataset.sources && dataset.sources.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sources</div>
                  <ul className="space-y-1 text-sm">
                    {dataset.sources.map((s, i) => (
                      <li key={i}>
                        <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                          <ExternalLink className="size-3" />{s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
