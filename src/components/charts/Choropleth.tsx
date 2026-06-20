// src/components/charts/Choropleth.tsx
// Plain world choropleth via Leaflet (react-leaflet). All countries rendered; scored ones
// are shaded on a FIXED absolute green ramp (scoreToGreen: <50 unshaded, 50→80 one shade
// per percent, ≥80 deepest). Deepest green = highest overall, faintest = lowest — a single-hue
// sequential scale, deliberately NOT the tier palette used for badges/bars. Each scored country
// carries a permanent ISO-code label
// (Leaflet tooltip) shown only where its polygon is rendered large enough to read it
// (LabelDeclutter) — Leaflet has no built-in label collision, so we gate on projected
// pixel size. Click a country → popup overview with a "View <country>".
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { MapContainer, GeoJSON, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Layer, LeafletMouseEvent, LatLng, Polygon } from "leaflet";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import { ArrowRight } from "lucide-react";
import worldData from "world-atlas/countries-110m.json";
import type { ScoredCountry } from "@/types";
import { scoreToGreen, formatPercent, FILL_MIN, FILL_MAX } from "@/lib/formatters";
import { MAP_LAND, MAP_BORDER } from "@/lib/palette";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { PendingBadge } from "@/components/common/PendingBadge";
import { Button } from "@/components/ui/button";

const INITIAL_ZOOM = 2;
// A country's label shows only once its polygon is rendered big enough to read the 2-char
// code — so big countries label early and small ones only when zoomed in (slippy-map feel).
// On-screen size depends only on zoom (panning shifts both corners equally), so we recompute
// on zoomend. Tune these to trade label density for legibility.
const LABEL_MIN_W = 26; // min polygon width in px to fit the code
const LABEL_MIN_H = 16; // min polygon height in px to fit the code

// Fixed legend gradient (8 stops sampled from the absolute 50→80 ramp). Computed once — it
// never depends on the data, so the colour key is identical on every render.
const LEGEND_GRADIENT = `linear-gradient(to right, ${Array.from({ length: 8 }, (_, i) => {
  const score = FILL_MIN + ((FILL_MAX - FILL_MIN) * i) / 7;
  return `${scoreToGreen(score)} ${((i / 7) * 100).toFixed(0)}%`;
}).join(", ")})`;

// Size-aware label declutter: show/hide each country's permanent tooltip by how big its
// polygon renders on screen, using Leaflet's own projection (latLngToContainerPoint). No
// collision plugin needed. Must live inside <MapContainer>; renders nothing.
function LabelDeclutter({ layers }: { layers: React.RefObject<Map<string, Polygon>> }) {
  const map = useMap();
  useEffect(() => {
    const update = () => {
      for (const layer of layers.current.values()) {
        const b = layer.getBounds();
        const nw = map.latLngToContainerPoint(b.getNorthWest());
        const se = map.latLngToContainerPoint(b.getSouthEast());
        const fits = Math.abs(se.x - nw.x) >= LABEL_MIN_W && Math.abs(se.y - nw.y) >= LABEL_MIN_H;
        if (fits) layer.openTooltip();
        else layer.closeTooltip();
      }
    };
    const raf = requestAnimationFrame(update); // initial pass once the polygons are added
    map.on("zoomend", update);
    return () => {
      cancelAnimationFrame(raf);
      map.off("zoomend", update);
    };
  }, [map, layers]);
  return null;
}

// Leaflet doesn't clip at the antimeridian, so a ring that crosses ±180°
// (Russia, Fiji, Aleutians…) draws a full-width band. Keeping longitudes continuous
// (unwrapped) keeps each polygon on one side, so no band — without dropping countries.
function unwrapRing(ring: Position[]): Position[] {
  let offset = 0, prev = ring[0]?.[0] ?? 0;
  return ring.map(([lng, lat]) => {
    if (lng - prev > 180) offset -= 360;
    else if (lng - prev < -180) offset += 360;
    prev = lng;
    return [lng + offset, lat];
  });
}
function unwrapGeometry(geom: Geometry): Geometry {
  if (geom.type === "Polygon") return { ...geom, coordinates: geom.coordinates.map(unwrapRing) };
  if (geom.type === "MultiPolygon") return { ...geom, coordinates: geom.coordinates.map((poly) => poly.map(unwrapRing)) };
  return geom;
}

export function Choropleth({ countries }: { countries: ScoredCountry[] }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<{ country: ScoredCountry; latlng: LatLng } | null>(null);
  // Scored-country polygon layers, keyed by ISO, for the size-aware label declutter.
  const labelLayers = useRef<Map<string, Polygon>>(new Map());
  const byName = useMemo(() => new Map(countries.map((c) => [c.name, c])), [countries]);

  const geojson = useMemo(() => {
    const topo = worldData as unknown as Topology;
    const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
    return {
      type: "FeatureCollection",
      features: fc.features.filter((f) => String(f.id) !== "010").map((f) => { // omit Antarctica (wraps the pole)
        const c = byName.get(f.properties?.name ?? "");
        return { ...f, geometry: unwrapGeometry(f.geometry), properties: { name: f.properties?.name ?? "", fill: c ? scoreToGreen(c.overall) : null } };
      }),
    } as FeatureCollection;
  }, [byName]);

  const style = (feat?: Feature) => {
    const fill = (feat?.properties as { fill?: string | null })?.fill;
    return {
      fillColor: fill || MAP_LAND,
      fillOpacity: 1,
      color: MAP_BORDER,
      weight: fill ? 0.8 : 0.4,
    };
  };

  const onEachFeature = (feat: Feature, layer: Layer) => {
    const country = byName.get((feat.properties as { name: string })?.name);
    if (!country) return;
    layer.on("click", (e: LeafletMouseEvent) => setSelected({ country, latlng: e.latlng }));
    // Native Leaflet permanent tooltip at the polygon centre = the country's ISO code.
    // Bound here; LabelDeclutter opens/closes it by on-screen size (Leaflet has no collision).
    layer.bindTooltip(country.iso, { permanent: true, direction: "center", className: "country-label" });
    labelLayers.current.set(country.iso, layer as Polygon);
  };

  return (
    <div className="relative h-[360px] overflow-hidden rounded-lg border bg-muted sm:h-[480px]">
      <MapContainer center={[25, 8]} zoom={INITIAL_ZOOM} minZoom={1} maxZoom={6} className="h-full w-full" style={{ background: "transparent" }}>
        <LabelDeclutter layers={labelLayers} />
        <GeoJSON data={geojson} style={style} onEachFeature={onEachFeature} />
        {selected && (
          <Popup position={selected.latlng} eventHandlers={{ remove: () => setSelected(null) }}>
            <div className="w-52 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden>{selected.country.flag}</span>
                <span className="font-semibold">{selected.country.name}</span>
                {selected.country.hasPending ? <PendingBadge /> : <ScoreBadge score={selected.country.overall} />}
              </div>
              <div className="text-xs text-muted-foreground">{selected.country.region} · Rank #{selected.country.rank}</div>
              {selected.country.summary && <p className="line-clamp-3 text-xs text-muted-foreground">{selected.country.summary}</p>}
              <Button size="sm" className="mt-1 w-full" onClick={() => navigate(`/country/${selected.country.iso}`)}>
                View {selected.country.name} <ArrowRight className="size-4" />
              </Button>
            </div>
          </Popup>
        )}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-2 left-2 z-[1000] flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur">
        <span className="inline-block size-2 rounded-sm" style={{ background: MAP_LAND }} />
        <span className="tabular-nums">&lt;{formatPercent(FILL_MIN)}</span>
        <span className="ml-1 inline-block h-2 w-20 rounded-sm" style={{ background: LEGEND_GRADIENT }} />
        <span className="tabular-nums">{formatPercent(FILL_MIN)}–{formatPercent(FILL_MAX)}+</span>
      </div>
    </div>
  );
}
