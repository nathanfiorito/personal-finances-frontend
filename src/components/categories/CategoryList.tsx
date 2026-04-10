"use client";

import { useState } from "react";
import { CategoryOut, createCategory, updateCategory, deactivateCategory } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/hooks/useToast";
import { Pencil, Plus } from "lucide-react";
import { getCategoryColor } from "@/lib/chart-colors";

interface CategoryListProps {
  initialCategories: CategoryOut[];
}

export function CategoryList({ initialCategories }: CategoryListProps) {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategoryOut[]>(initialCategories);

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Rename modal
  const [renameTarget, setRenameTarget] = useState<CategoryOut | null>(null);
  const [renameName, setRenameName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [renameError, setRenameError] = useState("");

  // Deactivate confirm modal
  const [deactivateTarget, setDeactivateTarget] = useState<CategoryOut | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  // ─── Create ───────────────────────────────────────────────────────────────

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) {
      setCreateError("Enter a name for the category");
      return;
    }
    setCreating(true);
    try {
      const newCat = await createCategory(createName.trim());
      setCategories((prev) => [...prev, newCat]);
      showToast(`Category "${newCat.name}" created successfully!`, "success");
      setCreateOpen(false);
      setCreateName("");
      setCreateError("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error creating category";
      if (msg.toLowerCase().includes("409") || msg.toLowerCase().includes("duplicado") || msg.toLowerCase().includes("already")) {
        setCreateError("A category with this name already exists");
      } else {
        setCreateError(msg);
      }
    } finally {
      setCreating(false);
    }
  };

  // ─── Rename ───────────────────────────────────────────────────────────────

  const openRename = (cat: CategoryOut) => {
    setRenameTarget(cat);
    setRenameName(cat.name);
    setRenameError("");
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget) return;
    if (!renameName.trim()) {
      setRenameError("Enter a name for the category");
      return;
    }
    setRenaming(true);
    try {
      const updated = await updateCategory(renameTarget.id, { name: renameName.trim() });
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      showToast(`Category renamed to "${updated.name}"`, "success");
      setRenameTarget(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error renaming category";
      setRenameError(msg);
    } finally {
      setRenaming(false);
    }
  };

  // ─── Deactivate ───────────────────────────────────────────────────────────

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    setDeactivating(true);
    try {
      await deactivateCategory(deactivateTarget.id);
      setCategories((prev) =>
        prev.map((c) =>
          c.id === deactivateTarget.id ? { ...c, is_active: false } : c
        )
      );
      showToast(`Category "${deactivateTarget.name}" deactivated`, "success");
      setDeactivateTarget(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error deactivating category";
      showToast(msg, "error");
    } finally {
      setDeactivating(false);
    }
  };

  const active = categories.filter((c) => c.is_active);
  const inactive = categories.filter((c) => !c.is_active);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-neutral-500 dark:text-dark-muted">
              {active.length} active · {inactive.length} inactive
            </h2>
          </div>
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            New category
          </Button>
        </div>

        {/* Active categories */}
        <Card padding={false}>
          <div className="p-4 border-b border-neutral-200 dark:border-dark-border">
            <h3 className="font-semibold text-neutral-900 dark:text-dark-primary">Active categories</h3>
          </div>
          {active.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 dark:text-dark-muted text-sm">
              No active categories
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100 dark:divide-dark-border">
              {active.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between px-4 py-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(cat.name) }}
                    />
                    <span className="text-sm font-medium text-neutral-900 dark:text-dark-primary truncate">
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openRename(cat)}
                      aria-label={`Rename ${cat.name}`}
                    >
                      <Pencil size={14} />
                      Rename
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeactivateTarget(cat)}
                      className="text-danger dark:text-danger-dark hover:bg-danger-bg dark:hover:bg-danger-bg-dark"
                    >
                      Deactivate
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Inactive categories */}
        {inactive.length > 0 && (
          <Card padding={false}>
            <div className="p-4 border-b border-neutral-200 dark:border-dark-border">
              <h3 className="font-semibold text-neutral-500 dark:text-dark-muted">Inactive categories</h3>
            </div>
            <ul className="divide-y divide-neutral-100 dark:divide-dark-border">
              {inactive.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between px-4 py-3 opacity-60">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-dark-border flex-shrink-0" />
                    <span className="text-sm text-neutral-500 dark:text-dark-muted line-through">
                      {cat.name}
                    </span>
                  </div>
                  <Badge variant="default">Inactive</Badge>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setCreateName(""); setCreateError(""); }} title="New Category">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Category name"
            type="text"
            value={createName}
            onChange={(e) => { setCreateName(e.target.value); setCreateError(""); }}
            error={createError}
            placeholder="E.g.: Investments"
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => { setCreateOpen(false); setCreateName(""); setCreateError(""); }} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={creating}>
              Create category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Rename Modal */}
      <Modal open={Boolean(renameTarget)} onClose={() => setRenameTarget(null)} title="Rename Category">
        <form onSubmit={handleRename} className="flex flex-col gap-4">
          <Input
            label="New name"
            type="text"
            value={renameName}
            onChange={(e) => { setRenameName(e.target.value); setRenameError(""); }}
            error={renameError}
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setRenameTarget(null)} disabled={renaming}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={renaming}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deactivate Confirm Modal */}
      <Modal open={Boolean(deactivateTarget)} onClose={() => setDeactivateTarget(null)} title="Deactivate Category">
        <div className="flex flex-col gap-6">
          <p className="text-sm text-neutral-600 dark:text-dark-secondary">
            Are you sure you want to deactivate the category{" "}
            <strong className="text-neutral-900 dark:text-dark-primary">
              &ldquo;{deactivateTarget?.name}&rdquo;
            </strong>
            ? It will no longer appear in new expense options.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeactivateTarget(null)} disabled={deactivating}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeactivate} loading={deactivating}>
              Deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
