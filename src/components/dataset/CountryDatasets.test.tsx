import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { CountryDatasets } from "@/components/dataset/CountryDatasets";

// Exercises the real chain: getDatasets(iso) → conditional buttons → DatasetModal (Radix Dialog)
// → DatasetTable, over the actual Germany data files.
describe("CountryDatasets (integration over real data)", () => {
  it("renders both dataset buttons for Germany", () => {
    render(<CountryDatasets iso="germany" />);
    expect(screen.getByRole("button", { name: /cities/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /universities/i })).toBeInTheDocument();
  });

  it("renders nothing for a country with no datasets", () => {
    const { container } = render(<CountryDatasets iso="france" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("opens the Cities modal and shows the scoreboard with a known city", () => {
    render(<CountryDatasets iso="germany" />);
    fireEvent.click(screen.getByRole("button", { name: /cities/i }));
    // Dialog is portalled to document.body; title + a real row should appear.
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(/Relocation Scoreboard/i)).toBeInTheDocument();
    expect(within(dialog).getByText("Hamburg")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Overall" })).toBeInTheDocument();
  });

  it("opens the Universities modal and shows a known university", () => {
    render(<CountryDatasets iso="germany" />);
    fireEvent.click(screen.getByRole("button", { name: /universities/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(/Technical University of Munich/i)).toBeInTheDocument();
  });
});
