// src/pages/Leaderboard.tsx
import { useMemo, useState } from "react";
import { type VisibilityState } from "@tanstack/react-table";
import { useData } from "@/hooks/useData";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { SearchBox } from "@/components/leaderboard/SearchBox";
import { Filters } from "@/components/leaderboard/Filters";
import { regionsOf, byRegion, byWeightDesc } from "@/lib/selectors";

export default function Leaderboard() {
  const { countries, categories } = useData();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const regions = useMemo(() => regionsOf(countries), [countries]);
  const filtered = useMemo(() => byRegion(countries, region), [countries, region]);
  // Heaviest categories first, so both the columns and the column-toggle list read by weight.
  const orderedCategories = useMemo(() => [...categories].sort(byWeightDesc), [categories]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Countries ranked by overall feasibility. Sort any column; search and filter to narrow.</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBox value={search} onChange={setSearch} />
        <Filters
          regions={regions} region={region} onRegionChange={setRegion}
          categories={orderedCategories} columnVisibility={columnVisibility}
          onToggleColumn={(id, visible) => setColumnVisibility((v) => ({ ...v, [id]: visible }))}
        />
      </div>
      <LeaderboardTable
        countries={filtered} categories={orderedCategories}
        globalFilter={search} columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </div>
  );
}
