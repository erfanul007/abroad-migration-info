import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FactorCompareTable } from "@/components/compare/FactorCompareTable";
import type { Category, ScoredCountry } from "@/types";

const CAT: Category = {
  id: "c", name: "Cat", shortLabel: "Cat", weight: 10, description: "d",
  factors: [
    { id: "f1", label: "Approval rate", description: "", weight: 60 },
    { id: "f2", label: "Processing", description: "", weight: 40 },
  ],
};

const mk = (iso: string, name: string, f1: number | null, f2: number | null, catScore: number | null) =>
  ({
    iso, name, flag: "🏳",
    categories: {
      c: {
        status: "scored",
        factors: {
          f1: f1 == null ? { status: "pending", score: 0 } : { status: "scored", score: f1 },
          f2: f2 == null ? { status: "pending", score: 0 } : { status: "scored", score: f2 },
        },
        summary: "", pros: [], cons: [], links: [], lastReviewed: "2026-06-20",
      },
    },
    categoryScores: { c: catScore },
  }) as unknown as ScoredCountry;

describe("FactorCompareTable", () => {
  it("renders factors as rows, countries as columns, — for nulls, footer category scores", () => {
    render(
      <FactorCompareTable
        category={CAT}
        countries={[mk("DE", "Germany", 80, 50, 72), mk("NL", "Netherlands", 60, null, 68)]}
      />,
    );
    // factor labels + country headers
    expect(screen.getByText("Approval rate")).toBeInTheDocument();
    expect(screen.getByText("Processing")).toBeInTheDocument();
    expect(screen.getByText(/Germany/)).toBeInTheDocument();
    expect(screen.getByText(/Netherlands/)).toBeInTheDocument();
    // raw factor score + footer category score
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("Category score")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
    // NL f2 pending → em dash present
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("highlights the row-maximum score cell", () => {
    const { container } = render(
      <FactorCompareTable category={CAT} countries={[mk("DE", "Germany", 80, 50, 72), mk("NL", "Netherlands", 60, 90, 68)]} />,
    );
    // f1 row: DE 80 is max → its cell carries the highlight class
    const highlighted = container.querySelectorAll("td.bg-primary\\/5");
    expect(highlighted.length).toBe(2); // one max per factor row (f1: DE, f2: NL)
  });
});
