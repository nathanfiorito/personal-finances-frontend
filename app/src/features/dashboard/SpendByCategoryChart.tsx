import { useMemo } from "react";
import Big from "big.js";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SummaryEntry } from "@/lib/api/types";
import { formatMoney, sumAmounts } from "@/lib/format/format-money";

const CATEGORY_COLORS = [
  "oklch(0.699 0.197 41)", // brand orange
  "oklch(0.745 0.170 264)",
  "oklch(0.725 0.174 138)",
  "oklch(0.745 0.170 320)",
  "oklch(0.745 0.170 205)",
  "oklch(0.770 0.160 85)",
  "oklch(0.725 0.174 15)",
  "oklch(0.745 0.140 160)",
];

export interface SpendByCategoryChartProps {
  entries: SummaryEntry[] | undefined;
  isLoading?: boolean;
  className?: string;
}

interface SliceDatum {
  name: string;
  value: number;
  raw: string;
  count: number;
}

export function SpendByCategoryChart({
  entries,
  isLoading,
  className,
}: SpendByCategoryChartProps) {
  const data = useMemo<SliceDatum[]>(() => {
    if (!entries) return [];
    return entries
      .filter((entry) => new Big(entry.total).gt(0))
      .map((entry) => ({
        name: entry.category,
        value: Number(new Big(entry.total).toFixed(2)),
        raw: entry.total,
        count: entry.count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [entries]);

  const total = useMemo(
    () => (entries ? sumAmounts(entries.map((entry) => entry.total)) : "0"),
    [entries]
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Spend by category</CardTitle>
        <CardDescription>
          {isLoading
            ? "Loading…"
            : data.length === 0
              ? "No spending in this period"
              : `${data.length} categories`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : data.length === 0 ? (
          <div className="text-muted-foreground flex h-[260px] items-center justify-center text-sm">
            No data
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr,1fr] lg:items-center">
            <div className="relative h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="90%"
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.map((_, index) => (
                      <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      color: "var(--popover-foreground)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => formatMoney(String(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-muted-foreground text-xs">Total</span>
                <span className="text-xl font-semibold tabular-nums">
                  {formatMoney(total)}
                </span>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              {data.map((slice, index) => (
                <li key={slice.name} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden
                      className="size-3 shrink-0 rounded-full"
                      style={{
                        background: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                      }}
                    />
                    <span className="truncate">{slice.name}</span>
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatMoney(slice.raw)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
