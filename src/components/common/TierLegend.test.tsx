import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TierLegend } from "@/components/common/TierLegend";

describe("TierLegend", () => {
  it("renders all 5 tiers with their thresholds", () => {
    render(<TierLegend />);
    for (const label of ["Excellent", "Good", "Average", "Weak", "Poor"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByText("≥ 80%")).toBeInTheDocument();
    expect(screen.getByText("< 50%")).toBeInTheDocument();
  });
});
