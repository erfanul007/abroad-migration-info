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
