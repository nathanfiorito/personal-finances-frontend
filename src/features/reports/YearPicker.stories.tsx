import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { YearPicker } from "./YearPicker";

const meta: Meta<typeof YearPicker> = {
  title: "Features/Reports/YearPicker",
  component: YearPicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof YearPicker>;

function Controlled() {
  const [year, setYear] = useState(new Date().getFullYear());
  return <YearPicker value={year} onChange={setYear} />;
}

export const Default: Story = {
  render: () => <Controlled />,
};
