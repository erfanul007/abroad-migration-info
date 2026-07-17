import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ComparativeDataset } from "@/types";
import { UniversityOverviewMap } from "@/components/dataset/UniversityOverviewMap";

vi.mock("react-map-gl/maplibre", () => ({
  default: ({ children, mapStyle, interactiveLayerIds, onClick, onMouseMove }: React.PropsWithChildren<{
    mapStyle: string;
    interactiveLayerIds: string[];
    onClick: (event: unknown) => void;
    onMouseMove: (event: unknown) => void;
  }>) => (
    <div data-testid="maplibre-map" data-style={mapStyle} data-layers={interactiveLayerIds.join(",")}>
      {children}
      <button
        data-testid="university-feature"
        onClick={() => onClick({
          features: [{ properties: { id: "tum" }, geometry: { type: "Point", coordinates: [11.58, 48.15] } }],
        })}
        onMouseMove={() => onMouseMove({
          features: [{ properties: { id: "tum", label: "Technical University of Munich (TUM)", abbr: "TUM" }, geometry: { type: "Point", coordinates: [11.58, 48.15] } }],
        })}
      />
    </div>
  ),
  Source: ({ children, cluster, clusterRadius, data }: React.PropsWithChildren<{
    cluster: boolean;
    clusterRadius: number;
    data: { features: unknown[] };
  }>) => (
    <div data-testid="university-source" data-cluster={String(cluster)} data-radius={clusterRadius} data-count={data.features.length}>
      {children}
    </div>
  ),
  Layer: ({ id }: { id: string }) => <div data-testid={`layer-${id}`} />,
  NavigationControl: () => <div data-testid="navigation-control" />,
  Popup: ({ children }: React.PropsWithChildren) => <div data-testid="university-popup">{children}</div>,
}));

const dataset: ComparativeDataset = {
  kind: "universities",
  countryId: "germany",
  title: "German universities",
  scale: "rank",
  lastReviewed: "2026-07-17",
  columns: [{ id: "overallRank", label: "Rank", kind: "rank", betterWhen: "low" }],
  rows: [{
    id: "tum",
    label: "Technical University of Munich (TUM)",
    abbr: "TUM",
    sublabel: "Munich, Bavaria",
    values: { overallRank: 85, nonEuTuition: 6000 },
    location: { lat: 48.15, lng: 11.58, label: "Garching campus", sourceUrl: "https://example.org" },
  }],
};

describe("UniversityOverviewMap", () => {
  it("uses OpenFreeMap with native clustering and no permanent university labels", () => {
    render(<UniversityOverviewMap dataset={dataset} />);

    expect(screen.getByTestId("maplibre-map")).toHaveAttribute("data-style", "https://tiles.openfreemap.org/styles/positron");
    expect(screen.getByTestId("university-source")).toHaveAttribute("data-cluster", "true");
    expect(screen.getByTestId("university-source")).toHaveAttribute("data-count", "1");
    expect(screen.getByTestId("layer-university-clusters")).toBeInTheDocument();
    expect(screen.getByTestId("layer-university-points")).toBeInTheDocument();
    expect(screen.queryByText("TUM")).not.toBeInTheDocument();
  });

  it("opens only basic university information when an individual point is clicked", () => {
    render(<UniversityOverviewMap dataset={dataset} />);
    fireEvent.click(screen.getByTestId("university-feature"));

    const popup = screen.getByTestId("university-popup");
    expect(popup).toHaveTextContent("Technical University of Munich (TUM)");
    expect(popup).toHaveTextContent("Munich, Bavaria · Garching campus");
    expect(popup).toHaveTextContent("World rank#85");
    expect(popup).toHaveTextContent("Non-EU tuition€6,000");
  });

  it("shows the full university name on hover", () => {
    render(<UniversityOverviewMap dataset={dataset} />);
    fireEvent.mouseMove(screen.getByTestId("university-feature"));

    expect(screen.getByTestId("university-popup")).toHaveTextContent("Technical University of Munich (TUM)");
  });
});
