import type { Meta, StoryObj } from "@storybook/react";
import { TransactionTable } from "./TransactionTable";
import type { Transaction, Category } from "@/lib/types";

const categories: Category[] = [
  { id: 1, name: "Alimentação", is_active: true },
  { id: 2, name: "Transporte", is_active: true },
];

const transactions: Transaction[] = [
  { id: "1", amount: "45.90", date: "2026-04-12", establishment: "iFood", description: null, category: "Alimentação", category_id: 1, tax_id: null, entry_type: "text", transaction_type: "expense", payment_method: "credit", confidence: null, created_at: "2026-04-12T10:00:00" },
  { id: "2", amount: "5000.00", date: "2026-04-10", establishment: "Salary", description: null, category: "Transporte", category_id: 2, tax_id: null, entry_type: "text", transaction_type: "income", payment_method: "debit", confidence: null, created_at: "2026-04-10T09:00:00" },
];

const meta: Meta<typeof TransactionTable> = { component: TransactionTable };
export default meta;
type Story = StoryObj<typeof TransactionTable>;

export const WithData: Story = { args: { transactions, total: 2, page: 1, pageSize: 20, categories } };
export const Empty: Story = { args: { transactions: [], total: 0, page: 1, pageSize: 20, categories } };
