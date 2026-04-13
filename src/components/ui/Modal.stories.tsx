import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = { component: Modal };
export default meta;
export const Open: StoryObj<typeof Modal> = {
  args: { open: true, title: "Create Transaction", onClose: () => {}, children: <p className="text-sm text-neutral-600">Modal content here.</p> },
};
