import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExpenseFilters, FilterValues } from "@/components/expenses/ExpenseFilters";
import { CategoryOut } from "@/lib/api";

// Mock UI components that pull in complex dependencies
vi.mock("@/components/ui/Input", () => ({
  Input: ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => {
    const id = String(label).toLowerCase().replace(/\s+/g, "-");
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} {...props} />
      </div>
    );
  },
  Select: ({
    label,
    children,
    ...props
  }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => {
    const id = String(label).toLowerCase().replace(/\s+/g, "-");
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <select id={id} {...props}>{children}</select>
      </div>
    );
  },
}));

vi.mock("@/components/ui/Button", () => ({
  Button: ({ children, onClick }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

const CATEGORIES: CategoryOut[] = [
  { id: 1, name: "Alimentação", is_active: true },
  { id: 2, name: "Transporte", is_active: true },
];

const DEFAULT_FILTERS: FilterValues = {
  start: "2025-03-01",
  end: "2025-03-31",
  category_id: "",
  transaction_type: "",
};

function renderFilters(overrides?: Partial<FilterValues>, onChange = vi.fn()) {
  const filters = { ...DEFAULT_FILTERS, ...overrides };
  return render(
    <ExpenseFilters
      filters={filters}
      categories={CATEGORIES}
      onChange={onChange}
      onReset={vi.fn()}
    />
  );
}

describe("ExpenseFilters — transaction_type", () => {
  it("renders the Tipo select", () => {
    renderFilters();
    expect(screen.getByLabelText("Tipo")).toBeInTheDocument();
  });

  it("Tipo select has Todos option", () => {
    renderFilters();
    expect(screen.getByRole("option", { name: "Todos" })).toBeInTheDocument();
  });

  it("Tipo select has Despesa option", () => {
    renderFilters();
    expect(screen.getByRole("option", { name: "Despesa" })).toBeInTheDocument();
  });

  it("Tipo select has Receita option", () => {
    renderFilters();
    expect(screen.getByRole("option", { name: "Receita" })).toBeInTheDocument();
  });

  it("selecting Receita calls onChange with transaction_type=income", () => {
    const onChange = vi.fn();
    renderFilters({}, onChange);
    fireEvent.change(screen.getByLabelText("Tipo"), { target: { value: "income" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ transaction_type: "income" })
    );
  });

  it("selecting Despesa calls onChange with transaction_type=outcome", () => {
    const onChange = vi.fn();
    renderFilters({}, onChange);
    fireEvent.change(screen.getByLabelText("Tipo"), { target: { value: "outcome" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ transaction_type: "outcome" })
    );
  });

  it("selecting Todos calls onChange with transaction_type=''", () => {
    const onChange = vi.fn();
    renderFilters({ transaction_type: "income" }, onChange);
    fireEvent.change(screen.getByLabelText("Tipo"), { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ transaction_type: "" })
    );
  });

  it("current transaction_type value is reflected in the select", () => {
    renderFilters({ transaction_type: "income" });
    const select = screen.getByLabelText("Tipo") as HTMLSelectElement;
    expect(select.value).toBe("income");
  });
});

describe("ExpenseFilters — existing filters still work", () => {
  it("renders Category select", () => {
    renderFilters();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
  });

  it("renders category options", () => {
    renderFilters();
    expect(screen.getByRole("option", { name: "Alimentação" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Transporte" })).toBeInTheDocument();
  });

  it("changing start date calls onChange", () => {
    const onChange = vi.fn();
    renderFilters({}, onChange);
    fireEvent.change(screen.getByLabelText("Data inicial"), {
      target: { value: "2025-01-01" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ start: "2025-01-01" })
    );
  });
});
