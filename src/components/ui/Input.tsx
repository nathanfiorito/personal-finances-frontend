import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-neutral-700 dark:text-dark-secondary">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md border bg-neutral-50 dark:bg-dark-surface2 px-3 py-2 text-sm text-neutral-900 dark:text-dark-primary",
          "border-neutral-200 dark:border-dark-border placeholder:text-neutral-400",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
          error && "border-danger focus:ring-danger",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
