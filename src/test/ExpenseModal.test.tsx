import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { Expense } from "@/lib/api";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("@/lib/api", () => ({
  getCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "Alimentação", is_active: true },
    { id: 2, name: "Transporte", is_active: true },
  ]),
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderModal(
  open = true,
  expense: Expense | null = null,
  onSaved = vi.fn(),
  onClose = vi.fn()
) {
  return render(
    <ExpenseModal open={open} onClose={onClose} expense={expense} onSaved={onSaved} />
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

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ExpenseModal — transaction_type field", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Tipo select", async () => {
    renderModal();
    await waitFor(() => {
      expect(screen.getByLabelText("Tipo")).toBeInTheDocument();
    });
  });

  it("Tipo select has Despesa option", async () => {
    renderModal();
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Despesa" })).toBeInTheDocument();
    });
  });

  it("Tipo select has Receita option", async () => {
    renderModal();
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Receita" })).toBeInTheDocument();
    });
  });

  it("defaults to Despesa (outcome) on new transaction", async () => {
    renderModal();
    await waitFor(() => {
      const select = screen.getByLabelText("Tipo") as HTMLSelectElement;
      expect(select.value).toBe("outcome");
    });
  });

  it("pre-fills transaction_type from existing expense", async () => {
    const incomeExpense = { ...MOCK_EXPENSE, transaction_type: "income" as const };
    renderModal(true, incomeExpense);
    await waitFor(() => {
      const select = screen.getByLabelText("Tipo") as HTMLSelectElement;
      expect(select.value).toBe("income");
    });
  });

  it("title shows 'Nova Receita' when transaction_type is income", async () => {
    renderModal();
    await waitFor(() => screen.getByLabelText("Tipo"));
    fireEvent.change(screen.getByLabelText("Tipo"), { target: { value: "income" } });
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Nova Receita");
  });

  it("title shows 'Nova Despesa' when transaction_type is outcome", async () => {
    renderModal();
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Nova Despesa");
  });

  it("title shows 'Editar Receita' when editing an income", async () => {
    const incomeExpense = { ...MOCK_EXPENSE, transaction_type: "income" as const };
    renderModal(true, incomeExpense);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Editar Receita");
    });
  });

  it("title shows 'Editar Despesa' when editing an outcome", async () => {
    renderModal(true, MOCK_EXPENSE);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Editar Despesa");
    });
  });
});

describe("ExpenseModal — createExpense payload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends transaction_type in the payload", async () => {
    const { createExpense } = await import("@/lib/api");
    renderModal();

    await waitFor(() => screen.getByLabelText("Tipo"));

    fireEvent.change(screen.getByLabelText("Amount (R$)"), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText("Tipo"), { target: { value: "income" } });

    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await waitFor(() => {
      expect(createExpense).toHaveBeenCalledWith(
        expect.objectContaining({ transaction_type: "income" })
      );
    });
  });
});
