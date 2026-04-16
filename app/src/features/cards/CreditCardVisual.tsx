import { getBankStyle } from "@/lib/bank-registry";
import type { CardResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export interface CreditCardVisualProps {
  card: CardResponse;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CreditCardVisual({
  card,
  isSelected,
  onClick,
  className,
}: CreditCardVisualProps) {
  const style = getBankStyle(card.bank);

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "aspect-[1.586] w-full rounded-2xl p-4 transition-all duration-200",
        "flex flex-col justify-between select-none",
        "hover:shadow-md",
        onClick && "cursor-pointer",
        isSelected && "ring-2 ring-primary scale-105 shadow-lg",
        className
      )}
      style={{ backgroundColor: style.color, color: style.textColor }}
    >
      {/* Top row: bank name + initials badge */}
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium opacity-90">{card.bank}</span>
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          {style.initials}
        </span>
      </div>

      {/* Center: alias */}
      <div className="text-lg font-semibold tracking-wide">{card.alias}</div>

      {/* Bottom row: card number + closing day */}
      <div className="flex items-end justify-between">
        <span className="font-mono text-sm tracking-wider opacity-80">
          •••• •••• •••• {card.last_four_digits}
        </span>
        <span className="text-xs opacity-70">Fecha dia {card.closing_day}</span>
      </div>
    </div>
  );
}
