import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="summary" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="categories">By category</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">
        <p className="text-muted-foreground text-sm">
          A high-level view of the period.
        </p>
      </TabsContent>
      <TabsContent value="monthly">
        <p className="text-muted-foreground text-sm">
          Monthly breakdown.
        </p>
      </TabsContent>
      <TabsContent value="categories">
        <p className="text-muted-foreground text-sm">
          Category breakdown.
        </p>
      </TabsContent>
    </Tabs>
  ),
};
