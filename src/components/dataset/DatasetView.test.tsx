import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DatasetView } from "@/components/dataset/DatasetView";
import type { ComparativeDataset } from "@/types";

const ds: ComparativeDataset = {
  kind: "universities", countryId: "germany", title: "German universities", scale: "rank",
  lastReviewed: "2026-07-17",
  columns: [{ id: "overallRank", label: "Rank", kind: "rank", betterWhen: "low" }],
  rows: [
    { id: "tum", label: "Technical University of Munich (TUM)", abbr: "TUM", sublabel: "Munich, Bavaria", values: { overallRank: 1 } },
    { id: "rwth", label: "RWTH Aachen University", abbr: "RWTH", sublabel: "Aachen, North Rhine-Westphalia", values: { overallRank: 2 } },
  ],
};

describe("DatasetView", () => {
  it("renders the table tab with the dataset rows", () => {
    render(<DatasetView dataset={ds} />);
    expect(screen.getByText("Technical University of Munich (TUM)")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /table/i })).toBeInTheDocument();
  });
});
