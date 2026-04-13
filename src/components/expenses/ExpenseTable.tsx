"use client";

import { Expense } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryColor } from "@/lib/chart-colors";

interface ExpenseTableProps {
  expenses: Expense[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  loading?: boolean;
}

function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function TransactionTypeBadge({ type }: { type: string }) {
  const isIncome = type === "income";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        isIncome
          ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-500/10"
          : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-500/10"
      }`}
    >
      {isIncome ? "Income" : "Expense"}
    </span>
  );
}

export function ExpenseTable({
  expenses,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  loading,
}: ExpenseTableProps) {
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  if (!loading && expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-4">💸</div>
        <p className="text-neutral-500 dark:text-dark-muted font-medium">No expenses found</p>
        <p className="text-sm text-neutral-400 dark:text-dark-muted mt-1">
          Try adjusting the filters or add a new expense.
        </p>
      </div>
    );
  }

  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="flex flex-col gap-4">

      {/* ── Mobile card view (< sm) ───────────────────────────────────────── */}
      <div className="block sm:hidden rounded-xl border border-neutral-200 dark:border-dark-border overflow-hidden">
        {loading
          ? skeletonRows.map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 px-4 py-3 border-b border-neutral-100 dark:border-dark-border last:border-b-0 animate-pulse"
              >
                <div className="flex justify-between">
                  <div className="h-3 bg-neutral-200 dark:bg-dark-surface2 rounded w-16" />
                  <div className="h-3 bg-neutral-200 dark:bg-dark-surface2 rounded w-20" />
                </div>
                <div className="h-4 bg-neutral-200 dark:bg-dark-surface2 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 dark:bg-dark-surface2 rounded w-24" />
              </div>
            ))
          : expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex flex-col gap-1.5 px-4 py-3 border-b border-neutral-100 dark:border-dark-border last:border-b-0"
              >
                {/* Date + Value */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500 dark:text-dark-muted">
                    {formatDate(expense.date)}
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-dark-primary">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>

                {/* Establishment */}
                <p className="text-sm text-neutral-900 dark:text-dark-primary truncate">
                  {expense.establishment || (
                    <span className="text-neutral-400 dark:text-dark-muted italic">
                      {expense.description || "—"}
                    </span>
                  )}
                </p>

                {/* Category + Type + Actions */}
                <div className="flex items-center justify-between mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    >
                      {expense.category}
                    </span>
                    <TransactionTypeBadge type={expense.transaction_type ?? "outcome"} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(expense)}
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(expense)}
                      aria-label="Delete"
                      className="text-danger hover:text-danger dark:text-danger-dark"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* ── Desktop table view (≥ sm) ─────────────────────────────────────── */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-neutral-200 dark:border-dark-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 dark:bg-dark-surface2 border-b border-neutral-200 dark:border-dark-border">
              <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-dark-secondary">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-dark-secondary">Establishment</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-dark-secondary">Category</th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-600 dark:text-dark-secondary">Amount</th>
              <th className="px-4 py-3 text-center font-semibold text-neutral-600 dark:text-dark-secondary">Type</th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-600 dark:text-dark-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? skeletonRows.map((_, i) => (
                  <tr key={i} className="border-b border-neutral-100 dark:border-dark-border animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-neutral-200 dark:bg-dark-surface2 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-neutral-100 dark:border-dark-border hover:bg-neutral-50 dark:hover:bg-dark-surface2 transition-colors"
                  >
                    <td className="px-4 py-3 text-neutral-600 dark:text-dark-secondary">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-4 py-3 text-neutral-900 dark:text-dark-primary max-w-[200px]">
                      <div className="truncate">
                        {expense.establishment || (
                          <span className="text-neutral-400 dark:text-dark-muted italic">
                            {expense.description || "—"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getCategoryColor(expense.category) }}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-neutral-900 dark:text-dark-primary">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TransactionTypeBadge type={expense.transaction_type ?? "outcome"} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(expense)}
                          aria-label="Edit"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(expense)}
                          aria-label="Delete"
                          className="text-danger hover:text-danger dark:text-danger-dark"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500 dark:text-dark-muted">
            {loading ? "Loading..." : `Showing ${start}–${end} of ${total} expenses`}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || loading}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="px-3 py-1 text-sm text-neutral-600 dark:text-dark-secondary">
              {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || loading}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
