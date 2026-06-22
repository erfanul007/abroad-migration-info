import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryFactorScores } from "@/components/country/CategoryFactorScores";
import type { FactorBreakdown } from "@/types";

const breakdown: FactorBreakdown = {
  rows: [
    { id: "visa", label: "Visa approval rate", weight: 30, score: 72, points: 21.6 },
    { id: "proc", label: "Processing time", weight: 25, score: 65, points: 16.25 },
  ],
  total: 37.85,
};

describe("CategoryFactorScores", () => {
  it("renders a row per factor with weight, score badge and points, plus the weighted-mean footer", () => {
    render(<CategoryFactorScores breakdown={breakdown} displayScore={70} />);
    expect(screen.getByText("Visa approval rate")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument(); // via ScoreBadge
    expect(screen.getByText("21.6")).toBeInTheDocument();
    expect(screen.getByText("37.9")).toBeInTheDocument(); // 37.85 total rounded to 1 dp
    expect(screen.getByText("Weighted mean")).toBeInTheDocument(); // footer label; the note also says "weighted mean"
  });
  it("notes the weighted mean is the exact category score (no display curve)", () => {
    render(<CategoryFactorScores breakdown={breakdown} displayScore={70} />);
    expect(screen.getByText(/the exact category score \(70%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/no display curve is applied/i)).toBeInTheDocument();
  });
});
