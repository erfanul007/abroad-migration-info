import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContributionBars } from "@/components/charts/ContributionBars";
import type { Category, ScoredCountry } from "@/types";

const cat = (id: string, name: string, weight: number): Category => ({
  id, name, shortLabel: name, weight, description: "", factors: [],
});

// score=null marks a pending/non-derivable category.
const sc = (id: string, name: string, weight: number, score: number | null, contribution: number) =>
  ({ category: cat(id, name, weight), cell: null, score, contribution });

// Intentionally not weight-ordered, to prove the component sorts heaviest-first.
const country = {
  name: "Testland",
  scored: [
    sc("tax", "Tax", 3, 50, 1.5),
    sc("hc", "Healthcare", 5, null, 0), // pending
    sc("job", "Job market", 10, 80, 8.0),
  ],
} as unknown as ScoredCountry;

describe("ContributionBars", () => {
  it("sorts heaviest-weight first and sizes each track to weight/maxWeight", () => {
    const { container } = render(<ContributionBars country={country} />);
    const tracks = container.querySelectorAll<HTMLElement>('[role="progressbar"]');
    expect(tracks.length).toBe(3);
    // sorted heaviest-first: job (10)→100%, healthcare (5)→50%, tax (3)→30%
    expect(tracks[0].style.width).toBe("100%");
    expect(tracks[1].style.width).toBe("50%");
    expect(tracks[2].style.width).toBe("30%");
  });

  it("fills the coloured bar to the category score% and exposes it via aria-valuenow", () => {
    const { container } = render(<ContributionBars country={country} />);
    const tracks = container.querySelectorAll<HTMLElement>('[role="progressbar"]');
    const jobFill = tracks[0].querySelector<HTMLElement>("div");
    expect(jobFill?.style.width).toBe("80%");
    expect(tracks[0].getAttribute("aria-valuenow")).toBe("80");
    expect(tracks[2].querySelector<HTMLElement>("div")?.style.width).toBe("50%");
  });

  it("renders pending categories as an empty track with no fill and an n/a value", () => {
    const { container } = render(<ContributionBars country={country} />);
    const tracks = container.querySelectorAll<HTMLElement>('[role="progressbar"]');
    expect(tracks[1].querySelector("div")).toBeNull();
    expect(tracks[1].getAttribute("aria-valuenow")).toBeNull();
    expect(screen.getByText("n/a")).toBeInTheDocument();
  });

  it("labels each row with contribution / weight points", () => {
    render(<ContributionBars country={country} />);
    expect(screen.getByText("8 / 10")).toBeInTheDocument();
    expect(screen.getByText("1.5 / 3")).toBeInTheDocument();
  });
});
