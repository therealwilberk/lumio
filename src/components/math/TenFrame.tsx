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
    <div className={cn("space-y-3", className)}>
      {label && !hideLabel && (
        <div className="text-center font-bold text-lg text-muted-foreground animate-fade-in uppercase tracking-wider">
          {label}
        </div>
      )}
      {hideLabel && (
        <div className="flex justify-center mb-1">
          <HelpCircle className="w-5 h-5 text-muted-foreground/30 animate-pulse" />
        </div>
      )}
      <div className="grid grid-cols-5 grid-rows-2 gap-3 p-3 bg-secondary/80 backdrop-blur-sm rounded-3xl border-4 border-muted relative overflow-hidden shadow-inner">
        {cells.map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-background/40"
          >
            <AnimatePresence mode="popLayout">
              {i < count && (
                <motion.div
                  layoutId={`token-${i}`}
                  initial={{ scale: 0, rotate: -45, y: -20 }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                    y: 0,
                    boxShadow: hideLabel ? ["0 0 0px transparent", "0 0 12px currentColor", "0 0 0px transparent"] : "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    boxShadow: { repeat: Infinity, duration: 2.5 }
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={cn(
                    "w-10 h-10 sm:w-14 sm:h-14 rounded-full border-b-4 border-black/10 bounce-subtle",
                    color,
                    hideLabel && "shimmer-bg opacity-70"
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