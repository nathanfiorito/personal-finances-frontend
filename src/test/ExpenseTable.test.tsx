import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { Expense } from "@/lib/api";

vi.mock("@/components/ui/Button", () => ({
  Button: ({ children, onClick, disabled, ...props }: React.PropsWithChildren<{
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    size?: string;
    "aria-label"?: string;
  }>) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/lib/chart-colors", () => ({
  getCategoryColor: () => "#aaa",
}));

vi.mock("lucide-react", () => ({
  Pencil: () => <span>edit</span>,
  Trash2: () => <span>delete</span>,
  ChevronLeft: () => <span>prev</span>,
  ChevronRight: () => <span>next</span>,
}));

function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: "1",
    amount: "100.00",
    date: "2025-03-10",
    establishment: "Mercado",
    description: null,
    category: "Alimentação",
    category_id: 1,
    tax_id: null,
    entry_type: "text",
    transaction_type: "outcome",
    confidence: 1.0,
    created_at: "2025-03-10T10:00:00",
    ...overrides,
  };
}

function renderTable(expenses: Expense[], opts = {}) {
  return render(
    <ExpenseTable
      expenses={expenses}
      total={expenses.length}
      page={1}
      pageSize={20}
      onPageChange={vi.fn()}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      {...opts}
    />
  );
}

describe("ExpenseTable — transaction_type badge", () => {
  it("outcome row displays 'Expense' badge", () => {
    renderTable([makeExpense({ transaction_type: "outcome" })]);
    expect(screen.getAllByText("Expense").length).toBeGreaterThan(0);
  });

  it("income row displays 'Income' badge", () => {
    renderTable([makeExpense({ transaction_type: "income" })]);
    expect(screen.getAllByText("Income").length).toBeGreaterThan(0);
  });

  it("outcome badge has red color class", () => {
    const { container } = renderTable([makeExpense({ transaction_type: "outcome" })]);
    const badge = Array.from(container.querySelectorAll("span")).find(
      (el) => el.textContent === "Expense"
    );
    expect(badge?.className).toMatch(/red/);
  });

  it("income badge has green color class", () => {
    const { container } = renderTable([makeExpense({ transaction_type: "income" })]);
    const badge = Array.from(container.querySelectorAll("span")).find(
      (el) => el.textContent === "Income"
    );
    expect(badge?.className).toMatch(/green/);
  });

  it("fallback to outcome badge when transaction_type is missing", () => {
    const expense = makeExpense();
    // @ts-expect-error intentionally testing missing field (legacy data)
    delete expense.transaction_type;
    renderTable([expense]);
    expect(screen.getAllByText("Expense").length).toBeGreaterThan(0);
  });
});

describe("ExpenseTable — general rendering", () => {
  it("shows empty state when no expenses", () => {
    renderTable([]);
    expect(screen.getByText(/No expenses found/i)).toBeInTheDocument();
  });

  it("renders establishment name", () => {
    renderTable([makeExpense({ establishment: "Posto Shell" })]);
    expect(screen.getAllByText("Posto Shell").length).toBeGreaterThan(0);
  });

  it("renders formatted currency value", () => {
    renderTable([makeExpense({ amount: "250.00" })]);
    expect(screen.getAllByText(/250/).length).toBeGreaterThan(0);
  });

  it("renders multiple rows", () => {
    const expenses = [
      makeExpense({ id: "1", establishment: "Mercado" }),
      makeExpense({ id: "2", establishment: "Farmácia", transaction_type: "income" }),
    ];
    renderTable(expenses);
    expect(screen.getAllByText("Mercado").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Farmácia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Expense").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Income").length).toBeGreaterThan(0);
  });
});
