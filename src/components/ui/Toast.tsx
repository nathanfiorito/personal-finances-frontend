"use client";

import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: "border-success dark:border-success-dark bg-success-bg dark:bg-success-bg-dark text-success dark:text-success-dark",
  error: "border-danger dark:border-danger-dark bg-danger-bg dark:bg-danger-bg-dark text-danger dark:text-danger-dark",
  warning: "border-warning dark:border-warning-dark bg-warning-bg dark:bg-warning-bg-dark text-warning dark:text-warning-dark",
  info: "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = ICONS[toast.type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-md min-w-[280px] max-w-sm ${STYLES[toast.type]}`}
      role="alert"
    >
      <Icon size={18} className="mt-0.5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
