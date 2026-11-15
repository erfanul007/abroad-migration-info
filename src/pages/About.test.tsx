import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "@/pages/About";

describe("applicant study profile", () => {
  it("shows Tanima's evidence and preferences without treating the offer as document-verified", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "Tanima’s study profile" })).toBeInTheDocument();
    expect(screen.getByText(/3.83/)).toBeInTheDocument();
    expect(screen.getByText(/IELTS Academic/)).toBeInTheDocument();
    expect(screen.getByText(/09\/08\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/English only/)).toBeInTheDocument();
    expect(screen.getByText(/TU Ilmenau/)).toBeInTheDocument();
    expect(screen.getByText(/offer letter not inspected/i)).toBeInTheDocument();
    expect(screen.getByText("Erfanul Bhuiyan")).toBeInTheDocument();
  });
});
