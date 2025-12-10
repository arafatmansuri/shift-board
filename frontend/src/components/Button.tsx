import type { ReactNode } from "react";

type ButtonProps = {
  varient: "primary" | "secondary" | "assign";
  type?: "submit" | "reset" | "button";
  text?: string;
  isDisabled?: boolean;
  classes?: string;
  isWidthFull?: boolean;
  onClick?: () => void;
  startIcon?: ReactNode;
};
const variantStyles = {
  primary:
    "py-2.5 bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium",
  secondary:
    "px-6 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50",
  assign:
    "py-2.5 px-6 text-black bg-slate-300 hover:bg-slate-400 font-semibold text-sm md:text-[12pt]",
};
// const sizeStyles = {
//   lg: "py-2 px-5 gap-1 text-lg",
//   sm: "h-9 px-3 gap-1 text-sm",
//   md: "md:h-10 md:px-4 h-8 px-1 gap-2 md:text-md text-sm font-medium",
// };
const defaultStyles = "rounded-lg transition-colors cursor-pointer";
export const Button = ({
  type,
  text,
  isDisabled,
  classes,
  varient,
  onClick,
  isWidthFull,
  startIcon,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
    ${defaultStyles} ${variantStyles[varient]} ${isWidthFull && "w-full"} ${
        startIcon && "flex items-center font-normal gap-2 px-4 py-2"
      } ${classes}
    `}
      onClick={onClick}
    >
      {startIcon}
      {text}
    </button>
  );
};
