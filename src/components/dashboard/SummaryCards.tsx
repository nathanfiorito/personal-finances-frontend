import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
}

export function SummaryCards({ totalIncome, totalExpenses, transactionCount }: SummaryCardsProps) {
  const net = totalIncome - totalExpenses;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950"><TrendingUp size={20} className="text-success" /></div>
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-dark-muted uppercase tracking-wide">Income</p>
          <p className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</p>
        </div>
      </Card>
      <Card className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950"><TrendingDown size={20} className="text-danger" /></div>
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-dark-muted uppercase tracking-wide">Expenses</p>
          <p className="text-2xl font-bold text-danger">{formatCurrency(totalExpenses)}</p>
        </div>
      </Card>
      <Card className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-700/20"><Wallet size={20} className="text-brand-500" /></div>
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-dark-muted uppercase tracking-wide">Net Balance</p>
          <p className={`text-2xl font-bold ${net >= 0 ? "text-brand-500" : "text-danger"}`}>{formatCurrency(net)}</p>
          <p className="text-xs text-neutral-400 dark:text-dark-muted">{transactionCount} transactions</p>
        </div>
      </Card>
    </div>
  );
}
