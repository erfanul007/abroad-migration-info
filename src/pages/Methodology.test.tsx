import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Methodology from "@/pages/Methodology";
import { categories } from "@/lib/data";

describe("Methodology page", () => {
  it("renders all section headings (no standalone factor breakdown)", () => {
    render(<Methodology />);
    for (const h of ["How the score is built", "Display recalibration", "Score tiers", "Flags", "Category weights"]) {
      expect(screen.getByText(h)).toBeInTheDocument();
    }
    expect(screen.queryByText("Factor breakdown")).not.toBeInTheDocument();
  });
  it("lists every category name", () => {
    render(<Methodology />);
    for (const c of categories) expect(screen.getAllByText(c.name).length).toBeGreaterThan(0);
  });
});
