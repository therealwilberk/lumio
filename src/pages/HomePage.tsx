import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Flame, Play, Target, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { v4 as uuidv4 } from 'uuid';
import type { StudentStats } from '../../worker/entities';
export function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let userId = localStorage.getItem('nexus_user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('nexus_user_id', userId);
    }
    api<StudentStats>(`/api/student/${userId}`)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-2xl font-bold text-primary">Loading Nexus...</div>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-primary floating">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-balance tracking-tight">
              Number<span className="text-gradient">Nexus</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Master math through visual mental models and interactive play.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="rounded-3xl border-2 hover:border-orange-400 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats?.streak ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Days on fire!</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-2 hover:border-indigo-400 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" /> High Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats?.highScore ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Personal best</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-2 hover:border-green-400 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" /> Total Solved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats?.totalSolved ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Problems completed</p>
              </CardContent>
            </Card>
          </div>
          <div className="pt-8">
            <Button 
              size="lg" 
              className="btn-gradient px-12 py-8 text-2xl font-bold rounded-3xl shadow-glow-lg"
              onClick={() => navigate('/sandbox')}
            >
              <Play className="mr-3 w-8 h-8 fill-current" /> Start Training
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}