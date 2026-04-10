"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Expense,
  CategoryOut,
  PaginatedExpenses,
  getExpenses,
  getCategories,
  deleteExpense,
} from "@/lib/api";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { ExpenseFilters, FilterValues } from "@/components/expenses/ExpenseFilters";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";
import { Plus, Download } from "lucide-react";
import { exportCsv } from "@/lib/api";

const PAGE_SIZE = 20;

const defaultFilters = (): FilterValues => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  return {
    start: `${year}-${month}-01`,
    end: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
    category_id: "",
    transaction_type: "",
  };
};

export default function ExpensesPage() {
  const { showToast } = useToast();

  const [data, setData] = useState<PaginatedExpenses>({
    items: [],
    total: 0,
    page: 1,
    page_size: PAGE_SIZE,
  });
  const [categories, setCategories] = useState<CategoryOut[]>([]);
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch {
      // non-blocking
    }
  }, []);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getExpenses({
        start: filters.start || undefined,
        end: filters.end || undefined,
        category_id: filters.category_id ? Number(filters.category_id) : undefined,
        transaction_type: (filters.transaction_type as "income" | "outcome") || undefined,
        page,
        page_size: PAGE_SIZE,
      });
      setData(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error loading expenses";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [filters, page, showToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters());
    setPage(1);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleNewExpense = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  const handleSaved = () => {
    setPage(1);
    loadExpenses();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteExpense(deleteTarget.id);
      showToast("Expense deleted successfully", "success");
      setDeleteTarget(null);
      loadExpenses();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error deleting expense";
      showToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportCsv(filters.start, filters.end);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `despesas-${filters.start}-${filters.end}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("CSV exported successfully!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error exporting CSV";
      showToast(msg, "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Expenses</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-muted mt-1">
              Manage your expenses
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleExport}
              loading={exporting}
              title="Export CSV"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button variant="primary" onClick={handleNewExpense} aria-label="New expense">
              <Plus size={16} />
              <span className="hidden sm:inline" aria-hidden="true">New expense</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <ExpenseFilters
          filters={filters}
          categories={categories}
          onChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Table */}
        <ExpenseTable
          expenses={data.items}
          total={data.total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
          loading={loading}
        />
      </div>

      {/* Expense Create/Edit Modal */}
      <ExpenseModal
        open={modalOpen}
        onClose={handleModalClose}
        expense={editingExpense}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Expense"
        maxWidth="sm"
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm text-neutral-600 dark:text-dark-secondary">
            Are you sure you want to delete this expense?
          </p>
          {deleteTarget && (
            <div className="rounded-lg bg-danger-bg dark:bg-danger-bg-dark border border-danger/20 dark:border-danger-dark/20 px-4 py-3">
              <p className="text-sm font-medium text-danger dark:text-danger-dark">
                {deleteTarget.establishment || deleteTarget.description || "No description"} —{" "}
                {parseFloat(deleteTarget.amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} loading={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
