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
    expect(dialog).toHaveClass("sm:max-w-7xl");
    expect(within(dialog).getByText(/Relocation Scoreboard/i)).toBeInTheDocument();
    expect(within(dialog).getByText("Hamburg")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Overall" })).toBeInTheDocument();
  });

  it("opens the Universities modal and shows a known university", () => {
    render(<CountryDatasets iso="germany" />);
    fireEvent.click(screen.getByRole("button", { name: /universities/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(/Technical University of Munich/i)).toBeInTheDocument();
    const compare = within(dialog).getByRole("tab", { name: "Compare" });
    fireEvent.mouseDown(compare, { button: 0 });
    fireEvent.click(compare);
    expect(within(dialog).getByRole("combobox", { name: "First university" })).toBeInTheDocument();
    expect(within(dialog).getByRole("combobox", { name: "Second university" })).toBeInTheDocument();
  });

  it("offers a two-city comparison tab in the Cities modal", () => {
    render(<CountryDatasets iso="germany" />);
    fireEvent.click(screen.getByRole("button", { name: /cities/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("tab", { name: "Compare" })).toBeInTheDocument();
  });

  it("keeps TUM admissions and Tanima-fit details inside its expanded row", () => {
    render(<CountryDatasets iso="germany" />);
    fireEvent.click(screen.getByRole("button", { name: /universities/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Global" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Tuition" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Application" })).toBeInTheDocument();
    expect(within(dialog).getByText("85")).toBeInTheDocument();
    expect(within(dialog).getByText("€6,000")).toBeInTheDocument();
    expect(within(dialog).queryByText(/Summer 2027 · April start/)).not.toBeInTheDocument();

    const tumRow = within(dialog).getByText(/Technical University of Munich \(TUM\)/i).closest("tr") as HTMLElement;
    fireEvent.click(within(tumRow).getByRole("button", { name: "Show details" }));

    expect(within(dialog).getByText("M.Sc. Informatics")).toBeInTheDocument();
    expect(within(dialog).getByText(/Summer 2027 · April start/)).toBeInTheDocument();
    expect(within(dialog).getByText(/Winter 2027 · October start/)).toBeInTheDocument();
    expect(within(dialog).getByText(/Summer 2027 · 1 October 2026–30 November 2026/)).toBeInTheDocument();
    expect(within(dialog).getByText(/Winter 2027 · 1 February 2027–31 May 2027/)).toBeInTheDocument();
    expect(within(dialog).getByText("€6,000 per semester for non-EU students")).toBeInTheDocument();
    expect(within(dialog).getByText("TUMonline + uni-assist VPD")).toBeInTheDocument();
    expect(within(dialog).getByText(/Tanima's CSE degree and software-engineering experience/i)).toBeInTheDocument();
    expect(within(dialog).getByText("English-taught with broad CS specialisation choices")).toBeInTheDocument();
    expect(within(dialog).getByText("High tuition and Munich living costs")).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /TUM Informatics admissions/ })).toHaveAttribute("href", expect.stringContaining("tum.de"));
  });

  it("keeps the data-heavy Cities modal open after an outside click", () => {
    render(<CountryDatasets iso="germany" />);
    fireEvent.click(screen.getByRole("button", { name: /cities/i }));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-outside-dismiss", "disabled");

    fireEvent.pointerDown(document.body);
    fireEvent.click(document.body);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
