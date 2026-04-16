import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import type { CategoryResponse, TransactionResponse } from "@/lib/api/types";
import { TransactionForm } from "./TransactionForm";

const meta: Meta<typeof TransactionForm> = {
  title: "Features/Transactions/TransactionForm",
  component: TransactionForm,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TransactionForm>;

const categories: CategoryResponse[] = [
  { id: 1, name: "Alimentação", is_active: true },
  { id: 2, name: "Transporte", is_active: true },
  { id: 3, name: "Cafeteria", is_active: true },
  { id: 4, name: "Mercado", is_active: true },
  { id: 5, name: "Salário", is_active: true },
];

const sampleTransaction: TransactionResponse = {
  id: "abc",
  amount: "62.30",
  date: "2026-04-13",
  establishment: "iFood",
  description: "Pizza de domingo",
  category_id: 1,
  category: "Alimentação",
  tax_id: null,
  entry_type: "pdf",
  transaction_type: "expense",
  payment_method: "credit",
  confidence: 0.95,
  created_at: "2026-04-13T19:30:00Z",
};

export const Create: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-xl">
      <TransactionForm
        categories={categories}
        onSubmit={fn(async () => {})}
        onCancel={fn()}
        submitLabel="Create"
      />
    </div>
  ),
};

export const Edit: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-xl">
      <TransactionForm
        categories={categories}
        initial={sampleTransaction}
        onSubmit={fn(async () => {})}
        onCancel={fn()}
        submitLabel="Save changes"
      />
    </div>
  ),
};

export const ServerError: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-xl">
      <TransactionForm
        categories={categories}
        initial={sampleTransaction}
        onSubmit={async () => {
          throw new Error("Category is inactive.");
        }}
        submitLabel="Save changes"
      />
    </div>
  ),
};
