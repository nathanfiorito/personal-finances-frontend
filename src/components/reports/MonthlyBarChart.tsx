"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MonthlyItem } from "@/lib/api";
import { Card } from "@/components/ui/Card";

interface MonthlyBarChartProps {
  data: MonthlyItem[];
  year: number;
}

const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border rounded-lg px-3 py-2 shadow text-sm">
        <p className="font-medium text-neutral-700 dark:text-dark-secondary">{label}</p>
        <p className="font-bold text-brand-500">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function MonthlyBarChart({ data, year }: MonthlyBarChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-primary mb-4">
          Gastos Mensais — {year}
        </h3>
        <div className="flex items-center justify-center h-48 text-neutral-400 dark:text-dark-muted text-sm">
          Nenhum dado disponível para {year}
        </div>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    month: MONTH_NAMES[item.month - 1],
    total: parseFloat(item.total),
  }));

  const maxVal = Math.max(...chartData.map((d) => d.total));

  return (
    <Card>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-primary mb-6">
        Gastos Mensais — {year}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-neutral-100 dark:text-dark-border"
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "currentColor" }}
            className="text-neutral-500 dark:text-dark-secondary"
          />
          <YAxis
            tickFormatter={(v) =>
              v.toLocaleString("pt-BR", { notation: "compact", style: "currency", currency: "BRL" })
            }
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-neutral-500 dark:text-dark-secondary"
            width={72}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.total === maxVal ? "#EA580C" : "#F97316"}
                fillOpacity={entry.total === maxVal ? 1 : 0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
