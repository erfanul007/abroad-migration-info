import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { ComparativeDataset, DatasetColumn, DatasetRow } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/formatters";
import { UniversityCompareMap } from "@/components/dataset/UniversityCompareMap";

const valueText = (value: string | number | undefined, column: DatasetColumn) => {
  if (value == null || value === "") return "—";
  if (typeof value !== "number") return value;
  if (column.id === "nonEuTuition" || column.id === "applicationFee") return `€${formatNumber(value)}`;
  return `${formatNumber(value)}${column.unit ? ` ${column.unit}` : ""}`;
};

export function UniversityCompare({ dataset }: { dataset: ComparativeDataset }) {
  const [firstId, setFirstId] = useState(dataset.rows[0]?.id ?? "");
  const [secondId, setSecondId] = useState(dataset.rows[1]?.id ?? dataset.rows[0]?.id ?? "");
  const first = dataset.rows.find((row) => row.id === firstId);
  const second = dataset.rows.find((row) => row.id === secondId);

  if (!first || !second || dataset.rows.length < 2) {
    return <p className="text-sm text-muted-foreground">At least two universities are required for comparison.</p>;
  }

  const ranks = dataset.columns.filter((column) => column.kind === "rank");
  const facts = dataset.columns.filter((column) => column.kind !== "rank");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <UniversitySelect label="First university" value={firstId} rows={dataset.rows.filter((row) => row.id !== secondId)} onChange={setFirstId} />
        <UniversitySelect label="Second university" value={secondId} rows={dataset.rows.filter((row) => row.id !== firstId)} onChange={setSecondId} />
      </div>

      <UniversityCompareMap first={first} second={second} />

      <div className="grid gap-3 sm:grid-cols-2">
        {[first, second].map((university) => (
          <section key={university.id} className="rounded-lg bg-muted/40 p-4">
            <h3 className="font-semibold">{university.label}</h3>
            {university.sublabel && <p className="text-xs text-muted-foreground">{university.sublabel}</p>}
          </section>
        ))}
      </div>

      <section>
        <h3 className="mb-2 font-semibold">Subject ranks</h3>
        <div className="overflow-x-auto rounded-lg border">
          <Table aria-label="University subject rank comparison">
            <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>{first.label}</TableHead><TableHead>{second.label}</TableHead></TableRow></TableHeader>
            <TableBody>{ranks.map((column) => {
              const left = typeof first.values[column.id] === "number" ? first.values[column.id] as number : null;
              const right = typeof second.values[column.id] === "number" ? second.values[column.id] as number : null;
              const best = Math.min(left ?? Number.POSITIVE_INFINITY, right ?? Number.POSITIVE_INFINITY);
              return <TableRow key={column.id}>
                <TableCell className="font-medium">{column.label}</TableCell>
                <TableCell><span className={cn("tabular-nums", left === best && "font-semibold text-primary")}>{left == null ? "—" : `#${left}`}</span></TableCell>
                <TableCell><span className={cn("tabular-nums", right === best && "font-semibold text-primary")}>{right == null ? "—" : `#${right}`}</span></TableCell>
              </TableRow>;
            })}</TableBody>
          </Table>
        </div>
      </section>

      {facts.length > 0 && <section>
        <h3 className="mb-2 font-semibold">Admissions and costs</h3>
        <div className="overflow-x-auto rounded-lg border">
          <Table aria-label="University admissions comparison">
            <TableHeader><TableRow><TableHead>Fact</TableHead><TableHead>{first.label}</TableHead><TableHead>{second.label}</TableHead></TableRow></TableHeader>
            <TableBody>{facts.map((column) => {
              const left = first.values[column.id];
              const right = second.values[column.id];
              const numeric = typeof left === "number" && typeof right === "number";
              const best = numeric ? (column.betterWhen === "low" ? Math.min(left, right) : Math.max(left, right)) : null;
              return <TableRow key={column.id}>
                <TableCell className="font-medium">{column.label}</TableCell>
                <TableCell className="min-w-64 whitespace-normal"><span className={cn("tabular-nums", numeric && left === best && "font-semibold text-primary")}>{valueText(left, column)}</span></TableCell>
                <TableCell className="min-w-64 whitespace-normal"><span className={cn("tabular-nums", numeric && right === best && "font-semibold text-primary")}>{valueText(right, column)}</span></TableCell>
              </TableRow>;
            })}</TableBody>
          </Table>
        </div>
      </section>}

      <section>
        <h3 className="mb-2 font-semibold">International-student perspective</h3>
        <div className="grid gap-4 lg:grid-cols-2"><Narrative university={first} /><Narrative university={second} /></div>
      </section>
    </div>
  );
}

function UniversitySelect({ label, value, rows, onChange }: { label: string; value: string; rows: DatasetRow[]; onChange: (value: string) => void }) {
  return <div className="space-y-1"><span className="block text-xs font-medium text-muted-foreground">{label}</span><Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="w-72 max-w-full"><SelectValue /></SelectTrigger><SelectContent>{rows.map((row) => <SelectItem key={row.id} value={row.id}>{row.label}{row.sublabel ? ` · ${row.sublabel}` : ""}</SelectItem>)}</SelectContent></Select></div>;
}

function Narrative({ university }: { university: DatasetRow }) {
  const detail = university.detail;
  return <article className="space-y-3 rounded-lg border p-4">
    <div><h4 className="font-semibold">{university.label}</h4>{university.sublabel && <p className="text-xs text-muted-foreground">{university.sublabel}</p>}</div>
    {detail?.summary && <p className="text-muted-foreground">{detail.summary}</p>}
    <div className="grid gap-3 sm:grid-cols-2">
      {detail?.pros?.length ? <div><h5 className="mb-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">Pros</h5><ul className="space-y-1">{detail.pros.map((item, index) => <li key={index} className="flex gap-2"><span className="text-emerald-600">+</span><span>{item.text}</span></li>)}</ul></div> : null}
      {detail?.cons?.length ? <div><h5 className="mb-1 text-xs font-semibold text-rose-700 dark:text-rose-400">Cons</h5><ul className="space-y-1">{detail.cons.map((item, index) => <li key={index} className="flex gap-2"><span className="text-rose-600">−</span><span>{item.text}</span></li>)}</ul></div> : null}
    </div>
    {detail?.note && <p><span className="font-medium">Profile check: </span>{detail.note}</p>}
    {detail?.links?.length ? <div className="flex flex-wrap gap-x-4 gap-y-1 border-t pt-3">{detail.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline"><ExternalLink className="size-3" aria-hidden />{link.title}</a>)}</div> : null}
  </article>;
}
