import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import type { StudentStats } from '@shared/types';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { BrainCircuit, Target, Sparkles, TrendingUp, Play } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api<StudentStats>(`/api/student/${user.id}`)
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const displayStats = stats || {
    streak: 0,
    highScore: 0,
    totalScore: 0,
    totalSolved: 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg text-gray-600">Loading Dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome back, <span className="text-blue-600">{user?.username}</span>!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to continue your math adventure? Track your progress and start your next challenge.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
              <Target className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{displayStats.streak}</div>
              <p className="text-xs text-gray-500">Days in a row</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">High Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{displayStats.highScore}</div>
              <p className="text-xs text-gray-500">Best session</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total XP</CardTitle>
              <Sparkles className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{displayStats.totalScore}</div>
              <p className="text-xs text-blue-500">Points earned</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Problems Solved</CardTitle>
              <BrainCircuit className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{displayStats.totalSolved}</div>
              <p className="text-xs text-gray-500">Completed</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready for Your Next Challenge?
              </h2>
              
              <p className="text-gray-600 mb-8">
                Continue your learning journey with addition problems. Track your progress and earn XP as you master new skills!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/math/addition')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  Start Addition Practice
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/subjects')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg rounded-xl transition-all"
                >
                  View All Subjects
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Welcome to Lumio!</span>
                </div>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
              
              {displayStats.totalSolved > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Solved {displayStats.totalSolved} problems</span>
                  </div>
                  <span className="text-xs text-gray-500">Recent</span>
                </div>
              )}
              
              {displayStats.streak > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{displayStats.streak} day streak!</span>
                  </div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}