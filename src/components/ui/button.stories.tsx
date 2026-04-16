import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, Download, Loader2, Plus, Trash } from "lucide-react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean" },
  },
  args: { children: "Button" },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Outline: Story = { args: { variant: "outline" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete" } };
export const Link: Story = { args: { variant: "link", children: "Learn more" } };

export const WithLeadingIcon: Story = {
  args: {
    children: (
      <>
        <Plus /> New transaction
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: { size: "icon", variant: "outline", "aria-label": "Confirm", children: <Check /> },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Loader2 className="animate-spin" /> Saving…
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">
        <Trash /> Destructive
      </Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">xs</Button>
      <Button size="sm">sm</Button>
      <Button>default</Button>
      <Button size="lg">lg</Button>
      <Button size="icon" aria-label="Download">
        <Download />
      </Button>
    </div>
  ),
};
