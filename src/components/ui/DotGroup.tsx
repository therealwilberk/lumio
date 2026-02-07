import React from 'react';
import { motion } from 'framer-motion';

export const DotGroup = ({
  count,
  color,
  minRows = 0
}: {
  count: number;
  color: 'blue' | 'purple';
  minRows?: number
}) => {
  const dotsPerRow = 5;
  const rows = Math.max(Math.ceil(count / dotsPerRow), minRows);

  return (
    <div
      className="grid grid-cols-5 gap-2"
      style={{
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        minHeight: `${rows * 1.5}rem` // Ensure consistent height
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: i * 0.05
          }}
          className={`w-4 h-4 md:w-5 md:h-5 rounded-full shadow-sm ${
            color === 'blue'
              ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/20'
              : 'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-500/20'
          }`}
        />
      ))}
      {/* Empty spaces to maintain grid symmetry if count < rows * dotsPerRow */}
      {Array.from({ length: (rows * dotsPerRow) - count }).map((_, i) => (
        <div key={`empty-${i}`} className="w-4 h-4 md:w-5 md:h-5" />
      ))}
    </div>
  );
};
