import type { Meta, StoryObj } from "@storybook/react-vite";
import type { MonthlyReportEntry } from "@/lib/api/types";
import { MonthlyBarChart } from "./MonthlyBarChart";

const meta: Meta<typeof MonthlyBarChart> = {
  title: "Features/Reports/MonthlyBarChart",
  component: MonthlyBarChart,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MonthlyBarChart>;

const sample: MonthlyReportEntry[] = [
  { month: 1, total: "2850.00", by_category: [] },
  { month: 2, total: "3120.40", by_category: [] },
  { month: 3, total: "2740.80", by_category: [] },
  { month: 4, total: "3218.40", by_category: [] },
  { month: 5, total: "2990.10", by_category: [] },
  { month: 6, total: "3410.25", by_category: [] },
  { month: 7, total: "2850.00", by_category: [] },
  { month: 8, total: "3450.75", by_category: [] },
  { month: 9, total: "2980.00", by_category: [] },
  { month: 10, total: "3120.40", by_category: [] },
  { month: 11, total: "3600.00", by_category: [] },
  { month: 12, total: "4120.60", by_category: [] },
];

export const Default: Story = {
  args: { entries: sample, year: 2026 },
};

export const PartialYear: Story = {
  args: { entries: sample.slice(0, 4), year: 2026 },
};

export const Loading: Story = {
  args: { entries: undefined, year: 2026, isLoading: true },
};

export const Empty: Story = {
  args: { entries: [], year: 2026 },
};
