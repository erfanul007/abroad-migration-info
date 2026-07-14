import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DatasetScoreVisuals } from "@/components/dataset/DatasetScoreVisuals";
import type { ComparativeDataset, DatasetRow } from "@/types";

const dataset: ComparativeDataset = {
  kind: "cities",
  countryId: "germany",
  title: "German cities",
  scale: "score",
  lastReviewed: "2026-07-13",
  columns: [
    { id: "conversion", label: "Job conversion", shortLabel: "Conversion", kind: "score", weight: 60, betterWhen: "high" },
    { id: "jobs", label: "Tech jobs", shortLabel: "Jobs", kind: "score", weight: 40, betterWhen: "high" },
    { id: "rent", label: "Rent", kind: "number", betterWhen: "low" },
  ],
  rows: [],
};

const row: DatasetRow = {
  id: "hamburg",
  label: "Hamburg",
  values: { conversion: 75, jobs: 80, rent: 14 },
};

describe("DatasetScoreVisuals", () => {
  it("shows the city profile and its weighted contributions", () => {
    render(<DatasetScoreVisuals dataset={dataset} row={row} />);

    expect(screen.getByRole("img", { name: "Category profile for Hamburg" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Contribution to overall for Hamburg" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /Job conversion: 45 of 60 pts \(75%\)/ })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /Tech jobs: 32 of 40 pts \(80%\)/ })).toBeInTheDocument();
    expect(screen.queryByText("Rent")).not.toBeInTheDocument();
  });
});
