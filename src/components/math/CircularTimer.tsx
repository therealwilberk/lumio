import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
  className?: string;
}
export function CircularTimer({ timeLeft, totalTime, className }: CircularTimerProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, timeLeft / totalTime));
  const offset = circumference * (1 - progress);
  // Dynamic visual states
  const isCritical = timeLeft <= 5;
  const isWarning = timeLeft <= 10 && timeLeft > 5;
  let colorClass = "text-green-500";
  let glowClass = "shadow-[0_0_15px_rgba(34,197,94,0.5)]";
  if (isCritical) {
    colorClass = "text-red-500";
    glowClass = "shadow-[0_0_20px_rgba(239,68,68,0.7)]";
  } else if (isWarning) {
    colorClass = "text-yellow-500";
    glowClass = "shadow-[0_0_15px_rgba(234,179,8,0.5)]";
  }
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg 
        viewBox="0 0 96 96" 
        className="w-24 h-24 transform -rotate-90 overflow-visible" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background Circle with critical pulse */}
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          animate={{
            opacity: isCritical ? [0.1, 0.3, 0.1] : 0.2
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-muted/40"
        />
        {/* Progress Circle with smooth motion */}
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ 
            duration: 1, 
            ease: "linear",
          }}
          strokeLinecap="round"
          className={cn("transition-colors duration-500", colorClass)}
        />
      </svg>
      {/* Central Icon container */}
      <motion.div
        animate={{
          scale: isCritical ? [1, 1.2, 1] : 1,
          rotate: isCritical ? [0, -5, 5, 0] : 0,
          borderColor: isCritical ? "#ef4444" : isWarning ? "#eab308" : "#22c55e"
        }}
        transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
        className={cn(
          "absolute flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 transition-all duration-500",
          colorClass,
          glowClass
        )}
      >
        <AnimatePresence mode="wait">
          {isCritical ? (
            <motion.div
              key="zap"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Zap className="w-6 h-6 fill-current" />
            </motion.div>
          ) : (
            <motion.div
              key="timer"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Timer className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Outer Pulse for atmosphere */}
      {isCritical && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.15, 0], scale: [1, 1.5, 1.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-red-500 rounded-full pointer-events-none filter blur-2xl"
        />
      )}
    </div>
  );
}