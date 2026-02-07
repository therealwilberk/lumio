import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import type { StudentStats, DayActivity as DayActivityType, PerformanceMetrics, Achievement as AchievementType } from '@shared/types';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { KPIGrid } from '@/components/dashboard/KPICards';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { PerformanceRadar } from '@/components/dashboard/PerformanceRadar';
import { AchievementBadge } from '@/components/dashboard/AchievementBadge';
import { ALL_ACHIEVEMENTS } from '@/lib/achievements';
import { MascotDuck } from '@/components/ui/MascotDuck';
import {
  AlertTriangle,
  Download
} from 'lucide-react';

interface TroubleSpot {
  problem: string;
  missed: number;
  total: number;
  failureRate: number;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Dashboard data
  const [dailyActivity, setDailyActivity] = useState<DayActivityType[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [troubleSpots, setTroubleSpots] = useState<TroubleSpot[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

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

      // Generate last 7 days of activity
      const today = new Date();
      const mockActivity: DayActivityType[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        mockActivity.push({
          date: date.toISOString().split('T')[0],
          problemCount: Math.floor(Math.random() * 30) + 10,
          practiceTime: Math.floor(Math.random() * 300) + 180,
          subjects: ['math']
        });
      }
      setDailyActivity(mockActivity);

      setPerformanceMetrics({
        speed: 85,
        accuracy: 90,
        consistency: 75,
        problemSolving: 80,
        mentalMath: 88
      });

      setTroubleSpots([
        { problem: '8 + 7 = ?', missed: 3, total: 5, failureRate: 60 },
        { problem: '9 + 6 = ?', missed: 2, total: 4, failureRate: 50 },
        { problem: '7 + 8 = ?', missed: 2, total: 6, failureRate: 33 },
        { problem: '6 + 9 = ?', missed: 1, total: 4, failureRate: 25 }
      ]);

      setUnlockedAchievements(['first_steps', 'getting_started', 'daily_learner']);
    }
  }, [loading, stats, user]);

  const displayStats = stats || {
    streak: 0,
    highScore: 0,
    totalScore: 0,
    totalSolved: 0,
  };

  // Calculate derived stats
  const totalPracticeTime = dailyActivity.reduce((sum, day) => sum + day.practiceTime, 0);
  const accuracyRate = performanceMetrics?.accuracy || 0;

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
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a]">
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-500">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 pt-24 relative z-10">
        {/* Mascot Interaction */}
        <div className="absolute top-24 right-10 hidden xl:block">
          <MascotDuck mood="happy" className="w-40 h-40" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-4 -left-36 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-48 text-sm font-bold text-gray-700 dark:text-gray-200"
          >
            You're on a {displayStats.streak} day streak! You're a math superstar! 🌟
            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white dark:bg-gray-800 border-r border-t border-gray-100 dark:border-gray-700 rotate-45 -translate-y-1/2" />
          </motion.div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight">
              My Stats! 📊
            </h1>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Check out all the awesome math you've mastered!
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl h-12 px-6 font-bold"
            >
              <Download className="h-5 w-5 mr-2" />
              Save My Stats
            </Button>
            <Button
              onClick={() => navigate('/math')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl h-12 px-8 font-black shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-all"
            >
              Let's Practice!
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <KPIGrid
            totalTime={formatTime(totalPracticeTime)}
            problemsSolved={displayStats.totalSolved}
            accuracy={accuracyRate}
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
          <ActivityHeatmap data={dailyActivity} />
          {performanceMetrics && <PerformanceRadar metrics={performanceMetrics} />}
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
                  Let's Practice These!
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
                <CardTitle className="text-gray-900 dark:text-white">
                  🏆 Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {ALL_ACHIEVEMENTS.slice(0, 6).map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      unlocked={unlockedAchievements.includes(achievement.id)}
                    />
                  ))}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
                  {unlockedAchievements.length} of {ALL_ACHIEVEMENTS.length} badges earned!
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate('/achievements')}
                >
                  View All Achievements
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}