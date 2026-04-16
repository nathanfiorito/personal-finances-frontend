import { useMemo } from "react";
import Big from "big.js";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { InvoiceTransactionResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/format/format-date";
import { formatMoney } from "@/lib/format/format-money";
import { cn } from "@/lib/utils";

export interface InvoiceTransactionListProps {
  transactions: InvoiceTransactionResponse[];
  isLoading?: boolean;
  className?: string;
}

interface DayGroup {
  date: string;
  transactions: InvoiceTransactionResponse[];
  dailyTotal: string;
}

function groupByDay(transactions: InvoiceTransactionResponse[]): DayGroup[] {
  const groups = new Map<string, InvoiceTransactionResponse[]>();
  for (const tx of transactions) {
    const list = groups.get(tx.date);
    if (list) {
      list.push(tx);
    } else {
      groups.set(tx.date, [tx]);
    }
  }
  const ordered = [...groups.entries()].sort(([a], [b]) => (a < b ? 1 : -1));
  return ordered.map(([date, items]) => {
    const total = items.reduce(
      (sum, tx) => sum.plus(new Big(tx.amount)),
      new Big(0)
    );
    return { date, transactions: items, dailyTotal: total.toFixed(2) };
  });
}

function displayLabel(tx: InvoiceTransactionResponse): string {
  return tx.establishment ?? tx.description ?? "—";
}

function TransactionRow({ tx }: { tx: InvoiceTransactionResponse }) {
  return (
    <li className="flex items-start justify-between gap-3 px-4 py-3 sm:px-6">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium">{displayLabel(tx)}</p>
        <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
          <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
            {tx.category}
          </Badge>
          {tx.description && tx.establishment ? (
            <span className="truncate">{tx.description}</span>
          ) : null}
        </div>
      </div>
      <span className="font-medium tabular-nums">{formatMoney(tx.amount)}</span>
    </li>
  );
}

function LoadingState({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 2 }).map((_, groupIdx) => (
          <div key={groupIdx} className="overflow-hidden rounded-lg border">
            <div className="border-border bg-muted/30 flex items-center justify-between gap-3 border-b px-4 py-2 sm:px-6">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            <ul className="divide-border divide-y">
              {Array.from({ length: 3 }).map((__, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6"
                >
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function EmptyState({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent>
        <div className="text-muted-foreground flex flex-col items-center gap-1 py-12 text-center text-sm">
          <p className="text-foreground font-medium">No transactions in this invoice</p>
          <p>Transactions will appear here once they are added to this invoice.</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function InvoiceTransactionList({
  transactions,
  isLoading,
  className,
}: InvoiceTransactionListProps) {
  const groups = useMemo(() => groupByDay(transactions), [transactions]);

  if (isLoading) {
    return <LoadingState className={className} />;
  }

  if (transactions.length === 0) {
    return <EmptyState className={className} />;
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {groups.map((group) => (
          <section
            key={group.date}
            className="overflow-hidden rounded-lg border"
          >
            <header className="border-border bg-muted/30 flex items-center justify-between gap-3 border-b px-4 py-2 sm:px-6">
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-medium tabular-nums">
                  {formatDate(group.date)}
                </h3>
                <span className="text-muted-foreground text-xs">
                  {group.transactions.length}{" "}
                  {group.transactions.length === 1 ? "transaction" : "transactions"}
                </span>
              </div>
              <span className="text-muted-foreground text-xs font-medium tabular-nums">
                {formatMoney(group.dailyTotal)}
              </span>
            </header>
            <ul className="divide-border divide-y">
              {group.transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </ul>
          </section>
        ))}
      </CardContent>
    </Card>
  );
}
