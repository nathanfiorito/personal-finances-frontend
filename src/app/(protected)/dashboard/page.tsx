import { createClient } from "@/lib/supabase/server";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { BffDashboardResponse, SummaryItem } from "@/lib/api";

async function fetchDashboard(
  jwt: string,
  start: string,
  end: string
): Promise<BffDashboardResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const empty: BffDashboardResponse = { outcome_summary: [], income_summary: [], transaction_count: 0 };
  try {
    const res = await fetch(
      `${baseUrl}/api/v2/bff/dashboard?start=${start}&end=${end}`,
      { headers: { Authorization: `Bearer ${jwt}` }, cache: "no-store" }
    );
    if (!res.ok) return empty;
    return res.json();
  } catch {
    return empty;
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const jwt = session?.access_token ?? "";

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const start = `${year}-${month}-01`;
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  const end = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const { outcome_summary, income_summary, transaction_count } = await fetchDashboard(jwt, start, end);

  const totalOutcome = outcome_summary.reduce((sum, item) => sum + parseFloat(item.total), 0);
  const totalIncome = income_summary.reduce((sum, item) => sum + parseFloat(item.total), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Dashboard</h1>
        <p className="text-sm text-neutral-500 dark:text-dark-muted mt-1 capitalize">{monthLabel}</p>
      </div>

      <SummaryCards
        totalIncome={totalIncome}
        totalOutcome={totalOutcome}
        transactionCount={transaction_count}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={outcome_summary} />

        <div className="bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border rounded-xl shadow p-6">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-primary mb-4">
            Top expenses this month
          </h3>
          {outcome_summary.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-neutral-400 dark:text-dark-muted text-sm">
              No data available for this month
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {outcome_summary
                .slice()
                .sort((a, b) => parseFloat(b.total) - parseFloat(a.total))
                .map((item: SummaryItem) => {
                  const pct = totalOutcome > 0 ? (parseFloat(item.total) / totalOutcome) * 100 : 0;
                  return (
                    <li key={item.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-700 dark:text-dark-secondary font-medium">
                          {item.category}
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-dark-primary">
                          {parseFloat(item.total).toLocaleString("en-US", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-100 dark:bg-dark-surface2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full transition-all"
                          style={{ width: `${pct.toFixed(1)}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
