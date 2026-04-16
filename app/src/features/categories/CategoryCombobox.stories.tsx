import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { CategoryResponse } from "@/lib/api/types";
import { CategoryCombobox } from "./CategoryCombobox";

const meta: Meta<typeof CategoryCombobox> = {
  title: "Features/Categories/CategoryCombobox",
  component: CategoryCombobox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CategoryCombobox>;

const categories: CategoryResponse[] = [
  { id: 1, name: "Alimentação", is_active: true },
  { id: 2, name: "Transporte", is_active: true },
  { id: 3, name: "Cafeteria", is_active: true },
  { id: 4, name: "Mercado", is_active: true },
  { id: 5, name: "Saúde", is_active: true },
  { id: 6, name: "Lazer", is_active: true },
  { id: 7, name: "Streaming", is_active: true },
  { id: 8, name: "Aluguel", is_active: true },
];

function Controlled({ initial }: { initial: number | null }) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <div className="w-72">
      <CategoryCombobox categories={categories} value={value} onChange={setValue} />
    </div>
  );
}

export const Empty: Story = {
  render: () => <Controlled initial={null} />,
};

export const Selected: Story = {
  render: () => <Controlled initial={3} />,
};
