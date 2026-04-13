import type { Meta, StoryObj } from "@storybook/react";
import { TransactionModal } from "./TransactionModal";
import type { Transaction, Category } from "@/lib/types";

const categories: Category[] = [
  { id: 1, name: "Alimentação", is_active: true },
  { id: 2, name: "Transporte", is_active: true },
];

const existing: Transaction = {
  id: "1", amount: "45.90", date: "2026-04-12", establishment: "iFood",
  description: null, category: "Alimentação", category_id: 1, tax_id: null,
  entry_type: "text", transaction_type: "expense", payment_method: "credit",
  confidence: null, created_at: "2026-04-12T10:00:00",
};

const meta: Meta<typeof TransactionModal> = { component: TransactionModal };
export default meta;
type Story = StoryObj<typeof TransactionModal>;

export const CreateMode: Story = { args: { open: true, onClose: () => {}, categories } };
export const EditMode: Story = { args: { open: true, onClose: () => {}, transaction: existing, categories } };
