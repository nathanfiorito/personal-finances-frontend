import { formatCurrency } from "@/lib/utils";
import type { SummaryItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function OutcomeBreakdown({ data }: { data: SummaryItem[] }) {
  const total = data.reduce((sum, i) => sum + parseFloat(i.total), 0);
  const sorted = [...data].sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
  return (
    <Card>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-primary mb-4">Top expenses this month</h3>
      {!sorted.length ? (
        <div className="flex items-center justify-center h-48 text-neutral-400 dark:text-dark-muted text-sm">No data for this month</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map(item => {
            const pct = total > 0 ? (parseFloat(item.total) / total) * 100 : 0;
            return (
              <li key={item.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-700 dark:text-dark-secondary font-medium">{item.category}</span>
                  <span className="font-bold text-neutral-900 dark:text-dark-primary">{formatCurrency(item.total)}</span>
                </div>
                <div className="h-1.5 bg-neutral-100 dark:bg-dark-surface2 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct.toFixed(1)}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
