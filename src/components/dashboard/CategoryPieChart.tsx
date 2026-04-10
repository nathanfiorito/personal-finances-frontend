"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getCategoryColor } from "@/lib/chart-colors";
import { SummaryItem } from "@/lib/api";
import { Card } from "@/components/ui/Card";

interface CategoryPieChartProps {
  data: SummaryItem[];
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border rounded-lg px-3 py-2 shadow text-sm">
        <p className="font-medium text-neutral-800 dark:text-dark-primary">{name}</p>
        <p className="font-bold text-brand-500">{formatCurrency(value)}</p>
      </div>
    );
  }
  return null;
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-primary mb-4">
          Spending by Category
        </h3>
        <div className="flex items-center justify-center h-48 text-neutral-400 dark:text-dark-muted text-sm">
          No data available for this month
        </div>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    value: parseFloat(item.total),
    color: getCategoryColor(item.category),
  }));

  return (
    <Card>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-primary mb-4">
        Spending by Category
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-sm text-neutral-600 dark:text-dark-secondary">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
