import { SelectHTMLAttributes } from "react";

type CustomSelectProps = {
  id?: string;
  label?: string;
  error?: string;
  className?: string;
  options: {
    value: string;
    label: string;
  }[];
} & SelectHTMLAttributes<HTMLSelectElement>;

const CustomSelect = ({
  id,
  label,
  error,
  className = "",
  options,
  ...props
}: CustomSelectProps) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}

      <select
        id={id}
        {...props}
        className={`h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? "border-destructive focus-visible:ring-destructive"
            : "border-input focus-visible:ring-ring"
        } ${className}`}
      >
        <option value="" disabled>
          Seçiniz
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <div className="mt-1 text-sm text-destructive">{error}</div>}
    </div>
  );
};

export default CustomSelect;
