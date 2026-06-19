import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecalibrationCurve } from "@/components/methodology/RecalibrationCurve";

describe("RecalibrationCurve", () => {
  it("renders a labelled figure for the recalibration curve", () => {
    render(<RecalibrationCurve />);
    expect(screen.getByRole("img", { name: /recalibration/i })).toBeInTheDocument();
  });
});
