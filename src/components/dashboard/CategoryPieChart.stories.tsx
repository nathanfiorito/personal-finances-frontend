import type { Meta, StoryObj } from "@storybook/react";
import { CategoryPieChart } from "./CategoryPieChart";

const meta: Meta<typeof CategoryPieChart> = { component: CategoryPieChart };
export default meta;
type Story = StoryObj<typeof CategoryPieChart>;

export const WithData: Story = {
  args: {
    data: [
      { category: "Alimentação", total: "245.90" },
      { category: "Transporte", total: "120.00" },
      { category: "Lazer", total: "80.00" },
    ],
  },
};
export const Empty: Story = { args: { data: [] } };
