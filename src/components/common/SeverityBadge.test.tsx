import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SeverityBadge } from "@/components/common/SeverityBadge";

describe("SeverityBadge", () => {
  it("labels a blocker", () => {
    render(<SeverityBadge severity="blocker" />);
    expect(screen.getByText("(blocker)")).toBeInTheDocument();
  });
  it("labels a highlight as the direct-work route", () => {
    render(<SeverityBadge severity="highlight" />);
    expect(screen.getByText("(direct-work route)")).toBeInTheDocument();
  });
});
