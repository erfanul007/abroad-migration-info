import { Fragment, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, ChevronsUpDown, ExternalLink } from "lucide-react";
import type { ComparativeDataset, DatasetColumn, DatasetRow } from "@/types";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { DatasetScoreVisuals } from "@/components/dataset/DatasetScoreVisuals";
import { ImmigrationEvidence } from "@/components/dataset/ImmigrationEvidence";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatasetToolbar } from "@/components/dataset/DatasetToolbar";
import { formatNumber } from "@/lib/formatters";
import { bestValue, rowOverall, deriveFacets, filterDatasetRows, type DatasetFilter } from "@/lib/datasets";
import { cn } from "@/lib/utils";

const num = (v: number) => formatNumber(v, Number.isInteger(v) ? 0 : 1);

const intakeTagClass = (tag: string) => {
  if (tag === "Public") return "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  if (tag === "Private") return "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300";
  if (tag.endsWith(" open")) return "border-emerald-500/30 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300";
  if (tag === "No CS intake ’27") return "border-rose-500/30 bg-rose-500/15 text-rose-800 dark:text-rose-300";
  if (tag.startsWith("Winter")) return "border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-300";
  if (tag.startsWith("Summer")) return "border-teal-500/25 bg-teal-500/10 text-teal-700 dark:text-teal-300";
  return "border-border bg-muted text-muted-foreground";
};

/** A sortable comparative table for one supplementary dataset. Score cells render as tier badges,
 *  rank/number cells as figures (best-in-column highlighted), text cells plain; rows expand to a
 *  full-width profile panel. On score-scale datasets only scored columns stay in the table —
 *  context (number/text) columns move into the expanded panel to keep the grid scannable. */
export function DatasetTable({ dataset }: { dataset: ComparativeDataset }) {
  const isScore = dataset.scale === "score";
  const contextCols = useMemo(
    () => dataset.columns.filter((column) => !(isScore
      ? column.kind === "score"
      : dataset.kind === "universities"
        ? column.kind === "rank" || column.id === "nonEuTuition" || column.id === "applicationFee"
        : true)),
    [dataset, isScore],
  );
  const tableCols = useMemo(
    () => {
      const visibleColumns = dataset.columns.filter((column) => isScore
        ? column.kind === "score"
        : dataset.kind === "universities"
          ? column.kind === "rank" || column.id === "nonEuTuition" || column.id === "applicationFee"
          : true);

      return isScore
        ? [...visibleColumns].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
        : visibleColumns;
    },
    [dataset, isScore],
  );
  const hasDetail = dataset.rows.some((r) => r.detail) || contextCols.length > 0;
  const best = useMemo(
    () => Object.fromEntries(dataset.columns.map((c) => [c.id, bestValue(dataset, c.id)])),
    [dataset],
  );

  const [filter, setFilter] = useState<DatasetFilter>({ query: "", facets: {} });
  const facets = useMemo(() => deriveFacets(dataset), [dataset]);
  const filteredRows = useMemo(() => filterDatasetRows(dataset, filter), [dataset, filter]);

  const columns = useMemo<ColumnDef<DatasetRow>[]>(() => {
    const cols: ColumnDef<DatasetRow>[] = [];

    if (hasDetail) {
      cols.push({
        id: "_expand",
        header: () => <span className="sr-only">Details</span>,
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <button
              type="button"
              onClick={row.getToggleExpandedHandler()}
              aria-expanded={row.getIsExpanded()}
              aria-label={row.getIsExpanded() ? "Hide details" : "Show details"}
              className="text-muted-foreground hover:text-foreground"
            >
              {row.getIsExpanded() ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
          ) : null,
        enableSorting: false,
      });
    }

    cols.push({
      id: "_label",
      header: dataset.kind === "cities" ? "City" : dataset.kind === "universities" ? "University" : "Name",
      accessorFn: (r) => r.label,
      cell: ({ row }) => (
        <div className="min-w-40">
          <div className="flex flex-wrap items-center gap-1.5 whitespace-normal">
            <span className="font-medium">{row.original.label}</span>
            {dataset.kind === "universities" && row.original.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className={cn("border", intakeTagClass(tag))}>
                {tag}
              </Badge>
            ))}
          </div>
          {row.original.sublabel && (
            <div className="text-xs text-muted-foreground whitespace-normal">{row.original.sublabel}</div>
          )}
        </div>
      ),
    });

    if (isScore) {
      cols.push({
        id: "_overall",
        header: "Overall",
        accessorFn: (r) => rowOverall(dataset, r) ?? undefined,
        cell: ({ getValue }) => {
          const v = getValue<number | undefined>();
          return v == null ? <span className="text-muted-foreground">—</span> : <ScoreBadge score={v} />;
        },
        sortUndefined: "last",
        sortDescFirst: true,
      });
    }

    for (const col of tableCols) {
      cols.push({
        id: col.id,
        header: col.shortLabel ?? col.label,
        accessorFn: (r) => {
          const v = r.values[col.id];
          return typeof v === "number" ? v : undefined;
        },
        cell: ({ row }) => {
          const v = row.original.values[col.id];
          if (v == null || v === "") return <span className="text-muted-foreground">—</span>;
          if (col.kind === "text") return <span className="whitespace-normal">{String(v)}</span>;
          if (typeof v !== "number") return <span className="text-muted-foreground">—</span>;
          if (col.kind === "score") return <ScoreBadge score={v} />;
          const isBest = best[col.id] != null && v === best[col.id];
          const isEuroFee = col.id === "nonEuTuition" || col.id === "applicationFee";
          const formatted = isEuroFee ? `€${num(v)}` : num(v);
          return (
            <span className={cn("tabular-nums", isBest && "font-semibold text-primary")}>
              {formatted}
              {col.unit && !isEuroFee ? <span className="ml-0.5 text-xs text-muted-foreground">{col.unit}</span> : null}
            </span>
          );
        },
        sortUndefined: "last",
        sortDescFirst: col.betterWhen === "high",
      });
    }

    return cols;
  }, [dataset, isScore, hasDetail, best, tableCols]);

  const firstRankId = dataset.columns.find((c) => c.kind === "rank")?.id;
  const [sorting, setSorting] = useState<SortingState>(
    isScore
      ? [{ id: "_overall", desc: true }]
      : firstRankId
        ? [{ id: firstRankId, desc: false }]
        : [],
  );
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: { sorting, expanded },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getRowCanExpand: (row) => Boolean(row.original.detail) || contextCols.length > 0,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const leafCount = table.getVisibleLeafColumns().length;

  return (
    <div className="space-y-3">
      <DatasetToolbar
        dataset={dataset}
        facets={facets}
        filter={filter}
        onFilterChange={setFilter}
        total={dataset.rows.length}
        matched={filteredRows.length}
      />
      <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => {
                const dir = h.column.getIsSorted();
                return (
                  <TableHead
                    key={h.id}
                    aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : undefined}
                    className="whitespace-nowrap"
                  >
                    {h.column.getCanSort() ? (
                      <button type="button" onClick={h.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 select-none">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {dir === "asc" ? <ArrowUp className="size-3" /> : dir === "desc" ? <ArrowDown className="size-3" /> : <ChevronsUpDown className="size-3 opacity-40" />}
                      </button>
                    ) : (
                      flexRender(h.column.columnDef.header, h.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {filteredRows.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={leafCount} className="py-8 text-center text-muted-foreground">
                No matches — adjust the search or filters.
              </TableCell>
            </TableRow>
          )}
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <TableRow>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {row.getIsExpanded() && (
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableCell colSpan={leafCount} className="whitespace-normal">
                    <RowDetail dataset={dataset} row={row.original} contextCols={contextCols} />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}

function RowDetail({ dataset, row, contextCols }: { dataset: ComparativeDataset; row: DatasetRow; contextCols: DatasetColumn[] }) {
  const detail: NonNullable<DatasetRow["detail"]> = row.detail ?? {};
  const facts = contextCols
    .map((col) => ({ col, value: row.values[col.id] }))
    .filter((f) => f.value != null && f.value !== "");
  return (
    <div className="space-y-3 py-1 text-sm">
      {dataset.kind === "cities" && dataset.scale === "score" && (
        <DatasetScoreVisuals dataset={dataset} row={row} />
      )}
      {detail.summary && <p className="max-w-3xl text-muted-foreground">{detail.summary}</p>}
      {detail.immigration && <ImmigrationEvidence evidence={detail.immigration} />}
      {facts.length > 0 && (
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map(({ col, value }) => (
            <div key={col.id}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{col.label}</dt>
              <dd className="whitespace-normal">
                {typeof value === "number" ? (
                  <span className="tabular-nums">
                    {num(value)}
                    {col.unit ? <span className="ml-0.5 text-xs text-muted-foreground">{col.unit}</span> : null}
                  </span>
                ) : (
                  String(value)
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {detail.note && <p className="max-w-3xl"><span className="font-medium">Note: </span>{detail.note}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {detail.pros && detail.pros.length > 0 && (
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Pros</div>
            <ul className="space-y-1">
              {detail.pros.map((p, i) => (
                <li key={i} className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">+</span><span>{p.text}</span></li>
              ))}
            </ul>
          </div>
        )}
        {detail.cons && detail.cons.length > 0 && (
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-400">Cons</div>
            <ul className="space-y-1">
              {detail.cons.map((c, i) => (
                <li key={i} className="flex gap-2"><span className="text-rose-600 dark:text-rose-400">−</span><span>{c.text}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {detail.links && detail.links.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
          {detail.links.map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              <ExternalLink className="size-3" />{l.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
