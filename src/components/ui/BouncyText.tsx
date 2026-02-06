import React from 'react';
import { motion } from 'framer-motion';

interface BouncyTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function BouncyText({ text, className = '', delay = 0 }: BouncyTextProps) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 250,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 250,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "0.25em", display: "inline-block" }}
          key={index}
        >
          {word === "" ? "\u00A0" : word}
        </motion.span>
      ))}
    </motion.div>
  );
}
