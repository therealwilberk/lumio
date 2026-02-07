import React from 'react';
import { motion } from 'framer-motion';

interface DigitBlockProps {
  digit: string | number;
  color?: 'teal' | 'pink' | 'yellow' | 'blue' | 'purple';
  className?: string;
}

export function DigitBlock({ digit, color = 'blue', className = "" }: DigitBlockProps) {
  const colorClasses = {
    teal: 'bg-teal-100 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-400',
    pink: 'bg-pink-100 border-pink-200 text-pink-700 dark:bg-pink-900/30 dark:border-pink-800 dark:text-pink-400',
    yellow: 'bg-yellow-100 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400',
    blue: 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400',
    purple: 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
      className={`
        w-20 h-24 md:w-28 md:h-32
        flex items-center justify-center
        text-4xl md:text-6xl font-black
        rounded-3xl border-b-8
        shadow-lg
        ${colorClasses[color]}
        ${className}
      `}
    >
      {digit}
    </motion.div>
  );
}
