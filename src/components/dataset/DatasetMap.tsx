import { useEffect, useMemo, useState } from "react";
import { divIcon, latLngBounds } from "leaflet";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import { GeoJSON, MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import worldData from "world-atlas/countries-110m.json";
import type { ComparativeDataset, DatasetRow } from "@/types";
import { markerLabel, rowTier } from "@/lib/datasets";
import { formatNumber } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

/** A short, kind-aware value line for the detail modal (existing data only). */
function keyFacts(dataset: ComparativeDataset, row: DatasetRow): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = [];
  const v = row.values;
  if (dataset.kind === "universities") {
    if (typeof v.overallRank === "number") facts.push({ label: "World rank", value: `#${formatNumber(v.overallRank)}` });
    if (typeof v.nonEuTuition === "number") facts.push({ label: "Non-EU tuition", value: `€${formatNumber(v.nonEuTuition)}` });
    if (typeof v.programs === "string") facts.push({ label: "Programs", value: v.programs });
    if (typeof v.language === "string") facts.push({ label: "Language", value: v.language });
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
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{row.label}</DialogTitle>
        {place && <DialogDescription>{place}</DialogDescription>}
      </DialogHeader>
      {dataset.kind === "universities" && row.tags && row.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {row.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
        </div>
      )}
      {facts.length > 0 && (
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.label}</dt>
              <dd className="whitespace-normal">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {row.detail?.summary && <p className="text-sm text-muted-foreground">{row.detail.summary}</p>}
    </DialogContent>
  );
}

/** An overview map plotting every located row of a dataset. Each pin carries a permanent short
 *  label (abbr for long university names, name otherwise); clicking a pin opens a small detail
 *  modal built from existing row data. Not synced to the table's search/filter. */
export function DatasetMap({ dataset }: { dataset: ComparativeDataset }) {
  const [tileFailed, setTileFailed] = useState(false);
  const [selected, setSelected] = useState<DatasetRow | null>(null);
  const located = useMemo(() => dataset.rows.filter((r) => r.location), [dataset]);

  if (located.length === 0) return null;

  const noun = dataset.kind === "cities" ? "City" : "University";

  return (
    <section aria-label={`${noun} locations in Germany`} className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">Locations in Germany</h2>
        {tileFailed && <p role="status" className="text-xs text-amber-700 dark:text-amber-400">Street map unavailable; showing locations only.</p>}
      </div>
      <div className="h-[320px] overflow-hidden rounded-lg border bg-muted sm:h-[400px]">
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
          {!tileFailed && <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} eventHandlers={{ tileerror: () => setTileFailed(true) }} />}
          <FitBounds rows={located} />
          {located.map((row) => (
            <Marker
              key={row.id}
              position={[row.location!.lat, row.location!.lng]}
              icon={pinIcon}
              title={row.label}
              alt={row.label}
              keyboard
              eventHandlers={{ click: () => setSelected(row) }}
            >
              <Tooltip permanent direction="top" offset={[0, -30]} className="country-label">
                {markerLabel(row, dataset.kind)}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && <MarkerDetail dataset={dataset} row={selected} />}
      </Dialog>
    </section>
  );
}
