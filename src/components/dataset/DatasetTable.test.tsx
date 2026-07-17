import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { DatasetTable } from "@/components/dataset/DatasetTable";
import type { ComparativeDataset } from "@/types";

const ds: ComparativeDataset = {
  kind: "cities",
  countryId: "germany",
  title: "T",
  scale: "score",
  lastReviewed: "2026-07-13",
  columns: [
    { id: "conv", label: "Conversion", shortLabel: "Conv", kind: "score", weight: 60, betterWhen: "high" },
    { id: "jobs", label: "Jobs", kind: "score", weight: 40, betterWhen: "high" },
    { id: "rentM2", label: "€/m²", kind: "number", betterWhen: "low" },
  ],
  rows: [
    { id: "hamburg", label: "Hamburg", values: { conv: 76, jobs: 74, rentM2: 14 },
      detail: { summary: "Balanced all-rounder.", pros: [{ text: "Welcome Center" }], cons: [{ text: "Entry saturated" }], immigration: {
        publishedTime: "Several weeks", timeScope: "Authority processing; no end-to-end guarantee",
        applicationChannel: "Online residence-permit service", workStart: "Wait for written full-time employment authorisation",
        confidence: "medium", asOf: "2026-07", naturalisation: "Longer-term context only; not scored.",
      } } },
    { id: "munich", label: "Munich", values: { conv: 68, jobs: 92, rentM2: 22 } },
  ],
};

describe("DatasetTable", () => {
  it("renders every row and an Overall column for score datasets", () => {
    render(<DatasetTable dataset={ds} />);
    expect(screen.getByText("Hamburg")).toBeInTheDocument();
    expect(screen.getByText("Munich")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Overall" })).toBeInTheDocument();
  });

  it("moves context (non-score) columns out of the table into the row panel", () => {
    render(<DatasetTable dataset={ds} />);
    // score columns stay as headers; the non-score €/m² column does not
    expect(screen.getByRole("button", { name: "Conv" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "€/m²" })).not.toBeInTheDocument();
  });

  it("expands a row to reveal its detail panel and context facts", () => {
    render(<DatasetTable dataset={ds} />);
    expect(screen.queryByText("Balanced all-rounder.")).not.toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Category profile for Hamburg" })).not.toBeInTheDocument();
    const hamburgRow = screen.getByText("Hamburg").closest("tr") as HTMLElement;
    fireEvent.click(within(hamburgRow).getByRole("button", { name: "Show details" }));
    expect(screen.getByRole("img", { name: "Category profile for Hamburg" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Contribution to overall for Hamburg" })).toBeInTheDocument();
    expect(screen.getByText("Balanced all-rounder.")).toBeInTheDocument();
    expect(screen.getByText("Welcome Center")).toBeInTheDocument();
    expect(screen.getByText("Several weeks")).toBeInTheDocument();
    expect(screen.getByText("Authority processing; no end-to-end guarantee")).toBeInTheDocument();
    expect(screen.getByText("Online residence-permit service")).toBeInTheDocument();
    expect(screen.getByText("Wait for written full-time employment authorisation")).toBeInTheDocument();
    expect(screen.getByText("Medium confidence")).toBeInTheDocument();
    expect(screen.getByText("Verified 2026-07")).toBeInTheDocument();
    expect(screen.getByText("Longer-term context only; not scored.")).toBeInTheDocument();
    // the context column value (€/m² = 14) now renders inside the panel
    expect(screen.getByText("14")).toBeInTheDocument();
  });

  it("lets a row with no detail block still expand to show its context facts", () => {
    render(<DatasetTable dataset={ds} />);
    const munichRow = screen.getByText("Munich").closest("tr") as HTMLElement;
    fireEvent.click(within(munichRow).getByRole("button", { name: "Show details" }));
    expect(screen.getByText("22")).toBeInTheDocument();
  });

  it("sorts by a column when its header is clicked", () => {
    render(<DatasetTable dataset={ds} />);
    // default sort: Overall desc → Munich (77.6) above Hamburg (75.2)
    expect(within(screen.getAllByRole("row")[1]).getByText("Munich")).toBeInTheDocument();
    // sort by Conv (high-is-better, desc first) → Hamburg (76) rises above Munich (68)
    fireEvent.click(screen.getByRole("button", { name: "Conv" }));
    expect(within(screen.getAllByRole("row")[1]).getByText("Hamburg")).toBeInTheDocument();
  });

  it("does not add score visualizations to university rows", () => {
    const universities: ComparativeDataset = {
      kind: "universities",
      countryId: "germany",
      title: "Universities",
      scale: "rank",
      lastReviewed: "2026-07-13",
      columns: [{ id: "rank", label: "Rank", kind: "rank", betterWhen: "low" }],
      rows: [{ id: "tum", label: "Technical University of Munich", values: { rank: 1 }, detail: { summary: "Strong research profile." } }],
    };

    render(<DatasetTable dataset={universities} />);
    const row = screen.getByText("Technical University of Munich").closest("tr") as HTMLElement;
    fireEvent.click(within(row).getByRole("button", { name: "Show details" }));
    expect(screen.queryByText("Category profile")).not.toBeInTheDocument();
    expect(screen.queryByText("Contribution to overall")).not.toBeInTheDocument();
  });

  it("keeps descriptive university admissions facts inside the expanded row", () => {
    const universities: ComparativeDataset = {
      kind: "universities",
      countryId: "germany",
      title: "Universities",
      scale: "rank",
      lastReviewed: "2026-07-14",
      columns: [
        { id: "cse", label: "Computer Science", kind: "rank", betterWhen: "low" },
        { id: "programs", label: "Suitable programs", kind: "text", betterWhen: "high" },
        { id: "intakes", label: "Intakes", kind: "text", betterWhen: "high" },
        { id: "applicationWindow", label: "Application window", kind: "text", betterWhen: "high" },
        { id: "tuition", label: "Tuition", kind: "text", betterWhen: "low" },
        { id: "applicationPortal", label: "Application portal", kind: "text", betterWhen: "high" },
      ],
      rows: [{
        id: "tum",
        label: "Technical University of Munich",
        values: {
          cse: 71,
          programs: "M.Sc. Informatics",
          intakes: "Winter and summer",
          applicationWindow: "Winter: 1 February–31 May",
          tuition: "€6,000 per semester",
          applicationPortal: "TUMonline",
        },
      }],
    };

    render(<DatasetTable dataset={universities} />);
    expect(screen.getByRole("button", { name: "Computer Science" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Suitable programs" })).not.toBeInTheDocument();
    expect(screen.queryByText("M.Sc. Informatics")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show details" }));

    expect(screen.getByText("M.Sc. Informatics")).toBeInTheDocument();
    expect(screen.getByText("Winter and summer")).toBeInTheDocument();
    expect(screen.getByText("Winter: 1 February–31 May")).toBeInTheDocument();
    expect(screen.getByText("€6,000 per semester")).toBeInTheDocument();
    expect(screen.getByText("TUMonline")).toBeInTheDocument();
  });

  it("keeps global rank, tuition, and application fee visible and sortable", () => {
    const universities: ComparativeDataset = {
      kind: "universities",
      countryId: "germany",
      title: "Universities",
      scale: "rank",
      lastReviewed: "2026-07-14",
      columns: [
        { id: "overallRank", label: "Overall world rank", kind: "rank", betterWhen: "low" },
        { id: "cse", label: "Computer Science", kind: "rank", betterWhen: "low" },
        { id: "nonEuTuition", label: "Tuition", kind: "number", betterWhen: "low", unit: "€" },
        { id: "applicationFee", label: "Application", kind: "number", betterWhen: "low", unit: "€" },
        { id: "intakes", label: "International intakes", kind: "text", betterWhen: "high" },
        { id: "applicationWindow", label: "Application periods", kind: "text", betterWhen: "high" },
      ],
      rows: [
        { id: "paid", label: "Paid University", values: { overallRank: 80, cse: 70, nonEuTuition: 6000, applicationFee: 75, intakes: "Winter 2027 · October start", applicationWindow: "1 February 2027–31 May 2027" } },
        { id: "free", label: "Free University", values: { overallRank: 150, cse: 120, nonEuTuition: 0, applicationFee: 0, intakes: "Summer 2027 · April start", applicationWindow: "1 October 2026–30 November 2026" } },
      ],
    };

    render(<DatasetTable dataset={universities} />);
    expect(screen.getByRole("button", { name: "Overall world rank" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tuition" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Application" })).toBeInTheDocument();
    expect(screen.getByText("€6,000")).toBeInTheDocument();
    const freeRowBeforeSort = screen.getByText("Free University").closest("tr") as HTMLElement;
    expect(within(freeRowBeforeSort).getAllByText("€0")).toHaveLength(2);
    expect(screen.queryByText("Winter 2027 · October start")).not.toBeInTheDocument();

    expect(screen.getByText("€75")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tuition" }));
    expect(within(screen.getAllByRole("row")[1]).getByText("Free University")).toBeInTheDocument();

    const freeRow = screen.getByText("Free University").closest("tr") as HTMLElement;
    fireEvent.click(within(freeRow).getByRole("button", { name: "Show details" }));
    expect(screen.getByText("Summer 2027 · April start")).toBeInTheDocument();
    expect(screen.getByText("1 October 2026–30 November 2026")).toBeInTheDocument();
  });

  it("shows a Summer '27 chip only beside tagged university names", () => {
    const universities: ComparativeDataset = {
      kind: "universities",
      countryId: "germany",
      title: "Universities",
      scale: "rank",
      lastReviewed: "2026-07-14",
      columns: [{ id: "overallRank", label: "Global", kind: "rank", betterWhen: "low" }],
      rows: [
        { id: "summer", label: "Summer University", tags: ["Summer ’27"], values: { overallRank: 100 } },
        { id: "winter", label: "Winter University", values: { overallRank: 200 } },
      ],
    };

    render(<DatasetTable dataset={universities} />);

    const summerRow = screen.getByText("Summer University").closest("tr") as HTMLElement;
    const winterRow = screen.getByText("Winter University").closest("tr") as HTMLElement;
    expect(within(summerRow).getByText("Summer ’27")).toBeInTheDocument();
    expect(within(winterRow).queryByText("Summer ’27")).not.toBeInTheDocument();
  });

  const uni: ComparativeDataset = {
    kind: "universities",
    countryId: "germany",
    title: "Universities",
    scale: "rank",
    lastReviewed: "2026-07-14",
    columns: [{ id: "overallRank", label: "Rank", kind: "rank", betterWhen: "low" }],
    rows: [
      { id: "tum", label: "Technical University of Munich", sublabel: "Munich, Bavaria", tags: ["Summer ’27"], values: { overallRank: 1 } },
      { id: "lmu", label: "University of Munich (LMU)", sublabel: "Munich, Bavaria", tags: ["No CS intake ’27"], values: { overallRank: 3 } },
      { id: "rwth", label: "RWTH Aachen University", sublabel: "Aachen, North Rhine-Westphalia", tags: ["Winter ’27 upcoming"], values: { overallRank: 2 } },
    ],
  };

  it("renders a search box, two facets, and the match count for universities", () => {
    render(<DatasetTable dataset={uni} />);
    expect(screen.getByPlaceholderText("Search universities…")).toBeInTheDocument();
    // City + Intake facets both have >= 2 distinct values → two Select comboboxes
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.getByText("3 of 3")).toBeInTheDocument();
  });

  it("filters rows live by the search box (name or city) and updates the count", () => {
    render(<DatasetTable dataset={uni} />);
    fireEvent.change(screen.getByPlaceholderText("Search universities…"), { target: { value: "aachen" } });
    expect(screen.getByText("RWTH Aachen University")).toBeInTheDocument();
    expect(screen.queryByText("Technical University of Munich")).not.toBeInTheDocument();
    expect(screen.queryByText("University of Munich (LMU)")).not.toBeInTheDocument();
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("shows an empty state and a Clear control when nothing matches", () => {
    render(<DatasetTable dataset={uni} />);
    const search = screen.getByPlaceholderText("Search universities…");
    fireEvent.change(search, { target: { value: "zzz" } });
    expect(screen.getByText(/No matches/)).toBeInTheDocument();
    expect(screen.getByText("0 of 3")).toBeInTheDocument();
    // Clearing restores every row
    fireEvent.click(screen.getByRole("button", { name: /Clear/ }));
    expect(screen.getByText("Technical University of Munich")).toBeInTheDocument();
    expect(screen.getByText("3 of 3")).toBeInTheDocument();
  });

  it("gives a cities dataset the search box only (no facets)", () => {
    render(<DatasetTable dataset={ds} />);
    expect(screen.getByPlaceholderText("Search cities…")).toBeInTheDocument();
    expect(screen.queryAllByRole("combobox")).toHaveLength(0);
  });

  it("uses green, yellow, and red semantics for university intake chips", () => {
    const universities: ComparativeDataset = {
      kind: "universities",
      countryId: "germany",
      title: "Universities",
      scale: "rank",
      lastReviewed: "2026-07-14",
      columns: [{ id: "overallRank", label: "Global", kind: "rank", betterWhen: "low" }],
      rows: [{
        id: "status",
        label: "Status University",
        tags: ["Summer ’27", "Winter ’27 upcoming", "No CS intake ’27"],
        values: { overallRank: 100 },
      }],
    };

    render(<DatasetTable dataset={universities} />);

    expect(screen.getByText("Summer ’27")).toHaveClass("bg-emerald-500/10", "text-emerald-700");
    expect(screen.getByText("Winter ’27 upcoming")).toHaveClass("bg-amber-500/15", "text-amber-800");
    expect(screen.getByText("No CS intake ’27")).toHaveClass("bg-rose-500/15", "text-rose-800");
  });
});
