import { useMemo } from "react";
import { Edit, MoreVertical, Trash } from "lucide-react";
import Big from "big.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { TransactionResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/format/format-date";
import { formatMoney } from "@/lib/format/format-money";
import { cn } from "@/lib/utils";

export interface TransactionsListProps {
  transactions: TransactionResponse[] | undefined;
  isLoading?: boolean;
  isFetching?: boolean;
  onEdit?: (transaction: TransactionResponse) => void;
  onDelete?: (transaction: TransactionResponse) => void;
  className?: string;
}

interface DayGroup {
  date: string;
  transactions: TransactionResponse[];
  total: string;
}

function displayLabel(tx: TransactionResponse): string {
  return tx.establishment ?? tx.description ?? "—";
}

function groupByDay(transactions: TransactionResponse[]): DayGroup[] {
  const groups = new Map<string, TransactionResponse[]>();
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
    const total = items.reduce((sum, tx) => {
      const signed = tx.transaction_type === "income"
        ? new Big(tx.amount)
        : new Big(tx.amount).neg();
      return sum.plus(signed);
    }, new Big(0));
    return { date, transactions: items, total: total.toFixed(2) };
  });
}

function AmountCell({ tx }: { tx: TransactionResponse }) {
  const isIncome = tx.transaction_type === "income";
  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
      )}
    >
      {isIncome ? "+" : "−"} {formatMoney(tx.amount)}
    </span>
  );
}

function DayTotal({ total }: { total: string }) {
  const big = new Big(total);
  const isNegative = big.lt(0);
  return (
    <span
      className={cn(
        "text-xs font-medium tabular-nums",
        isNegative ? "text-muted-foreground" : "text-emerald-600 dark:text-emerald-400"
      )}
    >
      {isNegative ? "−" : "+"} {formatMoney(big.abs().toFixed(2))}
    </span>
  );
}

function RowActions({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: TransactionResponse;
  onEdit?: (transaction: TransactionResponse) => void;
  onDelete?: (transaction: TransactionResponse) => void;
}) {
  if (!onEdit && !onDelete) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={`Actions for ${displayLabel(transaction)}`}
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Transaction</DropdownMenuLabel>
        {onEdit ? (
          <DropdownMenuItem onSelect={() => onEdit(transaction)}>
            <Edit /> Edit
          </DropdownMenuItem>
        ) : null}
        {onDelete ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete(transaction)}>
              <Trash /> Delete
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TransactionRow({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: TransactionResponse;
  onEdit?: (transaction: TransactionResponse) => void;
  onDelete?: (transaction: TransactionResponse) => void;
}) {
  return (
    <li className="flex items-start justify-between gap-3 px-4 py-3 sm:px-6">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium">{displayLabel(transaction)}</p>
        <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
          <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
            {transaction.category}
          </Badge>
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase">
            {transaction.payment_method}
          </Badge>
          {transaction.card_alias ? (
            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
              {transaction.card_alias}
            </Badge>
          ) : null}
          {transaction.description && transaction.establishment ? (
            <span className="truncate">{transaction.description}</span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <AmountCell tx={transaction} />
        <RowActions transaction={transaction} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </li>
  );
}

export function TransactionsList({
  transactions,
  isLoading,
  isFetching,
  onEdit,
  onDelete,
  className,
}: TransactionsListProps) {
  const groups = useMemo(() => (transactions ? groupByDay(transactions) : []), [transactions]);

  if (isLoading) {
    return <LoadingState className={className} />;
  }

  if (!transactions || transactions.length === 0) {
    return <EmptyState className={className} />;
  }

  return (
    <div
      className={cn(
        "space-y-4",
        isFetching && "opacity-60 transition-opacity",
        className
      )}
    >
      {groups.map((group) => (
        <section
          key={group.date}
          className="bg-card text-card-foreground overflow-hidden rounded-lg border"
        >
          <header className="border-border bg-muted/30 flex items-center justify-between gap-3 border-b px-4 py-2 sm:px-6">
            <div className="flex items-baseline gap-2">
              <h3 className="text-sm font-medium tabular-nums">{formatDate(group.date)}</h3>
              <span className="text-muted-foreground text-xs">
                {group.transactions.length}{" "}
                {group.transactions.length === 1 ? "transaction" : "transactions"}
              </span>
            </div>
            <DayTotal total={group.total} />
          </header>
          <ul className="divide-border divide-y">
            {group.transactions.map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function EmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-card text-muted-foreground flex flex-col items-center gap-1 rounded-lg border px-6 py-16 text-center text-sm",
        className
      )}
    >
      <p className="text-foreground font-medium">No transactions yet</p>
      <p>They will appear here as soon as the Telegram bot extracts your first receipt.</p>
    </div>
  );
}

function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div
          key={groupIndex}
          className="bg-card overflow-hidden rounded-lg border"
        >
          <div className="border-border bg-muted/30 flex items-center justify-between gap-3 border-b px-4 py-2 sm:px-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          <ul className="divide-border divide-y">
            {Array.from({ length: 3 }).map((__, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
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
    </div>
  );
}
