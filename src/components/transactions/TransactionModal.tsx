"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { createTransaction, updateTransaction } from "@/lib/api/client";
import type { Transaction, Category } from "@/lib/types";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction;
  categories: Category[];
}

export function TransactionModal({ open, onClose, transaction, categories }: TransactionModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!transaction;

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [establishment, setEstablishment] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit">("debit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && transaction) {
      setAmount(transaction.amount);
      setDate(transaction.date);
      setEstablishment(transaction.establishment ?? "");
      setDescription(transaction.description ?? "");
      setCategoryId(transaction.category_id ?? "");
      setType(transaction.transaction_type);
      setPaymentMethod(transaction.payment_method);
    } else if (open && !transaction) {
      setAmount(""); setDate(new Date().toISOString().slice(0, 10));
      setEstablishment(""); setDescription("");
      setCategoryId(""); setType("expense"); setPaymentMethod("debit");
    }
    setError(null);
  }, [open, transaction]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) { setError("Please select a category."); return; }
    setLoading(true); setError(null);
    const payload = {
      amount: parseFloat(amount),
      date,
      establishment: establishment || undefined,
      description: description || undefined,
      category_id: categoryId,
      entry_type: "text",
      transaction_type: type,
      payment_method: paymentMethod,
    };
    try {
      if (isEdit) await updateTransaction(transaction!.id, payload);
      else await createTransaction(payload);
      toast(isEdit ? "Transaction updated." : "Transaction created.");
      onClose();
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Transaction" : "New Transaction"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Amount" type="number" step="0.01" min="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
          <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700 dark:text-dark-secondary">Type</label>
          <select value={type} onChange={e => setType(e.target.value as "income" | "expense")} className="rounded-md border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700 dark:text-dark-secondary">Category</label>
          <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))} className="rounded-md border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Select category…</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <Input label="Establishment" value={establishment} onChange={e => setEstablishment(e.target.value)} placeholder="Optional" />
        <Input label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700 dark:text-dark-secondary">Payment method</label>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as "credit" | "debit")} className="rounded-md border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">{isEdit ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}
