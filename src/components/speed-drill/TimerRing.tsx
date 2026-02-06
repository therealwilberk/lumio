import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface TimerRingProps {
  /** Current elapsed time in milliseconds */
  elapsedMs: number;
  
  /** Optional max time for percentage calculation in milliseconds (default: 60000ms = 60s) */
  maxMs?: number;
  
  /** Size of the ring in pixels (default: 128) */
  size?: number;
  
  /** Stroke width (default: 10) */
  strokeWidth?: number;
}

export function TimerRing({
  elapsedMs,
  maxMs = 60000,
  size = 128,
  strokeWidth = 10
}: TimerRingProps) {
  // Convert to seconds for display and calculations
  const elapsedSeconds = elapsedMs / 1000;
  const maxSeconds = maxMs / 1000;
  
  // Calculate radius (accounting for stroke)
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate progress (0 to 1)
  const progress = Math.min(elapsedSeconds / maxSeconds, 1);
  
  // Calculate stroke offset (reverse direction for clockwise)
  const strokeDashoffset = circumference - (progress * circumference);
  
  // Determine color based on elapsed time (using elapsed seconds directly for thresholds)
  const getColor = useMemo(() => {
    // Green for first 30s, Orange for 30-45s, Red for 45s+
    if (elapsedSeconds < 30) return '#10b981'; // Green
    if (elapsedSeconds < 45) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  }, [elapsedSeconds]);
  
  // Format time for display (MM:SS)
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const displayTime = formatTime(elapsedMs);
  
  // Pulse animation for urgency (when time >= 45s)
  const shouldPulse = elapsedSeconds >= 45;
  
  // Get urgency message
  const getUrgencyMessage = () => {
    if (elapsedSeconds < 20) return '⚡ Fast!';
    if (elapsedSeconds < 30) return '👍 Good';
    if (elapsedSeconds < 45) return '⏱️ Hurry';
    return '🚨 Hurry!';
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ 
          filter: shouldPulse ? 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.5))' : 'none',
          transition: 'filter 0.3s ease'
        }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
          opacity={0.5}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={false}
          animate={{
            strokeDashoffset,
            stroke: getColor
          }}
          transition={{
            duration: 0.1,
            ease: 'linear'
          }}
          style={{
            filter: shouldPulse ? 'drop-shadow(0 0 6px currentColor)' : 'none'
          }}
        />
      </svg>
      
      {/* Time display in center */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={shouldPulse ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 0.6,
          repeat: shouldPulse ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <span 
          className="text-2xl font-bold font-mono"
          style={{ color: getColor }}
        >
          {displayTime}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {getUrgencyMessage()}
        </span>
      </motion.div>
    </div>
  );
}
