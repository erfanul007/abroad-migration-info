import { useEffect, useMemo, useState } from "react";
import { divIcon, latLngBounds } from "leaflet";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import worldData from "world-atlas/countries-110m.json";
import type { DatasetRow } from "@/types";

const GERMANY_BOUNDS: [[number, number], [number, number]] = [[46.5, 5], [55.7, 16.1]];
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';

const germanyFeature = (() => {
  const topology = worldData as unknown as Topology;
  const collection = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
  return collection.features.find((item) => String(item.id) === "276" || item.properties?.name === "Germany") as Feature;
})();

function BoundsController({ first, second }: { first: DatasetRow; second: DatasetRow }) {
  const map = useMap();
  useEffect(() => {
    if (!first.location || !second.location) return;
    map.fitBounds(latLngBounds(
      [first.location.lat, first.location.lng],
      [second.location.lat, second.location.lng],
    ), { padding: [32, 32], maxZoom: 10 });
  }, [first, second, map]);
  return null;
}

function markerIcon(label: "A" | "B") {
  return divIcon({
    className: "university-map-marker-shell",
    html: `<span class="university-map-marker university-map-marker-${label.toLowerCase()}"><span>${label}</span></span>`,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38],
  });
}

function CityMarker({ row, label }: { row: DatasetRow; label: "A" | "B" }) {
  if (!row.location) return null;
  return (
    <Marker position={[row.location.lat, row.location.lng]} icon={markerIcon(label)} title={`${label}: ${row.label}, ${row.sublabel ?? "Germany"}`} alt={`${label}: ${row.label}`} keyboard>
      <Popup>
        <div className="w-52 space-y-1">
          <div className="font-semibold">{label}: {row.label}</div>
          {row.sublabel && <div className="text-xs text-muted-foreground">{row.sublabel}</div>}
          <div className="text-xs">{row.location.label}</div>
        </div>
      </Popup>
    </Marker>
  );
}

export function CityCompareMap({ first, second }: { first: DatasetRow; second: DatasetRow }) {
  const [tileFailed, setTileFailed] = useState(false);
  const summary = useMemo(() => {
    if (!first.location || !second.location) return "City location data is unavailable.";
    return `A: ${first.label}; B: ${second.label}`;
  }, [first, second]);

  if (!first.location || !second.location) return <p className="rounded-lg border p-4 text-sm text-muted-foreground">{summary}</p>;

  return (
    <section aria-label="Selected city locations in Germany" className="space-y-2">
      <div className="flex min-h-10 flex-wrap items-baseline justify-between gap-2">
        <div><h3 className="font-semibold">Location in Germany</h3><p className="text-xs text-muted-foreground">{summary}</p></div>
        {tileFailed && <p role="status" className="text-xs text-amber-700 dark:text-amber-400">Street map unavailable; showing city locations.</p>}
      </div>
      <div className="h-[300px] overflow-hidden rounded-lg border bg-muted sm:h-[340px]">
        <MapContainer center={[51.1, 10.4]} zoom={5} minZoom={5} maxZoom={15} maxBounds={GERMANY_BOUNDS} maxBoundsViscosity={1} scrollWheelZoom={false} className="h-full w-full" style={{ background: "var(--muted)" }}>
          <GeoJSON data={germanyFeature} style={{ color: "var(--border)", weight: 1.5, fillColor: "var(--muted)", fillOpacity: tileFailed ? 1 : 0 }} />
          {!tileFailed && <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} eventHandlers={{ tileerror: () => setTileFailed(true) }} />}
          <BoundsController first={first} second={second} />
          <CityMarker row={first} label="A" />
          <CityMarker row={second} label="B" />
        </MapContainer>
      </div>
    </section>
  );
}
