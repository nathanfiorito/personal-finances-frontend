import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpendByCategoryChart } from "@/features/dashboard/SpendByCategoryChart";
import { useSummary } from "@/features/dashboard/use-summary";
import { MonthlyBarChart } from "@/features/reports/MonthlyBarChart";
import { YearPicker } from "@/features/reports/YearPicker";
import { useMonthlyReport } from "@/features/reports/use-monthly-report";

export default function ReportsPage() {
  const [year, setYear] = useState(() => new Date().getFullYear());

  const monthlyQuery = useMonthlyReport({ year });

  const yearRange = useMemo(
    () => ({ start: `${year}-01-01`, end: `${year}-12-31` }),
    [year]
  );
  const summaryQuery = useSummary(yearRange);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-muted-foreground text-sm">Annual breakdown of your spending</p>
        </div>
        <YearPicker value={year} onChange={setYear} />
      </header>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="categories">By category</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="space-y-4">
          <MonthlyBarChart
            entries={monthlyQuery.data}
            year={year}
            isLoading={monthlyQuery.isPending}
          />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <SpendByCategoryChart
            entries={summaryQuery.data}
            isLoading={summaryQuery.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
