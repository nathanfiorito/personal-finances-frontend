import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = { component: Input };
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { label: "Amount", placeholder: "0.00" } };
export const WithError: Story = { args: { label: "Name", error: "This field is required" } };
export const Disabled: Story = { args: { label: "Email", disabled: true, value: "test@example.com" } };
