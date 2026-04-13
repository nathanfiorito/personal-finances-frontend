"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { deleteTransaction } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction, Category } from "@/lib/types";
import { TransactionModal } from "./TransactionModal";

interface TransactionTableProps {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  categories: Category[];
}

export function TransactionTable({ transactions, total, page, pageSize, categories }: TransactionTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [creating, setCreating] = useState(false);
  const totalPages = Math.ceil(total / pageSize);

  async function handleDelete(id: string) {
    if (!confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      toast("Transaction deleted.");
      router.refresh();
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Failed to delete.", "error");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>+ Add transaction</Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-neutral-200 dark:border-dark-border">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-dark-surface2 text-xs font-medium uppercase text-neutral-500 dark:text-dark-muted">
            <tr>
              {["Date","Establishment","Category","Type","Amount",""].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-dark-border bg-white dark:bg-dark-surface">
            {transactions.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-neutral-400 dark:text-dark-muted">No transactions found.</td></tr>
            ) : transactions.map(t => (
              <tr key={t.id} className="hover:bg-neutral-50 dark:hover:bg-dark-surface2">
                <td className="px-4 py-3 text-neutral-500 dark:text-dark-muted">{formatDate(t.date)}</td>
                <td className="px-4 py-3 font-medium">{t.establishment ?? t.description ?? "—"}</td>
                <td className="px-4 py-3"><Badge variant="brand">{t.category}</Badge></td>
                <td className="px-4 py-3"><Badge variant={t.transaction_type}>{t.transaction_type === "income" ? "Income" : "Expense"}</Badge></td>
                <td className="px-4 py-3 font-bold text-right">{formatCurrency(t.amount)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setEditing(t)} className="p-1.5 rounded text-neutral-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-700/20"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded text-neutral-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden flex flex-col gap-3">
        {transactions.length === 0 ? (
          <p className="text-center py-8 text-neutral-400 dark:text-dark-muted text-sm">No transactions found.</p>
        ) : transactions.map(t => (
          <div key={t.id} className="bg-white dark:bg-dark-surface rounded-xl border border-neutral-200 dark:border-dark-border p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-sm">{t.establishment ?? t.description ?? "—"}</p>
                <p className="text-xs text-neutral-400 dark:text-dark-muted">{formatDate(t.date)}</p>
              </div>
              <p className={`font-bold text-sm ${t.transaction_type === "income" ? "text-success" : "text-neutral-900 dark:text-dark-primary"}`}>
                {t.transaction_type === "income" ? "+" : ""}{formatCurrency(t.amount)}
              </p>
            </div>
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-1.5">
                <Badge variant="brand">{t.category}</Badge>
                <Badge variant={t.transaction_type}>{t.transaction_type === "income" ? "Income" : "Expense"}</Badge>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(t)} className="p-1.5 rounded text-neutral-400 hover:text-brand-500"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded text-neutral-400 hover:text-danger"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => { const params = new URLSearchParams(window.location.search); params.set("page", String(p)); router.push(`?${params.toString()}`); }}
              className={`w-8 h-8 rounded-md font-medium ${p === page ? "bg-brand-500 text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-dark-surface2"}`}
            >{p}</button>
          ))}
        </div>
      )}

      <TransactionModal open={creating} onClose={() => setCreating(false)} categories={categories} />
      <TransactionModal open={!!editing} onClose={() => setEditing(null)} transaction={editing ?? undefined} categories={categories} />
    </div>
  );
}
