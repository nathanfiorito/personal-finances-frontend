import { cn } from "@/lib/utils";

type BadgeVariant = "brand" | "income" | "expense" | "active" | "inactive" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  brand:    "bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-400",
  income:   "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  expense:  "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  active:   "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  inactive: "bg-neutral-100 text-neutral-500 dark:bg-dark-surface2 dark:text-dark-muted",
  default:  "bg-neutral-100 text-neutral-700 dark:bg-dark-surface2 dark:text-dark-secondary",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
