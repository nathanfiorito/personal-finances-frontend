import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export function Card({ children, className = "", padding = true, ...props }: CardProps) {
  return (
    <div
      className={`bg-white border border-neutral-200 rounded-xl shadow dark:bg-dark-surface dark:border-dark-border ${padding ? "p-6" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
