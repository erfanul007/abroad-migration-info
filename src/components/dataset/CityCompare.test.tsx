import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { CityCompare } from "@/components/dataset/CityCompare";
import type { ComparativeDataset } from "@/types";

vi.mock("@/components/dataset/CityCompareMap", () => ({
  CityCompareMap: ({ first, second }: { first: { label: string }; second: { label: string } }) => (
    <div role="region" aria-label="Selected city locations in Germany">Map: {first.label} vs {second.label}</div>
  ),
}));

const dataset: ComparativeDataset = {
  kind: "cities",
  countryId: "germany",
  title: "German cities",
  scale: "score",
  lastReviewed: "2026-07-14",
  columns: [
    { id: "jobs", label: "Tech jobs", shortLabel: "Jobs", kind: "score", weight: 60, betterWhen: "high" },
    { id: "rent", label: "Affordable rent", shortLabel: "Rent", kind: "score", weight: 40, betterWhen: "high" },
    { id: "salary", label: "Salary", kind: "text", betterWhen: "high" },
  ],
  rows: [
    {
      id: "alpha", label: "Alpha", sublabel: "North", location: { lat: 53, lng: 10, label: "Alpha city centre", sourceUrl: "https://www.openstreetmap.org/" }, values: { jobs: 80, rent: 70, salary: "€70k" },
      detail: { summary: "Deep job market.", pros: [{ text: "Many employers" }], cons: [{ text: "Tight housing" }], note: "Apply early.", links: [{ title: "Alpha source", url: "https://example.com/alpha" }] },
    },
    {
      id: "beta", label: "Beta", sublabel: "South", location: { lat: 48, lng: 11, label: "Beta city centre", sourceUrl: "https://www.openstreetmap.org/" }, values: { jobs: 60, rent: 90, salary: "€60k" },
      detail: { summary: "Affordable alternative.", pros: [{ text: "Easy housing" }], cons: [{ text: "Smaller market" }] },
    },
    { id: "gamma", label: "Gamma", values: { jobs: 40, rent: 50, salary: "€55k" } },
  ],
};

describe("CityCompare", () => {
  it("defaults to the two strongest cities and organizes score and narrative context", () => {
    render(<CityCompare dataset={dataset} />);

    expect(screen.getByRole("combobox", { name: "First city" })).toHaveTextContent("Alpha");
    expect(screen.getByRole("combobox", { name: "Second city" })).toHaveTextContent("Beta");
    expect(screen.getByText("First city").closest("label")).toBeNull();
    expect(screen.getByRole("img", { name: "Category profile comparison for Alpha and Beta" })).toBeInTheDocument();
    const visuals = screen.getByTestId("city-comparison-visuals");
    expect(within(visuals).getByRole("region", { name: "Selected city locations in Germany" })).toHaveTextContent("Map: Alpha vs Beta");
    expect(within(visuals).getByRole("img", { name: "Category profile comparison for Alpha and Beta" })).toBeInTheDocument();

    const scoreTable = screen.getByRole("table", { name: "Category score comparison" });
    expect(within(scoreTable).getByText("48 / 60")).toBeInTheDocument();
    expect(within(scoreTable).getByText("36 / 40")).toBeInTheDocument();

    const facts = screen.getByRole("table", { name: "City facts comparison" });
    expect(within(facts).getByText("€70k")).toBeInTheDocument();
    expect(within(facts).getByText("€60k")).toBeInTheDocument();

    expect(screen.getByText("Deep job market.")).toBeInTheDocument();
    expect(screen.getByText("Affordable alternative.")).toBeInTheDocument();
    expect(screen.getByText("Many employers")).toBeInTheDocument();
    expect(screen.getByText("Smaller market")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Alpha source/ })).toHaveAttribute("href", "https://example.com/alpha");
  });
});
