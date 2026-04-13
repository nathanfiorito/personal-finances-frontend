import type { Meta, StoryObj } from "@storybook/react";
import { CategoryModal } from "./CategoryModal";

const meta: Meta<typeof CategoryModal> = { component: CategoryModal };
export default meta;
type Story = StoryObj<typeof CategoryModal>;

export const CreateMode: Story = { args: { open: true, onClose: () => {} } };
export const RenameMode: Story = { args: { open: true, onClose: () => {}, category: { id: 1, name: "Alimentação", is_active: true } } };
