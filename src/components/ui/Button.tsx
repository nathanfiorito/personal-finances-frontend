import { ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, children, disabled, className = "", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500",
      secondary:
        "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-dark-surface2 dark:hover:bg-dark-border dark:text-dark-primary focus:ring-neutral-400",
      danger:
        "bg-danger hover:bg-red-700 text-white dark:bg-danger-dark dark:hover:bg-red-500 focus:ring-danger",
      ghost:
        "bg-transparent hover:bg-neutral-100 dark:hover:bg-dark-surface2 text-neutral-700 dark:text-dark-secondary focus:ring-neutral-400",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 min-h-[36px]",
      md: "text-sm px-4 py-2 min-h-[44px]",
      lg: "text-base px-5 py-2.5 min-h-[44px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
