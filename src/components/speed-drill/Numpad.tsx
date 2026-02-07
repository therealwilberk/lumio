import React from 'react';
import { motion } from 'framer-motion';
import { Delete, Check } from 'lucide-react';

interface NumpadProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  className?: string;
}

export function Numpad({ onNumberClick, onDelete, onSubmit, className = "" }: NumpadProps) {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {numbers.slice(0, 9).map((num) => (
        <NumpadButton key={num} onClick={() => onNumberClick(num)}>
          {num}
        </NumpadButton>
      ))}
      <NumpadButton
        onClick={onDelete}
        className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
      >
        <Delete className="h-6 w-6" />
      </NumpadButton>
      <NumpadButton onClick={() => onNumberClick('0')}>
        0
      </NumpadButton>
      <NumpadButton
        onClick={onSubmit}
        className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
      >
        <Check className="h-6 w-6" />
      </NumpadButton>
    </div>
  );
}

function NumpadButton({
  children,
  onClick,
  className = ""
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`h-16 flex items-center justify-center text-2xl font-bold rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition-colors ${className}`}
    >
      {children}
    </motion.button>
  );
}
