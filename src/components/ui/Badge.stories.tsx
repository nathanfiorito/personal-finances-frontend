import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = { component: Badge };
export default meta;
type Story = StoryObj<typeof Badge>;

export const Brand: Story = { args: { variant: "brand", children: "Alimentação" } };
export const Income: Story = { args: { variant: "income", children: "Income" } };
export const Expense: Story = { args: { variant: "expense", children: "Expense" } };
export const Active: Story = { args: { variant: "active", children: "Active" } };
export const Inactive: Story = { args: { variant: "inactive", children: "Inactive" } };
