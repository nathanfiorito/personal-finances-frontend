"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { ReportMonth } from "@/lib/types";
import { Card } from "@/components/ui/Card";

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function MonthlyBarChart({ data }: { data: ReportMonth[] }) {
  const chartData = data.map(d => ({
    month: MONTH_LABELS[d.month - 1],
    Income: parseFloat(d.income_total),
    Expenses: parseFloat(d.expense_total),
  }));
  return (
    <Card>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-primary mb-4">Monthly overview</h3>
      {!chartData.length ? (
        <div className="flex items-center justify-center h-48 text-neutral-400 dark:text-dark-muted text-sm">No data for this year</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={v => `R$${v}`} tick={{ fontSize: 11 }} width={60} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="Income" fill="#16A34A" radius={[3,3,0,0]} />
            <Bar dataKey="Expenses" fill="#F97316" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
