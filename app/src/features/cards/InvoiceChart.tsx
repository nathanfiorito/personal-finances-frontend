import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InvoiceDailyEntry, InvoicePredictionResponse, InvoiceTimelineResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/format/format-date";
import { formatMoney } from "@/lib/format/format-money";
import { cn } from "@/lib/utils";

export interface InvoiceChartProps {
  timeline: InvoiceTimelineResponse | null | undefined;
  prediction: InvoicePredictionResponse | null | undefined;
  isTimelineLoading?: boolean;
  isPredictionLoading?: boolean;
  className?: string;
}

const TOOLTIP_STYLE = {
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
} as const;

const CHART_HEIGHT = 260;

// ─── Tab 1: Current Invoice ───────────────────────────────────────────────────

interface CurrentChartDatum {
  date: string;
  label: string;
  accumulated: number;
}

function buildCurrentData(daily: InvoiceDailyEntry[]): CurrentChartDatum[] {
  return daily.map((entry) => ({
    date: entry.date,
    label: formatDate(entry.date, "dd/MM"),
    accumulated: Number(entry.accumulated),
  }));
}

function CurrentInvoiceTab({ daily }: { daily: InvoiceDailyEntry[] }) {
  const data = useMemo(() => buildCurrentData(daily), [daily]);

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[260px] items-center justify-center text-sm">
        No data for current period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatMoney(v, { withSymbol: false })}
          width={64}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value: number) => [formatMoney(String(value)), "Accumulated"]}
          labelFormatter={(label: string) => `Date: ${label}`}
        />
        <Area
          type="monotone"
          dataKey="accumulated"
          stroke="oklch(0.699 0.197 41)"
          strokeWidth={2}
          fill="oklch(0.699 0.197 41)"
          fillOpacity={0.15}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ─── Tab 2: Compare ───────────────────────────────────────────────────────────

interface CompareDatum {
  day: number;
  current: number | null;
  previous: number | null;
}

function buildCompareData(
  currentDaily: InvoiceDailyEntry[],
  previousDaily: InvoiceDailyEntry[]
): CompareDatum[] {
  const maxLen = Math.max(currentDaily.length, previousDaily.length);
  return Array.from({ length: maxLen }, (_, i) => ({
    day: i + 1,
    current: currentDaily[i] ? Number(currentDaily[i].accumulated) : null,
    previous: previousDaily[i] ? Number(previousDaily[i].accumulated) : null,
  }));
}

function CompareTab({
  currentDaily,
  previousDaily,
  currentTotal,
  previousTotal,
}: {
  currentDaily: InvoiceDailyEntry[];
  previousDaily: InvoiceDailyEntry[];
  currentTotal: string;
  previousTotal: string;
}) {
  const data = useMemo(
    () => buildCompareData(currentDaily, previousDaily),
    [currentDaily, previousDaily]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-6 rounded"
            style={{ background: "oklch(0.699 0.197 41)" }}
          />
          Current — {formatMoney(currentTotal)}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-6 rounded border-t-2 border-dashed"
            style={{ borderColor: "oklch(0.6 0.05 264)" }}
          />
          Previous — {formatMoney(previousTotal)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `Day ${v}`}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => formatMoney(v, { withSymbol: false })}
            width={64}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: number, name: string) => [
              formatMoney(String(value)),
              name === "current" ? "Current" : "Previous",
            ]}
            labelFormatter={(label: number) => `Day ${label}`}
          />
          <Line
            type="monotone"
            dataKey="current"
            stroke="oklch(0.699 0.197 41)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="oklch(0.6 0.05 264)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Tab 3: Prediction ────────────────────────────────────────────────────────

type ConfidenceLevel = "low" | "medium" | "high";

const CONFIDENCE_BADGE: Record<
  ConfidenceLevel,
  { label: string; className: string }
> = {
  low: {
    label: "Low confidence",
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  medium: {
    label: "Medium confidence",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  high: {
    label: "High confidence",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
};

interface PredictionDatum {
  day: number;
  actual: number | null;
  projected: number | null;
}

function buildPredictionData(
  daily: InvoiceDailyEntry[],
  predictedTotal: string
): PredictionDatum[] {
  const lastIndex = daily.length - 1;
  const lastAccumulated = lastIndex >= 0 ? Number(daily[lastIndex].accumulated) : 0;
  const predicted = Number(predictedTotal);

  const actualPoints: PredictionDatum[] = daily.map((entry, i) => ({
    day: i + 1,
    actual: Number(entry.accumulated),
    projected: null,
  }));

  // Add the bridge point and endpoint for projected line
  if (lastIndex >= 0) {
    // The last actual point also starts the projected line
    actualPoints[lastIndex].projected = lastAccumulated;
    // Add a final projected point at predicted total
    actualPoints.push({
      day: lastIndex + 2,
      actual: null,
      projected: predicted,
    });
  }

  return actualPoints;
}

function PredictionTab({
  daily,
  prediction,
  isPredictionLoading,
}: {
  daily: InvoiceDailyEntry[];
  prediction: InvoicePredictionResponse | null | undefined;
  isPredictionLoading?: boolean;
}) {
  const data = useMemo(
    () =>
      prediction ? buildPredictionData(daily, prediction.predicted_total) : [],
    [daily, prediction]
  );

  if (isPredictionLoading) {
    return <Skeleton className="h-[260px] w-full" />;
  }

  if (!prediction) {
    return (
      <div className="text-muted-foreground flex h-[260px] flex-col items-center justify-center gap-1 text-center text-sm">
        <p className="text-foreground font-medium">Not enough data for prediction</p>
        <p>At least 2 closed invoices needed.</p>
      </div>
    );
  }

  const confidenceKey = (
    prediction.confidence?.toLowerCase() as ConfidenceLevel | undefined
  ) ?? "low";
  const confidenceInfo =
    CONFIDENCE_BADGE[confidenceKey] ?? CONFIDENCE_BADGE.low;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium tabular-nums">
          Predicted: {formatMoney(prediction.predicted_total)}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            confidenceInfo.className
          )}
        >
          {confidenceInfo.label}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `Day ${v}`}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => formatMoney(v, { withSymbol: false })}
            width={64}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: number, name: string) => [
              formatMoney(String(value)),
              name === "actual" ? "Actual" : "Projected",
            ]}
            labelFormatter={(label: number) => `Day ${label}`}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="oklch(0.699 0.197 41)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="projected"
            stroke="oklch(0.699 0.197 41)"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
          <ReferenceLine
            y={Number(prediction.predicted_total)}
            stroke="oklch(0.6 0.05 264)"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{
              value: formatMoney(prediction.predicted_total),
              position: "insideTopRight",
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InvoiceChart({
  timeline,
  prediction,
  isTimelineLoading,
  isPredictionLoading,
  className,
}: InvoiceChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Invoice spending</CardTitle>
      </CardHeader>
      <CardContent>
        {isTimelineLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : !timeline ? (
          <div className="text-muted-foreground flex h-[260px] items-center justify-center text-sm">
            No invoice data available
          </div>
        ) : (
          <Tabs defaultValue="current">
            <TabsList>
              <TabsTrigger value="current">Current Invoice</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="prediction">Prediction</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="pt-4">
              <CurrentInvoiceTab daily={timeline.current.daily} />
            </TabsContent>

            <TabsContent value="compare" className="pt-4">
              <CompareTab
                currentDaily={timeline.current.daily}
                previousDaily={timeline.previous.daily}
                currentTotal={timeline.current.total}
                previousTotal={timeline.previous.total}
              />
            </TabsContent>

            <TabsContent value="prediction" className="pt-4">
              <PredictionTab
                daily={timeline.current.daily}
                prediction={prediction}
                isPredictionLoading={isPredictionLoading}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
