import { formatCurrency } from "@/lib/utils";
import type { ReportMonth } from "@/lib/types";

const MONTH_LABELS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function MonthlySummaryTable({ data }: { data: ReportMonth[] }) {
  if (!data.length) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-dark-border">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 dark:bg-dark-surface2 text-xs font-medium uppercase text-neutral-500 dark:text-dark-muted">
          <tr>
            {["Month","Income","Expenses","Net"].map(h => (
              <th key={h} className="px-4 py-3 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-dark-border bg-white dark:bg-dark-surface">
          {data.map(row => {
            const net = parseFloat(row.income_total) - parseFloat(row.expense_total);
            return (
              <tr key={row.month} className="hover:bg-neutral-50 dark:hover:bg-dark-surface2">
                <td className="px-4 py-3 font-medium">{MONTH_LABELS[row.month - 1]}</td>
                <td className="px-4 py-3 font-bold text-success">{formatCurrency(row.income_total)}</td>
                <td className="px-4 py-3 font-bold text-danger">{formatCurrency(row.expense_total)}</td>
                <td className={`px-4 py-3 font-bold ${net >= 0 ? "text-brand-500" : "text-danger"}`}>{formatCurrency(net)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
