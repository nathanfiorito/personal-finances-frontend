import { useMemo, useState, type ReactNode } from "react";
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
import { cn } from "@/lib/utils";

const TRIGGER_CLASS =
  "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

export interface ComboboxOption<T = string | number> {
  value: T;
  label: string;
  description?: string;
}

export interface ComboboxProps<T extends string | number = string | number> {
  options: ComboboxOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyState?: ReactNode;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean | "true" | "false";
  className?: string;
}

export function Combobox<T extends string | number = string | number>({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyState = "No results.",
  disabled,
  id,
  className,
  ...props
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

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
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) overflow-hidden p-0"
        align="start"
      >
        <Command className="bg-transparent p-0">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyState}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <CommandItem
                    key={String(option.value)}
                    value={option.label}
                    onSelect={() => {
                      onChange(isSelected ? null : option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn("mr-2", isSelected ? "opacity-100" : "opacity-0")}
                    />
                    <span className="flex-1 truncate">{option.label}</span>
                    {option.description ? (
                      <span className="text-muted-foreground ml-2 text-xs">
                        {option.description}
                      </span>
                    ) : null}
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
