import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ComparativeDataset } from "@/types";
import { DatasetMap } from "@/components/dataset/DatasetMap";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: React.PropsWithChildren) => <div data-testid="map">{children}</div>,
  GeoJSON: () => <div data-testid="germany-fallback" />,
  TileLayer: () => <div data-testid="tiles" />,
  Marker: ({ children, title, eventHandlers }: React.PropsWithChildren<{ title: string; eventHandlers: { click: () => void } }>) => (
    <button data-testid="marker" title={title} onClick={eventHandlers.click}>{children}</button>
  ),
  Tooltip: ({ children }: React.PropsWithChildren) => <span data-testid="tooltip">{children}</span>,
  useMap: () => ({ fitBounds: vi.fn() }),
}));

const loc = (lat: number, lng: number, label: string) => ({ lat, lng, label, sourceUrl: "https://example.org" });
const ds: ComparativeDataset = {
  kind: "universities", countryId: "germany", title: "German universities", scale: "rank",
  lastReviewed: "2026-07-17",
  columns: [{ id: "overallRank", label: "Rank", kind: "rank", betterWhen: "low" }],
  rows: [
    { id: "tum", label: "Technical University of Munich (TUM)", abbr: "TUM", sublabel: "Munich, Bavaria",
      values: { overallRank: 1 }, location: loc(48.15, 11.58, "Garching campus") },
    { id: "rwth", label: "RWTH Aachen University", abbr: "RWTH", sublabel: "Aachen, NRW",
      values: { overallRank: 2 }, location: loc(50.78, 6.06, "Informatikzentrum") },
    { id: "nowhere", label: "No Location University", abbr: "NLU", values: { overallRank: 3 } },
  ],
};

describe("DatasetMap", () => {
  it("renders a permanent label per located row, using abbr for long names", () => {
    render(<DatasetMap dataset={ds} />);
    expect(screen.getByText("TUM")).toBeInTheDocument();
    expect(screen.getByText("RWTH")).toBeInTheDocument();
  });
  it("skips rows without a location", () => {
    render(<DatasetMap dataset={ds} />);
    expect(screen.getAllByTestId("marker")).toHaveLength(2);
    expect(screen.queryByText("NLU")).not.toBeInTheDocument();
  });
  it("opens a detail modal with the full name when a marker is activated", () => {
    render(<DatasetMap dataset={ds} />);
    fireEvent.click(screen.getAllByTestId("marker")[0]);
    expect(screen.getByRole("dialog")).toHaveTextContent("Technical University of Munich (TUM)");
  });
  it("renders no map section when no row has a location", () => {
    const bare = { ...ds, rows: ds.rows.map((r) => ({ ...r, location: undefined })) };
    const { container } = render(<DatasetMap dataset={bare} />);
    expect(container).toBeEmptyDOMElement();
  });
});
