"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { CategoryOut, Expense, ExpenseInput, createExpense, updateExpense, getCategories } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
  onSaved: () => void;
}

const TIPO_OPTIONS = [
  { value: "texto", label: "Texto" },
  { value: "imagem", label: "Imagem" },
  { value: "pdf", label: "PDF" },
];

const DEFAULT_FORM: ExpenseInput = {
  valor: 0,
  data: new Date().toISOString().split("T")[0],
  estabelecimento: "",
  descricao: "",
  categoria_id: undefined,
  tipo_entrada: "texto",
};

export function ExpenseModal({ open, onClose, expense, onSaved }: ExpenseModalProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState<ExpenseInput>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseInput, string>>>({});
  const [categories, setCategories] = useState<CategoryOut[]>([]);
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(expense);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (open) {
      if (expense) {
        setForm({
          valor: parseFloat(expense.valor),
          data: expense.data,
          estabelecimento: expense.estabelecimento || "",
          descricao: expense.descricao || "",
          categoria_id: expense.categoria_id ?? undefined,
          tipo_entrada: expense.tipo_entrada,
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
    if (!form.valor || form.valor <= 0) errs.valor = "Informe um valor maior que zero";
    if (!form.data) errs.data = "Informe a data";
    if (!form.tipo_entrada) errs.tipo_entrada = "Selecione o tipo";
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
        estabelecimento: form.estabelecimento || undefined,
        descricao: form.descricao || undefined,
      };

      if (isEditing && expense) {
        await updateExpense(expense.id, payload);
        showToast("Despesa atualizada com sucesso!", "success");
      } else {
        await createExpense(payload);
        showToast("Despesa criada com sucesso!", "success");
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar despesa";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar Despesa" : "Nova Despesa"}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0.01"
            value={form.valor || ""}
            onChange={(e) => update("valor", parseFloat(e.target.value) || 0)}
            error={errors.valor}
            required
          />
          <Input
            label="Data"
            type="date"
            value={form.data}
            onChange={(e) => update("data", e.target.value)}
            error={errors.data}
            required
          />
        </div>

        <Input
          label="Estabelecimento"
          type="text"
          value={form.estabelecimento}
          onChange={(e) => update("estabelecimento", e.target.value)}
          placeholder="Ex: Supermercado Pão de Açúcar"
        />

        <Input
          label="Descrição"
          type="text"
          value={form.descricao}
          onChange={(e) => update("descricao", e.target.value)}
          placeholder="Descrição opcional"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Categoria"
            value={form.categoria_id ?? ""}
            onChange={(e) =>
              update("categoria_id", e.target.value ? Number(e.target.value) : undefined)
            }
          >
            <option value="">Sem categoria</option>
            {categories
              .filter((c) => c.ativo)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
          </Select>

          <Select
            label="Tipo de entrada"
            value={form.tipo_entrada}
            onChange={(e) => update("tipo_entrada", e.target.value)}
            error={errors.tipo_entrada}
            required
          >
            {TIPO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex gap-3 pt-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            {isEditing ? "Salvar alterações" : "Criar despesa"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
