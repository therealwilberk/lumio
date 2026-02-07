import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import type { StudentStats } from '@shared/types';
import { api } from '@/lib/api-client';
import { calculateTopicProgress } from '@/lib/progression';
import { Navbar } from '@/components/layout/Navbar';
import { RocketLoader } from '@/components/ui/LoadingStates';
import { MascotDuck } from '@/components/ui/MascotDuck';
import { LampContainer } from '@/components/ui/lamp';
import { Spotlight } from '@/components/ui/spotlight';
import { Meteors } from '@/components/ui/meteors';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import {
  Plus,
  Minus,
  X,
  Divide,
  Lock,
  TrendingUp,
  Target,
  Calculator,
  Award,
  BarChart3
} from 'lucide-react';

interface MathTopic {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  symbol: string;
  progress: number;
  isUnlocked: boolean;
  level: number;
  color: string;
  bgColor: string;
  description: string;
}

export function MathHubPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<MathTopic[]>([]);

  useEffect(() => {
    if (user) {
      // Fetch user stats and calculate topic progress
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const userStats = await api<StudentStats>(`/api/student/${user.id}`);
      setStats(userStats);

      // Calculate topic progress and unlock states
      const progressionData = calculateTopicProgress(userStats);
      const calculatedTopics = enrichTopicData(progressionData);
      setTopics(calculatedTopics);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Set default topics on error
      const progressionData = calculateTopicProgress(null);
      setTopics(enrichTopicData(progressionData));
    } finally {
      setLoading(false);
    }
  };

  const enrichTopicData = (progressionData: any[]): MathTopic[] => {
    const topicMetadata: Record<string, any> = {
      addition: {
        name: 'Addition',
        icon: Plus,
        symbol: '+',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: 'Master basic addition with fun challenges'
      },
      subtraction: {
        name: 'Subtraction',
        icon: Minus,
        symbol: '-',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: 'Build confidence with subtraction problems'
      },
      multiplication: {
        name: 'Multiplication',
        icon: X,
        symbol: '×',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        description: 'Learn multiplication patterns and tables'
      },
      division: {
        name: 'Division',
        icon: Divide,
        symbol: '÷',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        description: 'Master division step by step'
      }
    };

    return progressionData.map(topic => ({
      ...topic,
      ...topicMetadata[topic.id]
    }));
  };

  const handleTopicClick = (topic: MathTopic) => {
    if (topic.isUnlocked) {
      navigate(`/math/${topic.id}`);
    }
  };

  const getWeeklyScore = () => {
    // Mock weekly score calculation
    return stats?.totalScore ? Math.floor(stats.totalScore * 0.3) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center pt-24">
          <RocketLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 pt-24 relative z-10">
        <Meteors number={20} />

        {/* Mascot Greeting */}
        <div className="absolute top-24 right-10 hidden xl:block">
          <MascotDuck mood="idle" className="w-48 h-48" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-4 -left-32 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-48 text-sm font-bold text-gray-700 dark:text-gray-200"
          >
            Choose your next adventure, {user?.username || 'explorer'}! 🗺️
            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white dark:bg-gray-800 border-r border-t border-gray-100 dark:border-gray-700 rotate-45 -translate-y-1/2" />
          </motion.div>
        </div>

        {/* Header with Lamp Effect */}
        <div className="-mx-6 -mt-12 mb-12 overflow-hidden">
          <LampContainer className="min-h-[500px]">
            <motion.h1
              initial={{ opacity: 0.5, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
            >
              Pick Your Math Adventure! 🎯
            </motion.h1>
          </LampContainer>
        </div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
        >
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.totalSolved || 0}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.streak || 0}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Points This Week</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getWeeklyScore()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Math Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <HoverBorderGradient
                as="div"
                containerClassName="rounded-3xl"
                className={`dark:bg-black bg-white text-black dark:text-white ${topic.isUnlocked
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-75'
                  }`}
                onClick={() => handleTopicClick(topic)}
              >
                <div className="p-8 w-full">
                  {/* Icon and Symbol */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 ${topic.bgColor} rounded-2xl flex items-center justify-center`}>
                      <topic.icon className={`h-8 w-8 ${topic.color}`} />
                    </div>
                    <div className="text-4xl font-bold text-gray-400 dark:text-gray-500">
                      {topic.symbol}
                    </div>
                  </div>

                  {/* Topic Name and Level */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {topic.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Level {topic.level}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {topic.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {topic.progress === 0 ? "Not Started" : topic.progress < 100 ? "In Progress" : "Mastered!"}
                      </span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                        {topic.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-4 overflow-hidden border-2 border-gray-200 dark:border-gray-800">
                      <motion.div
                        className={`h-full rounded-full ${topic.progress < 100
                            ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                            : 'bg-gradient-to-r from-green-400 to-green-600'
                          }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.progress}%` }}
                        transition={{ duration: 1.5, type: "spring" }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  {topic.isUnlocked ? (
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl transition-all"
                    >
                      Let's Practice {topic.name}!
                    </Button>
                  ) : (
                    <div className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-3 rounded-xl text-center font-medium">
                      Locked 🔒
                    </div>
                  )}
                </div>
              </HoverBorderGradient>
            </motion.div>
          ))}
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl p-8 rounded-3xl max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Math Adventure! 🗺️
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Beat each topic to unlock the next one. Master all four to become a Math Champion! 🏆
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topics.map((topic) => (
                <div key={topic.id} className="text-center">
                  <div className={`w-12 h-12 ${topic.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <topic.icon className={`h-6 w-6 ${topic.color}`} />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {topic.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {topic.isUnlocked ? 'Ready!' : 'Locked'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
