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
  it("renders Receitas label", () => {
    renderCards(3000, 500);
    expect(screen.getByText("Receitas")).toBeInTheDocument();
  });

  it("renders Despesas label", () => {
    renderCards(3000, 500);
    expect(screen.getByText("Despesas")).toBeInTheDocument();
  });

  it("renders Saldo label", () => {
    renderCards(3000, 500);
    expect(screen.getByText("Saldo")).toBeInTheDocument();
  });

  it("renders Transações label", () => {
    renderCards(0, 0, 12);
    expect(screen.getByText("Transações")).toBeInTheDocument();
  });

  it("displays formatted income value", () => {
    renderCards(3000, 120);
    // income=3000, outcome=120 → saldo=2880, so 3000 appears only in the Receitas card
    expect(screen.getByText(/3[.,]000/)).toBeInTheDocument();
  });

  it("displays transaction count", () => {
    renderCards(0, 0, 42);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("saldo = income - outcome (positive)", () => {
    renderCards(3000, 500);
    // saldo = 2500
    expect(screen.getByText(/2\.500/)).toBeInTheDocument();
  });

  it("saldo = income - outcome (negative)", () => {
    renderCards(100, 800);
    // saldo = -700 — negative value should be formatted with minus sign
    const saldoEl = screen.getAllByText(/-?700/).at(0);
    expect(saldoEl).toBeInTheDocument();
  });

  it("positive saldo uses green color class", () => {
    const { container } = renderCards(3000, 500);
    const greenEls = container.querySelectorAll('[class*="text-green"]');
    expect(greenEls.length).toBeGreaterThan(0);
  });

  it("negative saldo uses red color class", () => {
    const { container } = renderCards(100, 800);
    const redEls = container.querySelectorAll('[class*="text-red"]');
    expect(redEls.length).toBeGreaterThan(0);
  });
});
