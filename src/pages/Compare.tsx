// src/pages/Compare.tsx
import { useState, useMemo } from "react";
import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { RadarProfile } from "@/components/charts/RadarProfile";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { FactorCompareDialog } from "@/components/compare/FactorCompareDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { topN, categoryScore, byWeightDesc } from "@/lib/selectors";
import { TOP_N } from "@/lib/config";
import { Radar, Table2, Plus, X } from "lucide-react";

const MAX_COMPARE = 5;

export default function Compare() {
  const { countries, categories } = useData();
  const [selected, setSelected] = useState<string[]>(topN(countries, TOP_N.compare).map((c) => c.iso));

  const chosen = useMemo(
    () => selected.map((iso) => countries.find((c) => c.iso === iso)).filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [selected, countries],
  );
  const orderedCategories = useMemo(() => [...categories].sort(byWeightDesc), [categories]);
  const optionsFor = (i: number) => countries.filter((c) => !selected.includes(c.iso) || selected[i] === c.iso);

  function setSlot(index: number, iso: string) {
    setSelected((prev) => { const next = [...prev]; next[index] = iso; return next; });
  }
  function removeSlot(index: number) {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }
  function addSlot() {
    const next = countries.find((c) => !selected.includes(c.iso));
    if (next) setSelected((prev) => [...prev, next.iso]);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Compare</h1>
        <p className="text-sm text-muted-foreground">Compare up to five countries side by side.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {selected.map((iso, i) => (
          <div key={i} className="flex items-center gap-1">
            <Select value={iso ?? ""} onValueChange={(v) => setSlot(i, v)}>
              <SelectTrigger className="w-48"><SelectValue placeholder={`Country ${i + 1}`} /></SelectTrigger>
              <SelectContent>
                {optionsFor(i).map((c) => <SelectItem key={c.iso} value={c.iso}>{c.flag} {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {selected.length > 2 && (
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground" aria-label="Remove country" onClick={() => removeSlot(i)}>
                <X className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        ))}
        {selected.length < MAX_COMPARE && (
          <Button variant="outline" size="sm" onClick={addSlot}>
            <Plus className="size-4" aria-hidden /> Add country
          </Button>
        )}
      </div>

      {chosen.length >= 2 && (
        <>
          <Section title="Profiles" icon={Radar}><RadarProfile countries={chosen} categories={categories} /></Section>
          <Section title="Category scores" icon={Table2}>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    {chosen.map((c) => <TableHead key={c.iso} className="text-center">{c.flag} {c.name}</TableHead>)}
                    <TableHead className="w-10"><span className="sr-only">Factors</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-semibold">
                    <TableCell>Overall</TableCell>
                    {chosen.map((c) => <TableCell key={c.iso} className="text-center"><ScoreBadge score={c.overall} /></TableCell>)}
                    <TableCell />
                  </TableRow>
                  {orderedCategories.map((cat) => {
                    const scores = chosen.map((c) => categoryScore(c, cat.id));
                    const max = Math.max(...scores.map((s) => s ?? -1));
                    return (
                      <TableRow key={cat.id}>
                        <TableCell title={cat.name}>{cat.shortLabel}</TableCell>
                        {chosen.map((c, idx) => {
                          const s = scores[idx];
                          return (
                            <TableCell key={c.iso} className={cn("text-center", s != null && s === max && "bg-primary/5")}>
                              {s == null ? <span className="text-muted-foreground">—</span> : <ScoreBadge score={s} />}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right"><FactorCompareDialog category={cat} countries={chosen} /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
