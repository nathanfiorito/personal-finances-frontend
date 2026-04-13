import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = { component: Button };
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Save", variant: "primary" } };
export const Destructive: Story = { args: { children: "Delete", variant: "destructive" } };
export const Ghost: Story = { args: { children: "Cancel", variant: "ghost" } };
export const Loading: Story = { args: { children: "Saving…", loading: true } };
export const Disabled: Story = { args: { children: "Save", disabled: true } };
