import { useMemo } from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import type { CardResponse } from "@/lib/api/types";

export interface CardComboboxProps {
  cards: CardResponse[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean | "true" | "false";
  className?: string;
}

export function CardCombobox({
  cards,
  value,
  onChange,
  placeholder = "Select a card",
  ...props
}: CardComboboxProps) {
  const options = useMemo<ComboboxOption<number>[]>(
    () =>
      cards.map((card) => ({
        value: card.id,
        label: `${card.alias} (${card.bank} •••• ${card.last_four_digits})`,
      })),
    [cards]
  );

  return (
    <Combobox
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      emptyState="No card found."
      searchPlaceholder="Search cards…"
      {...props}
    />
  );
}
