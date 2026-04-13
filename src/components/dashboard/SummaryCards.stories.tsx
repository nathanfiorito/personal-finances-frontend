import type { Meta, StoryObj } from "@storybook/react";
import { SummaryCards } from "./SummaryCards";

const meta: Meta<typeof SummaryCards> = { component: SummaryCards };
export default meta;
type Story = StoryObj<typeof SummaryCards>;

export const WithData: Story = { args: { totalIncome: 5000, totalExpenses: 1234.56, transactionCount: 12 } };
export const Empty: Story = { args: { totalIncome: 0, totalExpenses: 0, transactionCount: 0 } };
export const NegativeBalance: Story = { args: { totalIncome: 500, totalExpenses: 1500, transactionCount: 8 } };
