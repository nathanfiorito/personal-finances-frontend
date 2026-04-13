import { Suspense } from "react";
import { serverFetch } from "@/lib/api/server";
import type { BffExpensesResponse, TransactionFilters } from "@/lib/types";
import { TransactionFilters as Filters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Spinner } from "@/components/ui/Spinner";

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters: TransactionFilters = {
    start: params.start,
    end: params.end,
    category_id: params.category_id ? Number(params.category_id) : undefined,
    transaction_type: params.transaction_type as TransactionFilters["transaction_type"],
    page: params.page ? Number(params.page) : 1,
    page_size: 20,
  };

  const query = new URLSearchParams();
  if (filters.start) query.set("start", filters.start);
  if (filters.end) query.set("end", filters.end);
  if (filters.category_id) query.set("category_id", String(filters.category_id));
  if (filters.transaction_type) query.set("transaction_type", filters.transaction_type);
  if (filters.page) query.set("page", String(filters.page));
  query.set("page_size", "20");

  const data = await serverFetch<BffExpensesResponse>(`/api/v2/bff/expenses?${query.toString()}`);
  const transactions = data?.transactions.items ?? [];
  const total = data?.transactions.total ?? 0;
  const categories = data?.categories ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Transactions</h1>
      <Suspense fallback={<Spinner />}>
        <Filters categories={categories} />
      </Suspense>
      <TransactionTable
        transactions={transactions}
        total={total}
        page={filters.page ?? 1}
        pageSize={20}
        categories={categories}
      />
    </div>
  );
}
