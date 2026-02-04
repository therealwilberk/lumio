import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
interface NumberLineProps {
  max?: number;
  target1?: number;
  target2?: number;
  isAnimating?: boolean;
}
export function NumberLine({ max = 20, target1 = 0, target2 = 0, isAnimating }: NumberLineProps) {
  const width = 800;
  const height = 160;
  const padding = 40;
  const step = (width - padding * 2) / max;
  const getX = (val: number) => padding + val * step;
  const groundY = height - 60;
  const ticks = Array.from({ length: max + 1 }).map((_, i) => ({
    value: i,
    x: getX(i)
  }));
  return (
    <div className="w-full overflow-hidden p-2">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto overflow-visible"
      >
        {/* Main Line */}
        <line
          x1={padding} y1={groundY}
          x2={width - padding} y2={groundY}
          stroke="currentColor" strokeWidth="6" strokeLinecap="round"
          className="text-muted/40"
        />
        {/* Ticks & Labels */}
        {ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={tick.x} y1={groundY - 12}
              x2={tick.x} y2={groundY + 12}
              stroke="currentColor" strokeWidth="2"
              className="text-muted-foreground/30"
            />
            <text
              x={tick.x} y={groundY + 35}
              textAnchor="middle" fontSize="14" fontWeight="800"
              className="fill-muted-foreground/80 font-sans tabular-nums"
            >
              {tick.value}
            </text>
          </g>
        ))}
        {/* Character Marker & Jumps */}
        {isAnimating && (
          <g>
            {/* Jump 1 Path */}
            <motion.path
              d={`M ${getX(0)} ${groundY} Q ${getX(target1 / 2)} ${groundY - 100} ${getX(target1)} ${groundY}`}
              fill="none" stroke="#4F46E5" strokeWidth="5" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Jump 1 Marker */}
            <motion.g
              initial={{ x: getX(0), y: groundY }}
              animate={{
                x: [getX(0), getX(target1 / 2), getX(target1)],
                y: [groundY, groundY - 105, groundY]
              }}
              transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeOut" }}
            >
              <circle r="12" fill="#4F46E5" className="filter drop-shadow-md" />
              <Target className="w-6 h-6 text-white -translate-x-3 -translate-y-3" />
            </motion.g>
            {/* Jump 2 Path */}
            {target2 > 0 && (
              <>
                <motion.path
                  d={`M ${getX(target1)} ${groundY} Q ${getX(target1 + target2 / 2)} ${groundY - 100} ${getX(target1 + target2)} ${groundY}`}
                  fill="none" stroke="#F97316" strokeWidth="5" strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                />
                <motion.g
                  initial={{ x: getX(target1), y: groundY }}
                  animate={{
                    x: [getX(target1), getX(target1 + target2 / 2), getX(target1 + target2)],
                    y: [groundY, groundY - 105, groundY]
                  }}
                  transition={{ duration: 0.8, delay: 0.8, times: [0, 0.5, 1], ease: "easeOut" }}
                >
                  <circle r="12" fill="#F97316" className="filter drop-shadow-md" />
                  <Target className="w-6 h-6 text-white -translate-x-3 -translate-y-3" />
                </motion.g>
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}