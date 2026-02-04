import React from 'react';
import { motion } from 'framer-motion';
interface NumberLineProps {
  max?: number;
  target1?: number;
  target2?: number;
  isAnimating?: boolean;
}
export function NumberLine({ max = 20, target1 = 0, target2 = 0, isAnimating }: NumberLineProps) {
  const width = 800;
  const height = 120;
  const padding = 40;
  const step = (width - padding * 2) / max;
  const getX = (val: number) => padding + val * step;
  // Generate ticks
  const ticks = Array.from({ length: max + 1 }).map((_, i) => ({
    value: i,
    x: getX(i)
  }));
  return (
    <div className="w-full overflow-x-auto pb-4">
      <svg width={width} height={height} className="mx-auto overflow-visible">
        {/* Main Line */}
        <line 
          x1={padding} y1={height - 40} 
          x2={width - padding} y2={height - 40} 
          stroke="currentColor" strokeWidth="4" strokeLinecap="round"
          className="text-muted-foreground"
        />
        {/* Ticks & Labels */}
        {ticks.map((tick) => (
          <g key={tick.value}>
            <line 
              x1={tick.x} y1={height - 45} 
              x2={tick.x} y2={height - 35} 
              stroke="currentColor" strokeWidth="2"
              className="text-muted-foreground"
            />
            <text 
              x={tick.x} y={height - 15} 
              textAnchor="middle" fontSize="14" fontWeight="bold"
              className="fill-muted-foreground"
            >
              {tick.value}
            </text>
          </g>
        ))}
        {/* Jumps */}
        {isAnimating && (
          <>
            {/* Jump 1: 0 to target1 */}
            <motion.path
              d={`M ${getX(0)} ${height - 40} Q ${getX(target1 / 2)} ${height - 100} ${getX(target1)} ${height - 40}`}
              fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            {/* Jump 2: target1 to target1 + target2 */}
            {target2 > 0 && (
              <motion.path
                d={`M ${getX(target1)} ${height - 40} Q ${getX(target1 + target2 / 2)} ${height - 100} ${getX(target1 + target2)} ${height - 40}`}
                fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
              />
            )}
          </>
        )}
      </svg>
    </div>
  );
}