import toast, { Toaster, type ToastOptions } from 'react-hot-toast';

export type NotificationType = 'success' | 'error' | 'info' | 'streak' | 'achievement' | 'warning';

interface NotificationStyles {
  icon: string;
  duration: number;
  style: Record<string, string>;
}

const notificationStyles: Record<NotificationType, NotificationStyles> = {
  success: {
    icon: '🎉',
    duration: 2000,
    style: {
      background: '#10b981',
      color: '#fff',
    },
  },
  error: {
    icon: '💪',
    duration: 3000,
    style: {
      background: '#ef4444',
      color: '#fff',
    },
  },
  info: {
    icon: '💡',
    duration: 2500,
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  },
  streak: {
    icon: '🔥',
    duration: 2000,
    style: {
      background: '#f97316',
      color: '#fff',
    },
  },
  achievement: {
    icon: '🏆',
    duration: 3000,
    style: {
      background: '#8b5cf6',
      color: '#fff',
    },
  },
  warning: {
    icon: '⚠️',
    duration: 2500,
    style: {
      background: '#f59e0b',
      color: '#fff',
    },
  },
};

export function showNotification(
  type: NotificationType,
  message: string,
  options?: ToastOptions
) {
  const styles = notificationStyles[type];
  
  toast(message, {
    icon: styles.icon,
    duration: styles.duration,
    style: {
      borderRadius: '12px',
      padding: '16px',
      fontSize: '16px',
      fontWeight: '600',
      ...styles.style,
    },
    ...options,
  });
}

// Convenience functions
export const notify = {
  success: (message: string, options?: ToastOptions) => 
    showNotification('success', message, options),
  error: (message: string, options?: ToastOptions) => 
    showNotification('error', message, options),
  info: (message: string, options?: ToastOptions) => 
    showNotification('info', message, options),
  streak: (count: number, options?: ToastOptions) => 
    showNotification('streak', `${count} streak! Keep it up! 🔥`, options),
  achievement: (name: string, options?: ToastOptions) => 
    showNotification('achievement', `Achievement unlocked: ${name}! 🏆`, options),
  warning: (message: string, options?: ToastOptions) => 
    showNotification('warning', message, options),
};

// Toast provider component to add to App.tsx
export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        success: {
          duration: 2000,
          style: {
            borderRadius: '12px',
            padding: '16px',
          },
        },
        error: {
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '16px',
          },
        },
      }}
    />
  );
}

// Custom toast components for complex notifications
export function LoadingToast({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>{message}</span>
    </div>
  );
}

export function PointsToast({ points }: { points: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">⭐</span>
      <div>
        <p className="font-bold">+{points} points!</p>
        <p className="text-sm opacity-80">Great job!</p>
      </div>
    </div>
  );
}
