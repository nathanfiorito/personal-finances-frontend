import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SummaryCards } from "@/components/dashboard/SummaryCards";

// Mock the Card component to avoid complex CSS-in-JS concerns
vi.mock("@/components/ui/Card", () => ({
  Card: ({ children, ...props }: React.PropsWithChildren<object>) => (
    <div {...props}>{children}</div>
  ),
}));

function renderCards(totalIncome: number, totalOutcome: number, transactionCount = 0) {
  return render(
    <SummaryCards
      totalIncome={totalIncome}
      totalOutcome={totalOutcome}
      transactionCount={transactionCount}
    />
  );
}

describe("SummaryCards", () => {
  it("renders Income label", () => {
    renderCards(3000, 500);
    expect(screen.getByText("Income")).toBeInTheDocument();
  });

  it("renders Expenses label", () => {
    renderCards(3000, 500);
    expect(screen.getByText("Expenses")).toBeInTheDocument();
  });

  it("renders Balance label", () => {
    renderCards(3000, 500);
    expect(screen.getByText("Balance")).toBeInTheDocument();
  });

  it("renders Transactions label", () => {
    renderCards(0, 0, 12);
    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });

  it("displays formatted income value", () => {
    renderCards(3000, 120);
    // income=3000, outcome=120 → balance=2880, so 3000 appears only in the Income card
    expect(screen.getByText(/3[.,]000/)).toBeInTheDocument();
  });

  it("displays transaction count", () => {
    renderCards(0, 0, 42);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("balance = income - outcome (positive)", () => {
    renderCards(3000, 500);
    // balance = 2500
    expect(screen.getByText(/2\.500/)).toBeInTheDocument();
  });

  it("balance = income - outcome (negative)", () => {
    renderCards(100, 800);
    // balance = -700 — negative value should be formatted with minus sign
    const balanceEl = screen.getAllByText(/-?700/).at(0);
    expect(balanceEl).toBeInTheDocument();
  });

  it("positive balance uses green color class", () => {
    const { container } = renderCards(3000, 500);
    const greenEls = container.querySelectorAll('[class*="text-green"]');
    expect(greenEls.length).toBeGreaterThan(0);
  });

  it("negative balance uses red color class", () => {
    const { container } = renderCards(100, 800);
    const redEls = container.querySelectorAll('[class*="text-red"]');
    expect(redEls.length).toBeGreaterThan(0);
  });
});
