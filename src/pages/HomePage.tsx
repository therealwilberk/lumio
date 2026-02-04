import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Flame, Play, Target, Star, Zap, ShieldCheck, Cpu, Server, Wifi, BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import type { StudentStats, DifficultyLevel } from '@shared/types';
import { PowerGem } from '@/components/math/PowerGem';
import { DifficultySelector } from '@/components/math/DifficultySelector';
import { MissionBriefing } from '@/components/math/MissionBriefing';
import { toast } from 'sonner';
import { LazyMotion, domAnimation, m as motion, AnimatePresence } from 'framer-motion';
export function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
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
    const userId = localStorage.getItem('nexus_user_id');
    setStats({ ...stats, difficulty: val });
    setIsSyncing(true);
    try {
      await api<StudentStats>(`/api/student/${userId}/settings`, {
        method: 'PATCH',
        body: JSON.stringify({ difficulty: val })
      });
      toast.success(`SYSTEM: DIFF-LEVEL ${val.toUpperCase()} LOCKED`);
    } catch (e) {
      setStats({ ...stats, difficulty: previous });
      toast.error("Settings link corrupted");
    } finally {
      setIsSyncing(false);
    }
  };
  const rankData = useMemo(() => {
    const score = stats?.totalScore ?? 0;
    if (score >= 5000) return { name: "NEXUS OVERLORD", color: "text-purple-400", bg: "bg-purple-500", icon: Trophy, next: 10000 };
    if (score >= 1000) return { name: "LEGEND", color: "text-yellow-400", bg: "bg-yellow-500", icon: Trophy, next: 5000 };
    if (score >= 500) return { name: "ELITE", color: "text-indigo-400", bg: "bg-indigo-500", icon: ShieldCheck, next: 1000 };
    if (score >= 100) return { name: "ADEPT", color: "text-green-400", bg: "bg-green-500", icon: Zap, next: 500 };
    return { name: "RECRUIT", color: "text-white/60", bg: "bg-white/20", icon: Target, next: 100 };
  }, [stats?.totalScore]);
  const progressValue = useMemo(() => {
    const score = stats?.totalScore ?? 0;
    const prevThreshold = score < 100 ? 0 :
                          score < 500 ? 100 :
                          score < 1000 ? 500 :
                          score < 5000 ? 1000 : 5000;
    const range = (score < 100 ? 100 : score < 500 ? 400 : score < 1000 ? 500 : score < 5000 ? 4000 : 5000) - prevThreshold;
    const current = score - prevThreshold;
    return Math.min(100, Math.max(0, (current / range) * 100));
  }, [stats?.totalScore]);
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background energy-grid-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24"><PowerGem isSuccess /></div>
        <div className="animate-pulse text-xl font-black tracking-widest text-indigo-400 uppercase">Connecting to Nexus...</div>
      </div>
    </div>
  );
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen energy-grid-bg bg-background text-foreground overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <ThemeToggle />
          <div className="text-center space-y-12 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 relative floating">
                <PowerGem isSuccess color="indigo" layoutId="hero-gem" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-indigo-500 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  NEXUS-CORE
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic">
                NUMBER<span className="text-indigo-500 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">NEXUS</span>
              </h1>
              <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={rankData.name}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <rankData.icon className={rankData.color} />
                    <span className={`text-sm font-black tracking-[0.3em] uppercase ${rankData.color}`}>RANK: {rankData.name}</span>
                  </motion.div>
                </AnimatePresence>
                <div className="w-full space-y-1">
                  <div className="flex justify-between text-[8px] font-black text-white/40 uppercase tracking-widest">
                    <span>Exp Progression</span>
                    <span>{stats?.totalScore ?? 0} / {rankData.next}</span>
                  </div>
                  <Progress value={progressValue} className="h-1.5 bg-white/5" />
                </div>
              </div>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-white/40 font-black text-[10px] tracking-[0.3em] uppercase">
                  <Cpu className="w-3 h-3" /> Mission Parameters
                </div>
                <div className="h-3 w-px bg-white/10" />
                <div className={cn(
                  "flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-500",
                  isSyncing ? "text-yellow-500" : "text-green-500"
                )}>
                  {isSyncing ? (
                    <>
                      <Server className="w-3 h-3 animate-pulse" /> SYNCING...
                    </>
                  ) : (
                    <>
                      <Wifi className="w-3 h-3" /> LINK SECURE
                    </>
                  )}
                </div>
              </div>
              <DifficultySelector value={stats?.difficulty || 'easy'} onValueChange={handleDifficultyChange} />
              <div className="pt-2">
                <MissionBriefing trigger={
                  <Button variant="ghost" className="text-xs font-black tracking-[0.2em] text-indigo-400/60 hover:text-indigo-400 hover:bg-indigo-500/10">
                    <BookOpen className="w-4 h-4 mr-2" /> ACCESS TACTICAL INTEL
                  </Button>
                } />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <Card className="bg-black/40 border-white/5 hover:border-orange-500/50 transition-all rounded-2xl group overflow-hidden">
                <CardHeader className="p-6 pb-2"><CardTitle className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> Current Streak</CardTitle></CardHeader>
                <CardContent className="p-6 pt-0 text-4xl font-black italic">{stats?.streak ?? 0}</CardContent>
              </Card>
              <Card className="bg-black/40 border-white/5 hover:border-indigo-500/50 transition-all rounded-2xl group overflow-hidden">
                <CardHeader className="p-6 pb-2"><CardTitle className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" /> Session High</CardTitle></CardHeader>
                <CardContent className="p-6 pt-0 text-4xl font-black italic">{stats?.highScore ?? 0}</CardContent>
              </Card>
              <Card className="bg-indigo-600/10 border-indigo-500/30 shadow-primary transition-all rounded-2xl group md:scale-110 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Star className="w-12 h-12 fill-indigo-500" />
                </div>
                <CardHeader className="p-6 pb-2"><CardTitle className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Star className="w-4 h-4 fill-indigo-500" /> Total XP</CardTitle></CardHeader>
                <CardContent className="p-6 pt-0 text-5xl font-black italic text-glow-primary">{stats?.totalScore ?? 0}</CardContent>
              </Card>
              <Card className="bg-black/40 border-white/5 hover:border-green-500/50 transition-all rounded-2xl group overflow-hidden">
                <CardHeader className="p-6 pb-2"><CardTitle className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4 text-green-500" /> Ops Cleared</CardTitle></CardHeader>
                <CardContent className="p-6 pt-0 text-4xl font-black italic">{stats?.totalSolved ?? 0}</CardContent>
              </Card>
            </div>
            <div className="pt-12">
              <Button size="lg" className="btn-gradient px-16 py-10 text-3xl font-black italic rounded-2xl shadow-glow tracking-tight" onClick={() => navigate('/sandbox')}>
                <Play className="mr-4 w-10 h-10 fill-current" /> START MISSION
              </Button>
              <footer className="mt-8 flex flex-col items-center gap-2">
                <p className="text-white/20 font-black tracking-widest text-[10px] uppercase">Nexus Sync Terminal: {stats?.id?.slice(0, 8) ?? 'OFFLINE'}...</p>
                <div className="flex gap-4 text-[9px] font-black text-indigo-500/40 uppercase tracking-tighter">
                  <span>Mental Model OS v2.0</span>
                  <span>•</span>
                  <span>Encryption Secure</span>
                  <span>•</span>
                  <span>Session {new Date().toLocaleDateString()}</span>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
    </LazyMotion>
  );
}