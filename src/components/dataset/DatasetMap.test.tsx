import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type { ComparativeDataset } from "@/types";
import { DatasetMap } from "@/components/dataset/DatasetMap";

vi.mock("@/components/dataset/DatasetOverviewMap", () => ({
  DatasetOverviewMap: ({ dataset }: { dataset: ComparativeDataset }) => {
    const count = dataset.rows.filter((row) => row.location).length;
    return count > 0 ? <div data-testid="dataset-overview" data-count={count} data-kind={dataset.kind} /> : null;
  },
}));

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: React.PropsWithChildren) => <div data-testid="map">{children}</div>,
  GeoJSON: () => <div data-testid="germany-fallback" />,
  TileLayer: () => <div data-testid="tiles" />,
  WMSTileLayer: () => <div data-testid="state-boundary-wms" />,
  Marker: ({ children, title }: React.PropsWithChildren<{ title: string }>) => (
    <div data-testid="marker" title={title}>{children}</div>
  ),
  Popup: ({ children }: React.PropsWithChildren) => <div data-testid="popup">{children}</div>,
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
      tags: ["Winter ’27"],
      values: { overallRank: 1, nonEuTuition: 6000, programs: "M.Sc. Informatics", language: "English" },
      detail: { summary: "Broad, research-oriented programme." },
      location: loc(48.15, 11.58, "Garching campus") },
    { id: "rwth", label: "RWTH Aachen University", abbr: "RWTH", sublabel: "Aachen, NRW",
      values: { overallRank: 2 }, location: loc(50.78, 6.06, "Informatikzentrum") },
    { id: "nowhere", label: "No Location University", abbr: "NLU", values: { overallRank: 3 } },
  ],
};

describe("DatasetMap", () => {
  it("delegates university datasets to the dedicated overview map", async () => {
    render(<DatasetMap dataset={ds} />);
    expect(await screen.findByTestId("dataset-overview")).toHaveAttribute("data-count", "2");
    expect(screen.queryByTestId("tiles")).not.toBeInTheDocument();
  });
  it("delegates city datasets to the same reusable overview map", async () => {
    const cities = { ...ds, kind: "cities" as const, scale: "score" as const };
    render(<DatasetMap dataset={cities} />);
    expect(await screen.findByTestId("dataset-overview")).toHaveAttribute("data-kind", "cities");
  });
  it("renders no map section when no row has a location", async () => {
    const bare = { ...ds, rows: ds.rows.map((r) => ({ ...r, location: undefined })) };
    const { container } = render(<DatasetMap dataset={bare} />);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
