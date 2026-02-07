import React from 'react';
import { motion } from 'framer-motion';

interface MascotDuckProps {
  className?: string;
  delay?: number;
  mood?: 'idle' | 'happy' | 'thinking' | 'sad';
}

export function MascotDuck({
  className = "w-32 h-32 md:w-40 md:h-40",
  delay = 0.5,
  mood = 'idle'
}: MascotDuckProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ x: 200, opacity: 0, rotate: 20 }}
      animate={{
        x: 0,
        opacity: 1,
        rotate: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1.2,
        delay
      }}
    >
      <motion.div
        className="w-full h-full relative"
        animate={mood === 'happy' ? {
          y: [0, -40, 0, -20, 0],
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.1, 1, 1.05, 1],
        } : mood === 'sad' ? {
          rotate: [0, -5, 5, -5, 5, 0],
          x: [0, -5, 5, -5, 5, 0],
        } : {
          y: [0, -10, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          rotate: [0, -10, 10, -10, 0],
          scale: 1.1,
          transition: { duration: 0.5 }
        }}
      >
        {/* Simple Duck SVG Fallback */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          {/* Body */}
          <ellipse cx="50" cy="60" rx="35" ry="30" fill="#FFD700" />
          {/* Head */}
          <circle cx="65" cy="35" r="22" fill="#FFD700" />
          {/* Beak */}
          <path d="M75,35 L90,38 L75,42 Z" fill="#FF8C00" />
          {/* Sunglasses */}
          <rect x="55" y="28" width="15" height="10" rx="2" fill="#333" />
          <rect x="72" y="28" width="15" height="10" rx="2" fill="#333" />
          <rect x="68" y="32" width="6" height="2" fill="#333" />
          {/* Wing */}
          <path d="M30,60 Q20,50 35,55" fill="none" stroke="#E6C200" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
