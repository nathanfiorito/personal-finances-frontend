import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "destructive" | "ghost";
  size?: "sm" | "md";
  loading?: boolean;
}

export function Button({
  variant = "primary", size = "md", loading, disabled, className, children, ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary:     "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-sm",
    destructive: "bg-danger hover:bg-danger/90 text-white shadow-sm",
    ghost:       "bg-transparent hover:bg-neutral-100 dark:hover:bg-dark-surface2 text-neutral-700 dark:text-dark-secondary border border-neutral-200 dark:border-dark-border",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm" };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
