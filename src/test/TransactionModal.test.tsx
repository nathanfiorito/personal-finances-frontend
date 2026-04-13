import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import type { Transaction, Category } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));
const createMock = vi.fn().mockResolvedValue({});
vi.mock("@/lib/api/client", () => ({
  createTransaction: (...args: unknown[]) => createMock(...args),
  updateTransaction: vi.fn().mockResolvedValue({}),
}));

const categories: Category[] = [
  { id: 1, name: "Alimentação", is_active: true },
];

const existing: Transaction = {
  id: "1", amount: "45.90", date: "2026-04-12", establishment: "iFood",
  description: null, category: "Alimentação", category_id: 1, tax_id: null,
  entry_type: "text", transaction_type: "expense", payment_method: "credit",
  confidence: null, created_at: "2026-04-12T10:00:00",
};

describe("TransactionModal", () => {
  it("defaults type to expense in create mode", () => {
    render(<TransactionModal open categories={categories} onClose={() => {}} />);
    expect(screen.getByDisplayValue("Expense")).toBeInTheDocument();
  });

  it("pre-fills fields in edit mode", () => {
    render(<TransactionModal open categories={categories} onClose={() => {}} transaction={existing} />);
    expect(screen.getByDisplayValue("45.90")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Expense")).toBeInTheDocument();
  });

  it("shows error when category not selected on submit", async () => {
    const user = userEvent.setup();
    render(<TransactionModal open categories={categories} onClose={() => {}} />);
    // Amount is a spinbutton (type=number); fill it so HTML5 validation passes
    const amountInput = screen.getByRole("spinbutton");
    await user.type(amountInput, "10.00");
    await user.click(screen.getByRole("button", { name: /create/i }));
    expect(screen.getByText("Please select a category.")).toBeInTheDocument();
  });

  it("calls createTransaction with correct payload", async () => {
    const user = userEvent.setup();
    render(<TransactionModal open categories={categories} onClose={() => {}} />);
    // Amount is the only spinbutton (type=number)
    const amountInput = screen.getByRole("spinbutton");
    await user.type(amountInput, "50.00");
    await user.selectOptions(screen.getByDisplayValue("Select category…"), "Alimentação");
    await user.click(screen.getByRole("button", { name: /create/i }));
    await waitFor(() => {
      expect(createMock).toHaveBeenCalledWith(expect.objectContaining({
        amount: 50,
        transaction_type: "expense",
        category_id: 1,
      }));
    });
  });
});
