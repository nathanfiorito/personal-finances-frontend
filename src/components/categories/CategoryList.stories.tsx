import type { Meta, StoryObj } from "@storybook/react";
import { CategoryList } from "./CategoryList";

const meta: Meta<typeof CategoryList> = { component: CategoryList };
export default meta;
type Story = StoryObj<typeof CategoryList>;

export const WithCategories: Story = {
  args: {
    categories: [
      { id: 1, name: "Alimentação", is_active: true },
      { id: 2, name: "Transporte", is_active: true },
      { id: 3, name: "Lazer", is_active: false },
    ],
  },
};
export const Empty: Story = { args: { categories: [] } };
