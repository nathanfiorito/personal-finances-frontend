import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PeriodPicker } from "./PeriodPicker";
import type { PeriodPreset } from "./period";

const meta: Meta<typeof PeriodPicker> = {
  title: "Features/Dashboard/PeriodPicker",
  component: PeriodPicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PeriodPicker>;

function Controlled() {
  const [value, setValue] = useState<PeriodPreset>("this-month");
  return <PeriodPicker value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: () => <Controlled />,
};
