import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = { component: Card };
export default meta;
export const Default: StoryObj<typeof Card> = {
  args: { children: <p className="text-sm text-neutral-600">Card content goes here.</p> },
};
