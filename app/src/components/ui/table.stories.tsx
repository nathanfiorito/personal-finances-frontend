import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Badge } from "./badge";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

const rows = [
  { id: "1", date: "14/04/2026", place: "Starbucks", category: "Cafeteria", amount: "R$ 24,90" },
  { id: "2", date: "14/04/2026", place: "Uber", category: "Transporte", amount: "R$ 18,70" },
  { id: "3", date: "13/04/2026", place: "iFood", category: "Alimentação", amount: "R$ 62,30" },
  { id: "4", date: "12/04/2026", place: "Extra", category: "Mercado", amount: "R$ 156,40" },
];

export const TransactionsTable: Story = {
  render: () => (
    <Table>
      <TableCaption>April expenses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Establishment</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="text-muted-foreground text-xs">{row.date}</TableCell>
            <TableCell>{row.place}</TableCell>
            <TableCell>
              <Badge variant="outline">{row.category}</Badge>
            </TableCell>
            <TableCell className="text-right font-medium">{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
