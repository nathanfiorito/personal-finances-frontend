"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { deactivateCategory } from "@/lib/api/client";
import type { Category } from "@/lib/types";
import { CategoryModal } from "./CategoryModal";

export function CategoryList({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  async function handleDeactivate(cat: Category) {
    if (!confirm(`Deactivate "${cat.name}"? It will no longer appear in new transactions.`)) return;
    try {
      await deactivateCategory(cat.id);
      toast(`"${cat.name}" deactivated.`);
      router.refresh();
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Failed to deactivate.", "error");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>+ New category</Button>
      </div>
      <div className="rounded-xl border border-neutral-200 dark:border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-dark-surface2 text-xs font-medium uppercase text-neutral-500 dark:text-dark-muted">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-dark-border bg-white dark:bg-dark-surface">
            {categories.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-12 text-center text-neutral-400">No categories found.</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id} className="hover:bg-neutral-50 dark:hover:bg-dark-surface2">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3">
                  <Badge variant={cat.is_active ? "active" : "inactive"}>{cat.is_active ? "Active" : "Inactive"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(cat)} className="p-1.5 rounded text-neutral-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-700/20" title="Rename"><Pencil size={14} /></button>
                    {cat.is_active && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeactivate(cat)}>Deactivate</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CategoryModal open={creating} onClose={() => setCreating(false)} />
      <CategoryModal open={!!editing} onClose={() => setEditing(null)} category={editing ?? undefined} />
    </div>
  );
}
