import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta: Meta<typeof Sheet> = {
  title: "UI/Sheet",
  component: Sheet,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const RightSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine the transactions list.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-4 py-3 text-sm text-muted-foreground">
          Filter controls go here in PR #6.
        </div>
        <SheetFooter>
          <Button>Apply</Button>
          <SheetClose asChild>
            <Button variant="ghost">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const BottomMobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit (mobile)</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh]">
        <SheetHeader>
          <SheetTitle>Edit transaction</SheetTitle>
          <SheetDescription>Mobile-friendly bottom sheet.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-4 py-3 text-sm text-muted-foreground">
          Form fields go here.
        </div>
        <SheetFooter>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
