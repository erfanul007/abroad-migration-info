import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { divIcon, latLngBounds } from "leaflet";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import worldData from "world-atlas/countries-110m.json";
import type { ComparativeDataset, DatasetRow } from "@/types";
import { markerLabel, rowTier } from "@/lib/datasets";
import { formatNumber } from "@/lib/formatters";

const UniversityOverviewMap = lazy(() => import("@/components/dataset/UniversityOverviewMap").then((module) => ({
  default: module.UniversityOverviewMap,
})));

const GERMANY_BOUNDS: [[number, number], [number, number]] = [[46.5, 5], [55.7, 16.1]];
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';

const germanyFeature = (() => {
  const topology = worldData as unknown as Topology;
  const collection = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
  return collection.features.find((item) => String(item.id) === "276" || item.properties?.name === "Germany") as Feature;
})();

const pinIcon = divIcon({
  className: "university-map-marker-shell",
  html: '<span class="university-map-marker university-map-marker-pin"></span>',
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  popupAnchor: [0, -38],
});

function FitBounds({ rows }: { rows: DatasetRow[] }) {
  const map = useMap();
  useEffect(() => {
    const points = rows.filter((r) => r.location).map((r) => [r.location!.lat, r.location!.lng] as [number, number]);
    if (points.length === 0) return;
    map.fitBounds(latLngBounds(points), { padding: [36, 36], maxZoom: 11 });
  }, [rows, map]);
  return null;
}

/** A short, kind-aware value line for the map popup (existing data only). */
function keyFacts(dataset: ComparativeDataset, row: DatasetRow): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = [];
  const v = row.values;
  if (dataset.kind === "universities") {
    if (typeof v.overallRank === "number") facts.push({ label: "World rank", value: `#${formatNumber(v.overallRank)}` });
    if (typeof v.nonEuTuition === "number") facts.push({ label: "Non-EU tuition", value: `€${formatNumber(v.nonEuTuition)}` });
  } else {
    const tier = dataset.scale === "score" ? rowTier(dataset, row) : null;
    if (tier) facts.push({ label: "Overall", value: tier });
    if (row.sublabel) facts.push({ label: "Region", value: row.sublabel });
  }
  return facts;
}

function MarkerDetail({ dataset, row }: { dataset: ComparativeDataset; row: DatasetRow }) {
  const place = [row.sublabel, row.location?.label].filter(Boolean).join(" · ");
  const facts = keyFacts(dataset, row);
  return (
    <div className="w-64 space-y-2">
      <div>
        <div className="font-semibold leading-tight">{row.label}</div>
        {place && <div className="mt-0.5 text-xs text-muted-foreground">{place}</div>}
      </div>
      {facts.length > 0 && (
        <dl className="grid gap-y-1.5 text-sm">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.label}</dt>
              <dd className="whitespace-normal">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {dataset.kind !== "universities" && row.detail?.summary && (
        <p className="line-clamp-3 text-xs text-muted-foreground">{row.detail.summary}</p>
      )}
    </div>
  );
}

/** An overview map plotting every located row of a dataset. Each pin carries a permanent short
 *  label (abbr for long university names, name otherwise); clicking a pin opens a small detail
 *  popup built from existing row data. Not synced to the table's search/filter. */
function LeafletDatasetMap({ dataset }: { dataset: ComparativeDataset }) {
  const [tileFailed, setTileFailed] = useState(false);
  const located = useMemo(() => dataset.rows.filter((r) => r.location), [dataset]);

  if (located.length === 0) return null;

  const noun = dataset.kind === "cities" ? "City" : "University";

  return (
    <section aria-label={`${noun} locations in Germany`} className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">Locations in Germany</h2>
        {tileFailed && <p role="status" className="text-xs text-amber-700 dark:text-amber-400">Street map unavailable; showing locations only.</p>}
      </div>
      <div className="relative h-[320px] overflow-hidden rounded-lg border bg-muted sm:h-[400px]">
        <MapContainer
          center={[51.1, 10.4]}
          zoom={5}
          minZoom={5}
          maxZoom={15}
          maxBounds={GERMANY_BOUNDS}
          maxBoundsViscosity={1}
          scrollWheelZoom={false}
          className="h-full w-full"
          style={{ background: "var(--muted)" }}
        >
          <GeoJSON
            data={germanyFeature}
            style={{ color: "var(--border)", weight: 1.5, fillColor: "var(--muted)", fillOpacity: tileFailed ? 1 : 0 }}
          />
          {!tileFailed && (
            <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} eventHandlers={{ tileerror: () => setTileFailed(true) }} />
          )}
          <FitBounds rows={located} />
          {located.map((row) => (
            <Marker
              key={row.id}
              position={[row.location!.lat, row.location!.lng]}
              icon={pinIcon}
              title={row.label}
              alt={row.label}
              keyboard
            >
              <Tooltip permanent direction="top" offset={[0, -30]} className="country-label">
                {markerLabel(row, dataset.kind)}
              </Tooltip>
              <Popup autoPan autoPanPadding={[24, 24]} maxWidth={288}>
                <MarkerDetail dataset={dataset} row={row} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </section>
  );
}

export function DatasetMap({ dataset }: { dataset: ComparativeDataset }) {
  return dataset.kind === "universities"
    ? (
      <Suspense fallback={<div role="status" className="h-[320px] animate-pulse rounded-lg border bg-muted sm:h-[400px]" aria-label="Loading university map" />}>
        <UniversityOverviewMap dataset={dataset} />
      </Suspense>
    )
    : <LeafletDatasetMap dataset={dataset} />;
}
