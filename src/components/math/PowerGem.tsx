import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
interface PowerGemProps {
  color?: "indigo" | "orange";
  className?: string;
  isSuccess?: boolean;
  index?: number;
}
export function PowerGem({ color = "indigo", className, isSuccess, index = 0 }: PowerGemProps) {
  const baseColor = color === "indigo" ? "#6366f1" : "#f97316";
  const lightColor = color === "indigo" ? "#818cf8" : "#fb923c";
  const darkColor = color === "indigo" ? "#4338ca" : "#c2410c";
  const layoutId = `gem-${index}`;
  return (
    <motion.div
      layoutId={layoutId}
      initial={{ scale: 0, rotate: -180 }}
      animate={{
        scale: isSuccess ? [1, 1.2, 1] : 1,
        rotate: 0,
        filter: isSuccess ? `drop-shadow(0 0 15px ${baseColor})` : `drop-shadow(0 0 5px ${baseColor}44)`
      }}
      transition={{ 
        layout: { type: "spring", stiffness: 200, damping: 25 },
        scale: { type: "spring", stiffness: 300, damping: 15 } 
      }}
      className={cn("relative w-full h-full flex items-center justify-center", className)}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible" preserveAspectRatio="xMidYMid meet">
        {/* Main Gem Body */}
        <path
          d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
          fill={baseColor}
          stroke={lightColor}
          strokeWidth="2"
        />
        {/* Facets with individual shimmer */}
        <motion.path
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          d="M50 5 L85 25 L50 50 Z"
          fill={lightColor}
          fillOpacity="0.3"
        />
        <motion.path
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          d="M15 25 L50 5 L50 50 Z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M15 75 L50 95 L50 50 Z"
          fill={darkColor}
          fillOpacity="0.4"
        />
        {/* Core Glow */}
        <circle cx="50" cy="50" r="10" fill="white" fillOpacity="0.6">
          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      {/* Sparkles using deterministic positions */}
      <AnimateSparkles color={baseColor} active={isSuccess} seed={index} />
    </motion.div>
  );
}
function AnimateSparkles({ color, active, seed }: { color: string; active?: boolean; seed: number }) {
  const sparkles = useMemo(() => {
    // Deterministic pseudo-random generation based on seed
    const count = 4;
    return Array.from({ length: count }).map((_, i) => {
      const angle = (seed + i * (360 / count)) % 360;
      const rad = (angle * Math.PI) / 180;
      const distance = 25 + (Math.abs(Math.sin(seed + i)) * 15);
      return {
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance,
        delay: i * 0.15,
        size: 2 + (Math.abs(Math.cos(seed + i)) * 2)
      };
    });
  }, [seed]);
  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {active && sparkles.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              x: s.x,
              y: s.y,
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              delay: s.delay,
              ease: "easeOut"
            }}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{ 
              width: s.size, 
              height: s.size, 
              backgroundColor: color, 
              boxShadow: `0 0 10px ${color}` 
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}