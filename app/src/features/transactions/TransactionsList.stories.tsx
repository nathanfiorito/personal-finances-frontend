import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
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
