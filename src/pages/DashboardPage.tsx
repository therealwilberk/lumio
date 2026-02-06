import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LazyMotion, domAnimation, m as motion } from 'framer-motion';

// Temporary default stats - will be replaced with real user data from AuthContext
const defaultStats = {
  streak: 0,
  highScore: 0,
  totalScore: 0,
  totalSolved: 0,
}; 

export function DashboardPage() {
  const navigate = useNavigate();

  // TODO: Replace with real user data from AuthContext
  const displayStats = defaultStats;

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen energy-grid-bg bg-background text-foreground overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            {/* ThemeToggle can remain or be moved to a layout component later */}
            {/* <ThemeToggle /> */} 
            <div className="text-center space-y-12 animate-fade-in">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic text-center">LUMIO<span className="text-indigo-500 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">CORE</span></h1>

              <div className="max-w-md mx-auto space-y-6">
                <div className="pt-2 text-center">
                  {/* Placeholder for future mission intel */}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <Card className="bg-black/40 border-white/5 hover:border-orange-500/50 transition-all rounded-2xl group overflow-hidden">
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                      Current Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-4xl font-black italic">{displayStats.streak ?? 0}</CardContent>
                </Card>
                <Card className="bg-black/40 border-white/5 hover:border-indigo-500/50 transition-all rounded-2xl group overflow-hidden">
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                      Session High
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-4xl font-black italic">{displayStats.highScore ?? 0}</CardContent>
                </Card>
                <Card className="bg-indigo-600/10 border-indigo-500/30 shadow-primary transition-all rounded-2xl group md:scale-110 relative overflow-hidden">
                  {/* Removed absolute star icon */}
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                       Total XP
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-5xl font-black italic text-glow-primary">{displayStats.totalScore ?? 0}</CardContent>
                </Card>
                <Card className="bg-black/40 border-white/5 hover:border-green-500/50 transition-all rounded-2xl group overflow-hidden">
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                      Ops Cleared
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-4xl font-black italic">{displayStats.totalSolved ?? 0}</CardContent>
                </Card>
              </div>
              <div className="pt-12">
                <Button size="lg" className="btn-gradient px-16 py-10 text-3xl font-black italic rounded-2xl shadow-glow tracking-tight" onClick={() => navigate('/math/addition')}>
                  START MISSION
                </Button>
                <footer className="mt-8 flex flex-col items-center gap-2">
                  <p className="text-white/20 font-black tracking-widest text-[10px] uppercase">Lumio Sync Terminal</p>
                  <div className="flex gap-4 text-[9px] font-black text-indigo-500/40 uppercase tracking-tighter">
                    <span>Lumio OS v1.0</span><span>•</span><span>Encryption Secure</span><span>•</span><span>Session {new Date().toLocaleDateString()}</span>
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