"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getCategoryColor } from "@/lib/chart-colors";
import { formatCurrency } from "@/lib/utils";
import type { SummaryItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function CategoryPieChart({ data }: { data: SummaryItem[] }) {
  if (!data.length) {
    return (
      <Card>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-primary mb-4">Expenses by category</h3>
        <div className="flex items-center justify-center h-48 text-neutral-400 dark:text-dark-muted text-sm">No data for this month</div>
      </Card>
    );
  }
  const chartData = data.map(d => ({ name: d.category, value: parseFloat(d.total) }));
  return (
    <Card>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-primary mb-4">Expenses by category</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
            {chartData.map((entry, i) => (
              <Cell key={entry.name} fill={getCategoryColor(entry.name, i)} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
