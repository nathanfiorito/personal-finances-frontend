import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TransactionResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/format/format-date";
import { formatMoney } from "@/lib/format/format-money";
import { cn } from "@/lib/utils";

export interface RecentTransactionsListProps {
  transactions: TransactionResponse[] | undefined;
  isLoading?: boolean;
  className?: string;
}

function displayLabel(tx: TransactionResponse): string {
  return tx.establishment ?? tx.description ?? "—";
}

function AmountCell({ tx, className }: { tx: TransactionResponse; className?: string }) {
  const isIncome = tx.transaction_type === "income";
  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
        className
      )}
    >
      {isIncome ? "+" : "−"} {formatMoney(tx.amount)}
    </span>
  );
}

export function RecentTransactionsList({
  transactions,
  isLoading,
  className,
}: RecentTransactionsListProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-0">
        {isLoading ? (
          <LoadingState />
        ) : !transactions || transactions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ul className="divide-border divide-y sm:hidden">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-sm font-medium">{displayLabel(tx)}</p>
                    <p className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>{formatDate(tx.date)}</span>
                      <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                        {tx.category}
                      </Badge>
                    </p>
                  </div>
                  <AmountCell tx={tx} className="text-sm" />
                </li>
              ))}
            </ul>
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Date</TableHead>
                    <TableHead>Establishment</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="pr-6 text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-muted-foreground pl-6 text-xs">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell>{displayLabel(tx)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.category}</Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <AmountCell tx={tx} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-muted-foreground px-6 py-10 text-center text-sm">
      No transactions yet.
    </div>
  );
}

function LoadingState() {
  return (
    <ul className="divide-border divide-y">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="flex items-center justify-between gap-3 px-6 py-3">
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-4 w-16" />
        </li>
      ))}
    </ul>
  );
}
