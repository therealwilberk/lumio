import React from 'react';
import { motion } from 'framer-motion';
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
  const progress = timeLeft / totalTime;
  const offset = circumference * (1 - progress);
  // Color mapping
  let colorClass = "text-green-500";
  let glowClass = "shadow-[0_0_15px_rgba(34,197,94,0.5)]";
  if (timeLeft <= 5) {
    colorClass = "text-red-500";
    glowClass = "shadow-[0_0_20px_rgba(239,68,68,0.7)]";
  } else if (timeLeft <= 10) {
    colorClass = "text-yellow-500";
    glowClass = "shadow-[0_0_15px_rgba(234,179,8,0.5)]";
  }
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg className="w-24 h-24 transform -rotate-90 overflow-visible">
        {/* Background Circle */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-muted/20"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "linear" }}
          strokeLinecap="round"
          className={cn("transition-colors duration-500", colorClass)}
        />
      </svg>
      {/* Central Icon */}
      <motion.div
        animate={{ 
          scale: timeLeft <= 5 ? [1, 1.2, 1] : 1,
          rotate: timeLeft <= 5 ? [0, -5, 5, 0] : 0
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className={cn(
          "absolute flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 transition-colors duration-500",
          colorClass,
          glowClass
        )}
      >
        {timeLeft <= 5 ? <Zap className="w-6 h-6 fill-current" /> : <Timer className="w-6 h-6" />}
      </motion.div>
      {/* Critical Pulse Overlay */}
      {timeLeft <= 3 && (
        <motion.div
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute inset-0 bg-red-500 rounded-full pointer-events-none filter blur-xl"
        />
      )}
    </div>
  );
}