import type { Meta, StoryObj } from "@storybook/react";
import { TransactionFilters } from "./TransactionFilters";

const meta: Meta<typeof TransactionFilters> = { component: TransactionFilters };
export default meta;
type Story = StoryObj<typeof TransactionFilters>;

export const Default: Story = {
  args: {
    categories: [
      { id: 1, name: "Alimentação", is_active: true },
      { id: 2, name: "Transporte", is_active: true },
    ],
  },
};
