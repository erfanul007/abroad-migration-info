import { useEffect, useMemo, useState } from "react";
import { divIcon, latLngBounds } from "leaflet";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import worldData from "world-atlas/countries-110m.json";
import type { DatasetRow } from "@/types";
import { formatNumber } from "@/lib/formatters";

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
    ), { padding: [36, 36], maxZoom: 12 });
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

function tuitionText(row: DatasetRow) {
  const tuition = row.values.nonEuTuition;
  return typeof tuition === "number" ? `€${formatNumber(tuition)} non-EU tuition / semester` : "Tuition not available";
}

function UniversityMarker({ row, label }: { row: DatasetRow; label: "A" | "B" }) {
  if (!row.location) return null;
  return (
    <Marker
      position={[row.location.lat, row.location.lng]}
      icon={markerIcon(label)}
      title={`${label}: ${row.label}, ${row.location.label}`}
      alt={`${label}: ${row.label}`}
      keyboard
    >
      <Popup>
        <div className="w-64 space-y-1">
          <div className="font-semibold">{label}: {row.label}</div>
          <div className="text-xs text-muted-foreground">{row.location.label}</div>
          {typeof row.values.programs === "string" && <div className="text-xs">{row.values.programs}</div>}
          <div className="text-xs font-medium">{tuitionText(row)}</div>
        </div>
      </Popup>
    </Marker>
  );
}

export function UniversityCompareMap({ first, second }: { first: DatasetRow; second: DatasetRow }) {
  const [tileFailed, setTileFailed] = useState(false);
  const summary = useMemo(() => {
    if (!first.location || !second.location) return "University location data is unavailable.";
    return `A: ${first.label} — ${first.location.label}; B: ${second.label} — ${second.location.label}`;
  }, [first, second]);

  if (!first.location || !second.location) {
    return <p className="rounded-lg border p-4 text-sm text-muted-foreground">{summary}</p>;
  }

  return (
    <section aria-label="Selected university locations in Germany" className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-semibold">Location in Germany</h3>
          <p className="text-xs text-muted-foreground">{summary}</p>
        </div>
        {tileFailed && <p role="status" className="text-xs text-amber-700 dark:text-amber-400">Street map unavailable; showing university locations.</p>}
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
          <BoundsController first={first} second={second} />
          <UniversityMarker row={first} label="A" />
          <UniversityMarker row={second} label="B" />
        </MapContainer>
      </div>
    </section>
  );
}
