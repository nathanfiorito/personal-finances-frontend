import { forwardRef, useState } from "react";
import Big from "big.js";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AmountInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (nextAmount: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
  "aria-invalid"?: boolean | "true" | "false";
  className?: string;
}

function formatDisplay(amount: string): string {
  if (!amount) return "";
  try {
    const formatted = new Big(amount).toFixed(2);
    return formatted.replace(".", ",");
  } catch {
    return amount;
  }
}

function normalizeInput(raw: string): string {
  const cleaned = raw.replace(/[^\d,.-]/g, "").replace(",", ".");
  if (!cleaned || cleaned === "-" || cleaned === ".") return "";
  try {
    return new Big(cleaned).toFixed(2);
  } catch {
    return "";
  }
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(function AmountInput(
  { value, defaultValue, onChange, onBlur, className, ...props },
  ref
) {
  const isControlled = value !== undefined;
  const [isFocused, setIsFocused] = useState(false);
  const [lastSyncedValue, setLastSyncedValue] = useState<string | undefined>(value);
  const [display, setDisplay] = useState<string>(() =>
    formatDisplay(value ?? defaultValue ?? "")
  );

  if (isControlled && !isFocused && value !== lastSyncedValue) {
    setLastSyncedValue(value);
    setDisplay(formatDisplay(value ?? ""));
  }

  return (
    <Input
      ref={ref}
      inputMode="decimal"
      type="text"
      value={display}
      onFocus={() => setIsFocused(true)}
      onChange={(event) => {
        const raw = event.target.value;
        setDisplay(raw);
        onChange?.(normalizeInput(raw));
      }}
      onBlur={() => {
        setIsFocused(false);
        const normalized = normalizeInput(display);
        setDisplay(formatDisplay(normalized));
        setLastSyncedValue(normalized);
        onChange?.(normalized);
        onBlur?.();
      }}
      className={cn("tabular-nums", className)}
      {...props}
    />
  );
});
