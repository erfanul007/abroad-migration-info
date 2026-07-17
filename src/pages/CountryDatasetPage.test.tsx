import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import CountryDatasetPage from "@/pages/CountryDatasetPage";

// DatasetMap renders a real Leaflet map; stub it so these page-chrome tests stay in jsdom.
vi.mock("@/components/dataset/DatasetMap", () => ({
  DatasetMap: () => <div data-testid="dataset-map" />,
}));

function renderAt(path: string, kind: "cities" | "universities") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="country/:iso/:kind" element={<CountryDatasetPage kind={kind} />} />
        <Route path="*" element={<div>fallback</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("CountryDatasetPage", () => {
  it("renders the dataset title, map, and a back link for a known country", () => {
    renderAt("/country/germany/universities", "universities");
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByTestId("dataset-map")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to/i })).toBeInTheDocument();
  });

  it("shows not-found for an unknown country", () => {
    renderAt("/country/zzz/universities", "universities");
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it("shows a no-data message when a real country lacks that dataset", () => {
    // Canada is a real country with no supplementary datasets → the missing-dataset branch.
    renderAt("/country/canada/universities", "universities");
    expect(screen.getByText(/no universities data/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to canada/i })).toBeInTheDocument();
  });
});
