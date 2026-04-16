import { useMemo } from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import type { CategoryResponse } from "@/lib/api/types";

export interface CategoryComboboxProps {
  categories: CategoryResponse[];
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean | "true" | "false";
  className?: string;
}

export function CategoryCombobox({
  categories,
  value,
  onChange,
  placeholder = "Select a category",
  ...props
}: CategoryComboboxProps) {
  const options = useMemo<ComboboxOption<number>[]>(
    () => categories.map((category) => ({ value: category.id, label: category.name })),
    [categories]
  );

  return (
    <Combobox
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      emptyState="No category found."
      searchPlaceholder="Search categories…"
      {...props}
    />
  );
}
