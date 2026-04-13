"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { createCategory, updateCategory } from "@/lib/api/client";
import type { Category } from "@/lib/types";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
}

export function CategoryModal({ open, onClose, category }: CategoryModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState(category?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      if (category) await updateCategory(category.id, { name });
      else await createCategory(name);
      toast(category ? "Category renamed." : "Category created.");
      onClose();
      router.refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      if (msg.includes("409") || msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("already exists")) {
        setError("A category with this name already exists.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={category ? "Rename Category" : "New Category"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={name} onChange={e => setName(e.target.value)} error={error ?? undefined} required autoFocus />
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">{category ? "Rename" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}
