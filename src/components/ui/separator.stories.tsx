import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[420px] space-y-4">
      <h4 className="text-sm font-medium">Category</h4>
      <p className="text-muted-foreground text-sm">Alimentação</p>
      <Separator />
      <h4 className="text-sm font-medium">Payment method</h4>
      <p className="text-muted-foreground text-sm">Credit</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Dashboard</span>
      <Separator orientation="vertical" />
      <span>Transactions</span>
      <Separator orientation="vertical" />
      <span>Reports</span>
    </div>
  ),
};
