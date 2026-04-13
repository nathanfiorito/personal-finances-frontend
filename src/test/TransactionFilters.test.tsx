import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";

const categories = [
  { id: 1, name: "Alimentação", is_active: true },
  { id: 2, name: "Transporte", is_active: true },
];

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/transactions",
  useSearchParams: () => new URLSearchParams(),
}));

describe("TransactionFilters", () => {
  it("renders category options", () => {
    render(<TransactionFilters categories={categories} />);
    expect(screen.getByText("Alimentação")).toBeInTheDocument();
    expect(screen.getByText("Transporte")).toBeInTheDocument();
  });

  it("renders type options", () => {
    render(<TransactionFilters categories={categories} />);
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Expense")).toBeInTheDocument();
  });

  it("pushes URL with transaction_type when type changes", async () => {
    const user = userEvent.setup();
    render(<TransactionFilters categories={categories} />);
    const typeSelect = screen.getByDisplayValue("All types");
    await user.selectOptions(typeSelect, "expense");
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining("transaction_type=expense"));
  });

  it("pushes URL with category_id when category changes", async () => {
    const user = userEvent.setup();
    render(<TransactionFilters categories={categories} />);
    const catSelect = screen.getByDisplayValue("All categories");
    await user.selectOptions(catSelect, "Alimentação");
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining("category_id=1"));
  });
});
