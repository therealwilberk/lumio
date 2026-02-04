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
  pulseActive?: boolean;
  max?: number;
}
export function TenFrame({
  id,
  value,
  color = "indigo",
  className,
  label,
  isSuccess,
  startIndex = 0,
  pulseActive = false,
  max = 10
}: TenFrameProps) {
  const cells = Array.from({ length: 10 });
  const count = Math.min(max, Math.max(0, value));
  const themeStyles = color === "indigo" ? "neon-border-indigo" : "neon-border-orange";
  const bgStyles = color === "indigo" ? "bg-indigo-950/20" : "bg-orange-950/20";
  return (
    <div className={cn("space-y-4 shrink-0", className)}>
      <div className="flex justify-between items-center px-2">
        <span className={cn(
          "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
          color === "orange" ? "text-orange-400" : "text-indigo-400",
          pulseActive && "animate-pulse"
        )}>
          {label || `Slot ${id}`}
        </span>
        <span className="font-mono font-bold text-sm tabular-nums opacity-60">
          {count}/{max}
        </span>
      </div>
      <div className={cn(
        "grid grid-cols-5 grid-rows-2 gap-2 p-2 sm:p-3 rounded-2xl border-2 relative overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-500",
        themeStyles,
        isSuccess && color === "indigo" && "shadow-[0_0_20px_rgba(99,102,241,0.3)]",
        isSuccess && color === "orange" && "shadow-[0_0_20px_rgba(249,115,22,0.3)]"
      )}>
        <div className="absolute inset-0 opacity-10 pointer-events-none energy-grid-bg" />
        {cells.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center relative border border-white/5 transition-colors duration-300",
              i < count && color === "indigo" ? "bg-indigo-500/10" : i < count && color === "orange" ? "bg-orange-500/10" : bgStyles
            )}
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 rounded-tl pointer-events-none" />
            <AnimatePresence mode="popLayout">
              {i < count && (
                <motion.div
                  key={`token-${id}-${startIndex + i}`}
                  layoutId={`token-${id}-${startIndex + i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    layout: { type: "spring", stiffness: 200, damping: 25 },
                    scale: { type: "spring", stiffness: 400, damping: 20 }
                  }}
                  className={cn(
                    "w-8 h-8 sm:w-12 sm:h-12 relative z-10",
                    pulseActive && "gem-pulse",
                    isSuccess && "gem-shimmer"
                  )}
                >
                  <PowerGem color={color} isSuccess={isSuccess} index={startIndex + i} />
                </motion.div>
              )}
            </AnimatePresence>
            {i >= count && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}