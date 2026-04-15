import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SummaryEntry } from "@/lib/api/types";
import { SpendByCategoryChart } from "./SpendByCategoryChart";

const meta: Meta<typeof SpendByCategoryChart> = {
  title: "Features/Dashboard/SpendByCategoryChart",
  component: SpendByCategoryChart,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SpendByCategoryChart>;

const sample: SummaryEntry[] = [
  { category: "Alimentação", total: "1104.90", count: 14 },
  { category: "Transporte", total: "486.20", count: 18 },
  { category: "Cafeteria", total: "248.40", count: 10 },
  { category: "Mercado", total: "621.75", count: 4 },
  { category: "Streaming", total: "79.80", count: 3 },
  { category: "Saúde", total: "210.00", count: 2 },
  { category: "Lazer", total: "467.35", count: 6 },
];

export const Default: Story = {
  args: { entries: sample },
};

export const Loading: Story = {
  args: { entries: undefined, isLoading: true },
};

export const Empty: Story = {
  args: { entries: [] },
};
