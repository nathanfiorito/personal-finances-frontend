import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Combobox, type ComboboxOption } from "./combobox";
import { Label } from "./label";

const meta: Meta<typeof Combobox> = {
  title: "UI/Combobox",
  component: Combobox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const categories: ComboboxOption<number>[] = [
  { value: 1, label: "Alimentação" },
  { value: 2, label: "Transporte" },
  { value: 3, label: "Cafeteria" },
  { value: 4, label: "Mercado" },
  { value: 5, label: "Saúde" },
  { value: 6, label: "Lazer" },
  { value: 7, label: "Streaming" },
  { value: 8, label: "Aluguel" },
];

function Controlled({ initial = null }: { initial?: number | null }) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <div className="w-72 space-y-2">
      <Label htmlFor="category">Category</Label>
      <Combobox id="category" options={categories} value={value} onChange={setValue} />
    </div>
  );
}

export const Default: Story = {
  render: () => <Controlled />,
};

export const Selected: Story = {
  render: () => <Controlled initial={3} />,
};

export const Invalid: Story = {
  render: () => (
    <div className="w-72 space-y-2">
      <Label htmlFor="category-invalid">Category</Label>
      <Combobox
        id="category-invalid"
        options={categories}
        value={null}
        onChange={() => {}}
        aria-invalid
      />
      <p className="text-destructive text-xs">Category is required.</p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <Combobox
        options={categories}
        value={1}
        onChange={() => {}}
        disabled
      />
    </div>
  ),
};
