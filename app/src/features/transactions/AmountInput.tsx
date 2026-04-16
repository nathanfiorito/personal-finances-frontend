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
    const normalized = new Big(amount).toFixed(2);
    const negative = normalized.startsWith("-");
    const absolute = negative ? normalized.slice(1) : normalized;
    const [intPart, decPart] = absolute.split(".");
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${negative ? "-" : ""}${withThousands},${decPart}`;
  } catch {
    return amount;
  }
}

function normalizeInput(raw: string): string {
  const cleaned = raw.replace(/[^\d,.-]/g, "");
  if (!cleaned || cleaned === "-") return "";
  const parseable = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;
  if (parseable === "." || parseable === "-.") return "";
  try {
    return new Big(parseable).toFixed(2);
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
