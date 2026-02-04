import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RotateCcw, Timer, ShieldQuestion, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TenFrame } from '@/components/math/TenFrame';
import { NumberLine } from '@/components/math/NumberLine';
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
  const [isTimed, setIsTimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isShaking, setIsShaking] = useState(false);
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
      if (!isSuccess) {
        const initialMax = data.streak < 3 ? 10 : data.streak < 8 ? 15 : 20;
        setProblem(generateProblem(initialMax));
      }
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, [userId, isSuccess]);
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
  }, [stats]);
  const checkAnswer = async () => {
    if (!answer || isSuccess) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const numericAnswer = parseInt(answer);
    const correct = numericAnswer === problem.num1 + problem.num2;
    if (correct) {
      setIsSuccess(true);
      setIsAnimating(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#F97316', '#84CC16']
      });
      let points = 1;
      if (isTimed) {
        if (timeLeft > 15) points = 5;
        else if (timeLeft > 10) points = 3;
        else points = 2;
      }
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
        if (isTimed) {
          setTimeLeft(20); // Reset timer on mistake in timed mode to give a second chance
          timerRef.current = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
          }, 1000);
        }
      } catch (e) {
        console.error('Failure API failure:', e);
      }
    }
  };
  const breakdown = useMemo(() => getMakeTenBreakdown(problem.num1, problem.num2), [problem]);
  const timerColor = timeLeft > 10 ? 'text-green-500' : timeLeft > 5 ? 'text-yellow-500' : 'text-red-500';
  return (
    <LayoutGroup>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="rounded-2xl hover:bg-accent group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Dashboard
          </Button>
          <div className="flex items-center gap-6 bg-card px-6 py-2 rounded-full border shadow-sm">
            <div className="flex items-center space-x-3">
              <Switch id="timed-mode" checked={isTimed} onCheckedChange={(val) => {
                setIsTimed(val);
                if (!val && timerRef.current) clearInterval(timerRef.current);
              }} disabled={isSuccess} />
              <Label htmlFor="timed-mode" className="font-bold flex items-center gap-2 cursor-pointer">
                <Timer className="w-4 h-4 text-primary" /> Timed Mode
              </Label>
            </div>
            <div className="text-sm font-bold text-muted-foreground border-l pl-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
              Streak: {stats?.streak ?? 0}
            </div>
          </div>
        </div>
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-300", isShaking && "animate-shake")}>
          <div className="space-y-10 order-2 lg:order-1">
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <TenFrame
                id="frame-1"
                value={showHint ? 10 : problem.num1}
                color="bg-indigo-500"
                label={isTimed ? undefined : (showHint ? "Full 10" : `Value: ${problem.num1}`)}
                hideLabel={isTimed && !showHint}
              />
              <motion.div layout className="text-4xl font-bold text-muted-foreground/50">+</motion.div>
              <TenFrame
                id="frame-2"
                value={showHint ? breakdown.remainder : problem.num2}
                color="bg-orange-500"
                label={isTimed ? undefined : (showHint ? "Leftover" : `Value: ${problem.num2}`)}
                hideLabel={isTimed && !showHint}
              />
            </div>
            <div className="bg-card p-6 rounded-3xl border shadow-soft">
              <NumberLine target1={problem.num1} target2={problem.num2} isAnimating={isAnimating} />
            </div>
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <div className="text-center space-y-4">
              <h2 className="text-6xl font-black tracking-tighter text-balance">
                {isTimed && !showHint && !isSuccess ? (
                  <span className="flex items-center justify-center gap-2">
                    <ShieldQuestion className="w-12 h-12 text-indigo-400/40" />
                    +
                    <ShieldQuestion className="w-12 h-12 text-orange-400/40" />
                  </span>
                ) : `${problem.num1} + ${problem.num2}`}
                <span className="ml-2 text-primary">= ?</span>
              </h2>
              {isTimed && !isSuccess && (
                <div className="flex flex-col items-center gap-2">
                  <div className={`text-4xl font-mono font-bold ${timerColor} tabular-nums transition-colors duration-300`}>
                    {timeLeft}s
                  </div>
                  <div className="w-64 h-3 bg-secondary rounded-full overflow-hidden border">
                    <motion.div
                      className={cn("h-full", timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500')}
                      initial={{ width: "100%" }}
                      animate={{ width: `${(timeLeft / 20) * 100}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                </div>
              )}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 text-left shadow-sm"
                  >
                    <div className="flex gap-3">
                      <div className="bg-indigo-500 p-2 rounded-xl text-white h-fit">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-lg mb-1">Make Ten Strategy!</p>
                        <p className="text-sm font-medium opacity-90 leading-relaxed">
                          {problem.num1} needs {breakdown.needs} to make 10. <br/>
                          Then we add the remaining {breakdown.remainder}. <br/>
                          <span className="font-black">10 + {breakdown.remainder} = ?</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="?"
                  className="text-4xl h-24 text-center rounded-3xl border-4 border-muted focus-visible:ring-primary focus-visible:border-primary font-bold shadow-sm transition-all bg-secondary/50"
                  onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                  disabled={isSuccess}
                  autoFocus
                />
                <Button
                  size="lg"
                  onClick={checkAnswer}
                  className="h-24 px-8 rounded-3xl btn-gradient text-2xl font-bold"
                  disabled={isSuccess || !answer}
                >
                  {isSuccess ? <CheckCircle2 className="w-10 h-10" /> : "Solve!"}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <Button
                    key={num}
                    variant="secondary"
                    className="h-20 text-3xl font-bold rounded-2xl border-b-4 border-muted hover:translate-y-1 hover:border-b-0 active:scale-95 transition-all bg-background"
                    onClick={() => setAnswer((prev) => prev + num)}
                    disabled={isSuccess}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="destructive"
                  className="h-20 text-2xl font-bold rounded-2xl border-b-4 border-red-700 hover:translate-y-1 hover:border-b-0 active:scale-95 transition-all"
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
  );
}