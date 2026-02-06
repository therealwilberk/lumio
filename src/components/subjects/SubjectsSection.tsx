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
      title: 'Mathematics',
      description: 'Master addition, subtraction, multiplication, and division with interactive challenges.',
      progress: 35,
      isUnlocked: true,
      isComingSoon: false,
      path: '/math/addition'
    },
    {
      subject: 'kiswahili' as const,
      title: 'Kiswahili',
      description: 'Learn Swahili language basics, vocabulary, and conversational skills.',
      progress: 0,
      isUnlocked: false,
      isComingSoon: true,
      path: '#'
    },
    {
      subject: 'agriculture' as const,
      title: 'Agriculture',
      description: 'Explore farming concepts, plant science, and sustainable agriculture practices.',
      progress: 0,
      isUnlocked: false,
      isComingSoon: true,
      path: '#'
    },
    {
      subject: 'english' as const,
      title: 'English',
      description: 'Improve reading, writing, grammar, and communication skills in English.',
      progress: 0,
      isUnlocked: false,
      isComingSoon: true,
      path: '#'
    }
  ];

  const handleContinue = (path: string) => {
    navigate(path);
  };

  return (
    <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Learning Path
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master fundamental skills through engaging, interactive challenges designed for Grade 6 students.
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
                onContinue={() => handleContinue(subject.path)}
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
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-8 rounded-3xl max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your Learning Journey
            </h3>
            <p className="text-gray-600 mb-6">
              Track your progress across all subjects and unlock new content as you advance.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1</div>
                <div className="text-sm text-gray-600">Subjects Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">35%</div>
                <div className="text-sm text-gray-600">Math Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">Coming Soon</div>
              </div>
            </div>

            {user && (
              <div className="text-sm text-gray-500">
                Keep learning to unlock more subjects and earn achievements!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
