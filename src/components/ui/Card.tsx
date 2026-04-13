import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border shadow dark:shadow-none p-6", className)}>
      {children}
    </div>
  );
}
