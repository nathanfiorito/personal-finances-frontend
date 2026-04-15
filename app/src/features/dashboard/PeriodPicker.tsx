import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERIOD_LABELS, type PeriodPreset } from "./period";

const PRESETS: PeriodPreset[] = [
  "this-month",
  "last-month",
  "last-30-days",
  "last-90-days",
  "this-year",
];

export interface PeriodPickerProps {
  value: PeriodPreset;
  onChange: (value: PeriodPreset) => void;
  className?: string;
}

export function PeriodPicker({ value, onChange, className }: PeriodPickerProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as PeriodPreset)}>
      <SelectTrigger className={className ?? "w-[180px]"} aria-label="Period">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PRESETS.map((preset) => (
          <SelectItem key={preset} value={preset}>
            {PERIOD_LABELS[preset]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
