import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { placeholder: "Add a description…" },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" placeholder="e.g. Dinner with colleagues" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Disabled textarea" },
};
