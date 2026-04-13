import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const config: Record<ToastType, { icon: React.ReactNode; border: string }> = {
  success: { icon: <CheckCircle size={16} className="text-success" />, border: "border-l-4 border-success" },
  error:   { icon: <XCircle size={16} className="text-danger" />,   border: "border-l-4 border-danger" },
  warning: { icon: <AlertTriangle size={16} className="text-warning" />, border: "border-l-4 border-warning" },
};

export function Toast({ message, type, onClose }: ToastProps) {
  const { icon, border } = config[type];
  return (
    <div className={cn("flex items-center gap-3 rounded-lg bg-white dark:bg-dark-surface shadow-lg p-4 min-w-72", border)}>
      {icon}
      <p className="flex-1 text-sm text-neutral-800 dark:text-dark-primary">{message}</p>
      <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
        <X size={14} />
      </button>
    </div>
  );
}
