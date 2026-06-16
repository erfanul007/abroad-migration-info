// src/pages/Leaderboard.tsx
import { useMemo, useState } from "react";
import { type VisibilityState } from "@tanstack/react-table";
import { useData } from "@/hooks/useData";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { SearchBox } from "@/components/leaderboard/SearchBox";
import { Filters } from "@/components/leaderboard/Filters";

export default function Leaderboard() {
  const { countries, categories } = useData();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const regions = useMemo(() => [...new Set(countries.map((c) => c.region))].sort(), [countries]);
  const filtered = useMemo(
    () => (region === "all" ? countries : countries.filter((c) => c.region === region)),
    [countries, region],
  );

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
          categories={categories} columnVisibility={columnVisibility}
          onToggleColumn={(id, visible) => setColumnVisibility((v) => ({ ...v, [id]: visible }))}
        />
      </div>
      <LeaderboardTable
        countries={filtered} categories={categories}
        globalFilter={search} columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </div>
  );
}
