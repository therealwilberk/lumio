import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import type { StudentStats } from '@shared/types';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { DailyActivityChart, SpeedImprovementChart } from '@/components/dashboard/ActivityCharts';
import { 
  BrainCircuit, 
  Target, 
  Sparkles, 
  TrendingUp, 
  Play, 
  Clock, 
  Award,
  Download,
  BarChart3,
  LineChart,
  PieChart,
  AlertTriangle,
  Lock,
  Trophy,
  Flame,
  CheckCircle
} from 'lucide-react';

interface DailyActivity {
  day: string;
  problems: number;
  time: number;
}

interface SpeedTrend {
  session: string;
  avgTime: number;
  accuracy: number;
}

interface TroubleSpot {
  problem: string;
  missed: number;
  total: number;
  failureRate: number;
}

interface Achievement {
  id: string;
  name: string;
  icon: React.ReactNode;
  unlocked: boolean;
  criteria: string;
  progress?: number;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Dashboard data
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [speedTrend, setSpeedTrend] = useState<SpeedTrend[]>([]);
  const [troubleSpots, setTroubleSpots] = useState<TroubleSpot[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (user) {
      Promise.all([
        api<StudentStats>(`/api/student/${user.id}`),
        api<DailyActivity[]>(`/api/student/${user.id}/daily-activity`),
        api<SpeedTrend[]>(`/api/student/${user.id}/speed-trend`),
        api<TroubleSpot[]>(`/api/student/${user.id}/trouble-spots`),
        api<Achievement[]>(`/api/student/${user.id}/achievements`)
      ])
        .then(([statsData, activityData, speedData, troubleData, achievementData]) => {
          setStats(statsData);
          setDailyActivity(activityData);
          setSpeedTrend(speedData);
          setTroubleSpots(troubleData);
          setAchievements(achievementData);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Mock data for development
  useEffect(() => {
    if (!loading && !stats) {
      setStats({
        id: user?.id || 'demo-user',
        streak: 5,
        highScore: 240,
        totalScore: 1250,
        totalSolved: 287,
        lastSolvedAt: Date.now(),
        difficulty: 'medium',
        sessionLogs: []
      });
      
      setDailyActivity([
        { day: 'Mon', problems: 15, time: 180 },
        { day: 'Tue', problems: 20, time: 240 },
        { day: 'Wed', problems: 18, time: 210 },
        { day: 'Thu', problems: 25, time: 300 },
        { day: 'Fri', problems: 22, time: 270 },
        { day: 'Sat', problems: 30, time: 360 },
        { day: 'Sun', problems: 28, time: 330 }
      ]);
      
      setSpeedTrend([
        { session: 'Session 1', avgTime: 12.5, accuracy: 85 },
        { session: 'Session 2', avgTime: 11.2, accuracy: 88 },
        { session: 'Session 3', avgTime: 10.8, accuracy: 90 },
        { session: 'Session 4', avgTime: 9.5, accuracy: 92 },
        { session: 'Session 5', avgTime: 8.9, accuracy: 94 }
      ]);
      
      setTroubleSpots([
        { problem: '8 + 7 = ?', missed: 3, total: 5, failureRate: 60 },
        { problem: '9 + 6 = ?', missed: 2, total: 4, failureRate: 50 },
        { problem: '7 + 8 = ?', missed: 2, total: 6, failureRate: 33 },
        { problem: '6 + 9 = ?', missed: 1, total: 4, failureRate: 25 }
      ]);
      
      setAchievements([
        { id: 'first_problem', name: 'First Steps', icon: <Trophy className="h-6 w-6" />, unlocked: true, criteria: 'Solve your first problem' },
        { id: 'streak_3', name: '3 Day Streak', icon: <Award className="h-6 w-6" />, unlocked: true, criteria: 'Practice for 3 consecutive days' },
        { id: 'speed_demon', name: 'Speed Demon', icon: <Sparkles className="h-6 w-6" />, unlocked: false, criteria: 'Complete 20 problems in under 2 minutes' },
        { id: 'perfect_week', name: 'Perfect Week', icon: <Target className="h-6 w-6" />, unlocked: false, criteria: 'Practice every day for a week' },
        { id: 'math_master', name: 'Math Master', icon: <BrainCircuit className="h-6 w-6" />, unlocked: false, criteria: 'Achieve 95% accuracy over 100 problems' },
        { id: 'legend', name: 'Legend', icon: <Trophy className="h-6 w-6" />, unlocked: false, criteria: 'Unlock all achievements' }
      ]);
    }
  }, [loading, stats]);

  const displayStats = stats || {
    streak: 0,
    highScore: 0,
    totalScore: 0,
    totalSolved: 0,
  };

  // Calculate derived stats
  const totalPracticeTime = dailyActivity.reduce((sum, day) => sum + day.time, 0);
  const accuracyRate = speedTrend.length > 0 
    ? Math.round(speedTrend.reduce((sum, session) => sum + session.accuracy, 0) / speedTrend.length)
    : 0;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg text-gray-600 dark:text-gray-300">Loading Dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, {user?.username}! Track your progress and achievements.
            </p>
          </div>
          
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </motion.div>

        {/* Colorful Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <StatsGrid
            totalTime={formatTime(totalPracticeTime)}
            problemsSolved={displayStats.totalSolved}
            accuracyRate={accuracyRate}
            streak={displayStats.streak}
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <DailyActivityChart data={dailyActivity} />
          <SpeedImprovementChart data={speedTrend} />
        </motion.div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trouble Spots */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Trouble Spots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {troubleSpots.map((spot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {spot.problem}
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-400">
                          {spot.missed}/{spot.total} missed
                        </div>
                      </div>
                      <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                        {spot.failureRate}%
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => navigate('/math/regular-practice')}
                >
                  Practice These
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`relative p-3 rounded-xl text-center transition-all ${
                        achievement.unlocked
                          ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
                          : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className={`mb-2 ${achievement.unlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`}>
                        {achievement.icon}
                      </div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {achievement.name}
                      </div>
                      {!achievement.unlocked && (
                        <Lock className="absolute top-1 right-1 h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}