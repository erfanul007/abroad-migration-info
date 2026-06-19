import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryWeightPie } from "@/components/methodology/CategoryWeightPie";
import { categories } from "@/lib/data";

describe("CategoryWeightPie", () => {
  it("renders a labelled figure for the weight distribution", () => {
    const colorById = Object.fromEntries(categories.map((c, i) => [c.id, `oklch(0.68 0.15 ${i})`]));
    render(<CategoryWeightPie categories={categories} colorById={colorById} />);
    expect(screen.getByRole("img", { name: /weight distribution/i })).toBeInTheDocument();
  });
});
