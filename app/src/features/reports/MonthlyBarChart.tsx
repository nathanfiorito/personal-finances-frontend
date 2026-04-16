import { useMemo } from "react";
import Big from "big.js";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MonthlyReportEntry } from "@/lib/api/types";
import { formatMoney, sumAmounts } from "@/lib/format/format-money";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export interface MonthlyBarChartProps {
  entries: MonthlyReportEntry[] | undefined;
  year: number;
  isLoading?: boolean;
  className?: string;
}

interface BarDatum {
  month: string;
  monthIndex: number;
  value: number;
  raw: string;
}

function buildSeries(entries: MonthlyReportEntry[] | undefined): BarDatum[] {
  const byMonth = new Map<number, MonthlyReportEntry>();
  if (entries) {
    for (const entry of entries) {
      byMonth.set(entry.month, entry);
    }
  }
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const entry = byMonth.get(month);
    const raw = entry?.total ?? "0";
    return {
      month: MONTH_LABELS[index],
      monthIndex: month,
      value: Number(new Big(raw).toFixed(2)),
      raw,
    };
  });
}

export function MonthlyBarChart({ entries, year, isLoading, className }: MonthlyBarChartProps) {
  const data = useMemo(() => buildSeries(entries), [entries]);
  const total = useMemo(
    () => (entries ? sumAmounts(entries.map((entry) => entry.total)) : "0"),
    [entries]
  );
  const hasAny = entries && entries.length > 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Monthly spend</CardTitle>
        <CardDescription>
          {isLoading
            ? "Loading…"
            : hasAny
              ? `${year} — ${formatMoney(total)} total`
              : `No spending recorded in ${year}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={60}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(value as number)
                  }
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                  contentStyle={{
                    background: "var(--popover)",
                    color: "var(--popover-foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => formatMoney(String(value))}
                  labelFormatter={(label) => `${label} / ${year}`}
                />
                <Bar
                  dataKey="value"
                  fill="oklch(0.699 0.197 41)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
