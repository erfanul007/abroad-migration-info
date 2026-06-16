// src/components/common/ScoreBadge.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreBadge } from "@/components/common/ScoreBadge";

describe("ScoreBadge", () => {
  it("renders the rounded score", () => {
    render(<ScoreBadge score={67.6} />);
    expect(screen.getByText("68")).toBeInTheDocument();
  });
});
