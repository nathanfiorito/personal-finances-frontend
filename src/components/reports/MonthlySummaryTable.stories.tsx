import type { Meta, StoryObj } from "@storybook/react";
import { MonthlySummaryTable } from "./MonthlySummaryTable";

const meta: Meta<typeof MonthlySummaryTable> = { component: MonthlySummaryTable };
export default meta;
export const WithData: StoryObj<typeof MonthlySummaryTable> = {
  args: {
    data: [
      { month: 1, income_total: "5000.00", expense_total: "1234.56", expense_by_category: [] },
      { month: 2, income_total: "5000.00", expense_total: "980.00", expense_by_category: [] },
    ],
  },
};
