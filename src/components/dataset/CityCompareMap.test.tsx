import type { PropsWithChildren } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CityCompareMap } from "@/components/dataset/CityCompareMap";
import type { DatasetRow } from "@/types";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children, ...props }: PropsWithChildren<Record<string, unknown>>) => <div data-testid="city-map" data-max-bounds={JSON.stringify(props.maxBounds)}>{children}</div>,
  GeoJSON: () => <div data-testid="germany-outline" />,
  TileLayer: ({ eventHandlers, url, attribution }: { eventHandlers: { tileerror: () => void }; url: string; attribution: string }) => <button data-testid="street-tiles" data-url={url} data-attribution={attribution} onClick={eventHandlers.tileerror}>tiles</button>,
  Marker: ({ children, title }: PropsWithChildren<{ title: string }>) => <div data-testid="city-marker" title={title}>{children}</div>,
  Popup: ({ children }: PropsWithChildren) => <div>{children}</div>,
  useMap: () => ({ fitBounds: vi.fn() }),
}));

const row = (id: string, label: string, state: string, lat: number, lng: number): DatasetRow => ({
  id,
  label,
  sublabel: state,
  location: { lat, lng, label: `${label} city centre`, sourceUrl: `https://www.openstreetmap.org/search?query=${id}` },
  values: { jobs: 70 },
});

describe("CityCompareMap", () => {
  it("shows two city pins on a Germany-bounded OpenStreetMap", () => {
    render(<CityCompareMap first={row("berlin", "Berlin", "Berlin", 52.52, 13.405)} second={row("munich", "Munich", "Bavaria", 48.137, 11.575)} />);

    expect(screen.getByRole("region", { name: "Selected city locations in Germany" })).toBeInTheDocument();
    expect(screen.getByTestId("city-map")).toHaveAttribute("data-max-bounds", JSON.stringify([[46.5, 5], [55.7, 16.1]]));
    expect(screen.getByTestId("street-tiles")).toHaveAttribute("data-url", "https://tile.openstreetmap.org/{z}/{x}/{y}.png");
    expect(screen.getAllByTestId("city-marker")).toHaveLength(2);
    expect(screen.getByText("A: Berlin")).toBeInTheDocument();
    expect(screen.getByText("B: Munich")).toBeInTheDocument();
  });

  it("keeps city pins visible when street tiles fail", () => {
    render(<CityCompareMap first={row("berlin", "Berlin", "Berlin", 52.52, 13.405)} second={row("munich", "Munich", "Bavaria", 48.137, 11.575)} />);
    fireEvent.click(screen.getByTestId("street-tiles"));
    expect(screen.getByText("Street map unavailable; showing city locations.")).toBeInTheDocument();
    expect(screen.getAllByTestId("city-marker")).toHaveLength(2);
  });
});
