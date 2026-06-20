// src/components/charts/RadarProfile.tsx
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Category, ScoredCountry } from "@/types";
import { formatPercent } from "@/lib/formatters";
import { categoryScore, byWeightDesc } from "@/lib/selectors";
import { SERIES } from "@/lib/palette";

export function RadarProfile({ countries, categories }: { countries: ScoredCountry[]; categories: Category[] }) {
  // Heaviest category first, so the radar axes read in the same order as the tables/columns.
  const data = [...categories].sort(byWeightDesc).map((cat) => {
    const row: Record<string, string | number> = { category: cat.shortLabel };
    for (const c of countries) row[c.name] = categoryScore(c, cat.id) ?? 0;
    return row;
  });

  return (
    <figure className="m-0" role="img" aria-label={`Category radar profile for ${countries.map((c) => c.name).join(", ")}`}>
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
          {countries.map((c, i) => (
            <Radar key={c.id} name={c.name} dataKey={c.name} stroke={SERIES[i % SERIES.length]} fill={SERIES[i % SERIES.length]} fillOpacity={0.18} />
          ))}
          <Tooltip formatter={(value, name) => [formatPercent(Number(value)), name]} />
          {countries.length > 1 && <Legend />}
        </RadarChart>
      </ResponsiveContainer>
    </figure>
  );
}
