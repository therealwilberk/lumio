import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function StreakCounter({ 
  count, 
  size = 'md', 
  showLabel = true,
  className = '' 
}: StreakCounterProps) {
  if (count === 0) return null;

  const sizeClasses = {
    sm: 'px-2 py-1 gap-1 text-sm',
    md: 'px-3 py-1.5 gap-2 text-base',
    lg: 'px-4 py-2 gap-2 text-lg',
  };

  const fireSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        'inline-flex items-center rounded-full font-bold',
        'bg-gradient-to-r from-orange-500 to-red-500 text-white',
        sizeClasses[size],
        className
      )}
    >
      <motion.span
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -10, 10, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
        className={fireSizes[size]}
      >
        🔥
      </motion.span>
      <span>
        {count} {showLabel && 'Streak!'}
      </span>
    </motion.div>
  );
}

// Compact streak badge for inline use
export function StreakBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-semibold"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
      >
        🔥
      </motion.span>
      {count}
    </motion.div>
  );
}

// Animated streak achievement
interface StreakMilestoneProps {
  streak: number;
  onComplete: () => void;
}

export function StreakMilestone({ streak, onComplete }: StreakMilestoneProps) {
  const milestones = [5, 10, 25, 50, 100];
  const isMilestone = milestones.includes(streak);

  if (!isMilestone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 text-center shadow-2xl max-w-sm mx-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -20, 20, 0]
          }}
          transition={{ duration: 0.8, repeat: 2 }}
          className="text-8xl mb-4"
        >
          🔥
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white mb-2">
          {streak} Streak!
        </h2>
        <p className="text-orange-100 text-lg">
          Incredible! You&apos;re on fire!
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-white/80 text-sm"
        >
          Keep practicing to maintain your streak!
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
