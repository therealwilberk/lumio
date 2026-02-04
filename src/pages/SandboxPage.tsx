import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RotateCcw, Zap, Sparkles, TrendingUp, Delete, BrainCircuit, Loader2, BookOpen, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TenFrame } from '@/components/math/TenFrame';
import { NumberLine } from '@/components/math/NumberLine';
import { CircularTimer } from '@/components/math/CircularTimer';
import { DifficultySelector } from '@/components/math/DifficultySelector';
import { MissionBriefing } from '@/components/math/MissionBriefing';
import { generateProblem, getHintStrategy, getMakeTenBreakdown } from '@/lib/math-utils';
import { api } from '@/lib/api-client';
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { StudentStats, DifficultyLevel } from '@shared/types';
export function SandboxPage() {
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [problem, setProblem] = useState(() => generateProblem(10));
  const [answer, setAnswer] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isTimed, setIsTimed] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isShaking, setIsShaking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
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
      if (isMounted.current) setStats(data);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, [userId]);
  const handleDifficultyChange = async (val: DifficultyLevel) => {
    if (!stats || isSubmitting || isAnimating || isSuccess) return;
    const previous = stats.difficulty;
    setStats({ ...stats, difficulty: val });
    setIsSyncing(true);
    try {
      await api<StudentStats>(`/api/student/${userId}/settings`, {
        method: 'PATCH',
        body: JSON.stringify({ difficulty: val })
      });
      toast.success(`MISSION PARAMETERS: ${val.toUpperCase()}`);
    } catch (e) {
      setStats({ ...stats, difficulty: previous });
      toast.error("Tactical sync failed");
    } finally {
      setIsSyncing(false);
    }
  };
  const nextProblem = useCallback(() => {
    if (!isMounted.current) return;
    const diff = stats?.difficulty || 'easy';
    const streak = stats?.streak || 0;
    let baseMax = diff === 'easy' ? 10 : diff === 'medium' ? 20 : 40;
    if (diff === 'hard' && streak > 10) baseMax = 60;
    setProblem(generateProblem(baseMax));
    setAnswer('');
    setMistakes(0);
    setIsSuccess(false);
    setIsAnimating(false);
    setIsSubmitting(false);
    setShowHint(false);
    setTimeLeft(diff === 'hard' ? 30 : 20);
    setScorePopup(null);
  }, [stats]);
  useEffect(() => {
    isMounted.current = true;
    fetchStats();
    return () => { isMounted.current = false; if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchStats]);
  useEffect(() => {
    if (isTimed && !isSuccess && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimed, problem, isSuccess, isSubmitting]);
  const handleInputChange = (val: string) => {
    if (isSuccess || isAnimating || isSubmitting || val.length > 3) return;
    const sanitized = val.length > 1 && val.startsWith('0') ? val.replace(/^0+/, '') : val;
    setAnswer(sanitized);
  };
  const checkAnswer = async () => {
    if (!answer || isSuccess || isAnimating || isSubmitting) return;
    const numericAnswer = parseInt(answer);
    const correct = numericAnswer === problem.num1 + problem.num2;
    setIsSubmitting(true);
    if (correct) {
      setIsAnimating(true);
      setIsSuccess(true);
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
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      try {
        const updated = await api<StudentStats>(`/api/student/${userId}/progress`, {
          method: 'POST',
          body: JSON.stringify({ isCorrect: true, points })
        });
        if (isMounted.current) { 
          setStats(updated); 
          setTimeout(nextProblem, 2500); 
        }
      } catch (e) { console.error(e); setIsSubmitting(false); }
    } else {
      setIsShaking(true);
      setTimeout(() => { if (isMounted.current) setIsShaking(false); }, 500);
      setMistakes(prev => prev + 1);
      if (mistakes >= 1) setShowHint(true);
      try {
        const updated = await api<StudentStats>(`/api/student/${userId}/progress`, {
          method: 'POST',
          body: JSON.stringify({ isCorrect: false })
        });
        if (isMounted.current) { 
          setStats(updated); 
          setIsSubmitting(false); 
          setTimeLeft(stats?.difficulty === 'hard' ? 30 : 20); 
        }
      } catch (e) { console.error(e); setIsSubmitting(false); }
    }
  };
  const hintStrategy = useMemo(() => getHintStrategy(problem.num1, problem.num2), [problem]);
  const breakdown = useMemo(() => getMakeTenBreakdown(problem.num1, problem.num2), [problem]);
  const showTenFrames = problem.num1 <= 10 && problem.num2 <= 10;
  return (
    <div className={cn("min-h-screen energy-grid-bg bg-background text-foreground transition-all duration-700", isSuccess && "bg-indigo-950/20")}>
      <LayoutGroup>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <Button variant="ghost" onClick={() => navigate('/')} className="rounded-xl border border-transparent hover:border-white/10" disabled={isAnimating || isSubmitting}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Exit
            </Button>
            <div className="flex items-center gap-4 bg-black/60 backdrop-blur-2xl px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3 px-2">
                <Switch id="turbo-mode" checked={isTimed} onCheckedChange={setIsTimed} disabled={isSuccess} />
                <Label htmlFor="turbo-mode" className="font-black text-[10px] uppercase cursor-pointer flex items-center gap-2"><Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> Turbo</Label>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <DifficultySelector variant="compact" value={stats?.difficulty || 'easy'} onValueChange={handleDifficultyChange} disabled={isSuccess} />
                {isSyncing && <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />}
              </div>
              <div className="h-6 w-px bg-white/10" />
              <MissionBriefing trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-400/60"><BookOpen className="w-4 h-4" /></Button>} />
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2 font-black text-indigo-400 text-[10px] uppercase px-2"><TrendingUp className="w-4 h-4" />{stats?.streak ?? 0}</div>
            </div>
          </div>
          <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-12 items-start", isShaking && "animate-shake")}>
            <div className="space-y-10 order-2 lg:order-1">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {showTenFrames ? (
                  <>
                    <TenFrame 
                      id="frame-1" 
                      value={showHint && hintStrategy.visualCues.bridgeActive ? 10 : problem.num1} 
                      color="indigo" 
                      label="BANK A" 
                      isSuccess={isSuccess} 
                      startIndex={0}
                    />
                    <div className="text-4xl font-black text-white/10">+</div>
                    <TenFrame 
                      id="frame-2" 
                      value={showHint && hintStrategy.visualCues.bridgeActive ? breakdown.remainder : problem.num2} 
                      color="orange" 
                      label="BANK B" 
                      isSuccess={isSuccess} 
                      startIndex={problem.num1}
                    />
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full p-8 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-500/20 rounded-lg"><BrainCircuit className="w-6 h-6 text-indigo-400" /></div>
                      <div>
                        <h4 className="font-black text-xs text-white/40 tracking-widest uppercase">Strategy Intel</h4>
                        <p className="text-sm font-bold text-white/80">Advanced Decomposition Active</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                        <div className="text-2xl font-black italic">{Math.floor(problem.num1 / 10) + Math.floor(problem.num2 / 10)}0</div>
                        <div className="text-[10px] font-black text-indigo-400 uppercase">Combined Tens</div>
                      </div>
                      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                        <div className="text-2xl font-black italic">{ (problem.num1 % 10) + (problem.num2 % 10) }</div>
                        <div className="text-[10px] font-black text-orange-400 uppercase">Combined Ones</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="bg-black/60 p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md relative overflow-hidden">
                <NumberLine max={stats?.difficulty === 'hard' ? 60 : 30} target1={problem.num1} target2={problem.num2} isAnimating={isAnimating || isSuccess} />
              </div>
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <div className="text-center relative">
                <AnimatePresence>
                  {scorePopup && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.5 }} 
                      animate={{ opacity: 1, y: -150, scale: 2 }} 
                      exit={{ opacity: 0, scale: 3 }} 
                      className="absolute left-1/2 -translate-x-1/2 text-7xl font-black text-green-400 z-50 pointer-events-none italic"
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
                  {isTimed && !isSuccess && <CircularTimer timeLeft={timeLeft} totalTime={stats?.difficulty === 'hard' ? 30 : 20} className="scale-110" />}
                </div>
                <AnimatePresence>
                  {showHint && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 bg-indigo-500/10 border-2 border-indigo-500/20 rounded-2xl text-left backdrop-blur-md mb-8 relative group shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                      <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 fill-current" /> {hintStrategy.title}</p>
                      <p className="text-lg font-bold leading-tight mb-4">{hintStrategy.description}</p>
                      <div className="space-y-2">
                        {hintStrategy.steps.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm font-medium text-white/80">
                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black">{idx + 1}</div>{step}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <div className={cn("absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20", (answer.length > 0 || isAnimating) && "opacity-60 power-pulse", isSuccess && "from-green-500 to-emerald-600 opacity-100")} />
                  <div className="relative flex gap-4">
                    <div className="relative flex-1">
                      <Input 
                        type="number" 
                        inputMode="numeric" 
                        value={answer} 
                        onChange={(e) => handleInputChange(e.target.value)} 
                        placeholder="?" 
                        className={cn("text-7xl h-32 text-center rounded-2xl border-4 transition-all font-black italic bg-black/90 input-power-core", isSuccess ? "border-green-500 text-green-400" : "border-white/10 text-glow-primary")} 
                        onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer(); }} 
                        disabled={isSuccess || isAnimating} 
                        autoFocus 
                      />
                    </div>
                    <Button 
                      size="lg" 
                      onClick={checkAnswer} 
                      className={cn("h-32 px-12 rounded-2xl text-3xl font-black italic transition-all", isSuccess ? "bg-green-500 text-white" : "btn-gradient")} 
                      disabled={isSuccess || isAnimating || !answer}
                    >
                      {isSubmitting && !isSuccess ? <Loader2 className="w-8 h-8 animate-spin" /> : isSuccess ? <CheckCircle2 className="w-12 h-12" /> : "ENGAGE"}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "DEL"].map((num) => (
                    <Button 
                      key={String(num)} 
                      variant="outline" 
                      className={cn("h-20 text-3xl font-black rounded-xl border-white/5 bg-black/40 hover:bg-indigo-600", num === "C" && "text-red-400")} 
                      onClick={() => { 
                        if (num === "C") handleInputChange(""); 
                        else if (num === "DEL") handleInputChange(answer.slice(0, -1)); 
                        else handleInputChange(answer + num); 
                      }} 
                      disabled={isSuccess || isAnimating}
                    >
                      {num === "C" ? <RotateCcw /> : num === "DEL" ? <Delete /> : num}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutGroup>
    </div>
  );
}