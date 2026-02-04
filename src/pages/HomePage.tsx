import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Flame, Play, Target, Star, Zap, ShieldCheck, Activity } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { v4 as uuidv4 } from 'uuid';
import type { StudentStats, DifficultyLevel } from '@shared/types';
import { PowerGem } from '@/components/math/PowerGem';
import { DifficultySelector } from '@/components/math/DifficultySelector';
import { toast } from 'sonner';
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
  const handleDifficultyChange = async (val: DifficultyLevel) => {
    if (!stats) return;
    const previous = stats.difficulty;
    setStats({ ...stats, difficulty: val });
    try {
      await api<StudentStats>(`/api/student/${stats.id}/settings`, {
        method: 'PATCH',
        body: JSON.stringify({ difficulty: val })
      });
      toast.success(`Mission parameters set to ${val.toUpperCase()}`);
    } catch (e) {
      setStats({ ...stats, difficulty: previous });
      toast.error("Failed to sync settings");
    }
  };
  const getRank = (score: number) => {
    if (score > 1000) return { name: "LEGEND", color: "text-yellow-400", icon: Trophy };
    if (score > 500) return { name: "ELITE", color: "text-indigo-400", icon: ShieldCheck };
    if (score > 100) return { name: "ADEPT", color: "text-green-400", icon: Zap };
    return { name: "RECRUIT", color: "text-white/60", icon: Target };
  };
  const rank = getRank(stats?.totalScore ?? 0);
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background energy-grid-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24">
          <PowerGem isSuccess />
        </div>
        <div className="animate-pulse text-xl font-black tracking-widest text-indigo-400 uppercase">Syncing Data...</div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen energy-grid-bg bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <ThemeToggle />
          <div className="text-center space-y-12 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 relative floating">
                <PowerGem isSuccess color="indigo" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-indigo-500 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  NEXUS-CORE
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic">
                NUMBER<span className="text-indigo-500 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">NEXUS</span>
              </h1>
              <div className="flex items-center justify-center gap-3">
                <rank.icon className={rank.color} />
                <span className={`text-sm font-black tracking-[0.3em] uppercase ${rank.color}`}>
                  RANK: {rank.name}
                </span>
              </div>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 text-white/40 font-black text-[10px] tracking-[0.3em] uppercase">
                <Activity className="w-3 h-3" /> Mission Parameters
              </div>
              <DifficultySelector 
                value={stats?.difficulty || 'easy'} 
                onValueChange={handleDifficultyChange} 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <Card className="bg-black/40 border-white/5 hover:border-orange-500/50 transition-all rounded-2xl group overflow-hidden">
                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" /> Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="text-4xl font-black italic">{stats?.streak ?? 0}</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-white/5 hover:border-indigo-500/50 transition-all rounded-2xl group overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" /> Record High
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="text-4xl font-black italic">{stats?.highScore ?? 0}</div>
                </CardContent>
              </Card>
              <Card className="bg-indigo-600/10 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all rounded-2xl group relative overflow-hidden md:scale-110">
                <div className="absolute inset-0 bg-indigo-500/10" />
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Star className="w-4 h-4 fill-indigo-500" /> Power Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="text-5xl font-black italic text-glow-primary">{stats?.totalScore ?? 0}</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-white/5 hover:border-green-500/50 transition-all rounded-2xl group overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" /> Units Cleared
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="text-4xl font-black italic">{stats?.totalSolved ?? 0}</div>
                </CardContent>
              </Card>
            </div>
            <div className="pt-12">
              <Button
                size="lg"
                className="btn-gradient px-16 py-10 text-3xl font-black italic rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.4)] tracking-tight"
                onClick={() => navigate('/sandbox')}
              >
                <Play className="mr-4 w-10 h-10 fill-current" /> START MISSION
              </Button>
              <p className="mt-6 text-white/20 font-black tracking-widest text-[10px] uppercase">
                Ready for deployment... System nominal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}