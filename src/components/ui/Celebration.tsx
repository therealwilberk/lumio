import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export type CelebrationType = 'correct' | 'levelUp' | 'streak' | 'achievement' | 'completion';

interface CelebrationConfig {
  particleCount: number;
  spread: number;
  origin?: { x?: number; y?: number };
  colors: string[];
  shapes?: ('circle' | 'square' | 'star')[];
  scalar?: number;
}

const celebrationConfigs: Record<CelebrationType, CelebrationConfig> = {
  correct: {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#34d399', '#6ee7b7', '#059669'],
  },
  levelUp: {
    particleCount: 200,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#f97316'],
    shapes: ['star'],
    scalar: 1.2,
  },
  streak: {
    particleCount: 150,
    spread: 80,
    origin: { x: 0.5, y: 0.8 },
    colors: ['#ef4444', '#f97316', '#fb923c', '#fca5a5'],
  },
  achievement: {
    particleCount: 180,
    spread: 90,
    origin: { y: 0.5 },
    colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed'],
    shapes: ['star'],
  },
  completion: {
    particleCount: 250,
    spread: 120,
    origin: { y: 0.5 },
    colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#f59e0b'],
    scalar: 1.5,
  },
};

export function celebrate(type: CelebrationType = 'correct') {
  const config = celebrationConfigs[type];
  
  confetti({
    ...config,
    disableForReducedMotion: true,
    zIndex: 100,
  });

  // Multiple bursts for bigger celebrations
  if (type === 'levelUp' || type === 'completion') {
    setTimeout(() => {
      confetti({
        ...config,
        particleCount: config.particleCount / 2,
        origin: { x: 0.2, y: 0.7 },
      });
    }, 200);
    
    setTimeout(() => {
      confetti({
        ...config,
        particleCount: config.particleCount / 2,
        origin: { x: 0.8, y: 0.7 },
      });
    }, 400);
  }
}

// Firework-style celebration for major achievements
export function celebrateFireworks() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

// Success overlay component with celebration
interface SuccessOverlayProps {
  message: string;
  subMessage?: string;
  points?: number;
  emoji?: string;
  duration?: number;
  onComplete: () => void;
}

export function SuccessOverlay({
  message,
  subMessage,
  points,
  emoji = '🎉',
  duration = 1500,
  onComplete,
}: SuccessOverlayProps) {
  useEffect(() => {
    celebrate('correct');
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{
          scale: [0.5, 1.1, 1],
          y: [50, -10, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow-2xl max-w-sm mx-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -15, 15, 0],
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-7xl mb-4"
        >
          {emoji}
        </motion.div>
        
        <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
          {message}
        </h2>
        
        {subMessage && (
          <p className="text-gray-600 dark:text-gray-400 mb-2">{subMessage}</p>
        )}
        
        {points && points > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-blue-600 dark:text-blue-400"
          >
            +{points} points! ⭐
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Level up overlay
interface LevelUpOverlayProps {
  level: number;
  onComplete: () => void;
}

export function LevelUpOverlay({ level, onComplete }: LevelUpOverlayProps) {
  useEffect(() => {
    celebrate('levelUp');
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-10 text-center shadow-2xl max-w-sm mx-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-8xl mb-4"
        >
          🏆
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white mb-2">
          Level Up!
        </h2>
        <p className="text-xl text-yellow-100">
          You're now Level {level}!
        </p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-white/80 text-sm"
        >
          Amazing progress! Keep it up! 🚀
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Streak celebration overlay
interface StreakOverlayProps {
  streak: number;
  onComplete: () => void;
}

export function StreakOverlay({ streak, onComplete }: StreakOverlayProps) {
  useEffect(() => {
    celebrate('streak');
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: -100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-8 py-4 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="text-4xl"
          >
            🔥
          </motion.span>
          <div className="text-white">
            <p className="text-2xl font-bold">{streak} Streak!</p>
            <p className="text-sm opacity-90">Keep it going!</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
