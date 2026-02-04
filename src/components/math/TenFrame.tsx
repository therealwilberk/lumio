import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
interface TenFrameProps {
  value: number;
  color?: string;
  className?: string;
  label?: string;
}
export function TenFrame({ value, color = "bg-indigo-500", className, label }: TenFrameProps) {
  const cells = Array.from({ length: 10 });
  const count = Math.min(10, Math.max(0, value));
  return (
    <div className={cn("space-y-2", className)}>
      {label && <div className="text-center font-bold text-lg text-muted-foreground">{label}</div>}
      <div className="grid grid-cols-5 grid-rows-2 gap-2 p-2 bg-secondary rounded-2xl border-4 border-muted">
        {cells.map((_, i) => (
          <div 
            key={i} 
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-background/50"
          >
            <AnimatePresence>
              {i < count && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className={cn("w-10 h-10 sm:w-14 sm:h-14 rounded-full shadow-lg", color)}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}