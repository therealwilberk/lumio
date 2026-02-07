import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
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
    <CardContainer containerClassName="py-0" className="w-full">
      <CardBody className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border-4 border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300 w-full h-auto">
        {/* Coming Soon Badge */}
        {isComingSoon && (
          <CardItem
            translateZ="20"
            className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
          >
            Coming Soon
          </CardItem>
        )}

        {/* Lock Overlay */}
        {!isUnlocked && !isComingSoon && (
          <div className="absolute inset-0 bg-black/20 rounded-[24px] flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Locked</p>
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className={`${!isUnlocked && !isComingSoon ? 'opacity-50' : ''}`}>
          {/* Icon */}
          <CardItem
            translateZ="50"
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner"
            style={{ backgroundColor: config.light }}
          >
            <Icon
              className="h-8 w-8"
              style={{ color: config.primary }}
            />
          </CardItem>

          {/* Title and Description */}
          <CardItem
            translateZ="60"
            as="h3"
            className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight"
          >
            {title}
          </CardItem>

          <CardItem
            translateZ="40"
            as="p"
            className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed"
          >
            {description}
          </CardItem>

          {/* Progress Bar */}
          {isUnlocked && !isComingSoon && (
            <CardItem translateZ="80" className="mb-8">
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
            </CardItem>
          )}

          {/* Action Button */}
          {isUnlocked && !isComingSoon && (
            <CardItem translateZ="30" className="w-full">
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
            </CardItem>
          )}

          {isComingSoon && (
            <CardItem translateZ="30" className="w-full">
              <AnimatedButton
                disabled
                variant="secondary"
                className="w-full"
              >
                Coming Soon
              </AnimatedButton>
            </CardItem>
          )}

          {!isUnlocked && !isComingSoon && (
            <CardItem translateZ="30" className="w-full">
              <AnimatedButton
                disabled
                variant="secondary"
                className="w-full"
              >
                Locked
              </AnimatedButton>
            </CardItem>
          )}
        </div>
      </CardBody>
    </CardContainer>
  );
}
