import type { Meta, StoryObj } from "@storybook/react-vite";
import { Receipt, Tag, TrendingUp, Wallet } from "lucide-react";
import { KpiCard, KpiCardSkeleton } from "./KpiCard";

const meta: Meta<typeof KpiCard> = {
  title: "Features/Dashboard/KpiCard",
  component: KpiCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {
  args: {
    label: "Total spent",
    value: "R$ 3.218,40",
    hint: "April 2026",
    icon: <Wallet />,
  },
};

export const WithPositiveTrend: Story = {
  args: {
    label: "Avg. transaction",
    value: "R$ 61,88",
    trend: { direction: "down", label: "-4.2%", tone: "positive" },
    hint: "vs. last period",
    icon: <Receipt />,
  },
};

export const WithNegativeTrend: Story = {
  args: {
    label: "Transactions",
    value: "52",
    trend: { direction: "up", label: "+8", tone: "negative" },
    hint: "vs. last period",
    icon: <TrendingUp />,
  },
};

export const TopCategory: Story = {
  args: {
    label: "Top category",
    value: "Alimentação",
    hint: "R$ 1.104,90 (34%)",
    icon: <Tag />,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Total spent" value="R$ 3.218,40" hint="April 2026" icon={<Wallet />} />
      <KpiCard
        label="Transactions"
        value="52"
        trend={{ direction: "up", label: "+8", tone: "negative" }}
        hint="vs. last period"
        icon={<Receipt />}
      />
      <KpiCard
        label="Avg. transaction"
        value="R$ 61,88"
        trend={{ direction: "down", label: "-4.2%", tone: "positive" }}
        hint="vs. last period"
        icon={<TrendingUp />}
      />
      <KpiCard
        label="Top category"
        value="Alimentação"
        hint="R$ 1.104,90 (34%)"
        icon={<Tag />}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCardSkeleton />
      <KpiCardSkeleton />
      <KpiCardSkeleton />
      <KpiCardSkeleton />
    </div>
  ),
};
