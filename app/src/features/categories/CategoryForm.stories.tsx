import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import type { CategoryResponse } from "@/lib/api/types";
import { CategoryForm } from "./CategoryForm";

const meta: Meta<typeof CategoryForm> = {
  title: "Features/Categories/CategoryForm",
  component: CategoryForm,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CategoryForm>;

const sample: CategoryResponse = { id: 1, name: "Alimentação", is_active: true };

export const Create: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-md">
      <CategoryForm
        onSubmit={fn(async () => {})}
        onCancel={fn()}
        submitLabel="Create"
      />
    </div>
  ),
};

export const Rename: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-md">
      <CategoryForm
        initial={sample}
        onSubmit={fn(async () => {})}
        onCancel={fn()}
        submitLabel="Rename"
      />
    </div>
  ),
};

export const ServerError: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-md">
      <CategoryForm
        initial={sample}
        onSubmit={async () => {
          throw new Error("A category with this name already exists.");
        }}
        submitLabel="Save"
      />
    </div>
  ),
};
