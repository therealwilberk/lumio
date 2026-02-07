import React from 'react';
import { motion } from 'framer-motion';
import { SubjectCard } from './SubjectCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function SubjectsSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock progress data - in a real app, this would come from the backend
  const subjects = [
    {
      subject: 'math' as const,
      title: 'Math Adventure',
      description: 'Level up your brain with fun plus, minus, and times tables challenges!',
      progress: 35,
      isUnlocked: true,
      isComingSoon: false
    },
    {
      subject: 'kiswahili' as const,
      title: 'Kiswahili Zone',
      description: 'Learn Swahili the fun way with new words and cool stories!',
      progress: 0,
      isUnlocked: false,
      isComingSoon: true
    },
    {
      subject: 'agriculture' as const,
      title: 'Farm Science',
      description: 'Discover the secrets of plants and how to grow your own garden!',
      progress: 0,
      isUnlocked: false,
      isComingSoon: true
    },
    {
      subject: 'english' as const,
      title: 'Word Master',
      description: 'Become a pro at reading and writing while discovering amazing new books!',
      progress: 0,
      isUnlocked: false,
      isComingSoon: true
    }
  ];

  return (
    <section id="subjects-section" className="py-20 px-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Pick Your Adventure! 🚀
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose a subject and start leveling up your skills!
          </p>
        </motion.div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.subject}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1 
              }}
            >
              <SubjectCard
                subject={subject.subject}
                title={subject.title}
                description={subject.description}
                progress={subject.progress}
                isUnlocked={subject.isUnlocked}
                isComingSoon={subject.isComingSoon}
                onContinue={() => {
                  if (subject.subject === 'math') {
                    navigate('/math');
                  }
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl p-8 rounded-3xl max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Learning Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Track your progress across all subjects and unlock new content as you advance.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Subjects Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">35%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Math Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Coming Soon</div>
              </div>
            </div>

            {user && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Keep learning to unlock more subjects and earn achievements!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
