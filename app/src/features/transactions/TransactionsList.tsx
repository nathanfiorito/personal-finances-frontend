import { Edit, MoreVertical, Trash } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

function displayLabel(tx: TransactionResponse): string {
  return tx.establishment ?? tx.description ?? "—";
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

export function TransactionsList({
  transactions,
  isLoading,
  isFetching,
  onEdit,
  onDelete,
  className,
}: TransactionsListProps) {
  if (isLoading) {
    return <LoadingState className={className} />;
  }

  if (!transactions || transactions.length === 0) {
    return <EmptyState className={className} />;
  }

  return (
    <div
      className={cn(
        "relative",
        isFetching && "opacity-60 transition-opacity",
        className
      )}
    >
      <ul className="divide-border bg-card text-card-foreground divide-y rounded-lg border sm:hidden">
        {transactions.map((tx) => (
          <li key={tx.id} className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-sm font-medium">{displayLabel(tx)}</p>
              <p className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>{formatDate(tx.date)}</span>
                <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                  {tx.category}
                </Badge>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase">
                  {tx.payment_method}
                </Badge>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <AmountCell tx={tx} />
              <RowActions transaction={tx} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-card text-card-foreground hidden rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Date</TableHead>
              <TableHead>Establishment</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10 pr-6 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-muted-foreground pl-6 text-xs whitespace-nowrap">
                  {formatDate(tx.date)}
                </TableCell>
                <TableCell className="max-w-[260px]">
                  <div className="truncate">{displayLabel(tx)}</div>
                  {tx.description && tx.establishment ? (
                    <div className="text-muted-foreground truncate text-xs">
                      {tx.description}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{tx.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="uppercase">
                    {tx.payment_method}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <AmountCell tx={tx} />
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <RowActions transaction={tx} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
    <div className={cn("bg-card rounded-lg border", className)}>
      <ul className="divide-border divide-y">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="flex items-center justify-between gap-3 px-6 py-4">
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-4 w-20" />
          </li>
        ))}
      </ul>
    </div>
  );
}
