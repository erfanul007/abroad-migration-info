import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import type { ComparativeDataset } from "@/types";
import { UniversityCompare } from "@/components/dataset/UniversityCompare";

vi.mock("@/components/dataset/UniversityCompareMap", () => ({
  UniversityCompareMap: ({ first, second }: { first: { label: string }; second: { label: string } }) => (
    <div role="region" aria-label="Selected university locations in Germany">Map: {first.label} vs {second.label}</div>
  ),
}));

const dataset: ComparativeDataset = {
  kind: "universities",
  countryId: "germany",
  title: "German universities",
  scale: "rank",
  lastReviewed: "2026-07-14",
  columns: [
    { id: "overallRank", label: "Overall world rank", kind: "rank", betterWhen: "low" },
    { id: "cse", label: "Computer Science", shortLabel: "CSE", kind: "rank", betterWhen: "low" },
    { id: "ai", label: "Artificial Intelligence", shortLabel: "AI", kind: "rank", betterWhen: "low" },
    { id: "programs", label: "Suitable programs", kind: "text", betterWhen: "high" },
    { id: "intakes", label: "Intakes", kind: "text", betterWhen: "high" },
    { id: "applicationWindow", label: "Application window", kind: "text", betterWhen: "high" },
    { id: "tuition", label: "Tuition", kind: "text", betterWhen: "low" },
    { id: "nonEuTuition", label: "Non-EU tuition / semester", kind: "number", betterWhen: "low", unit: "€" },
    { id: "applicationPortal", label: "Application portal", kind: "text", betterWhen: "high" },
  ],
  rows: [
    {
      id: "alpha",
      label: "Alpha Technical University",
      sublabel: "Alpha City",
      location: { lat: 48.2, lng: 11.6, label: "Alpha campus", sourceUrl: "https://www.openstreetmap.org/" },
      values: {
        overallRank: 85,
        cse: 71,
        ai: 54,
        programs: "M.Sc. Informatics",
        intakes: "Winter and summer",
        applicationWindow: "Winter: 1 February–31 May",
        tuition: "€6,000 per semester",
        nonEuTuition: 6000,
        applicationPortal: "Alpha Online",
      },
      detail: {
        summary: "Strong match for a CSE graduate with software experience.",
        pros: [{ text: "Broad English-taught curriculum" }],
        cons: [{ text: "High non-EU tuition" }],
        note: "Module-credit eligibility still needs checking.",
        links: [{ title: "Alpha admissions", url: "https://example.com/alpha" }],
      },
    },
    {
      id: "beta",
      label: "Beta University",
      sublabel: "Beta City",
      location: { lat: 52.5, lng: 13.3, label: "Beta campus", sourceUrl: "https://www.openstreetmap.org/" },
      values: {
        overallRank: 210,
        cse: 131,
        ai: 88,
        programs: "M.Sc. Software Systems Engineering",
        intakes: "Winter",
        applicationWindow: "1 March–15 July",
        tuition: "No tuition; semester contribution applies",
        nonEuTuition: 0,
        applicationPortal: "Beta Online",
      },
      detail: {
        summary: "Applied software-engineering option.",
        pros: [{ text: "No tuition" }],
        cons: [{ text: "Competitive admission" }],
      },
    },
  ],
};

describe("UniversityCompare", () => {
  it("compares ranks, admissions facts, and international-student narratives", () => {
    render(<UniversityCompare dataset={dataset} />);

    expect(screen.getByRole("combobox", { name: "First university" })).toHaveTextContent("Alpha Technical University");
    expect(screen.getByRole("combobox", { name: "Second university" })).toHaveTextContent("Beta University");
    expect(screen.getByText("First university").closest("label")).toBeNull();
    expect(screen.getByRole("region", { name: "Selected university locations in Germany" })).toHaveTextContent("Map: Alpha Technical University vs Beta University");

    const ranks = screen.getByRole("table", { name: "University subject rank comparison" });
    const cseRow = within(ranks).getByText("Computer Science").closest("tr") as HTMLElement;
    expect(within(cseRow).getByText("#71")).toHaveClass("font-semibold");
    expect(within(cseRow).getByText("#131")).not.toHaveClass("font-semibold");
    const overallRow = within(ranks).getByText("Overall world rank").closest("tr") as HTMLElement;
    expect(within(overallRow).getByText("#85")).toHaveClass("font-semibold");

    const admissions = screen.getByRole("table", { name: "University admissions comparison" });
    expect(within(admissions).getByText("M.Sc. Informatics")).toBeInTheDocument();
    expect(within(admissions).getByText("M.Sc. Software Systems Engineering")).toBeInTheDocument();
    expect(within(admissions).getByText("Winter: 1 February–31 May")).toBeInTheDocument();
    expect(within(admissions).getByText("Beta Online")).toBeInTheDocument();
    const tuitionRow = within(admissions).getByText("Non-EU tuition / semester").closest("tr") as HTMLElement;
    expect(within(tuitionRow).getByText("€6,000")).not.toHaveClass("font-semibold");
    expect(within(tuitionRow).getByText("€0")).toHaveClass("font-semibold");

    expect(screen.getByText("Strong match for a CSE graduate with software experience.")).toBeInTheDocument();
    expect(screen.getByText("Broad English-taught curriculum")).toBeInTheDocument();
    expect(screen.getByText("Competitive admission")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Alpha admissions/ })).toHaveAttribute("href", "https://example.com/alpha");
  });
});
