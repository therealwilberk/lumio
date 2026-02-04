import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PowerGem } from './PowerGem';
interface TenFrameProps {
  id: string;
  value: number;
  color?: "indigo" | "orange";
  className?: string;
  label?: string;
  isSuccess?: boolean;
  startIndex?: number;
}
export function TenFrame({ 
  id, 
  value, 
  color = "indigo", 
  className, 
  label, 
  isSuccess,
  startIndex = 0
}: TenFrameProps) {
  const cells = Array.from({ length: 10 });
  const count = Math.min(10, Math.max(0, value));
  const themeStyles = color === "indigo" ? "neon-border-indigo" : "neon-border-orange";
  const bgStyles = color === "indigo" ? "bg-indigo-950/20" : "bg-orange-950/20";
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center px-2">
        <span className={cn(
          "text-xs font-black uppercase tracking-widest text-glow-primary",
          color === "orange" && "text-glow-secondary"
        )}>
          {label || `Slot ${id.split('-')[1]}`}
        </span>
        <span className="font-mono font-bold text-lg tabular-nums">
          {count}/10
        </span>
      </div>
      <div className={cn(
        "grid grid-cols-5 grid-rows-2 gap-2 p-3 rounded-xl border-2 relative overflow-hidden bg-black/40 backdrop-blur-md",
        themeStyles
      )}>
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none energy-grid-bg" />
        {cells.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-10 h-10 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center relative border border-white/5 transition-colors",
              bgStyles
            )}
          >
            {/* Slot Bevel Corner Effect */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 rounded-tl" />
            <AnimatePresence mode="popLayout">
              {i < count && (
                <motion.div
                  key={`token-${startIndex + i}`}
                  layoutId={`token-${startIndex + i}`}
                  initial={{ scale: 0, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0, filter: "brightness(2) blur(4px)", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-8 h-8 sm:w-12 sm:h-12 relative z-10"
                >
                  <PowerGem color={color} isSuccess={isSuccess} index={startIndex + i} />
                  {/* Trail effect when layout moves */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 rounded-full filter blur-md opacity-50",
                      color === "indigo" ? "bg-indigo-400" : "bg-orange-400"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Empty Slot Glow */}
            {i >= count && (
              <div className="w-2 h-2 rounded-full bg-white/5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}