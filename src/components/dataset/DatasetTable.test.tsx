import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { DatasetTable } from "@/components/dataset/DatasetTable";
import type { ComparativeDataset } from "@/types";

const ds: ComparativeDataset = {
  kind: "cities",
  countryId: "germany",
  title: "T",
  scale: "score",
  lastReviewed: "2026-07-13",
  columns: [
    { id: "conv", label: "Conversion", shortLabel: "Conv", kind: "score", weight: 60, betterWhen: "high" },
    { id: "jobs", label: "Jobs", kind: "score", weight: 40, betterWhen: "high" },
    { id: "rentM2", label: "€/m²", kind: "number", betterWhen: "low" },
  ],
  rows: [
    { id: "hamburg", label: "Hamburg", values: { conv: 76, jobs: 74, rentM2: 14 },
      detail: { summary: "Balanced all-rounder.", pros: [{ text: "Welcome Center" }], cons: [{ text: "Entry saturated" }] } },
    { id: "munich", label: "Munich", values: { conv: 68, jobs: 92, rentM2: 22 } },
  ],
};

describe("DatasetTable", () => {
  it("renders every row and an Overall column for score datasets", () => {
    render(<DatasetTable dataset={ds} />);
    expect(screen.getByText("Hamburg")).toBeInTheDocument();
    expect(screen.getByText("Munich")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Overall" })).toBeInTheDocument();
  });

  it("expands a row to reveal its detail panel", () => {
    render(<DatasetTable dataset={ds} />);
    expect(screen.queryByText("Balanced all-rounder.")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show details" }));
    expect(screen.getByText("Balanced all-rounder.")).toBeInTheDocument();
    expect(screen.getByText("Welcome Center")).toBeInTheDocument();
  });

  it("sorts by a column when its header is clicked", () => {
    render(<DatasetTable dataset={ds} />);
    // default sort: Overall desc → Munich (77.6) above Hamburg (75.2)
    expect(within(screen.getAllByRole("row")[1]).getByText("Munich")).toBeInTheDocument();
    // sort by Conv (high-is-better, desc first) → Hamburg (76) rises above Munich (68)
    fireEvent.click(screen.getByRole("button", { name: "Conv" }));
    expect(within(screen.getAllByRole("row")[1]).getByText("Hamburg")).toBeInTheDocument();
  });
});
