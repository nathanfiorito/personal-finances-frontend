import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { placeholder: "you@example.com" },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true, value: "disabled value" } };

export const WithValue: Story = { args: { defaultValue: "nathan@example.com" } };

export const Email: Story = { args: { type: "email", placeholder: "you@example.com" } };
export const Password: Story = { args: { type: "password", placeholder: "••••••••" } };
export const Number: Story = { args: { type: "number", placeholder: "0" } };

export const Invalid: Story = {
  render: () => (
    <div className="w-72 space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" aria-invalid defaultValue="not-an-email" />
      <p className="text-destructive text-xs">Enter a valid email address.</p>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-72 space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="nathan" />
    </div>
  ),
};
