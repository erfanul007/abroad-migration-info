import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CountryDatasets } from "@/components/dataset/CountryDatasets";

// Exercises the real chain: getDatasets(iso) → conditional links to the dataset pages,
// over the actual Germany data files. Modal behaviour now lives on the dataset pages.
describe("CountryDatasets (integration over real data)", () => {
  it("links to the cities and universities pages for Germany", () => {
    render(<MemoryRouter><CountryDatasets iso="germany" /></MemoryRouter>);
    expect(screen.getByRole("link", { name: /universities/i })).toHaveAttribute("href", "/country/germany/universities");
    expect(screen.getByRole("link", { name: /cities/i })).toHaveAttribute("href", "/country/germany/cities");
  });

  it("renders nothing for a country with no datasets", () => {
    const { container } = render(<MemoryRouter><CountryDatasets iso="france" /></MemoryRouter>);
    expect(container).toBeEmptyDOMElement();
  });
});
