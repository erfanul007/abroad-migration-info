// src/components/leaderboard/Filters.tsx
import { type VisibilityState } from "@tanstack/react-table";
import type { Category } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  regions: string[];
  region: string;
  onRegionChange: (r: string) => void;
  categories: Category[];
  columnVisibility: VisibilityState;
  onToggleColumn: (id: string, visible: boolean) => void;
}

export function Filters({ regions, region, onRegionChange, categories, columnVisibility, onToggleColumn }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={region} onValueChange={onRegionChange}>
        <SelectTrigger className="w-44"><SelectValue placeholder="All regions" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All regions</SelectItem>
          {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm"><SlidersHorizontal className="mr-2 size-4" />Columns</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{c.shortLabel}</span>
                <Switch
                  checked={columnVisibility[c.id] !== false}
                  onCheckedChange={(v) => onToggleColumn(c.id, v)}
                />
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
