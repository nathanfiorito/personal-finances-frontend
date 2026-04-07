import { Card } from "@/components/ui/Card";
import { TrendingDown, Hash, Calendar } from "lucide-react";

interface SummaryCardsProps {
  totalMonth: number;
  transactionCount: number;
  monthLabel: string;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function SummaryCards({ totalMonth, transactionCount, monthLabel }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card data-testid="summary-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-dark-muted">Total do mês</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-dark-primary">
              {formatCurrency(totalMonth)}
            </p>
          </div>
          <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
            <TrendingDown className="text-brand-500" size={20} />
          </div>
        </div>
      </Card>

      <Card data-testid="summary-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-dark-muted">Transações</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-dark-primary">
              {transactionCount}
            </p>
          </div>
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <Hash className="text-blue-500" size={20} />
          </div>
        </div>
      </Card>

      <Card data-testid="summary-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-dark-muted">Período</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-dark-primary capitalize">
              {monthLabel}
            </p>
          </div>
          <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
            <Calendar className="text-purple-500" size={20} />
          </div>
        </div>
      </Card>
    </div>
  );
}
