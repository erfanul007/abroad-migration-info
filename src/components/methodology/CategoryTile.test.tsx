import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryTile } from "@/components/methodology/CategoryTile";
import { categories } from "@/lib/data";

describe("CategoryTile", () => {
  const cat = categories[0];

  it("shows name, weight and factor labels, but not factor descriptions, by default", () => {
    render(<CategoryTile category={cat} color="oklch(0.68 0.15 0.0)" />);
    expect(screen.getByText(cat.name)).toBeInTheDocument();
    expect(screen.getByText(`${cat.weight}%`)).toBeInTheDocument();
    for (const f of cat.factors) expect(screen.getByText(f.label)).toBeInTheDocument();
    expect(screen.queryByText(cat.factors[0].description)).not.toBeInTheDocument();
  });

  it("opens the factor-detail dialog (revealing descriptions) when the button is clicked", async () => {
    render(<CategoryTile category={cat} color="oklch(0.68 0.15 0.0)" />);
    fireEvent.click(screen.getByRole("button", { name: /view factor details/i }));
    expect(await screen.findByText(cat.factors[0].description)).toBeInTheDocument();
  });
});
