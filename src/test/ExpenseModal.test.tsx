import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { CategoryOut, Expense } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  createExpense: vi.fn().mockResolvedValue({}),
  updateExpense: vi.fn().mockResolvedValue({}),
}));

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock("@/components/ui/Modal", () => ({
  Modal: ({
    open,
    children,
    title,
  }: {
    open: boolean;
    children: React.ReactNode;
    title: string;
    onClose: () => void;
    maxWidth?: string;
  }) =>
    open ? (
      <div role="dialog" aria-label={title}>
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}));

vi.mock("@/components/ui/Button", () => ({
  Button: ({
    children,
    onClick,
    type,
    disabled,
    loading,
  }: React.PropsWithChildren<{
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    variant?: string;
  }>) => (
    <button type={type} onClick={onClick} disabled={disabled || loading}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/Input", () => ({
  Input: ({
    label,
    error,
    ...props
  }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label htmlFor={props.id ?? label}>{label}</label>
      <input id={props.id ?? label} {...props} />
      {error && <span role="alert">{error}</span>}
    </div>
  ),
  Select: ({
    label,
    children,
    ...props
  }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div>
      <label htmlFor={props.id ?? label}>{label}</label>
      <select id={props.id ?? label} {...props}>
        {children}
      </select>
    </div>
  ),
}));

const DEFAULT_CATEGORIES: CategoryOut[] = [
  { id: 1, name: "Alimentação", is_active: true },
  { id: 2, name: "Transporte", is_active: true },
];

function renderModal(
  open = true,
  expense: Expense | null = null,
  onSaved = vi.fn(),
  onClose = vi.fn(),
  categories = DEFAULT_CATEGORIES
) {
  return render(
    <ExpenseModal
      open={open}
      onClose={onClose}
      expense={expense}
      categories={categories}
      onSaved={onSaved}
    />
  );
}

const MOCK_EXPENSE: Expense = {
  id: "abc-123",
  amount: "150.00",
  date: "2025-03-10",
  establishment: "Mercado",
  description: "Compras",
  category: "Alimentação",
  category_id: 1,
  tax_id: null,
  entry_type: "texto",
  transaction_type: "outcome",
  confidence: 1.0,
  created_at: "2025-03-10T10:00:00",
};

describe("ExpenseModal — transaction_type field", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Type select", () => {
    renderModal();
    expect(screen.getByLabelText("Type")).toBeInTheDocument();
  });

  it("Type select has Expense option", () => {
    renderModal();
    expect(screen.getByRole("option", { name: "Expense" })).toBeInTheDocument();
  });

  it("Type select has Income option", () => {
    renderModal();
    expect(screen.getByRole("option", { name: "Income" })).toBeInTheDocument();
  });

  it("defaults to Expense (outcome) on new transaction", () => {
    renderModal();
    const select = screen.getByLabelText("Type") as HTMLSelectElement;
    expect(select.value).toBe("outcome");
  });

  it("pre-fills transaction_type from existing expense", () => {
    const incomeExpense = { ...MOCK_EXPENSE, transaction_type: "income" as const };
    renderModal(true, incomeExpense);
    const select = screen.getByLabelText("Type") as HTMLSelectElement;
    expect(select.value).toBe("income");
  });

  it("title shows 'New Income' when transaction_type is income", () => {
    renderModal();
    fireEvent.change(screen.getByLabelText("Type"), { target: { value: "income" } });
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "New Income");
  });

  it("title shows 'New Expense' when transaction_type is outcome", () => {
    renderModal();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "New Expense");
  });

  it("title shows 'Edit Income' when editing an income", () => {
    const incomeExpense = { ...MOCK_EXPENSE, transaction_type: "income" as const };
    renderModal(true, incomeExpense);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Edit Income");
  });

  it("title shows 'Edit Expense' when editing an outcome", () => {
    renderModal(true, MOCK_EXPENSE);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Edit Expense");
  });
});

describe("ExpenseModal — createExpense payload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends transaction_type in the payload", async () => {
    const { createExpense } = await import("@/lib/api");
    renderModal();

    fireEvent.change(screen.getByLabelText("Amount (R$)"), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText("Type"), { target: { value: "income" } });
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await waitFor(() => {
      expect(createExpense).toHaveBeenCalledWith(
        expect.objectContaining({ transaction_type: "income" })
      );
    });
  });
});
