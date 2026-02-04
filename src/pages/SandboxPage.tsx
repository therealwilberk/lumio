import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RotateCcw, Zap, Sparkles, TrendingUp, Shield, Skull, Delete, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TenFrame } from '@/components/math/TenFrame';
import { NumberLine } from '@/components/math/NumberLine';
import { CircularTimer } from '@/components/math/CircularTimer';
import { generateProblem, getHintStrategy, getMakeTenBreakdown } from '@/lib/math-utils';
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
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);
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
    if (isSuccess) return;
    setMistakes(prev => prev + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    if (mistakes >= 1) setShowHint(true);
    try {
      const updated = await api<StudentStats>(`/api/student/${userId}/progress`, {
        method: 'POST',
        body: JSON.stringify({ isCorrect: false })
      });
      setStats(updated);
    } catch (e) {
      console.error('Timeout API failure:', e);
    }
  }, [userId, mistakes, isSuccess]);
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
    const diff = stats?.difficulty || 'easy';
    const streak = stats?.streak || 0;
    let maxSum = diff === 'easy' ? 10 : diff === 'medium' ? 15 : 20;
    if (streak > 10) maxSum = Math.min(20, maxSum + 5);
    setProblem(generateProblem(maxSum));
    setAnswer('');
    setMistakes(0);
    setIsSuccess(false);
    setIsAnimating(false);
    setShowHint(false);
    setTimeLeft(20);
    setScorePopup(null);
  }, [stats]);
  const triggerSpark = () => {
    const id = Date.now();
    setSparks(prev => [...prev, { id, x: Math.random() * 40 - 20, y: Math.random() * 20 - 10 }]);
    setTimeout(() => setSparks(prev => prev.filter(s => s.id !== id)), 600);
  };
  const handleInputChange = (val: string) => {
    if (isSuccess || isAnimating) return;
    setAnswer(val);
    triggerSpark();
  };
  const checkAnswer = async () => {
    if (!answer || isSuccess || isAnimating) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const numericAnswer = parseInt(answer);
    const correct = numericAnswer === problem.num1 + problem.num2;
    if (correct) {
      setIsSuccess(true);
      setIsAnimating(true);
      let multiplier = 1;
      if (isTimed) {
        if (timeLeft > 15) multiplier = 4;
        else if (timeLeft > 10) multiplier = 3;
        else if (timeLeft > 5) multiplier = 2;
      }
      if (stats?.difficulty === 'medium') multiplier += 1;
      if (stats?.difficulty === 'hard') multiplier += 2;
      const points = 10 * multiplier;
      setScorePopup(points);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#F97316', '#FFFFFF', '#4ADE80', '#9333EA']
      });
      try {
        const updated = await api<StudentStats>(`/api/student/${userId}/progress`, {
          method: 'POST',
          body: JSON.stringify({ isCorrect: true, points })
        });
        setStats(updated);
        setTimeout(nextProblem, 3000);
      } catch (e) {
        console.error('Success API failure:', e);
      }
    } else {
      setMistakes(prev => prev + 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      if (mistakes >= 1) setShowHint(true);
      try {
        const updated = await api<StudentStats>(`/api/student/${userId}/progress`, {
          method: 'POST',
          body: JSON.stringify({ isCorrect: false })
        });
        setStats(updated);
        if (isTimed) setTimeLeft(20);
      } catch (e) {
        console.error('Failure API failure:', e);
      }
    }
  };
  const hintStrategy = useMemo(() => getHintStrategy(problem.num1, problem.num2), [problem]);
  const breakdown = useMemo(() => getMakeTenBreakdown(problem.num1, problem.num2), [problem]);
  const DifficultyIcon = stats?.difficulty === 'easy' ? Shield : stats?.difficulty === 'medium' ? Zap : Skull;
  const difficultyColor = stats?.difficulty === 'easy' ? 'text-green-400' : stats?.difficulty === 'medium' ? 'text-orange-400' : 'text-red-500';
  return (
    <div className={cn(
      "min-h-screen energy-grid-bg bg-background text-foreground transition-all duration-700",
      isSuccess && "bg-indigo-950/20"
    )}>
      <LayoutGroup>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="rounded-xl hover:bg-white/5 group border border-transparent hover:border-white/10"
              disabled={isAnimating}
            >
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Exit Mission
            </Button>
            <div className="flex items-center gap-4 sm:gap-6 bg-black/60 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div className="flex items-center space-x-3">
                <Switch id="turbo-mode" checked={isTimed} onCheckedChange={setIsTimed} disabled={isSuccess || isAnimating} />
                <Label htmlFor="turbo-mode" className="font-black text-[10px] uppercase tracking-widest cursor-pointer flex items-center gap-2">
                  <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> Turbo
                </Label>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className={cn("flex items-center gap-2 font-black uppercase tracking-[0.2em] text-[10px]", difficultyColor)}>
                <DifficultyIcon className="w-4 h-4" />
                {stats?.difficulty}
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2 font-black text-indigo-400 text-[10px] tracking-widest uppercase">
                <TrendingUp className="w-4 h-4" />
                Streak: {stats?.streak ?? 0}
              </div>
            </div>
          </div>
          <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-12 items-start transition-all duration-300", isShaking && "animate-shake")}>
            {/* Left: Visual Models */}
            <div className="space-y-10 order-2 lg:order-1">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <TenFrame
                  id="frame-1"
                  value={showHint && hintStrategy.visualCues.bridgeActive ? 10 : problem.num1}
                  color="indigo"
                  label={showHint && hintStrategy.visualCues.bridgeActive ? "FULL 10" : "BANK A"}
                  isSuccess={isSuccess}
                  startIndex={0}
                  pulseActive={showHint && hintStrategy.visualCues.pulseAddend1}
                />
                <motion.div layout className="text-4xl font-black text-white/10">+</motion.div>
                <TenFrame
                  id="frame-2"
                  value={showHint && hintStrategy.visualCues.bridgeActive ? breakdown.remainder : problem.num2}
                  color="orange"
                  label={showHint && hintStrategy.visualCues.bridgeActive ? "REMAINDER" : "BANK B"}
                  isSuccess={isSuccess}
                  startIndex={showHint && hintStrategy.visualCues.bridgeActive ? 10 : problem.num1}
                  pulseActive={showHint && hintStrategy.visualCues.pulseAddend2}
                />
              </div>
              <div className="bg-black/60 p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                <NumberLine target1={problem.num1} target2={problem.num2} isAnimating={isAnimating || isSuccess} />
              </div>
            </div>
            {/* Right: Problem & Input */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="text-center relative">
                <AnimatePresence>
                  {scorePopup && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.5 }}
                      animate={{ opacity: 1, y: -150, scale: 2 }}
                      exit={{ opacity: 0, scale: 3 }}
                      className="absolute left-1/2 -translate-x-1/2 text-7xl font-black text-green-400 z-50 pointer-events-none drop-shadow-[0_0_30px_rgba(74,222,128,1)] italic"
                    >
                      +{scorePopup} XP
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-center items-center gap-8 mb-8">
                  <h2 className="text-8xl font-black tracking-tighter italic flex items-center gap-4">
                    <span className="text-glow-primary">{problem.num1}</span>
                    <span className="text-white/10 text-6xl">+</span>
                    <span className="text-glow-secondary">{problem.num2}</span>
                  </h2>
                  {isTimed && !isSuccess && (
                    <CircularTimer timeLeft={timeLeft} totalTime={20} className="scale-110" />
                  )}
                </div>
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 bg-indigo-500/10 border-2 border-indigo-500/20 rounded-2xl text-left backdrop-blur-md mb-8 relative overflow-hidden group shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BrainCircuit className="w-16 h-16" />
                      </div>
                      <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 fill-current" /> {hintStrategy.title}
                      </p>
                      <p className="text-lg font-bold leading-tight mb-4">
                        {hintStrategy.description}
                      </p>
                      <div className="space-y-2">
                        {hintStrategy.steps.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm font-medium text-white/80">
                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black">{idx + 1}</div>
                            {step}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <div className={cn(
                    "absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 transition duration-1000 group-hover:duration-200",
                    (answer.length > 0 || isAnimating) && "opacity-60 power-pulse",
                    isSuccess && "from-green-500 to-emerald-600 opacity-100"
                  )} />
                  <div className="relative flex gap-4">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        value={answer}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="?"
                        className={cn(
                          "text-7xl h-32 text-center rounded-2xl border-4 transition-all font-black italic bg-black/90 input-power-core",
                          isSuccess ? "border-green-500 text-green-400" : "border-white/10 text-glow-primary"
                        )}
                        onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer(); }}
                        disabled={isSuccess || isAnimating}
                        autoFocus
                      />
                      {/* Sparks container */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                        {sparks.map(s => (
                          <motion.div
                            key={s.id}
                            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                            animate={{ opacity: 0, scale: 0, x: s.x, y: s.y }}
                            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]"
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      size="lg"
                      onClick={checkAnswer}
                      className={cn(
                        "h-32 px-12 rounded-2xl text-3xl font-black italic transition-all shadow-2xl relative overflow-hidden group",
                        isSuccess ? "bg-green-500 text-white" : "btn-gradient"
                      )}
                      disabled={isSuccess || isAnimating || !answer}
                    >
                      <span className="relative z-10">{isSuccess ? <CheckCircle2 className="w-12 h-12" /> : "ENGAGE"}</span>
                      {!isSuccess && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      className="h-20 text-3xl font-black rounded-xl border-white/5 bg-black/40 hover:bg-indigo-600 hover:text-white hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] active:scale-90 transition-all"
                      onClick={() => handleInputChange(answer + num)}
                      disabled={isSuccess || isAnimating}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className="h-20 text-2xl font-black rounded-xl border-red-900/30 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white transition-all"
                    onClick={() => handleInputChange('')}
                    disabled={isSuccess || isAnimating}
                  >
                    <RotateCcw className="w-8 h-8" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 text-3xl font-black rounded-xl border-white/5 bg-black/40 hover:bg-indigo-600 hover:text-white transition-all"
                    onClick={() => handleInputChange(answer + "0")}
                    disabled={isSuccess || isAnimating}
                  >
                    0
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 rounded-xl border-white/5 bg-black/40 hover:bg-indigo-600 hover:text-white transition-all"
                    onClick={() => handleInputChange(answer.slice(0, -1))}
                    disabled={isSuccess || isAnimating}
                  >
                    <Delete className="w-8 h-8" />
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