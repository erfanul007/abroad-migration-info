// src/pages/Compare.tsx
import { useState, useMemo } from "react";
import { useData } from "@/hooks/useData";
import { Section } from "@/components/common/Section";
import { RadarProfile } from "@/components/charts/RadarProfile";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/cn";
import { Radar, Table2 } from "lucide-react";

export default function Compare() {
  const { countries, categories } = useData();
  const [selected, setSelected] = useState<string[]>(countries.slice(0, 2).map((c) => c.iso));

  const chosen = useMemo(
    () => selected.map((iso) => countries.find((c) => c.iso === iso)).filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [selected, countries],
  );
  const optionsFor = (i: number) => countries.filter((c) => !selected.includes(c.iso) || selected[i] === c.iso);

  function setSlot(index: number, iso: string) {
    setSelected((prev) => { const next = [...prev]; next[index] = iso; return next; });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Compare</h1>
        <p className="text-sm text-muted-foreground">Compare up to three countries side by side.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {[0, 1, 2].map((i) => (
          <Select key={i} value={selected[i] ?? ""} onValueChange={(v) => setSlot(i, v)}>
            <SelectTrigger className="w-48"><SelectValue placeholder={`Country ${i + 1}`} /></SelectTrigger>
            <SelectContent>
              {optionsFor(i).map((c) => <SelectItem key={c.iso} value={c.iso}>{c.flag} {c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        ))}
        {selected.length > 2 && <Button variant="ghost" size="sm" onClick={() => setSelected((s) => s.slice(0, 2))}>Reset to 2</Button>}
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-semibold">
                    <TableCell>Overall</TableCell>
                    {chosen.map((c) => <TableCell key={c.iso} className="text-center"><ScoreBadge score={c.overall} /></TableCell>)}
                  </TableRow>
                  {categories.map((cat) => {
                    const scores = chosen.map((c) => c.categories[cat.id]?.score ?? null);
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
