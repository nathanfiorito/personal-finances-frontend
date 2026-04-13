import type { Meta, StoryObj } from "@storybook/react";
import { OutcomeBreakdown } from "./OutcomeBreakdown";

const meta: Meta<typeof OutcomeBreakdown> = { component: OutcomeBreakdown };
export default meta;
type Story = StoryObj<typeof OutcomeBreakdown>;

export const WithData: Story = {
  args: {
    data: [
      { category: "Alimentação", total: "245.90" },
      { category: "Transporte", total: "120.00" },
    ],
  },
};
export const Empty: Story = { args: { data: [] } };
