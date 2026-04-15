import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CategoryResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

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
  disabled,
  id,
  className,
  ...props
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const active = categories.find((category) => category.id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between font-normal", className)}
          {...props}
        >
          <span className={cn("truncate", !active && "text-muted-foreground")}>
            {active?.name ?? placeholder}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search…" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => {
                const selected = category.id === value;
                return (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      onChange(selected ? null : category.id);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2", selected ? "opacity-100" : "opacity-0")} />
                    {category.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
