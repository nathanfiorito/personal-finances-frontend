import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface YearPickerProps {
  value: number;
  onChange: (year: number) => void;
  range?: number;
  className?: string;
}

export function YearPicker({ value, onChange, range = 5, className }: YearPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: range }, (_, offset) => currentYear - offset);

  return (
    <Select value={String(value)} onValueChange={(next) => onChange(Number(next))}>
      <SelectTrigger className={className ?? "w-[140px]"} aria-label="Year">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
