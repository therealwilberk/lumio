import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';
interface TenFrameProps {
  value: number;
  color?: string;
  className?: string;
  label?: string;
  hideLabel?: boolean;
}
export function TenFrame({ value, color = "bg-indigo-500", className, label, hideLabel }: TenFrameProps) {
  const cells = Array.from({ length: 10 });
  const count = Math.min(10, Math.max(0, value));
  return (
    <div className={cn("space-y-2", className)}>
      {label && !hideLabel && (
        <div className="text-center font-bold text-lg text-muted-foreground animate-fade-in">
          {label}
        </div>
      )}
      {hideLabel && (
        <div className="flex justify-center mb-1">
          <HelpCircle className="w-5 h-5 text-muted-foreground/50" />
        </div>
      )}
      <div className="grid grid-cols-5 grid-rows-2 gap-2 p-2 bg-secondary rounded-2xl border-4 border-muted relative overflow-hidden">
        {cells.map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-background/50"
          >
            <AnimatePresence>
              {i < count && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    boxShadow: hideLabel ? ["0 0 0px transparent", "0 0 15px currentColor", "0 0 0px transparent"] : undefined
                  }}
                  transition={{
                    boxShadow: { repeat: Infinity, duration: 2 }
                  }}
                  exit={{ scale: 0 }}
                  className={cn(
                    "w-10 h-10 sm:w-14 sm:h-14 rounded-full shadow-lg", 
                    color,
                    hideLabel && "shimmer-bg"
                  )}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}