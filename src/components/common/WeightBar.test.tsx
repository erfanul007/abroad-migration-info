import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { WeightBar } from "@/components/common/WeightBar";

describe("WeightBar", () => {
  it("fills proportionally to weight/max and is decorative", () => {
    const { container } = render(<WeightBar weight={24} max={48} />);
    const fill = container.querySelector("span > span") as HTMLElement;
    expect(fill.style.width).toBe("50%");
    expect(container.querySelector("[aria-hidden]")).toBeTruthy();
  });
  it("clamps and handles max=0 without NaN", () => {
    const { container } = render(<WeightBar weight={5} max={0} />);
    const fill = container.querySelector("span > span") as HTMLElement;
    expect(fill.style.width).toBe("0%");
  });
});
