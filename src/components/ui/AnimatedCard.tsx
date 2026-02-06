import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'yellow';
  delay?: number;
  onClick?: () => void;
}

const glowColors = {
  blue: 'hover:shadow-blue-500/20 focus:shadow-blue-500/20',
  purple: 'hover:shadow-purple-500/20 focus:shadow-purple-500/20',
  green: 'hover:shadow-green-500/20 focus:shadow-green-500/20',
  orange: 'hover:shadow-orange-500/20 focus:shadow-orange-500/20',
  pink: 'hover:shadow-pink-500/20 focus:shadow-pink-500/20',
  yellow: 'hover:shadow-yellow-500/20 focus:shadow-yellow-500/20',
};

export function AnimatedCard({
  children,
  className = '',
  glowColor = 'blue',
  delay = 0,
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl shadow-sm transition-shadow duration-300',
        glowColors[glowColor],
        onClick && 'cursor-pointer',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.3,
        delay,
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// Breathing card for ambient animation
export function BreathingCard({
  children,
  className = '',
  glowColor = 'blue',
}: AnimatedCardProps) {
  return (
    <motion.div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl shadow-sm',
        glowColors[glowColor],
        className
      )}
      animate={{
        scale: [1, 1.02, 1],
        boxShadow: [
          '0 4px 6px rgba(0, 0, 0, 0.05)',
          '0 10px 20px rgba(0, 0, 0, 0.1)',
          '0 4px 6px rgba(0, 0, 0, 0.05)',
        ],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{
        y: -4,
        scale: 1.03,
        transition: { type: 'spring', stiffness: 400, damping: 20 }
      }}
    >
      {children}
    </motion.div>
  );
}

// Interactive subject card with lock/unlock states
interface SubjectCardProps extends AnimatedCardProps {
  isLocked?: boolean;
  progress?: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function SubjectAnimatedCard({
  children,
  isLocked = false,
  progress = 0,
  icon,
  title,
  description,
  className = '',
  glowColor = 'blue',
  onClick,
}: SubjectCardProps) {
  return (
    <motion.div
      className={cn(
        'relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden',
        !isLocked && 'cursor-pointer',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isLocked ? {
        y: -8,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            🔒
          </motion.div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            glowColor === 'blue' && 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
            glowColor === 'purple' && 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400',
            glowColor === 'green' && 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400',
            glowColor === 'orange' && 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400',
            glowColor === 'pink' && 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400',
            glowColor === 'yellow' && 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400',
          )}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
        
        {!isLocked && progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-semibold text-gray-900 dark:text-white">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  glowColor === 'blue' && 'bg-blue-500',
                  glowColor === 'purple' && 'bg-purple-500',
                  glowColor === 'green' && 'bg-green-500',
                  glowColor === 'orange' && 'bg-orange-500',
                  glowColor === 'pink' && 'bg-pink-500',
                  glowColor === 'yellow' && 'bg-yellow-500',
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
        
        {children}
      </div>
    </motion.div>
  );
}
