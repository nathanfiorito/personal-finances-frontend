import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
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

const TRIGGER_CLASS =
  "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

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
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(TRIGGER_CLASS, className)}
          {...props}
        >
          <span className={cn("truncate", !active && "text-muted-foreground")}>
            {active?.name ?? placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
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
