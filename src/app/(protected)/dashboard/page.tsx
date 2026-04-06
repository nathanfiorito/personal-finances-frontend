import { createClient } from "@/lib/supabase/server";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { SummaryItem } from "@/lib/api";

async function fetchSummary(jwt: string, start: string, end: string): Promise<SummaryItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/api/reports/summary?start=${start}&end=${end}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function fetchExpenseCount(jwt: string, start: string, end: string): Promise<number> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(
      `${baseUrl}/api/expenses?start=${start}&end=${end}&page=1&page_size=1`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total ?? 0;
  } catch {
    return 0;
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const jwt = session?.access_token ?? "";

  // Current month range
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const start = `${year}-${month}-01`;
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  const end = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

  const monthLabel = now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const [summary, transactionCount] = await Promise.all([
    fetchSummary(jwt, start, end),
    fetchExpenseCount(jwt, start, end),
  ]);

  const totalMonth = summary.reduce((sum, item) => sum + parseFloat(item.total), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Dashboard</h1>
        <p className="text-sm text-neutral-500 dark:text-dark-muted mt-1 capitalize">{monthLabel}</p>
      </div>

      <SummaryCards
        totalMonth={totalMonth}
        transactionCount={transactionCount}
        monthLabel={monthLabel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={summary} />

        {/* Top categories list */}
        <div className="bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border rounded-xl shadow p-6">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-primary mb-4">
            Maiores gastos do mês
          </h3>
          {summary.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-neutral-400 dark:text-dark-muted text-sm">
              Nenhum dado disponível para este mês
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {summary
                .slice()
                .sort((a, b) => parseFloat(b.total) - parseFloat(a.total))
                .map((item) => {
                  const pct = totalMonth > 0 ? (parseFloat(item.total) / totalMonth) * 100 : 0;
                  return (
                    <li key={item.categoria}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-700 dark:text-dark-secondary font-medium">
                          {item.categoria}
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-dark-primary">
                          {parseFloat(item.total).toLocaleString("pt-BR", {
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
