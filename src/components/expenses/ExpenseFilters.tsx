"use client";

import { CategoryOut } from "@/lib/api";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface FilterValues {
  start: string;
  end: string;
  category_id: string;
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
        label="Start date"
        type="date"
        value={filters.start}
        onChange={(e) => update("start", e.target.value)}
        className="w-full sm:w-40"
      />
      <Input
        label="End date"
        type="date"
        value={filters.end}
        onChange={(e) => update("end", e.target.value)}
        className="w-full sm:w-40"
      />
      <Select
        label="Category"
        value={filters.category_id}
        onChange={(e) => update("category_id", e.target.value)}
        className="w-full sm:w-44"
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Select>
      <Select
        label="Type"
        value={filters.transaction_type}
        onChange={(e) => update("transaction_type", e.target.value)}
        className="w-full sm:w-36"
      >
        <option value="">All</option>
        <option value="outcome">Expense</option>
        <option value="income">Income</option>
      </Select>
      <Button variant="ghost" size="sm" onClick={onReset} className="self-end mb-0.5">
        Clear filters
      </Button>
    </div>
  );
}
