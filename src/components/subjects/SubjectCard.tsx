import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
  },
  kiswahili: {
    primary: '#ec4899',
    secondary: '#db2777',
    light: '#fce7f3',
    icon: BookOpen,
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)'
  },
  agriculture: {
    primary: '#10b981',
    secondary: '#059669',
    light: '#d1fae5',
    icon: Sprout,
    gradient: 'linear-gradient(135deg, #10b981, #059669)'
  },
  english: {
    primary: '#f59e0b',
    secondary: '#d97706',
    light: '#fef3c7',
    icon: PenTool,
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
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
      whileHover={isUnlocked && !isComingSoon ? { y: -8 } : {}}
      className="relative"
    >
      <div 
        className="relative bg-white rounded-[24px] p-8 shadow-lg transition-all duration-300 hover:shadow-2xl"
        style={{
          boxShadow: isUnlocked && !isComingSoon 
            ? '0 4px 20px rgba(0, 0, 0, 0.08)' 
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
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
            className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: config.light }}
          >
            <Icon 
              className="h-6 w-6"
              style={{ color: config.primary }}
            />
          </div>

          {/* Title and Description */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">{description}</p>

          {/* Progress Bar */}
          {isUnlocked && !isComingSoon && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Progress</span>
                <span className="text-sm font-semibold" style={{ color: config.primary }}>
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ 
                    background: config.gradient,
                    width: `${progress}%`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          {isUnlocked && !isComingSoon && (
            <Button
              onClick={onContinue}
              className="w-full text-white font-semibold rounded-xl py-3 transition-all transform hover:scale-105"
              style={{ background: config.gradient }}
            >
              <span className="flex items-center justify-center gap-2">
                Continue Learning
                <ChevronRight className="h-4 w-4" />
              </span>
            </Button>
          )}

          {isComingSoon && (
            <Button
              disabled
              className="w-full bg-gray-100 text-gray-500 font-semibold rounded-xl py-3 cursor-not-allowed"
            >
              Coming Soon
            </Button>
          )}

          {!isUnlocked && !isComingSoon && (
            <Button
              disabled
              className="w-full bg-gray-100 text-gray-500 font-semibold rounded-xl py-3 cursor-not-allowed"
            >
              Locked
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
