import { motion } from "motion/react";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
}: ButtonProps) {
  const baseClasses =
    "px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer";

  const variantClasses = {
    primary:
      "bg-[#0B67FF] hover:bg-[#0952CC] text-white shadow-lg shadow-[#0B67FF]/30",
    secondary:
      "bg-[#06B6D4] hover:bg-[#0891A8] text-white shadow-lg shadow-[#06B6D4]/30",
    ghost:
      "bg-transparent border-2 border-[#0B67FF] text-[#0B67FF] hover:bg-[#0B67FF]/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
