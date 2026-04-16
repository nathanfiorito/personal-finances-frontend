import { CalendarDays, Clock, CreditCard } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { KpiCard, KpiCardSkeleton } from "@/features/dashboard/KpiCard";
import { formatDate } from "@/lib/format/format-date";
import { formatMoney } from "@/lib/format/format-money";
import { cn } from "@/lib/utils";

export interface InvoiceKpiRowProps {
  total: string | null;
  dueDate: string | null;
  closingDate: string | null;
  isLoading?: boolean;
  className?: string;
}

function daysRemaining(closingDate: string | null): string {
  if (!closingDate) return "—";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const closing = parseISO(closingDate);
  const diff = differenceInDays(closing, today);
  if (diff < 0) return "Closed";
  if (diff === 0) return "Closes today";
  return `${diff} day${diff === 1 ? "" : "s"}`;
}

export function InvoiceKpiRow({
  total,
  dueDate,
  closingDate,
  isLoading,
  className,
}: InvoiceKpiRowProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}>
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}>
      <KpiCard
        label="Current Invoice"
        value={total ? formatMoney(total) : "—"}
        icon={<CreditCard />}
      />
      <KpiCard
        label="Due Date"
        value={dueDate ? formatDate(dueDate) : "—"}
        icon={<CalendarDays />}
      />
      <KpiCard
        label="Days Remaining"
        value={daysRemaining(closingDate)}
        hint={closingDate ? `Closes on ${formatDate(closingDate)}` : undefined}
        icon={<Clock />}
      />
    </div>
  );
}
