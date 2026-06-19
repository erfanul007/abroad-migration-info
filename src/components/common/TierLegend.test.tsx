import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TierLegend } from "@/components/common/TierLegend";
import { TIER } from "@/lib/config";

describe("TierLegend", () => {
  it("renders all four tiers with thresholds from TIER", () => {
    render(<TierLegend />);
    expect(screen.getByText("Excellent")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("Fair")).toBeInTheDocument();
    expect(screen.getByText("Weak")).toBeInTheDocument();
    expect(screen.getByText(`≥ ${TIER.excellent}%`)).toBeInTheDocument();
    expect(screen.getByText(`< ${TIER.fair}%`)).toBeInTheDocument();
  });
});
