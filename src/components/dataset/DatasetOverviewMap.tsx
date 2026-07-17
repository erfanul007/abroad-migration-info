import { useMemo, useState } from "react";
import MapGL, { Layer, NavigationControl, Popup, Source } from "react-map-gl/maplibre";
import type { LayerProps } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent } from "maplibre-gl";
import type { Feature, FeatureCollection, Point } from "geojson";
import type { ComparativeDataset, DatasetRow } from "@/types";
import { rowOverall, rowTier } from "@/lib/datasets";
import { formatNumber, formatPercent, tierLabel } from "@/lib/formatters";
import "maplibre-gl/dist/maplibre-gl.css";

const OPENFREEMAP_STYLE = "https://tiles.openfreemap.org/styles/positron";
const GERMANY_BOUNDS: [[number, number], [number, number]] = [[5, 46.5], [16.1, 55.7]];
const INTERACTIVE_LAYERS = ["dataset-clusters", "dataset-points"];

interface DatasetPointProperties {
  id: string;
  label: string;
}

const clusterLayer = {
  id: "dataset-clusters",
  type: "circle" as const,
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#0f766e",
    "circle-radius": ["step", ["get", "point_count"], 17, 8, 21, 16, 25],
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 2,
  },
} satisfies LayerProps;

const clusterCountLayer = {
  id: "dataset-cluster-count",
  type: "symbol" as const,
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-size": 12,
  },
  paint: { "text-color": "#ffffff" },
} satisfies LayerProps;

const pointLayer = {
  id: "dataset-points",
  type: "circle" as const,
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#0f766e",
    "circle-radius": 7,
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 2,
  },
} satisfies LayerProps;

function datasetFeatures(rows: DatasetRow[]): FeatureCollection<Point, DatasetPointProperties> {
  return {
    type: "FeatureCollection",
    features: rows.flatMap((row) => row.location ? [{
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [row.location.lng, row.location.lat] },
      properties: { id: row.id, label: row.label },
    }] : []),
  };
}

function BasicDatasetPopup({ dataset, row }: { dataset: ComparativeDataset; row: DatasetRow }) {
  const place = [row.sublabel, row.location?.label].filter(Boolean).join(" · ");
  const overall = dataset.kind === "cities" ? rowOverall(dataset, row) : null;
  const tier = dataset.kind === "cities" ? rowTier(dataset, row) : null;
  return (
    <div className="w-60 space-y-2">
      <div>
        <div className="font-semibold leading-tight">{row.label}</div>
        {place && <div className="mt-0.5 text-xs text-muted-foreground">{place}</div>}
      </div>
      <dl className="grid gap-y-1.5 text-sm">
        {typeof row.values.overallRank === "number" && (
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">World rank</dt><dd>#{formatNumber(row.values.overallRank)}</dd></div>
        )}
        {typeof row.values.nonEuTuition === "number" && (
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Non-EU tuition</dt><dd>€{formatNumber(row.values.nonEuTuition)}</dd></div>
        )}
        {overall != null && (
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overall</dt><dd>{formatPercent(overall)}</dd></div>
        )}
        {tier && (
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tier</dt><dd>{tierLabel(tier)}</dd></div>
        )}
      </dl>
    </div>
  );
}

export function DatasetOverviewMap({ dataset }: { dataset: ComparativeDataset }) {
  const rows = useMemo(() => dataset.rows.filter((row) => row.location), [dataset.rows]);
  const features = useMemo(() => datasetFeatures(rows), [rows]);
  const byId = useMemo(() => new globalThis.Map(rows.map((row) => [row.id, row])), [rows]);
  const [selected, setSelected] = useState<DatasetRow | null>(null);
  const [hovered, setHovered] = useState<Feature<Point, DatasetPointProperties> | null>(null);

  if (rows.length === 0) return null;

  const handleClick = (event: MapLayerMouseEvent) => {
    const hit = event.features?.[0];
    if (!hit || hit.geometry.type !== "Point") return;
    const coordinates = hit.geometry.coordinates as [number, number];
    if (hit.properties?.cluster) {
      event.target.easeTo({ center: coordinates, zoom: Math.min(event.target.getZoom() + 2, 12) });
      return;
    }
    setSelected(byId.get(String(hit.properties?.id)) ?? null);
  };

  const handleHover = (event: MapLayerMouseEvent) => {
    const hit = event.features?.[0];
    if (!hit || hit.geometry.type !== "Point" || hit.properties?.cluster) {
      setHovered(null);
      return;
    }
    setHovered(hit as unknown as Feature<Point, DatasetPointProperties>);
  };

  return (
    <section aria-label={`${dataset.kind === "cities" ? "City" : "University"} locations in Germany`} className="space-y-2">
      <h2 className="font-semibold">Locations in Germany</h2>
      <div className="h-[320px] overflow-hidden rounded-lg border bg-muted sm:h-[400px]">
        <MapGL
          initialViewState={{ bounds: GERMANY_BOUNDS, fitBoundsOptions: { padding: 32 } }}
          mapStyle={OPENFREEMAP_STYLE}
          minZoom={4}
          maxZoom={15}
          maxBounds={GERMANY_BOUNDS}
          interactiveLayerIds={INTERACTIVE_LAYERS}
          onClick={handleClick}
          onMouseMove={handleHover}
          onMouseLeave={() => setHovered(null)}
          cursor={hovered ? "pointer" : "grab"}
          attributionControl={{ compact: true }}
          reuseMaps
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl position="top-right" showCompass={false} />
          <Source id="dataset-locations" type="geojson" data={features} cluster clusterMaxZoom={10} clusterRadius={44}>
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...pointLayer} />
          </Source>

          {!selected && hovered && (
            <Popup
              longitude={hovered.geometry.coordinates[0]}
              latitude={hovered.geometry.coordinates[1]}
              closeButton={false}
              closeOnClick={false}
              offset={12}
              anchor="bottom"
            >
              <span className="text-xs font-semibold">{hovered.properties.label}</span>
            </Popup>
          )}

          {selected?.location && (
            <Popup
              longitude={selected.location.lng}
              latitude={selected.location.lat}
              onClose={() => setSelected(null)}
              closeOnClick={false}
              offset={14}
              maxWidth="280px"
              anchor="bottom"
            >
              <BasicDatasetPopup dataset={dataset} row={selected} />
            </Popup>
          )}
        </MapGL>
      </div>
    </section>
  );
}
