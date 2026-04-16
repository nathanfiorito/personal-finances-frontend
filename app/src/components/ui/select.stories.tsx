import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const CategoryPicker: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Daily</SelectLabel>
          <SelectItem value="food">Alimentação</SelectItem>
          <SelectItem value="transport">Transporte</SelectItem>
          <SelectItem value="coffee">Cafeteria</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Monthly</SelectLabel>
          <SelectItem value="rent">Aluguel</SelectItem>
          <SelectItem value="utilities">Contas de casa</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
