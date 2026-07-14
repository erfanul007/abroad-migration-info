import { BarChart3, Radar as RadarIcon } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ComparativeDataset, DatasetRow } from "@/types";
import { formatNumber, formatPercent, scoreTier, tierColor } from "@/lib/formatters";
import { SERIES } from "@/lib/palette";

export function DatasetScoreVisuals({ dataset, row }: { dataset: ComparativeDataset; row: DatasetRow }) {
  const entries = dataset.columns
    .filter((column) => column.kind === "score")
    .flatMap((column) => {
      const score = row.values[column.id];
      if (typeof score !== "number") return [];
      const weight = column.weight ?? 0;
      return [{
        id: column.id,
        name: column.label,
        shortLabel: column.shortLabel ?? column.label,
        weight,
        score,
        contribution: (score / 100) * weight,
      }];
    })
    .sort((a, b) => b.weight - a.weight);

  if (entries.length === 0) return null;

  const maxWeight = Math.max(...entries.map((entry) => entry.weight), 1);

  return (
    <div className="grid gap-6 border-b pb-5 lg:grid-cols-2">
      <section>
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          <RadarIcon className="size-4 text-muted-foreground" aria-hidden />
          Category profile
        </h3>
        <figure className="m-0" role="img" aria-label={`Category profile for ${row.label}`}>
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={entries} outerRadius="72%">
              <PolarGrid />
              <PolarAngleAxis dataKey="shortLabel" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(value) => `${value}%`} />
              <Radar dataKey="score" name={row.label} stroke={SERIES[0]} fill={SERIES[0]} fillOpacity={0.18} />
              <Tooltip
                formatter={(value) => [formatPercent(Number(value)), row.label]}
                labelFormatter={(_, payload) => payload[0]?.payload?.name ?? ""}
              />
            </RadarChart>
          </ResponsiveContainer>
        </figure>
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <BarChart3 className="size-4 text-muted-foreground" aria-hidden />
          Contribution to overall
        </h3>
        <figure className="m-0" role="img" aria-label={`Contribution to overall for ${row.label}`}>
          <ul className="space-y-2">
            {entries.map((entry) => {
              const detail = `${entry.name}: ${formatNumber(entry.contribution, 2)} of ${formatNumber(entry.weight)} pts (${formatPercent(entry.score)})`;
              return (
                <li key={entry.id} className="flex items-center gap-3 text-xs">
                  <span className="w-28 shrink-0 truncate text-muted-foreground" title={entry.name}>
                    {entry.name}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className="h-3.5 rounded-full bg-muted"
                      style={{ width: `${(entry.weight / maxWeight) * 100}%` }}
                      role="progressbar"
                      aria-label={detail}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(entry.score)}
                      title={detail}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.max(0, Math.min(100, entry.score))}%`, backgroundColor: tierColor(scoreTier(entry.score)) }}
                      />
                    </div>
                  </div>
                  <span className="w-16 shrink-0 text-right tabular-nums text-muted-foreground">
                    {formatNumber(entry.contribution, 1)} / {formatNumber(entry.weight)}
                  </span>
                </li>
              );
            })}
          </ul>
          <figcaption className="mt-3 text-[11px] leading-snug text-muted-foreground">
            Bar width = category weight · coloured fill = score earned (tier colour) · grey = headroom
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
