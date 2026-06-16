// src/components/charts/RadarProfile.tsx
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Category, ScoredCountry } from "@/types";

const COLORS = ["#2f6df6", "#16a34a", "#ea580c"]; // design-system §2.3

export function RadarProfile({ countries, categories }: { countries: ScoredCountry[]; categories: Category[] }) {
  const data = categories.map((cat) => {
    const row: Record<string, string | number> = { category: cat.shortLabel };
    for (const c of countries) row[c.name] = c.categories[cat.id]?.score ?? 0;
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={360}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
        {countries.map((c, i) => (
          <Radar key={c.id} name={c.name} dataKey={c.name} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.18} />
        ))}
        <Tooltip />
        {countries.length > 1 && <Legend />}
      </RadarChart>
    </ResponsiveContainer>
  );
}
