"use client";

import { CategoryOut } from "@/lib/api";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface FilterValues {
  start: string;
  end: string;
  categoria_id: string;
  transaction_type: string;
}

interface ExpenseFiltersProps {
  filters: FilterValues;
  categories: CategoryOut[];
  onChange: (filters: FilterValues) => void;
  onReset: () => void;
}

export function ExpenseFilters({ filters, categories, onChange, onReset }: ExpenseFiltersProps) {
  const update = (key: keyof FilterValues, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Input
        label="Data inicial"
        type="date"
        value={filters.start}
        onChange={(e) => update("start", e.target.value)}
        className="w-full sm:w-40"
      />
      <Input
        label="Data final"
        type="date"
        value={filters.end}
        onChange={(e) => update("end", e.target.value)}
        className="w-full sm:w-40"
      />
      <Select
        label="Categoria"
        value={filters.categoria_id}
        onChange={(e) => update("categoria_id", e.target.value)}
        className="w-full sm:w-44"
      >
        <option value="">Todas</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nome}
          </option>
        ))}
      </Select>
      <Select
        label="Tipo"
        value={filters.transaction_type}
        onChange={(e) => update("transaction_type", e.target.value)}
        className="w-full sm:w-36"
      >
        <option value="">Todos</option>
        <option value="outcome">Despesa</option>
        <option value="income">Receita</option>
      </Select>
      <Button variant="ghost" size="sm" onClick={onReset} className="self-end mb-0.5">
        Limpar filtros
      </Button>
    </div>
  );
}
