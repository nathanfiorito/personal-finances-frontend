import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getBankNames } from "@/lib/bank-registry";
import { cn } from "@/lib/utils";

const TRIGGER_CLASS =
  "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

export interface BankComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean | "true" | "false";
  className?: string;
}

export function BankCombobox({
  value,
  onChange,
  placeholder = "Select or type a bank",
  disabled,
  id,
  className,
  ...props
}: BankComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const bankNames = useMemo(() => getBankNames(), []);

  // Sync inputValue when outer value changes (e.g. form reset)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSelect = (selectedBank: string) => {
    onChange(selectedBank);
    setInputValue(selectedBank);
    setOpen(false);
  };

  const handleInputChange = (search: string) => {
    setInputValue(search);
    // Immediately propagate free text to the form field
    onChange(search);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    // When closing without selecting, keep the typed value
    if (!nextOpen && inputValue !== value) {
      onChange(inputValue);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
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
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) overflow-hidden p-0"
        align="start"
      >
        <Command className="bg-transparent p-0" shouldFilter={false}>
          <CommandInput
            placeholder="Search or type a bank…"
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            {bankNames.filter((b) =>
              b.toLowerCase().includes(inputValue.toLowerCase())
            ).length === 0 ? (
              inputValue.trim() ? (
                <CommandGroup>
                  <CommandItem value={inputValue} onSelect={() => handleSelect(inputValue)}>
                    Use &ldquo;{inputValue}&rdquo;
                  </CommandItem>
                </CommandGroup>
              ) : (
                <CommandEmpty>Type a bank name.</CommandEmpty>
              )
            ) : (
              <CommandGroup>
                {bankNames
                  .filter((b) => b.toLowerCase().includes(inputValue.toLowerCase()))
                  .map((bank) => (
                    <CommandItem
                      key={bank}
                      value={bank}
                      data-checked={bank === value ? "true" : undefined}
                      onSelect={() => handleSelect(bank)}
                    >
                      {bank}
                    </CommandItem>
                  ))}
                {inputValue.trim() &&
                  !bankNames.some(
                    (b) => b.toLowerCase() === inputValue.toLowerCase()
                  ) && (
                    <CommandItem
                      value={inputValue}
                      onSelect={() => handleSelect(inputValue)}
                    >
                      Use &ldquo;{inputValue}&rdquo;
                    </CommandItem>
                  )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
