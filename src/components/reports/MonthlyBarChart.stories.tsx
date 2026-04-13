import type { Meta, StoryObj } from "@storybook/react";
import { MonthlyBarChart } from "./MonthlyBarChart";

const meta: Meta<typeof MonthlyBarChart> = { component: MonthlyBarChart };
export default meta;
type Story = StoryObj<typeof MonthlyBarChart>;

export const WithData: Story = {
  args: {
    data: [
      { month: 1, income_total: "5000.00", expense_total: "1234.56", expense_by_category: [] },
      { month: 2, income_total: "5000.00", expense_total: "980.00", expense_by_category: [] },
      { month: 3, income_total: "0.00", expense_total: "450.00", expense_by_category: [] },
    ],
  },
};
export const Empty: Story = { args: { data: [] } };
