import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryFactorDialog } from "@/components/country/CategoryFactorDialog";
import { categories } from "@/lib/data";
import type { CategoryScore } from "@/types";

const cat = categories[0];
const cell: CategoryScore = {
  status: "scored",
  factors: Object.fromEntries(cat.factors.map((f) => [f.id, { status: "scored" as const, score: 70 }])),
  summary: "", pros: [], cons: [], links: [], lastReviewed: "2026-06-20",
};

describe("CategoryFactorDialog", () => {
  it("shows the trigger button but no factor rows until opened", () => {
    render(<CategoryFactorDialog category={cat} cell={cell} score={70} />);
    expect(screen.getByRole("button", { name: /view factor details/i })).toBeInTheDocument();
    expect(screen.queryByText(cat.factors[0].label)).not.toBeInTheDocument();
  });
  it("opens the modal revealing the factor breakdown when clicked", async () => {
    render(<CategoryFactorDialog category={cat} cell={cell} score={70} />);
    fireEvent.click(screen.getByRole("button", { name: /view factor details/i }));
    expect(await screen.findByText(cat.factors[0].label)).toBeInTheDocument();
    expect(screen.getByText("Weighted mean")).toBeInTheDocument();
  });
});
