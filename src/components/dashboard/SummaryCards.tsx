import { Card } from "@/components/ui/Card";
import { TrendingDown, TrendingUp, Hash } from "lucide-react";

interface SummaryCardsProps {
  totalIncome: number;
  totalOutcome: number;
  transactionCount: number;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function SummaryCards({ totalIncome, totalOutcome, transactionCount }: SummaryCardsProps) {
  const saldo = totalIncome - totalOutcome;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card data-testid="summary-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-dark-muted">Receitas</p>
            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
            <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
          </div>
        </div>
      </Card>

      <Card data-testid="summary-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-dark-muted">Despesas</p>
            <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalOutcome)}
            </p>
          </div>
          <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg">
            <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
          </div>
        </div>
      </Card>

      <Card data-testid="summary-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-dark-muted">Saldo</p>
            <p
              className={`mt-1 text-2xl font-bold ${
                saldo >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(saldo)}
            </p>
          </div>
          <div
            className={`p-2 rounded-lg ${
              saldo >= 0
                ? "bg-green-50 dark:bg-green-500/10"
                : "bg-red-50 dark:bg-red-500/10"
            }`}
          >
            {saldo >= 0 ? (
              <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
            ) : (
              <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
            )}
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
    </div>
  );
}
