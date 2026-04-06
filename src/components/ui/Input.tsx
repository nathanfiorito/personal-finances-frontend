import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700 dark:text-dark-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            bg-neutral-50 dark:bg-dark-surface2
            border border-neutral-200 dark:border-dark-border
            rounded-md text-sm
            px-3 py-2
            text-neutral-900 dark:text-dark-primary
            placeholder-neutral-400 dark:placeholder-dark-muted
            focus:outline-none focus:ring-2 focus:ring-brand-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-danger dark:border-danger-dark" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger dark:text-danger-dark">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700 dark:text-dark-secondary"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`
            bg-neutral-50 dark:bg-dark-surface2
            border border-neutral-200 dark:border-dark-border
            rounded-md text-sm
            px-3 py-2
            text-neutral-900 dark:text-dark-primary
            focus:outline-none focus:ring-2 focus:ring-brand-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-danger dark:border-danger-dark" : ""}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-xs text-danger dark:text-danger-dark">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
