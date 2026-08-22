"use client";

import { Box, CircularProgress } from "@mui/material";

export interface CustomButtonProps {
  type?: "submit" | "button" | "reset";
  isSubmitting?: boolean;
  className?: string;
  text?: string;
  circularColor?: string;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

const CustomButton = ({
  text,
  type = "button",
  isSubmitting = false,
  className = "",
  circularColor,
  handleClick,
  children,
}: CustomButtonProps) => {
  return (
    <button
      type={type}
      disabled={isSubmitting}
      onClick={(e) => {
        e.stopPropagation();
        handleClick?.(e);
      }}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full ${className}`}
    >
      {isSubmitting ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress
            size={23}
            sx={{ color: circularColor ? circularColor : "#fff" }}
          />
        </Box>
      ) : (
        (text ?? children)
      )}
    </button>
  );
};

export default CustomButton;
