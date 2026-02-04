import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RotateCcw, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TenFrame } from '@/components/math/TenFrame';
import { NumberLine } from '@/components/math/NumberLine';
import { CircularTimer } from '@/components/math/CircularTimer';
import { generateProblem, getMakeTenBreakdown } from '@/lib/math-utils';
import { api } from '@/lib/api-client';
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { StudentStats } from '@shared/types';
export function SandboxPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [problem, setProblem] = useState(() => generateProblem(10));
  const [answer, setAnswer] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isTimed, setIsTimed] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isShaking, setIsShaking] = useState(false);
  const [scorePopup, setScorePopup] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useMemo(() => {
    let id = localStorage.getItem('nexus_user_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('nexus_user_id', id);
    }
    return id;
  }, []);
  const fetchStats = useCallback(async () => {
    try {
      const data = await api<StudentStats>(`/api/student/${userId}`);
      setStats(data);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, [userId]);
  const handleTimeout = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setMistakes((m) => m + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    try {
      const updated = await api<StudentStats>(`/api/student/${userId}/progress`, {
        method: 'POST',
        body: JSON.stringify({ isCorrect: false })
      });
      setStats(updated);
    } catch (e) {
      console.error('Timeout API failure:', e);
    }
  }, [userId]);
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  useEffect(() => {
    if (isTimed && !isSuccess) {
      setTimeLeft(20);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimed, problem, isSuccess, handleTimeout]);
  const nextProblem = useCallback(() => {
    const currentStreak = stats?.streak ?? 0;
    const max = currentStreak < 3 ? 10 : currentStreak < 8 ? 15 : 20;
    setProblem(generateProblem(max));
    setAnswer('');
    setMistakes(0);
    setIsSuccess(false);
    setIsAnimating(false);
    setShowHint(false);
    setTimeLeft(20);
    setScorePopup(null);
  }, [stats]);
  const checkAnswer = async () => {
    if (!answer || isSuccess) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const numericAnswer = parseInt(answer);
    const correct = numericAnswer === problem.num1 + problem.num2;
    if (correct) {
      setIsSuccess(true);
      setIsAnimating(true);
      let multiplier = 1;
      if (isTimed) {
        if (timeLeft > 10) multiplier = 3;
        else if (timeLeft > 5) multiplier = 2;
      }
      const points = 10 * multiplier;
      setScorePopup(points);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#F97316', '#FFFFFF']
      });
      try {
        const updated = await api<StudentStats>(`/api/student/${userId}/progress`, {
          method: 'POST',
          body: JSON.stringify({ isCorrect: true, points })
        });
        setStats(updated);
        setTimeout(nextProblem, 2500);
      } catch (e) {
        console.error('Success API failure:', e);
      }
    } else {
      setMistakes((m) => m + 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      if (mistakes + 1 >= 2) setShowHint(true);
      try {
        const updated = await api<StudentStats>(`/api/student/${userId}/progress`, {
          method: 'POST',
          body: JSON.stringify({ isCorrect: false })
        });
        setStats(updated);
      } catch (e) {
        console.error('Failure API failure:', e);
      }
    }
  };
  const breakdown = useMemo(() => getMakeTenBreakdown(problem.num1, problem.num2), [problem]);
  return (
    <div className="min-h-screen energy-grid-bg bg-background text-foreground">
      <LayoutGroup>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <Button variant="ghost" onClick={() => navigate('/')} className="rounded-xl hover:bg-white/5 group border border-transparent hover:border-white/10">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Base
            </Button>
            <div className="flex items-center gap-6 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <Switch id="timed-mode" checked={isTimed} onCheckedChange={setIsTimed} disabled={isSuccess} />
                <Label htmlFor="timed-mode" className="font-black text-xs uppercase tracking-tighter cursor-pointer flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Turbo Mode
                </Label>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2 font-black text-indigo-400">
                <TrendingUp className="w-4 h-4" />
                STREAK: {stats?.streak ?? 0}
              </div>
            </div>
          </div>
          <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-12 items-start transition-all duration-300", isShaking && "animate-shake")}>
            {/* Visual Stage */}
            <div className="space-y-12 order-2 lg:order-1">
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <TenFrame
                  id="frame-1"
                  value={showHint ? 10 : problem.num1}
                  color="indigo"
                  label={showHint ? "POWER CORE" : "PRIMARY"}
                  isSuccess={isSuccess}
                />
                <motion.div layout className="text-4xl font-black text-white/20 animate-pulse">+</motion.div>
                <TenFrame
                  id="frame-2"
                  value={showHint ? breakdown.remainder : problem.num2}
                  color="orange"
                  label={showHint ? "OVERFLOW" : "SECONDARY"}
                  isSuccess={isSuccess}
                />
              </div>
              <div className="bg-black/40 p-8 rounded-3xl border border-white/5 shadow-inner backdrop-blur-sm relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <NumberLine target1={problem.num1} target2={problem.num2} isAnimating={isAnimating} />
              </div>
            </div>
            {/* Input Side */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="text-center relative">
                <AnimatePresence>
                  {scorePopup && (
                    <motion.div
                      initial={{ opacity: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, y: -80, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-1/2 -translate-x-1/2 text-5xl font-black text-green-400 z-50 pointer-events-none drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                    >
                      +{scorePopup}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-center items-center gap-8 mb-6">
                  <h2 className="text-7xl font-black tracking-tighter flex items-center gap-4">
                    <span className="text-glow-primary">{problem.num1}</span>
                    <span className="text-white/20">+</span>
                    <span className="text-glow-secondary">{problem.num2}</span>
                  </h2>
                  {isTimed && !isSuccess && (
                    <CircularTimer timeLeft={timeLeft} totalTime={20} />
                  )}
                </div>
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-left backdrop-blur-md mb-6"
                    >
                      <p className="text-indigo-400 font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Tactical Hint
                      </p>
                      <p className="text-lg font-bold">
                        Fill the primary bank! <br/>
                        {problem.num1} + {breakdown.needs} = <span className="text-indigo-400">10</span>. <br/>
                        Remaining: {breakdown.remainder}. <br/>
                        <span className="text-2xl">10 + {breakdown.remainder} = ?</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 relative">
                  <Input
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="?"
                    className={cn(
                      "text-5xl h-24 text-center rounded-2xl border-2 transition-all font-black bg-black/60",
                      isSuccess ? "border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "border-white/10 focus:border-indigo-500 shadow-2xl"
                    )}
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                    disabled={isSuccess}
                    autoFocus
                  />
                  <Button
                    size="lg"
                    onClick={checkAnswer}
                    className={cn(
                      "h-24 px-10 rounded-2xl text-2xl font-black transition-all",
                      isSuccess ? "bg-green-500" : "btn-gradient"
                    )}
                    disabled={isSuccess || !answer}
                  >
                    {isSuccess ? <CheckCircle2 className="w-10 h-10" /> : "ENGAGE"}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      className="h-20 text-3xl font-black rounded-xl border-white/5 bg-white/5 hover:bg-indigo-500 hover:text-white hover:border-indigo-400 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95 transition-all"
                      onClick={() => {
                        setAnswer((prev) => prev + num);
                        confetti({ particleCount: 5, spread: 20, origin: { y: 0.8 }, colors: ['#6366F1'] });
                      }}
                      disabled={isSuccess}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant="destructive"
                    className="h-20 text-2xl font-black rounded-xl border-2 border-red-900/50 bg-red-950/20 hover:bg-red-600 active:scale-95 transition-all"
                    onClick={() => setAnswer('')}
                    disabled={isSuccess}
                  >
                    <RotateCcw className="w-8 h-8" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutGroup>
    </div>
  );
}