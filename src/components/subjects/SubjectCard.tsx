import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { 
  Calculator, 
  BookOpen, 
  Sprout, 
  PenTool, 
  Lock, 
  TrendingUp,
  ChevronRight 
} from 'lucide-react';

export interface SubjectCardProps {
  subject: 'math' | 'kiswahili' | 'agriculture' | 'english';
  title: string;
  description: string;
  progress: number;
  isUnlocked: boolean;
  isComingSoon?: boolean;
  onContinue?: () => void;
}

const subjectConfig = {
  math: {
    primary: '#3b82f6',
    secondary: '#2563eb',
    light: '#dbeafe',
    icon: Calculator,
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    path: '/math'
  },
  kiswahili: {
    primary: '#ec4899',
    secondary: '#db2777',
    light: '#fce7f3',
    icon: BookOpen,
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    path: '#'
  },
  agriculture: {
    primary: '#10b981',
    secondary: '#059669',
    light: '#d1fae5',
    icon: Sprout,
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    path: '#'
  },
  english: {
    primary: '#f59e0b',
    secondary: '#d97706',
    light: '#fef3c7',
    icon: PenTool,
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    path: '#'
  }
};

export function SubjectCard({ 
  subject, 
  title, 
  description, 
  progress, 
  isUnlocked, 
  isComingSoon = false,
  onContinue 
}: SubjectCardProps) {
  const config = subjectConfig[subject];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      whileHover={isUnlocked && !isComingSoon ? { y: -12, scale: 1.02 } : {}}
      className="relative"
    >
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border-4 border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300"
      >
        {/* Coming Soon Badge */}
        {isComingSoon && (
          <div 
            className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
          >
            Coming Soon
          </div>
        )}

        {/* Lock Overlay */}
        {!isUnlocked && !isComingSoon && (
          <div className="absolute inset-0 bg-black/20 rounded-[24px] flex items-center justify-center">
            <div className="text-center">
              <Lock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Locked</p>
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className={`${!isUnlocked && !isComingSoon ? 'opacity-50' : ''}`}>
          {/* Icon */}
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner"
            style={{ backgroundColor: config.light }}
          >
            <Icon 
              className="h-8 w-8"
              style={{ color: config.primary }}
            />
          </div>

          {/* Title and Description */}
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">{title}</h3>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">{description}</p>

          {/* Progress Bar */}
          {isUnlocked && !isComingSoon && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                  {progress === 0 ? "Not Started" : progress < 100 ? "In Progress" : "Mastered!"}
                </span>
                <span className="text-sm font-black" style={{ color: config.primary }}>
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-3 overflow-hidden border border-gray-100 dark:border-gray-700">
                <motion.div
                  className="h-full rounded-full shadow-inner"
                  style={{ 
                    background: config.gradient,
                    width: `${progress}%`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, type: "spring" }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          {isUnlocked && !isComingSoon && (
            <AnimatedButton
              onClick={onContinue}
              variant="primary"
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                Let's Practice!
                <ChevronRight className="h-4 w-4" />
              </span>
            </AnimatedButton>
          )}

          {isComingSoon && (
            <AnimatedButton
              disabled
              variant="secondary"
              className="w-full"
            >
              Coming Soon
            </AnimatedButton>
          )}

          {!isUnlocked && !isComingSoon && (
            <AnimatedButton
              disabled
              variant="secondary"
              className="w-full"
            >
              Locked
            </AnimatedButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}
