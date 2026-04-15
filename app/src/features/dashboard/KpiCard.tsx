import type { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  trend?: {
    direction: "up" | "down";
    label: string;
    tone?: "positive" | "negative" | "neutral";
  };
  icon?: ReactNode;
  className?: string;
}

export function KpiCard({ label, value, hint, trend, icon, className }: KpiCardProps) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
          {value}
        </CardTitle>
        {icon ? (
          <div className="text-muted-foreground absolute top-4 right-4 [&>svg]:size-4">
            {icon}
          </div>
        ) : null}
      </CardHeader>
      {(hint || trend) && (
        <CardContent className="text-muted-foreground flex items-center gap-2 text-xs">
          {trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium",
                trend.tone === "positive" &&
                  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                trend.tone === "negative" &&
                  "bg-destructive/10 text-destructive",
                (!trend.tone || trend.tone === "neutral") && "bg-muted text-foreground/80"
              )}
            >
              {trend.direction === "up" ? (
                <ArrowUp className="size-3" />
              ) : (
                <ArrowDown className="size-3" />
              )}
              {trend.label}
            </span>
          ) : null}
          {hint ? <span>{hint}</span> : null}
        </CardContent>
      )}
    </Card>
  );
}

export function KpiCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-8 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}
