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
import type { ComparativeDataset, DatasetRow } from "@/types";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/formatters";
import { bestValue, rowOverall } from "@/lib/datasets";
import { cn } from "@/lib/utils";

const num = (v: number) => formatNumber(v, Number.isInteger(v) ? 0 : 1);

/** A sortable comparative table for one supplementary dataset. Score cells render as tier badges,
 *  rank/number cells as figures (best-in-column highlighted), text cells plain; rows with a
 *  `detail` block expand to a full-width profile panel. */
export function DatasetTable({ dataset }: { dataset: ComparativeDataset }) {
  const isScore = dataset.scale === "score";
  const hasDetail = dataset.rows.some((r) => r.detail);
  const best = useMemo(
    () => Object.fromEntries(dataset.columns.map((c) => [c.id, bestValue(dataset, c.id)])),
    [dataset],
  );

  const columns = useMemo<ColumnDef<DatasetRow>[]>(() => {
    const cols: ColumnDef<DatasetRow>[] = [];

    if (hasDetail) {
      cols.push({
        id: "_expand",
        header: () => <span className="sr-only">Details</span>,
        cell: ({ row }) =>
          row.original.detail ? (
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
          <div className="font-medium whitespace-normal">{row.original.label}</div>
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

    for (const col of dataset.columns) {
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
          return (
            <span className={cn("tabular-nums", isBest && "font-semibold text-primary")}>
              {num(v)}
              {col.unit ? <span className="ml-0.5 text-xs text-muted-foreground">{col.unit}</span> : null}
            </span>
          );
        },
        sortUndefined: "last",
        sortDescFirst: col.betterWhen === "high",
      });
    }

    return cols;
  }, [dataset, isScore, hasDetail, best]);

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
    data: dataset.rows,
    columns,
    state: { sorting, expanded },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getRowCanExpand: (row) => Boolean(row.original.detail),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const leafCount = table.getVisibleLeafColumns().length;

  return (
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
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <TableRow>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {row.getIsExpanded() && row.original.detail && (
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableCell colSpan={leafCount} className="whitespace-normal">
                    <RowDetail detail={row.original.detail} />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RowDetail({ detail }: { detail: NonNullable<DatasetRow["detail"]> }) {
  return (
    <div className="space-y-3 py-1 text-sm">
      {detail.summary && <p className="max-w-3xl text-muted-foreground">{detail.summary}</p>}
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
