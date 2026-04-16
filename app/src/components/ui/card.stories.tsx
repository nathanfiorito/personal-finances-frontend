import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[340px]">
      <CardHeader>
        <CardTitle>April spend</CardTitle>
        <CardDescription>Last 30 days vs. previous period</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">R$ 3.218,40</p>
        <p className="text-muted-foreground text-xs">+4,1% vs. previous period</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">
          View details
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[340px]">
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardDescription>5 most recent</CardDescription>
        <CardAction>
          <Button size="xs" variant="ghost">
            See all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Starbucks</span>
          <span className="text-muted-foreground">R$ 24,90</span>
        </div>
        <div className="flex justify-between">
          <span>Uber</span>
          <span className="text-muted-foreground">R$ 18,70</span>
        </div>
        <div className="flex justify-between">
          <span>iFood</span>
          <span className="text-muted-foreground">R$ 62,30</span>
        </div>
      </CardContent>
    </Card>
  ),
};
