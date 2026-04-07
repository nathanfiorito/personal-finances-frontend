"use client";

import { useCallback, useEffect, useState } from "react";
import { MonthlyItem, getMonthly } from "@/lib/api";
import { MonthlyBarChart } from "@/components/reports/MonthlyBarChart";
import { MonthlySummaryTable } from "@/components/reports/MonthlySummaryTable";
import { Spinner } from "@/components/ui/Spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export default function ReportsPage() {
  const { showToast } = useToast();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState<MonthlyItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (y: number) => {
      setLoading(true);
      try {
        const result = await getMonthly(y);
        setData(result);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao carregar relatório";
        showToast(msg, "error");
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    load(year);
  }, [year, load]);

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => (y < currentYear ? y + 1 : y));

  const totalYear = data.reduce((sum, item) => sum + parseFloat(item.total), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Relatórios</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-muted mt-1">
            Análise de gastos por período
          </p>
        </div>
        {/* Year selector */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={prevYear} disabled={loading} aria-label="Ano anterior">
            <ChevronLeft size={16} />
          </Button>
          <span className="text-lg font-bold text-neutral-900 dark:text-dark-primary w-16 text-center">
            {year}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={nextYear}
            disabled={loading || year >= currentYear}
            aria-label="Próximo ano"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" className="text-brand-500" />
        </div>
      ) : (
        <>
          {/* Summary stat */}
          {data.length > 0 && (
            <div className="bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border rounded-xl shadow p-4 flex items-center justify-between">
              <span className="text-sm text-neutral-500 dark:text-dark-muted font-medium">
                Total em {year}
              </span>
              <span className="text-xl font-bold text-neutral-900 dark:text-dark-primary">
                {totalYear.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
          )}

          <MonthlyBarChart data={data} year={year} />
          <MonthlySummaryTable data={data} />
        </>
      )}
    </div>
  );
}
