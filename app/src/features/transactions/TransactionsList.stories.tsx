import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import type { TransactionResponse } from "@/lib/api/types";
import { TransactionsList } from "./TransactionsList";

const meta: Meta<typeof TransactionsList> = {
  title: "Features/Transactions/TransactionsList",
  component: TransactionsList,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    onEdit: fn(),
    onDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TransactionsList>;

const sample: TransactionResponse[] = [
  {
    id: "1",
    amount: "24.90",
    date: "2026-04-14",
    establishment: "Starbucks Paulista",
    description: "Cappuccino + bolo",
    category_id: 3,
    category: "Cafeteria",
    tax_id: null,
    entry_type: "image",
    transaction_type: "expense",
    payment_method: "credit",
    confidence: 0.98,
    created_at: "2026-04-14T09:20:00Z",
  },
  {
    id: "2",
    amount: "18.70",
    date: "2026-04-14",
    establishment: "Uber",
    description: "Casa → escritório",
    category_id: 2,
    category: "Transporte",
    tax_id: null,
    entry_type: "text",
    transaction_type: "expense",
    payment_method: "credit",
    confidence: 1,
    created_at: "2026-04-14T08:45:00Z",
  },
  {
    id: "3",
    amount: "62.30",
    date: "2026-04-13",
    establishment: "iFood",
    description: null,
    category_id: 1,
    category: "Alimentação",
    tax_id: null,
    entry_type: "pdf",
    transaction_type: "expense",
    payment_method: "credit",
    confidence: 0.95,
    created_at: "2026-04-13T19:30:00Z",
  },
  {
    id: "4",
    amount: "156.40",
    date: "2026-04-12",
    establishment: "Extra Supermercado",
    description: null,
    category_id: 4,
    category: "Mercado",
    tax_id: null,
    entry_type: "image",
    transaction_type: "expense",
    payment_method: "debit",
    confidence: 0.92,
    created_at: "2026-04-12T11:05:00Z",
  },
  {
    id: "5",
    amount: "5000.00",
    date: "2026-04-10",
    establishment: null,
    description: "Salário — abril",
    category_id: 9,
    category: "Salário",
    tax_id: null,
    entry_type: "manual",
    transaction_type: "income",
    payment_method: "credit",
    confidence: 1,
    created_at: "2026-04-10T09:00:00Z",
  },
];

export const Default: Story = {
  args: { transactions: sample },
};

export const Loading: Story = {
  args: { transactions: undefined, isLoading: true },
};

export const Empty: Story = {
  args: { transactions: [] },
};

const LARGE_SAMPLE: TransactionResponse[] = (() => {
  const establishments = [
    ["Starbucks", "Cafeteria", 3],
    ["Uber", "Transporte", 2],
    ["iFood", "Alimentação", 1],
    ["Extra Mercado", "Mercado", 4],
    ["Netflix", "Streaming", 7],
    ["Academia Smart", "Saúde", 5],
    ["Posto Shell", "Transporte", 2],
    ["Padaria do Ze", "Alimentação", 1],
    ["Livraria Cultura", "Lazer", 6],
    ["Farmácia Drogasil", "Saúde", 5],
  ] as const;
  const amounts = ["12.90", "34.50", "89.90", "156.40", "5034.00", "24.90", "62.30", "18.70", "210.00", "79.80"];
  const paymentMethods: Array<"credit" | "debit"> = ["credit", "debit"];

  return Array.from({ length: 52 }).map((_, i) => {
    const [establishment, category, category_id] = establishments[i % establishments.length];
    const amount = amounts[i % amounts.length];
    const day = 28 - Math.floor(i / 4);
    return {
      id: String(i + 1),
      amount,
      date: `2026-04-${String(day).padStart(2, "0")}`,
      establishment,
      description: null,
      category_id,
      category,
      tax_id: null,
      entry_type: "image" as const,
      transaction_type: "expense" as const,
      payment_method: paymentMethods[i % 2],
      confidence: 0.95,
      created_at: `2026-04-${String(day).padStart(2, "0")}T09:00:00Z`,
    };
  });
})();

function PaginatedStory() {
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const total = LARGE_SAMPLE.length;
  const pageItems = useMemo(
    () => LARGE_SAMPLE.slice(page * pageSize, page * pageSize + pageSize),
    [page]
  );
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-muted-foreground text-sm">{total} transactions</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">
            <Download /> Export CSV
          </Button>
          <Button>
            <Plus /> New
          </Button>
        </div>
      </header>
      <TransactionsList transactions={pageItems} onEdit={fn()} onDelete={fn()} />
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
    </div>
  );
}

export const PageWithPagination: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background text-foreground min-h-screen w-full p-6 sm:p-10">
      <div className="mx-auto w-full max-w-screen-2xl">
        <PaginatedStory />
      </div>
    </div>
  ),
};
