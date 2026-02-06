import { motion } from 'framer-motion';

interface FloatingElement {
  emoji: string;
  delay: number;
  duration: number;
  x: number;
  y: number;
  scale?: number;
}

interface FloatingElementsProps {
  elements?: FloatingElement[];
  className?: string;
}

const defaultElements: FloatingElement[] = [
  { emoji: '✨', delay: 0, duration: 3, x: 20, y: 30, scale: 1 },
  { emoji: '🎯', delay: 1, duration: 4, x: 70, y: 20, scale: 0.8 },
  { emoji: '🚀', delay: 2, duration: 5, x: 50, y: 60, scale: 1.2 },
  { emoji: '⭐', delay: 1.5, duration: 3.5, x: 80, y: 40, scale: 0.9 },
  { emoji: '💡', delay: 0.5, duration: 4.5, x: 10, y: 70, scale: 0.7 },
  { emoji: '🎉', delay: 2.5, duration: 3, x: 30, y: 15, scale: 1.1 },
];

export function FloatingElements({ 
  elements = defaultElements, 
  className = '' 
}: FloatingElementsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ 
            left: `${el.x}%`, 
            top: `${el.y}%`,
            fontSize: `${el.scale ? el.scale * 40 : 40}px`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// Math-themed floating elements for math pages
export function MathFloatingElements({ className = '' }: { className?: string }) {
  const mathElements: FloatingElement[] = [
    { emoji: '➕', delay: 0, duration: 3, x: 15, y: 25, scale: 0.8 },
    { emoji: '➖', delay: 0.5, duration: 3.5, x: 75, y: 35, scale: 0.7 },
    { emoji: '✖️', delay: 1, duration: 4, x: 45, y: 70, scale: 0.9 },
    { emoji: '➗', delay: 1.5, duration: 3.2, x: 85, y: 60, scale: 0.75 },
    { emoji: '📊', delay: 2, duration: 4.5, x: 25, y: 80, scale: 1 },
    { emoji: '🎯', delay: 0.8, duration: 3.8, x: 60, y: 15, scale: 0.85 },
  ];

  return <FloatingElements elements={mathElements} className={className} />;
}

// Celebration-themed floating elements for success moments
export function CelebrationFloatingElements({ className = '' }: { className?: string }) {
  const celebrationElements: FloatingElement[] = [
    { emoji: '🎊', delay: 0, duration: 2, x: 20, y: 20, scale: 1.2 },
    { emoji: '🎈', delay: 0.3, duration: 2.5, x: 70, y: 30, scale: 1 },
    { emoji: '🎁', delay: 0.6, duration: 2.2, x: 50, y: 50, scale: 1.1 },
    { emoji: '🏆', delay: 0.9, duration: 2.8, x: 80, y: 70, scale: 1.3 },
    { emoji: '✨', delay: 1.2, duration: 2, x: 30, y: 75, scale: 0.9 },
  ];

  return <FloatingElements elements={celebrationElements} className={className} />;
}
