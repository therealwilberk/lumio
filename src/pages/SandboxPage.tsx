import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RotateCcw, AlertCircle, Timer, ShieldQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TenFrame } from '@/components/math/TenFrame';
import { NumberLine } from '@/components/math/NumberLine';
import { generateProblem, getMakeTenBreakdown } from '@/lib/math-utils';
import { api } from '@/lib/api-client';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import type { StudentStats } from '@shared/types';
export function SandboxPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [problem, setProblem] = useState(generateProblem(10));
  const [answer, setAnswer] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const userId = localStorage.getItem('nexus_user_id') || 'guest';
  useEffect(() => {
    fetchStats();
  }, []);
  const fetchStats = async () => {
    try {
      const data = await api<StudentStats>(`/api/student/${userId}`);
      setStats(data);
      const initialMax = data.streak < 3 ? 10 : data.streak < 8 ? 15 : 20;
      setProblem(generateProblem(initialMax));
    } catch (e) {
      console.error(e);
    }
  };
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
  }, [isTimed, problem, isSuccess]);
  const handleTimeout = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setMistakes((m) => m + 1);
    await api(`/api/student/${userId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ isCorrect: false })
    });
  };
  const checkAnswer = async () => {
    if (!answer) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const numericAnswer = parseInt(answer);
    const correct = numericAnswer === problem.num1 + problem.num2;
    if (correct) {
      setIsSuccess(true);
      setIsAnimating(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      let points = 1;
      if (isTimed) {
        if (timeLeft > 15) points = 5;
        else if (timeLeft > 10) points = 3;
        else points = 2;
      }
      await api<StudentStats>(`/api/student/${userId}/progress`, {
        method: 'POST',
        body: JSON.stringify({ isCorrect: true, points })
      }).then(setStats);
      setTimeout(nextProblem, 3000);
    } else {
      setMistakes((m) => m + 1);
      if (mistakes + 1 >= 2) setShowHint(true);
      await api(`/api/student/${userId}/progress`, {
        method: 'POST',
        body: JSON.stringify({ isCorrect: false })
      }).then(setStats);
    }
  };
  const nextProblem = () => {
    const currentStreak = stats?.streak ?? 0;
    const max = currentStreak < 3 ? 10 : currentStreak < 8 ? 15 : 20;
    setProblem(generateProblem(max));
    setAnswer('');
    setMistakes(0);
    setIsSuccess(false);
    setIsAnimating(false);
    setShowHint(false);
    setTimeLeft(20);
  };
  const breakdown = getMakeTenBreakdown(problem.num1, problem.num2);
  const timerColor = timeLeft > 10 ? 'text-green-500' : timeLeft > 5 ? 'text-yellow-500' : 'text-red-500';
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="rounded-2xl shrink-0">
          <ArrowLeft className="mr-2 w-4 h-4" /> Dashboard
        </Button>
        <div className="flex items-center gap-6 bg-secondary/50 px-6 py-2 rounded-full border">
          <div className="flex items-center space-x-2">
            <Switch id="timed-mode" checked={isTimed} onCheckedChange={setIsTimed} disabled={isSuccess} />
            <Label htmlFor="timed-mode" className="font-bold flex items-center gap-2">
              <Timer className="w-4 h-4" /> Timed Mode
            </Label>
          </div>
          <div className="text-sm font-bold text-muted-foreground border-l pl-6">
            Streak: {stats?.streak ?? 0}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 order-2 lg:order-1">
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <TenFrame
              value={showHint ? 10 : problem.num1}
              color="bg-indigo-500"
              label={isTimed ? undefined : (showHint ? "Full 10" : `Value: ${problem.num1}`)}
              hideLabel={isTimed}
            />
            <div className="text-4xl font-bold text-muted-foreground">+</div>
            <TenFrame
              value={showHint ? breakdown.remainder : problem.num2}
              color="bg-orange-500"
              label={isTimed ? undefined : (showHint ? "Leftover" : `Value: ${problem.num2}`)}
              hideLabel={isTimed}
            />
          </div>
          <div className="bg-card p-6 rounded-3xl border shadow-sm">
            <NumberLine target1={problem.num1} target2={problem.num2} isAnimating={isAnimating} />
          </div>
        </div>
        <div className="space-y-8 order-1 lg:order-2">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-baseline gap-4">
              <h2 className="text-6xl font-black tracking-tighter">
                {isTimed ? (
                  <span className="flex items-center gap-2">
                    <ShieldQuestion className="w-12 h-12 text-muted-foreground/30" />
                    +
                    <ShieldQuestion className="w-12 h-12 text-muted-foreground/30" />
                  </span>
                ) : `${problem.num1} + ${problem.num2}`}
                <span className="ml-2">= ?</span>
              </h2>
            </div>
            {isTimed && !isSuccess && (
              <div className="flex justify-center items-center gap-2">
                <div className={`text-4xl font-mono font-bold ${timerColor} transition-colors duration-300`}>
                  {timeLeft}s
                </div>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / 20) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </div>
            )}
            <AnimatePresence>
              {showHint && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-orange-50 text-orange-700 rounded-2xl border border-orange-200 text-left">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium">Strategy: {problem.num1} needs {breakdown.needs} to make 10. Then add {breakdown.remainder}.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-4">
            <Input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="?"
              className="text-4xl h-20 text-center rounded-3xl border-4 focus-visible:ring-indigo-400 font-bold"
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              disabled={isSuccess || (isTimed && timeLeft === 0)}
            />
            <Button
              size="lg"
              onClick={checkAnswer}
              className="h-20 w-32 rounded-3xl btn-gradient text-xl font-bold"
              disabled={isSuccess || !answer || (isTimed && timeLeft === 0)}
            >
              {isSuccess ? <CheckCircle2 className="w-8 h-8" /> : "Check"}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <Button
                key={num}
                variant="secondary"
                className="h-16 text-2xl font-bold rounded-2xl active:scale-95"
                onClick={() => setAnswer((prev) => prev + num)}
                disabled={isSuccess || (isTimed && timeLeft === 0)}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="destructive"
              className="h-16 text-2xl font-bold rounded-2xl active:scale-95"
              onClick={() => setAnswer('')}
              disabled={isSuccess}
            >
              <RotateCcw className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}