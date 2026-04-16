import { useMemo, useState } from "react";
import Big from "big.js";
import { Receipt, Tag, TrendingUp, Wallet } from "lucide-react";
import { KpiCard, KpiCardSkeleton } from "@/features/dashboard/KpiCard";
import { PeriodPicker } from "@/features/dashboard/PeriodPicker";
import { RecentTransactionsList } from "@/features/dashboard/RecentTransactionsList";
import { SpendByCategoryChart } from "@/features/dashboard/SpendByCategoryChart";
import { PERIOD_LABELS, rangeForPreset, type PeriodPreset } from "@/features/dashboard/period";
import { useRecentTransactions } from "@/features/dashboard/use-recent-transactions";
import { useSummary } from "@/features/dashboard/use-summary";
import type { SummaryEntry } from "@/lib/api/types";
import { formatMoney, sumAmounts } from "@/lib/format/format-money";

interface DashboardKpis {
  total: string;
  transactionCount: number;
  average: string;
  topCategory: SummaryEntry | null;
}

function computeKpis(entries: SummaryEntry[] | undefined): DashboardKpis | null {
  if (!entries) return null;
  const total = sumAmounts(entries.map((entry) => entry.total));
  const transactionCount = entries.reduce((sum, entry) => sum + entry.count, 0);
  const average =
    transactionCount === 0 ? "0" : new Big(total).div(transactionCount).toFixed(2);
  const topCategory =
    entries.length === 0
      ? null
      : [...entries].sort((a, b) => (new Big(b.total).gt(a.total) ? 1 : -1))[0];
  return { total, transactionCount, average, topCategory };
}

function topCategoryHint(topCategory: SummaryEntry | null, total: string): string | null {
  if (!topCategory) return null;
  const totalBig = new Big(total);
  if (totalBig.eq(0)) return formatMoney(topCategory.total);
  const share = new Big(topCategory.total).div(totalBig).times(100).toFixed(0);
  return `${formatMoney(topCategory.total)} (${share}%)`;
}

export default function DashboardPage() {
  const [preset, setPreset] = useState<PeriodPreset>("this-month");
  const range = useMemo(() => rangeForPreset(preset), [preset]);

  const summaryQuery = useSummary(range);
  const recentQuery = useRecentTransactions({ limit: 5 });

  const kpis = computeKpis(summaryQuery.data);
  const isLoading = summaryQuery.isPending;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">{PERIOD_LABELS[preset]}</p>
        </div>
        <PeriodPicker value={preset} onChange={setPreset} />
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !kpis ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              label="Total spent"
              value={formatMoney(kpis.total)}
              hint={PERIOD_LABELS[preset]}
              icon={<Wallet />}
            />
            <KpiCard
              label="Transactions"
              value={kpis.transactionCount}
              hint="in the selected period"
              icon={<Receipt />}
            />
            <KpiCard
              label="Avg. transaction"
              value={formatMoney(kpis.average)}
              hint="per transaction"
              icon={<TrendingUp />}
            />
            <KpiCard
              label="Top category"
              value={kpis.topCategory?.category ?? "—"}
              hint={topCategoryHint(kpis.topCategory, kpis.total) ?? undefined}
              icon={<Tag />}
            />
          </>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <SpendByCategoryChart
          entries={summaryQuery.data}
          isLoading={summaryQuery.isPending}
          className="lg:col-span-3"
        />
        <RecentTransactionsList
          transactions={recentQuery.data}
          isLoading={recentQuery.isPending}
          className="lg:col-span-2"
        />
      </section>
    </div>
  );
}
