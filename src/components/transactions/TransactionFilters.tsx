"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/lib/types";

interface TransactionFiltersProps {
  categories: Category[];
}

export function TransactionFilters({ categories }: TransactionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); params.delete("page"); }
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex gap-2">
        <Input
          label="From"
          type="date"
          value={searchParams.get("start") ?? ""}
          onChange={e => setParam("start", e.target.value || null)}
          className="w-36"
        />
        <Input
          label="To"
          type="date"
          value={searchParams.get("end") ?? ""}
          onChange={e => setParam("end", e.target.value || null)}
          className="w-36"
        />
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700 dark:text-dark-secondary">Category</label>
          <select
            value={searchParams.get("category_id") ?? ""}
            onChange={e => setParam("category_id", e.target.value || null)}
            className="rounded-md border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface2 px-3 py-2 text-sm text-neutral-900 dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700 dark:text-dark-secondary">Type</label>
          <select
            value={searchParams.get("transaction_type") ?? ""}
            onChange={e => setParam("transaction_type", e.target.value || null)}
            className="rounded-md border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface2 px-3 py-2 text-sm text-neutral-900 dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>
      {(searchParams.get("start") || searchParams.get("end") || searchParams.get("category_id") || searchParams.get("transaction_type")) && (
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>Clear filters</Button>
      )}
    </div>
  );
}
