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
      setCreateError("Informe um nome para a categoria");
      return;
    }
    setCreating(true);
    try {
      const newCat = await createCategory(createName.trim());
      setCategories((prev) => [...prev, newCat]);
      showToast(`Categoria "${newCat.nome}" criada com sucesso!`, "success");
      setCreateOpen(false);
      setCreateName("");
      setCreateError("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar categoria";
      if (msg.toLowerCase().includes("409") || msg.toLowerCase().includes("duplicado") || msg.toLowerCase().includes("already")) {
        setCreateError("Já existe uma categoria com este nome");
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
    setRenameName(cat.nome);
    setRenameError("");
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget) return;
    if (!renameName.trim()) {
      setRenameError("Informe um nome para a categoria");
      return;
    }
    setRenaming(true);
    try {
      const updated = await updateCategory(renameTarget.id, { nome: renameName.trim() });
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      showToast(`Categoria renomeada para "${updated.nome}"`, "success");
      setRenameTarget(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao renomear categoria";
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
          c.id === deactivateTarget.id ? { ...c, ativo: false } : c
        )
      );
      showToast(`Categoria "${deactivateTarget.nome}" desativada`, "success");
      setDeactivateTarget(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao desativar categoria";
      showToast(msg, "error");
    } finally {
      setDeactivating(false);
    }
  };

  const active = categories.filter((c) => c.ativo);
  const inactive = categories.filter((c) => !c.ativo);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-neutral-500 dark:text-dark-muted">
              {active.length} ativas · {inactive.length} inativas
            </h2>
          </div>
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            Nova categoria
          </Button>
        </div>

        {/* Active categories */}
        <Card padding={false}>
          <div className="p-4 border-b border-neutral-200 dark:border-dark-border">
            <h3 className="font-semibold text-neutral-900 dark:text-dark-primary">Categorias ativas</h3>
          </div>
          {active.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 dark:text-dark-muted text-sm">
              Nenhuma categoria ativa
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100 dark:divide-dark-border">
              {active.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(cat.nome) }}
                    />
                    <span className="text-sm font-medium text-neutral-900 dark:text-dark-primary">
                      {cat.nome}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openRename(cat)}
                      aria-label={`Renomear ${cat.nome}`}
                    >
                      <Pencil size={14} />
                      Renomear
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeactivateTarget(cat)}
                      className="text-danger dark:text-danger-dark hover:bg-danger-bg dark:hover:bg-danger-bg-dark"
                    >
                      Desativar
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
              <h3 className="font-semibold text-neutral-500 dark:text-dark-muted">Categorias inativas</h3>
            </div>
            <ul className="divide-y divide-neutral-100 dark:divide-dark-border">
              {inactive.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between px-4 py-3 opacity-60">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-dark-border flex-shrink-0" />
                    <span className="text-sm text-neutral-500 dark:text-dark-muted line-through">
                      {cat.nome}
                    </span>
                  </div>
                  <Badge variant="default">Inativa</Badge>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setCreateName(""); setCreateError(""); }} title="Nova Categoria">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Nome da categoria"
            type="text"
            value={createName}
            onChange={(e) => { setCreateName(e.target.value); setCreateError(""); }}
            error={createError}
            placeholder="Ex: Investimentos"
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => { setCreateOpen(false); setCreateName(""); setCreateError(""); }} disabled={creating}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={creating}>
              Criar categoria
            </Button>
          </div>
        </form>
      </Modal>

      {/* Rename Modal */}
      <Modal open={Boolean(renameTarget)} onClose={() => setRenameTarget(null)} title="Renomear Categoria">
        <form onSubmit={handleRename} className="flex flex-col gap-4">
          <Input
            label="Novo nome"
            type="text"
            value={renameName}
            onChange={(e) => { setRenameName(e.target.value); setRenameError(""); }}
            error={renameError}
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setRenameTarget(null)} disabled={renaming}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={renaming}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deactivate Confirm Modal */}
      <Modal open={Boolean(deactivateTarget)} onClose={() => setDeactivateTarget(null)} title="Desativar Categoria">
        <div className="flex flex-col gap-6">
          <p className="text-sm text-neutral-600 dark:text-dark-secondary">
            Tem certeza que deseja desativar a categoria{" "}
            <strong className="text-neutral-900 dark:text-dark-primary">
              &ldquo;{deactivateTarget?.nome}&rdquo;
            </strong>
            ? Ela não aparecerá mais nas opções de novas despesas.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeactivateTarget(null)} disabled={deactivating}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeactivate} loading={deactivating}>
              Desativar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
