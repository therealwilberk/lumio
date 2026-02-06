import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import type { StudentStats } from '@shared/types';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { RocketLoader } from '@/components/ui/LoadingStates';
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
      const calculatedTopics = calculateTopicProgress(userStats);
      setTopics(calculatedTopics);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Set default topics on error
      setTopics(calculateTopicProgress(null));
    } finally {
      setLoading(false);
    }
  };

  const calculateTopicProgress = (userStats: StudentStats | null): MathTopic[] => {
    // Mock progress data - in real app, this would come from backend
    const additionProgress = userStats?.totalScore ? Math.min((userStats.totalScore / 100) * 100, 100) : 35;
    const subtractionProgress = additionProgress >= 80 ? Math.min((additionProgress - 60) * 0.8, 100) : 0;
    const multiplicationProgress = subtractionProgress >= 80 ? Math.min((subtractionProgress - 60) * 0.7, 100) : 0;
    const divisionProgress = multiplicationProgress >= 80 ? Math.min((multiplicationProgress - 60) * 0.6, 100) : 0;

    return [
      {
        id: 'addition',
        name: 'Addition',
        icon: Plus,
        symbol: '+',
        progress: additionProgress,
        isUnlocked: true,
        level: Math.floor(additionProgress / 20) + 1,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: 'Master basic addition with fun challenges'
      },
      {
        id: 'subtraction',
        name: 'Subtraction',
        icon: Minus,
        symbol: '-',
        progress: subtractionProgress,
        isUnlocked: additionProgress >= 80,
        level: subtractionProgress > 0 ? Math.floor(subtractionProgress / 20) + 1 : 1,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: 'Build confidence with subtraction problems'
      },
      {
        id: 'multiplication',
        name: 'Multiplication',
        icon: X,
        symbol: '×',
        progress: multiplicationProgress,
        isUnlocked: subtractionProgress >= 80,
        level: multiplicationProgress > 0 ? Math.floor(multiplicationProgress / 20) + 1 : 1,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        description: 'Learn multiplication patterns and tables'
      },
      {
        id: 'division',
        name: 'Division',
        icon: Divide,
        symbol: '÷',
        progress: divisionProgress,
        isUnlocked: multiplicationProgress >= 80,
        level: divisionProgress > 0 ? Math.floor(divisionProgress / 20) + 1 : 1,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        description: 'Master division step by step'
      }
    ];
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        <Navbar />
        <div className="flex items-center justify-center pt-24">
          <RocketLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Math Hub! 🔢
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn math one adventure at a time. Beat challenges to unlock new topics!
          </p>
        </motion.div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={topic.isUnlocked ? { scale: 1.05 } : {}}
              className="relative"
            >
              <Card 
                className={`bg-white dark:bg-gray-800 border-0 shadow-xl overflow-hidden transition-all duration-300 ${
                  topic.isUnlocked 
                    ? 'cursor-pointer hover:shadow-2xl' 
                    : 'cursor-not-allowed opacity-75'
                }`}
                onClick={() => handleTopicClick(topic)}
              >
                <CardContent className="p-8">
                  {/* Lock Overlay */}
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
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {topic.progress === 0 ? "Let's get started!" : topic.progress < 50 ? "Keep going!" : topic.progress < 100 ? "Almost there!" : "You did it!"}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {topic.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${topic.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    {topic.isUnlocked ? (
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl transition-all transform hover:scale-105"
                      >
                        Let's Practice {topic.name}!
                      </Button>
                    ) : (
                      <div className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-3 rounded-xl text-center font-medium">
                        Locked 🔒
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
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
