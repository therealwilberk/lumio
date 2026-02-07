import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.button
      className={cn(
        'rounded-xl font-semibold transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'primary' && 'focus:ring-blue-500',
        variant === 'success' && 'focus:ring-green-500',
        variant === 'danger' && 'focus:ring-red-500',
        variant === 'gradient' && 'focus:ring-purple-500',
        variantStyles[variant],
        sizeStyles[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled && !isLoading ? { 
        scale: 1.05, 
        y: -2,
      } : {}}
      whileTap={!disabled && !isLoading ? { 
        scale: 0.95,
      } : {}}
      transition={{ 
        type: 'spring', 
        stiffness: 250,
        damping: 12
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.span
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            ⏳
          </motion.span>
          Loading...
        </motion.span>
      ) : (
        children
      )}
    </motion.button>
  );
}

// Icon button with animations
interface AnimatedIconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function AnimatedIconButton({
  icon,
  label,
  variant = 'secondary',
  className = '',
  ...props
}: AnimatedIconButtonProps) {
  return (
    <motion.button
      className={cn(
        'p-3 rounded-xl transition-colors duration-200',
        variant === 'primary' && 'bg-blue-100 text-blue-600 hover:bg-blue-200',
        variant === 'secondary' && 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        variant === 'ghost' && 'hover:bg-gray-100 text-gray-700',
        className
      )}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9, rotate: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      <motion.span
        className="flex items-center gap-2"
        whileHover={{ x: 2 }}
      >
        {icon}
        {label && <span className="text-sm font-medium">{label}</span>}
      </motion.span>
    </motion.button>
  );
}

// Floating action button
export function FloatingActionButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      className={cn(
        'fixed bottom-6 right-6 w-14 h-14 rounded-full',
        'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
        'shadow-lg hover:shadow-xl',
        'flex items-center justify-center',
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -5, 0],
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
