import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = true }: CardProps) {
  return (
    <motion.div
      className={`bg-[#1E293B] rounded-xl p-6 ${className}`}
      whileHover={hoverable ? { y: -8, boxShadow: '0 20px 40px rgba(11, 103, 255, 0.2)' } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
