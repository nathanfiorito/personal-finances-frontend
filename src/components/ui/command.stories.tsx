import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";

const meta: Meta<typeof Command> = {
  title: "UI/Command",
  component: Command,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Command>;

export const CategorySearch: Story = {
  render: () => (
    <Command className="w-80 rounded-lg border shadow-md">
      <CommandInput placeholder="Search categories…" />
      <CommandList>
        <CommandEmpty>No category found.</CommandEmpty>
        <CommandGroup heading="Daily">
          <CommandItem>Alimentação</CommandItem>
          <CommandItem>Transporte</CommandItem>
          <CommandItem>Cafeteria</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Monthly">
          <CommandItem>Aluguel</CommandItem>
          <CommandItem>Contas de casa</CommandItem>
          <CommandItem>Streaming</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
