import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = { component: Toast };
export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = { args: { message: "Transaction saved successfully.", type: "success", onClose: () => {} } };
export const Error: Story = { args: { message: "Something went wrong. Please try again.", type: "error", onClose: () => {} } };
export const Warning: Story = { args: { message: "Duplicate transaction detected.", type: "warning", onClose: () => {} } };
