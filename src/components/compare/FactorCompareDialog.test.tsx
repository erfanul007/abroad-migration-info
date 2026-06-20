import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FactorCompareDialog } from "@/components/compare/FactorCompareDialog";
import type { Category, ScoredCountry } from "@/types";

const CAT: Category = {
  id: "c", name: "Visa access", shortLabel: "Visa", weight: 9, description: "Visa accessibility.",
  factors: [{ id: "f1", label: "Approval rate", description: "", weight: 100 }],
};

const mk = (iso: string, name: string, score: number) =>
  ({
    iso, name, flag: "🏳",
    categories: {
      c: {
        status: "scored", factors: { f1: { status: "scored", score } },
        summary: "", pros: [], cons: [], links: [], lastReviewed: "2026-06-20",
      },
    },
    categoryScores: { c: score },
  }) as unknown as ScoredCountry;

describe("FactorCompareDialog", () => {
  const countries = [mk("DE", "Germany", 80), mk("NL", "Netherlands", 70)];

  it("hides the factor table until the trigger is clicked", () => {
    render(<FactorCompareDialog category={CAT} countries={countries} />);
    expect(screen.getByRole("button", { name: "Compare factors" })).toBeInTheDocument();
    expect(screen.queryByText("Approval rate")).not.toBeInTheDocument();
  });

  it("reveals the factor comparison on click", () => {
    render(<FactorCompareDialog category={CAT} countries={countries} />);
    fireEvent.click(screen.getByRole("button", { name: "Compare factors" }));
    expect(screen.getByText("Approval rate")).toBeInTheDocument();
    expect(screen.getByText("Category score")).toBeInTheDocument();
  });
});
