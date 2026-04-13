import { serverFetch } from "@/lib/api/server";
import { currentMonthRange } from "@/lib/utils";
import type { BffDashboardResponse } from "@/lib/types";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { OutcomeBreakdown } from "@/components/dashboard/OutcomeBreakdown";

export default async function DashboardPage() {
  const { start, end } = currentMonthRange();
  const data = await serverFetch<BffDashboardResponse>(`/api/v2/bff/dashboard?start=${start}&end=${end}`);

  const empty: BffDashboardResponse = { expense_summary: [], income_summary: [], transaction_count: 0 };
  const { expense_summary, income_summary, transaction_count } = data ?? empty;

  const totalIncome = income_summary.reduce((s, i) => s + parseFloat(i.total), 0);
  const totalExpenses = expense_summary.reduce((s, i) => s + parseFloat(i.total), 0);

  const monthLabel = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Dashboard</h1>
        <p className="text-sm text-neutral-500 dark:text-dark-muted mt-1 capitalize">{monthLabel}</p>
      </div>
      <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} transactionCount={transaction_count} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={expense_summary} />
        <OutcomeBreakdown data={expense_summary} />
      </div>
    </div>
  );
}
