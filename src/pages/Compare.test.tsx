import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Compare from "@/pages/Compare";

describe("Compare page country slots", () => {
  it("starts with 2 country selects and can add up to 5, then hides Add", () => {
    render(<Compare />);
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    const add = () => screen.getByRole("button", { name: /add country/i });
    fireEvent.click(add());
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
    fireEvent.click(add());
    fireEvent.click(add());
    expect(screen.getAllByRole("combobox")).toHaveLength(5);
    expect(screen.queryByRole("button", { name: /add country/i })).not.toBeInTheDocument();
  });

  it("removes a slot down to a floor of 2", () => {
    render(<Compare />);
    fireEvent.click(screen.getByRole("button", { name: /add country/i }));
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
    fireEvent.click(screen.getAllByRole("button", { name: /remove country/i })[0]);
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: /remove country/i })).not.toBeInTheDocument();
  });
});
