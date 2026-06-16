# Milestone 3 — Visualisations

Back to [plan index](./README.md). Tasks 17–19. Output: the three chart components (radar, contribution bars, choropleth). Colours come from design-system §2.2–2.3 via `lib/formatters`.

---

## Task 17: RadarProfile chart

**Files:** Create `src/components/charts/RadarProfile.tsx`

- [ ] **Step 1: Implement the radar** (one axis per category; overlay ≤3 countries for Compare)

```tsx
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
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add -A
git commit -m "feat: radar profile chart (single + overlay)"
```

---

## Task 18: ContributionBars chart

**Files:** Create `src/components/charts/ContributionBars.tsx`

- [ ] **Step 1: Implement weighted-contribution bars** (each category's contribution to overall, sorted desc)

```tsx
// src/components/charts/ContributionBars.tsx
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ScoredCountry } from "@/types";

export function ContributionBars({ country }: { country: ScoredCountry }) {
  const data = country.scored
    .map((s) => ({ name: s.category.shortLabel, contribution: Number(s.contribution.toFixed(2)), weight: s.category.weight }))
    .sort((a, b) => b.contribution - a.contribution);

  return (
    <ResponsiveContainer width="100%" height={Math.max(280, data.length * 26)}>
      <BarChart data={data} layout="vertical" margin={{ left: 16, right: 16 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, "dataMax"]} tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v: number, _n, p) => [`${v} of ${p.payload.weight} pts`, "Contribution"]} />
        <Bar dataKey="contribution" fill="#2f6df6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add -A
git commit -m "feat: weighted-contribution bar chart"
```

---

## Task 19: Choropleth map (offline)

**Files:** Create `src/components/charts/Choropleth.tsx`

> **As-built note.** The steps below are the original `d3-geo` SVG plan. The shipped component instead uses **Leaflet + react-leaflet** (tile-less GeoJSON layer with antimeridian longitude unwrapping, click → popup overview, pan/zoom) and shades scored countries on a **fixed absolute green ramp** (`scoreToGreen()`), not discrete tiers. The authoritative reference is `src/components/charts/Choropleth.tsx` plus PRD §10.1 note and design-system §2.2 / §5. Kept here as the build record.

- [ ] **Step 1: Implement the choropleth** (bundled world-atlas topojson; shade by overall tier; click → detail). Geometry join is by **country name** — Natural Earth `countries-110m` names match all 13 seeds, which avoids the numeric-id gaps (e.g. Norway) that affect id-based joins.

```tsx
// src/components/charts/Choropleth.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import worldData from "world-atlas/countries-110m.json";
import type { ScoredCountry } from "@/types";
import { scoreTier, scoreTierFill } from "@/lib/formatters";

const WIDTH = 800;
const HEIGHT = 400;
const TIERS = ["excellent", "good", "fair", "weak"] as const;

interface GeoProps { name: string }

export function Choropleth({ countries }: { countries: ScoredCountry[] }) {
  const navigate = useNavigate();
  const byName = useMemo(() => new Map(countries.map((c) => [c.name, c])), [countries]);

  const { features, pathGen } = useMemo(() => {
    const topo = worldData as unknown as Topology;
    const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, GeoProps>;
    const projection = geoEqualEarth().fitSize([WIDTH, HEIGHT], fc);
    return { features: fc.features, pathGen: geoPath(projection) };
  }, []);

  return (
    <div className="rounded-lg border p-2">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label="World map shaded by overall feasibility score">
        {features.map((geo, i) => {
          const match = byName.get(geo.properties?.name ?? "");
          const fill = match ? scoreTierFill(scoreTier(match.overall)) : "var(--muted)";
          return (
            <path
              key={(geo.id as string) ?? i}
              d={pathGen(geo) ?? undefined}
              fill={fill}
              stroke="var(--background)"
              strokeWidth={0.5}
              className={match ? "cursor-pointer transition-opacity hover:opacity-80" : "pointer-events-none"}
              onClick={() => match && navigate(`/country/${match.iso}`)}
            >
              {match && <title>{`${match.name}: ${Math.round(match.overall)}`}</title>}
            </path>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-3 px-2 pt-2 text-xs text-muted-foreground">
        {TIERS.map((t) => (
          <span key={t} className="inline-flex items-center gap-1">
            <span className="inline-block size-3 rounded-sm" style={{ background: scoreTierFill(t) }} />{t}
          </span>
        ))}
      </div>
    </div>
  );
}
```

> If TS cannot find the `geojson` types, run `npm install -D @types/geojson` (usually present transitively via `@types/d3-geo`). To verify the world data import resolves, ensure `resolveJsonModule` is on (set in Task 4) — `world-atlas/countries-110m.json` is a real file in the installed package.

- [ ] **Step 2: Verify render + click-through, then commit**

Temporarily mount `<Choropleth countries={useData().countries} />` on the Dashboard stub (Task 20 makes it permanent).

```bash
npm run dev    # all 13 seed countries shaded incl. Norway; hover shows "Name: score"; click opens /country/:iso; non-seed countries muted & non-clickable; Ctrl+C
npm run typecheck
git add -A
git commit -m "feat: choropleth map (d3-geo, name join) shaded by overall score"
```
