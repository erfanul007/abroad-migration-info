// src/components/leaderboard/LeaderboardTable.tsx
import { useMemo, useState } from "react";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel,
  useReactTable, type SortingState, type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { Category, ScoredCountry } from "@/types";
import { buildColumns } from "@/components/leaderboard/columns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/cn";

interface Props {
  countries: ScoredCountry[];
  categories: Category[];
  globalFilter: string;
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (v: VisibilityState) => void;
}

export function LeaderboardTable({ countries, categories, globalFilter, columnVisibility, onColumnVisibilityChange }: Props) {
  const columns = useMemo(() => buildColumns(categories), [categories]);
  const [sorting, setSorting] = useState<SortingState>([{ id: "overall", desc: true }]);
  const labelById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const table = useReactTable({
    data: countries,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: (u) =>
      onColumnVisibilityChange(typeof u === "function" ? u(columnVisibility) : u),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => {
                const sortDir = h.column.getIsSorted();
                return (
                  <TableHead
                    key={h.id}
                    title={labelById[h.column.id] ?? undefined}
                    onClick={h.column.getCanSort() ? h.column.getToggleSortingHandler() : undefined}
                    className={cn("whitespace-nowrap", h.column.getCanSort() && "cursor-pointer select-none")}
                  >
                    <span className="inline-flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && (
                        sortDir === "asc" ? <ArrowUp className="size-3" />
                          : sortDir === "desc" ? <ArrowDown className="size-3" />
                          : <ChevronsUpDown className="size-3 opacity-40" />
                      )}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow><TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">No countries match your search.</TableCell></TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
