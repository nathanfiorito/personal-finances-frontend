"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { CategoryOut, Expense, ExpenseInput, createExpense, updateExpense } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
  categories: CategoryOut[];
  onSaved: () => void;
}

const TRANSACTION_TYPE_OPTIONS = [
  { value: "outcome", label: "Expense" },
  { value: "income", label: "Income" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "debit", label: "Debit" },
  { value: "credit", label: "Credit" },
];

const DEFAULT_FORM: ExpenseInput = {
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  establishment: "",
  description: "",
  category_id: undefined,
  entry_type: "manual",
  transaction_type: "outcome",
  payment_method: "debit",
};

export function ExpenseModal({ open, onClose, expense, categories, onSaved }: ExpenseModalProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState<ExpenseInput>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseInput, string>>>({});
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(expense);

  useEffect(() => {
    if (open) {
      if (expense) {
        setForm({
          amount: parseFloat(expense.amount),
          date: expense.date,
          establishment: expense.establishment || "",
          description: expense.description || "",
          category_id: expense.category_id ?? undefined,
          entry_type: expense.entry_type,
          transaction_type: expense.transaction_type ?? "outcome",
          payment_method: expense.payment_method ?? "debit",
        });
      } else {
        setForm(DEFAULT_FORM);
      }
      setErrors({});
    }
  }, [open, expense]);

  const update = (key: keyof ExpenseInput, value: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ExpenseInput, string>> = {};
    if (!form.amount || form.amount <= 0) errs.amount = "Enter an amount greater than zero";
    if (!form.date) errs.date = "Enter the date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload: ExpenseInput = {
        ...form,
        establishment: form.establishment || undefined,
        description: form.description || undefined,
      };

      const typeLabel = payload.transaction_type === "income" ? "Income" : "Expense";
      if (isEditing && expense) {
        await updateExpense(expense.id, payload);
        showToast(`${typeLabel} updated successfully!`, "success");
      } else {
        await createExpense(payload);
        showToast(`${typeLabel} created successfully!`, "success");
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error saving expense";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = isEditing
    ? form.transaction_type === "income" ? "Edit Income" : "Edit Expense"
    : form.transaction_type === "income" ? "New Income" : "New Expense";

  return (
    <Modal open={open} onClose={onClose} title={modalTitle} maxWidth="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount (R$)"
            type="number"
            step="0.01"
            min="0.01"
            value={form.amount || ""}
            onChange={(e) => update("amount", parseFloat(e.target.value) || 0)}
            error={errors.amount}
            required
          />
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            error={errors.date}
            required
          />
        </div>

        <Input
          label="Establishment"
          type="text"
          value={form.establishment}
          onChange={(e) => update("establishment", e.target.value)}
          placeholder="E.g.: Grocery Store"
        />

        <Input
          label="Description"
          type="text"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Optional description"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Type"
            value={form.transaction_type}
            onChange={(e) => update("transaction_type", e.target.value as "income" | "outcome")}
            required
          >
            {TRANSACTION_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          <Select
            label="Payment method"
            value={form.payment_method}
            onChange={(e) => update("payment_method", e.target.value as "credit" | "debit")}
            required
          >
            {PAYMENT_METHOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <Select
          label="Category"
          value={form.category_id ?? ""}
          onChange={(e) =>
            update("category_id", e.target.value ? Number(e.target.value) : undefined)
          }
        >
          <option value="">No category</option>
          {categories
            .filter((c) => c.is_active)
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </Select>

        <div className="flex gap-3 pt-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            {isEditing ? "Save changes" : "Create expense"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
