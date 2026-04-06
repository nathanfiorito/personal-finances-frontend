import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "danger" | "warning" | "info";
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  const variants = {
    default:
      "bg-neutral-100 text-neutral-700 dark:bg-dark-surface2 dark:text-dark-secondary",
    success:
      "bg-success-bg text-success dark:bg-success-bg-dark dark:text-success-dark",
    danger:
      "bg-danger-bg text-danger dark:bg-danger-bg-dark dark:text-danger-dark",
    warning:
      "bg-warning-bg text-warning dark:bg-warning-bg-dark dark:text-warning-dark",
    info:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
