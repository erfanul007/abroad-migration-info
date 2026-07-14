import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ComparativeDataset, DatasetColumn, DatasetRow } from "@/types";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { CityCompareMap } from "@/components/dataset/CityCompareMap";
import { ImmigrationEvidence } from "@/components/dataset/ImmigrationEvidence";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { rowOverall, scoreColumns } from "@/lib/datasets";
import { SERIES } from "@/lib/palette";
import { cn } from "@/lib/utils";

const valueText = (value: string | number | undefined, column: DatasetColumn) => {
  if (value == null || value === "") return "—";
  if (typeof value === "number") return `${formatNumber(value, Number.isInteger(value) ? 0 : 1)}${column.unit ? ` ${column.unit}` : ""}`;
  return value;
};

export function CityCompare({ dataset }: { dataset: ComparativeDataset }) {
  const ranked = useMemo(
    () => [...dataset.rows].sort((a, b) => (rowOverall(dataset, b) ?? -1) - (rowOverall(dataset, a) ?? -1)),
    [dataset],
  );
  const [firstId, setFirstId] = useState(ranked[0]?.id ?? "");
  const [secondId, setSecondId] = useState(ranked[1]?.id ?? ranked[0]?.id ?? "");
  const first = dataset.rows.find((row) => row.id === firstId);
  const second = dataset.rows.find((row) => row.id === secondId);

  if (!first || !second || dataset.rows.length < 2) {
    return <p className="text-sm text-muted-foreground">At least two cities are required for comparison.</p>;
  }

  const scores = scoreColumns(dataset).sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  const facts = dataset.columns.filter((column) => column.kind !== "score");
  const firstOverall = rowOverall(dataset, first);
  const secondOverall = rowOverall(dataset, second);
  const gap = firstOverall != null && secondOverall != null ? Math.abs(firstOverall - secondOverall) : null;
  const radarData = scores.map((column) => ({
    category: column.shortLabel ?? column.label,
    fullName: column.label,
    [first.label]: typeof first.values[column.id] === "number" ? first.values[column.id] : 0,
    [second.label]: typeof second.values[column.id] === "number" ? second.values[column.id] : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <CitySelect label="First city" value={firstId} rows={dataset.rows.filter((row) => row.id !== secondId)} onChange={setFirstId} />
        <CitySelect label="Second city" value={secondId} rows={dataset.rows.filter((row) => row.id !== firstId)} onChange={setSecondId} />
        {gap != null && <p className="pb-1 text-xs text-muted-foreground">Overall gap: <span className="font-semibold tabular-nums text-foreground">{formatNumber(gap, 1)} pts</span></p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[first, second].map((city) => (
          <section key={city.id} className="rounded-lg bg-muted/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="font-semibold">{city.label}</h3>{city.sublabel && <p className="text-xs text-muted-foreground">{city.sublabel}</p>}</div>
              {rowOverall(dataset, city) == null
                ? <span className="text-muted-foreground">—</span>
                : <ScoreBadge score={rowOverall(dataset, city)!} />}
            </div>
          </section>
        ))}
      </div>

      <div data-testid="city-comparison-visuals" className="grid items-start gap-5 lg:grid-cols-2">
        <CityCompareMap first={first} second={second} />
        <section>
          <div className="min-h-10"><h3 className="font-semibold">Category profiles</h3><p className="text-xs text-muted-foreground">Scores by weighted category</p></div>
          <figure className="m-0" role="img" aria-label={`Category profile comparison for ${first.label} and ${second.label}`}>
          <ResponsiveContainer width="100%" height={340}>
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(value) => `${value}%`} />
              {[first, second].map((city, index) => <Radar key={city.id} name={city.label} dataKey={city.label} stroke={SERIES[index]} fill={SERIES[index]} fillOpacity={0.14} />)}
              <Tooltip formatter={(value, name) => [formatPercent(Number(value)), name]} labelFormatter={(_, payload) => payload[0]?.payload?.fullName ?? ""} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
          </figure>
        </section>
      </div>

      <section>
        <h3 className="mb-2 font-semibold">Scores and weighted contribution</h3>
        <div className="overflow-x-auto rounded-lg border">
          <Table aria-label="Category score comparison">
            <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Weight</TableHead><TableHead className="text-center">{first.label}</TableHead><TableHead className="text-center">{second.label}</TableHead></TableRow></TableHeader>
            <TableBody>
              {scores.map((column) => {
                const left = typeof first.values[column.id] === "number" ? first.values[column.id] as number : null;
                const right = typeof second.values[column.id] === "number" ? second.values[column.id] as number : null;
                const weight = column.weight ?? 0;
                const best = Math.max(left ?? -1, right ?? -1);
                return (
                  <TableRow key={column.id}>
                    <TableCell><span className="font-medium">{column.label}</span></TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{formatPercent(weight)}</TableCell>
                    <ComparisonScore score={left} weight={weight} best={best} />
                    <ComparisonScore score={right} weight={weight} best={best} />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      {facts.length > 0 && (
        <section>
          <h3 className="mb-2 font-semibold">Practical context</h3>
          <div className="overflow-x-auto rounded-lg border">
            <Table aria-label="City facts comparison">
              <TableHeader><TableRow><TableHead>Fact</TableHead><TableHead>{first.label}</TableHead><TableHead>{second.label}</TableHead></TableRow></TableHeader>
              <TableBody>{facts.map((column) => <TableRow key={column.id}><TableCell className="font-medium">{column.label}</TableCell><TableCell className="min-w-64 whitespace-normal">{valueText(first.values[column.id], column)}</TableCell><TableCell className="min-w-64 whitespace-normal">{valueText(second.values[column.id], column)}</TableCell></TableRow>)}</TableBody>
            </Table>
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-2 font-semibold">City narratives</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <Narrative city={first} />
          <Narrative city={second} />
        </div>
      </section>
    </div>
  );
}

function CitySelect({ label, value, rows, onChange }: { label: string; value: string; rows: DatasetRow[]; onChange: (value: string) => void }) {
  return <div className="space-y-1"><span className="block text-xs font-medium text-muted-foreground">{label}</span><Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="w-56"><SelectValue /></SelectTrigger><SelectContent>{rows.map((row) => <SelectItem key={row.id} value={row.id}>{row.label}{row.sublabel ? ` · ${row.sublabel}` : ""}</SelectItem>)}</SelectContent></Select></div>;
}

function ComparisonScore({ score, weight, best }: { score: number | null; weight: number; best: number }) {
  if (score == null) return <TableCell className="text-center text-muted-foreground">—</TableCell>;
  return <TableCell className={cn("text-center", score === best && "bg-primary/5")}><div className="flex flex-col items-center gap-1"><ScoreBadge score={score} /><span className="text-xs tabular-nums text-muted-foreground">{formatNumber((score / 100) * weight, 1)} / {formatNumber(weight)}</span></div></TableCell>;
}

function Narrative({ city }: { city: DatasetRow }) {
  const detail = city.detail;
  return (
    <article className="space-y-3 rounded-lg border p-4">
      <div><h4 className="font-semibold">{city.label}</h4>{city.sublabel && <p className="text-xs text-muted-foreground">{city.sublabel}</p>}</div>
      {detail?.summary && <p className="text-muted-foreground">{detail.summary}</p>}
      {detail?.immigration && <ImmigrationEvidence evidence={detail.immigration} />}
      <div className="grid gap-3 sm:grid-cols-2">
        {detail?.pros?.length ? <div><h5 className="mb-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">Pros</h5><ul className="space-y-1">{detail.pros.map((item, index) => <li key={index} className="flex gap-2"><span className="text-emerald-600">+</span><span>{item.text}</span></li>)}</ul></div> : null}
        {detail?.cons?.length ? <div><h5 className="mb-1 text-xs font-semibold text-rose-700 dark:text-rose-400">Cons</h5><ul className="space-y-1">{detail.cons.map((item, index) => <li key={index} className="flex gap-2"><span className="text-rose-600">−</span><span>{item.text}</span></li>)}</ul></div> : null}
      </div>
      {detail?.note && <p><span className="font-medium">Note: </span>{detail.note}</p>}
      {detail?.links?.length ? <div className="flex flex-wrap gap-x-4 gap-y-1 border-t pt-3">{detail.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline"><ExternalLink className="size-3" aria-hidden />{link.title}</a>)}</div> : null}
    </article>
  );
}
