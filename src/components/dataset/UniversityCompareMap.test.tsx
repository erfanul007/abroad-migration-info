import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DatasetRow } from "@/types";
import { UniversityCompareMap } from "@/components/dataset/UniversityCompareMap";

const fitBounds = vi.fn();

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div data-testid="university-map" data-max-bounds={JSON.stringify(props.maxBounds)}>{children}</div>,
  GeoJSON: ({ style }: { style: { fillOpacity: number } }) => <div data-testid="germany-fallback" data-fill-opacity={style.fillOpacity} />,
  TileLayer: ({ eventHandlers, url, attribution }: { eventHandlers: { tileerror: () => void }; url: string; attribution: string }) => <button data-testid="street-tiles" data-url={url} data-attribution={attribution} onClick={eventHandlers.tileerror}>tiles</button>,
  Marker: ({ children, position }: React.PropsWithChildren<{ position: [number, number] }>) => <div data-testid="university-marker" data-position={position.join(",")}>{children}</div>,
  Popup: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  useMap: () => ({ fitBounds }),
}));

const row = (id: string, label: string, lat: number, lng: number, tuition: number): DatasetRow => ({
  id,
  label,
  sublabel: `${label} city`,
  location: { lat, lng, label: `${label} CS campus`, sourceUrl: `https://www.openstreetmap.org/search?query=${id}` },
  values: { programs: `${label} MSc Computer Science`, nonEuTuition: tuition },
});

describe("UniversityCompareMap", () => {
  it("shows two accessible campus pins over Germany and fits both selections", () => {
    render(<UniversityCompareMap first={row("a", "Alpha", 48.2, 11.6, 6000)} second={row("b", "Beta", 52.5, 13.3, 0)} />);

    expect(screen.getByRole("region", { name: "Selected university locations in Germany" })).toBeInTheDocument();
    expect(screen.getByText("A: Alpha — Alpha CS campus; B: Beta — Beta CS campus")).toBeInTheDocument();
    expect(screen.getByTestId("germany-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("germany-fallback")).toHaveAttribute("data-fill-opacity", "0");
    expect(screen.getAllByTestId("university-marker")).toHaveLength(2);
    expect(screen.getByText("Alpha MSc Computer Science")).toBeInTheDocument();
    expect(screen.getByText("€6,000 non-EU tuition / semester")).toBeInTheDocument();
    expect(fitBounds).toHaveBeenCalled();
  });

  it("uses policy-compliant street tiles and degrades to the pin map on tile errors", () => {
    render(<UniversityCompareMap first={row("a", "Alpha", 48.2, 11.6, 6000)} second={row("b", "Beta", 52.5, 13.3, 0)} />);
    const tiles = screen.getByTestId("street-tiles");
    expect(tiles).toHaveAttribute("data-url", "https://tile.openstreetmap.org/{z}/{x}/{y}.png");
    expect(tiles.getAttribute("data-attribution")).toContain("OpenStreetMap contributors");

    fireEvent.click(tiles);
    expect(screen.getByText("Street map unavailable; showing university locations.")).toBeInTheDocument();
    expect(screen.getByTestId("germany-fallback")).toHaveAttribute("data-fill-opacity", "1");
    expect(screen.getAllByTestId("university-marker")).toHaveLength(2);
  });
});
