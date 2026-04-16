import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import type { CategoryResponse } from "@/lib/api/types";
import { CategoryList } from "./CategoryList";

const meta: Meta<typeof CategoryList> = {
  title: "Features/Categories/CategoryList",
  component: CategoryList,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    onEdit: fn(),
    onDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CategoryList>;

const sample: CategoryResponse[] = [
  { id: 1, name: "Alimentação", is_active: true },
  { id: 2, name: "Transporte", is_active: true },
  { id: 3, name: "Cafeteria", is_active: true },
  { id: 4, name: "Mercado", is_active: true },
  { id: 5, name: "Saúde", is_active: true },
  { id: 6, name: "Lazer", is_active: true },
  { id: 7, name: "Streaming", is_active: true },
  { id: 8, name: "Aluguel", is_active: true },
];

export const Default: Story = {
  args: { categories: sample },
};

export const Loading: Story = {
  args: { categories: undefined, isLoading: true },
};

export const Empty: Story = {
  args: { categories: [] },
};
