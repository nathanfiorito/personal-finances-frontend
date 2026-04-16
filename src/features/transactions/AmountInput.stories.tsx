import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { AmountInput } from "./AmountInput";

const meta: Meta<typeof AmountInput> = {
  title: "Features/Transactions/AmountInput",
  component: AmountInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AmountInput>;

function Controlled({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <div className="w-72 space-y-2">
      <Label htmlFor="amount">Amount</Label>
      <AmountInput id="amount" value={value} onChange={setValue} placeholder="0,00" />
      <p className="text-muted-foreground font-mono text-xs">normalized: {value || "—"}</p>
    </div>
  );
}

export const Empty: Story = {
  render: () => <Controlled />,
};

export const WithValue: Story = {
  render: () => <Controlled initial="1234.56" />,
};

export const Invalid: Story = {
  render: () => (
    <div className="w-72 space-y-2">
      <Label htmlFor="amount-invalid">Amount</Label>
      <AmountInput id="amount-invalid" defaultValue="1234.56" aria-invalid />
      <p className="text-destructive text-xs">Amount must be greater than zero.</p>
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: "10.00", disabled: true },
};
