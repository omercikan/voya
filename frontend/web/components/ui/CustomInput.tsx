import { InputHTMLAttributes } from "react";

type CustomInputProps = {
  id?: string;
  label?: string;
  error?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const CustomInput = ({
  id,
  label,
  error,
  className = "",
  ...props
}: CustomInputProps) => {
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

      <input
        id={id}
        autoComplete="on"
        {...props}
        className={`h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className} ${
          error
            ? "border-destructive focus-visible:ring-destructive"
            : "border-input focus-visible:ring-ring"
        }`}
      />

      {error && <div className="text-sm text-destructive mt-1">{error}</div>}
    </div>
  );
};

export default CustomInput;
