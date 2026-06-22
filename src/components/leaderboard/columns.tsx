import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import type { Category, ScoredCountry } from "@/types";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { PendingBadge } from "@/components/common/PendingBadge";
import { categoryScore } from "@/lib/selectors";

export function buildColumns(categories: Category[]): ColumnDef<ScoredCountry>[] {
  return [
    {
      id: "rank",
      header: "#",
      accessorKey: "rank",
      cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.original.rank}</span>,
      enableGlobalFilter: false,
    },
    {
      id: "country",
      header: "Country",
      accessorKey: "name",
      cell: ({ row }) => (
        <Link to={`/country/${row.original.iso}`} className="flex items-center gap-2 text-primary font-medium hover:underline">
          <span aria-hidden>{row.original.flag}</span>
          <span>{row.original.name}</span>
          {row.original.hasPending && <PendingBadge />}
        </Link>
      ),
    },
    {
      id: "overall",
      header: "Overall",
      accessorFn: (c) => c.overall,
      cell: ({ getValue }) => <ScoreBadge score={getValue<number>()} />,
      enableGlobalFilter: false,
    },
    ...categories.map<ColumnDef<ScoredCountry>>((cat) => ({
      id: cat.id,
      header: cat.shortLabel,
      accessorFn: (c) => categoryScore(c, cat.id) ?? undefined,
      cell: ({ getValue }) => {
        const v = getValue<number | undefined>();
        return v == null ? <span className="text-muted-foreground">—</span> : <ScoreBadge score={v} />;
      },
      enableGlobalFilter: false,
      sortUndefined: "last",
    })),
  ];
}
