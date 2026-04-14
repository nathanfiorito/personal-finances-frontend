# Frontend — Code Patterns

## Pattern: Adding a new page

Pages live under `src/app/(protected)/<route>/page.tsx`. They are async server components that fetch data with `serverFetch()` and pass it down to client components.

```tsx
// src/app/(protected)/transactions/page.tsx
import { serverFetch } from "@/lib/api/server";
import type { BffExpensesResponse } from "@/lib/types";
import { TransactionTable } from "@/components/transactions/TransactionTable";

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const data = await serverFetch<BffExpensesResponse>(
    `/api/v2/bff/expenses?page=${params.page ?? 1}&page_size=20`
  );
  const transactions = data?.transactions.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">
        Transactions
      </h1>
      <TransactionTable transactions={transactions} />
    </div>
  );
}
```

Key points:
- `serverFetch<T>(path)` returns `T | null` — always provide a fallback with `?? []`.
- `searchParams` is a `Promise` in Next.js 14 App Router — always `await` it.
- Pass fetched data as props to client components; don't fetch inside client components.

---

## Pattern: Adding a new client component

Client components handle interactivity (state, events, browser APIs). Mark them with `"use client"` at the top.

```tsx
// src/components/transactions/TransactionTable.tsx
"use client";

import { useState } from "react";
import type { Transaction } from "@/lib/types";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <table>
      {transactions.map((t) => (
        <tr key={t.id} onClick={() => setSelected(t.id)}>
          <td>{t.establishment}</td>
          <td>{t.amount}</td>
        </tr>
      ))}
    </table>
  );
}
```

Key points:
- Receive all data as props — do not call `serverFetch` inside a client component.
- Export as named export (not default), matching the file name.
- Put the component in `src/components/<domain>/` where domain matches the page it belongs to.
