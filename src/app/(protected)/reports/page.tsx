import { serverFetch } from "@/lib/api/server";
import type { ReportMonth } from "@/lib/types";
import { MonthlyBarChart } from "@/components/reports/MonthlyBarChart";
import { MonthlySummaryTable } from "@/components/reports/MonthlySummaryTable";
import { YearSelector } from "@/components/reports/YearSelector";

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const year = params.year ? Number(params.year) : new Date().getFullYear();
  const data = await serverFetch<ReportMonth[]>(`/api/v2/bff/reports?year=${year}`);
  const months = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Reports</h1>
        <YearSelector currentYear={year} />
      </div>
      <MonthlyBarChart data={months} />
      <MonthlySummaryTable data={months} />
    </div>
  );
}
