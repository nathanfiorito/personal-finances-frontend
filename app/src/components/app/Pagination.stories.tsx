import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "App/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function Controlled({ total, pageSize = 20 }: { total: number; pageSize?: number }) {
  const [page, setPage] = useState(0);
  return <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />;
}

export const ManyPages: Story = {
  render: () => <Controlled total={125} />,
};

export const SinglePage: Story = {
  render: () => <Controlled total={8} />,
};

export const Empty: Story = {
  render: () => <Controlled total={0} />,
};
