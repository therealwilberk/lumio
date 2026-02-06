import { motion } from 'framer-motion';
import { AnimatedButton } from './AnimatedButton';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export function EmptyState({
  emoji = '📚',
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -10, 10, 0],
          y: [0, -10, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        className="text-8xl mb-6"
      >
        {emoji}
      </motion.div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>
      
      <div className="flex gap-3">
        {action && (
          <AnimatedButton onClick={action.onClick} variant="gradient">
            {action.label}
          </AnimatedButton>
        )}
        {secondaryAction && (
          <AnimatedButton onClick={secondaryAction.onClick} variant="secondary">
            {secondaryAction.label}
          </AnimatedButton>
        )}
      </div>
    </motion.div>
  );
}

// Specialized empty states
export function NoDataState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      emoji="📊"
      title="No data yet"
      description="Start practicing to see your progress and statistics here!"
      action={onAction ? { label: "Start Learning", onClick: onAction } : undefined}
    />
  );
}

export function NoAchievementsState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      emoji="🏆"
      title="No achievements yet"
      description="Complete challenges and practice regularly to unlock achievements!"
      action={onAction ? { label: "Start Practicing", onClick: onAction } : undefined}
    />
  );
}

export function ComingSoonState({ feature }: { feature: string }) {
  return (
    <EmptyState
      emoji="🚧"
      title={`${feature} Coming Soon`}
      description="We're working hard to bring you this feature. Stay tuned!"
    />
  );
}

export function OfflineState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      emoji="📡"
      title="You're offline"
      description="Check your connection and try again to continue learning."
      action={{ label: "Try Again", onClick: onRetry }}
    />
  );
}

export function ErrorState({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-8xl mb-6"
      >
        😅
      </motion.div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {message}
      </p>
      
      <AnimatedButton onClick={onRetry} variant="primary">
        Try Again
      </AnimatedButton>
    </motion.div>
  );
}
