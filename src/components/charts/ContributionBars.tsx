// src/components/charts/ContributionBars.tsx
import { Bar, BarChart, Cell, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ScoredCountry } from "@/types";
import { formatNumber, scoreTier, tierColor } from "@/lib/formatters";

export function ContributionBars({ country }: { country: ScoredCountry }) {
  // Bar length = contribution to overall; bar colour = that category's score tier (same scale as
  // its ScoreBadge), so the chart reads in the one tier palette. Non-derivable → muted.
  const data = country.scored
    .map((s) => ({ name: s.category.shortLabel, contribution: Number(s.contribution.toFixed(2)), weight: s.category.weight, score: s.score }))
    .sort((a, b) => b.contribution - a.contribution);

  return (
    <figure className="m-0" role="img" aria-label={`Category contribution breakdown for ${country.name}`}>
      <ResponsiveContainer width="100%" height={Math.max(280, data.length * 26)}>
        <BarChart data={data} layout="vertical" margin={{ left: 16, right: 16 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, "dataMax"]} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v, _n, p) => [`${formatNumber(Number(v), 2)} of ${formatNumber((p as { payload: { weight: number } }).payload.weight)} pts`, "Contribution"]} />
          <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.score == null ? "var(--muted-foreground)" : tierColor(scoreTier(d.score))} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}
