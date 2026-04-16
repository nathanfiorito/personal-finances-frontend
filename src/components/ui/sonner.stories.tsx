import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";
import { Button } from "./button";
import { Toaster } from "./sonner";

const meta: Meta<typeof Toaster> = {
  title: "UI/Toast (Sonner)",
  component: Toaster,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Success: Story = {
  render: () => (
    <>
      <Toaster />
      <Button onClick={() => toast.success("Transaction created")}>Show success</Button>
    </>
  ),
};

export const ErrorToast: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="destructive"
        onClick={() =>
          toast.error("Something went wrong", {
            description: "Check your connection and try again.",
          })
        }
      >
        Show error
      </Button>
    </>
  ),
};

export const WithAction: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast("Transaction deleted", {
            action: { label: "Undo", onClick: () => toast.success("Restored") },
          })
        }
      >
        Show with undo
      </Button>
    </>
  ),
};
