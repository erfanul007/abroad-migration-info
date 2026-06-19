// src/components/methodology/CategoryWeightPie.tsx
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Category } from "@/types";
import { formatPercent } from "@/lib/formatters";

/** Multi-colour pie of the category weight distribution (sums to 100%). Slice colours come
 *  from the shared identity palette (colorById) so each slice matches its tile's dot. */
export function CategoryWeightPie({ categories, colorById }: { categories: Category[]; colorById: Record<string, string> }) {
  const data = categories.map((c) => ({ id: c.id, name: c.name, weight: c.weight }));
  return (
    <figure className="m-0" role="img" aria-label="Pie chart of category weight distribution across all categories">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie data={data} dataKey="weight" nameKey="name" innerRadius="45%" outerRadius="80%" paddingAngle={1} stroke="var(--background)" strokeWidth={2}>
            {data.map((d) => <Cell key={d.id} fill={colorById[d.id]} />)}
          </Pie>
          <Tooltip formatter={(value, name) => [formatPercent(Number(value)), name as string]} />
        </PieChart>
      </ResponsiveContainer>
    </figure>
  );
}
