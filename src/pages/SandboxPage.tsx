import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RotateCcw, Zap, Sparkles, TrendingUp, Delete, BrainCircuit, Loader2, BookOpen, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TenFrame } from '@/components/math/TenFrame';
import { NumberLine } from '@/components/math/NumberLine';
import { CircularTimer } from '@/components/math/CircularTimer';
import { DifficultySelector } from '@/components/math/DifficultySelector';
import { MissionBriefing } from '@/components/math/MissionBriefing';
import { MissionLog, type LogEntry } from '@/components/math/MissionLog';
import { AnalyticsPanel } from '@/components/math/AnalyticsPanel';
import { generateProblem, getHintStrategy, getMakeTenBreakdown } from '@/lib/math-utils';
import { api } from '@/lib/api-client';
import confetti from 'canvas-confetti';
import { LazyMotion, domAnimation, m as motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { StudentStats, DifficultyLevel, SolveLog } from '@shared/types';
export function SandboxPage() {
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const startTimeRef = useRef<number>(Date.now());
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [problem, setProblem] = useState(() => generateProblem(10));
  const [answer, setAnswer] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isTimed, setIsTimed] = useState(true);
  const [dataMode, setDataMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isShaking, setIsShaking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [scorePopup, setScorePopup] = useState<number | null>(null);
  const [missionHistory, setMissionHistory] = useState<LogEntry[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useMemo(() => {
    let id = localStorage.getItem('nexus_user_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('nexus_user_id', id);
    }
    return id;
  }, []);
  const fetchStats = useCallback(async () => {
    try {
      const data = await api<StudentStats>(`/api/student/${userId}`);
      if (isMounted.current) setStats(data);
    } catch (e) { console.error('Failed to fetch stats:', e); }
  }, [userId]);
  const nextProblem = useCallback((difficultyOverride?: DifficultyLevel) => {
    if (!isMounted.current) return;
    const currentDiff = difficultyOverride || stats?.difficulty || 'easy';
    const streak = stats?.streak || 0;
    let baseMax = currentDiff === 'easy' ? 10 : currentDiff === 'medium' ? 20 : 40;
    if (currentDiff === 'hard' && streak > 10) baseMax = 60;
    setProblem(generateProblem(baseMax, problem));
    setAnswer('');
    setMistakes(0);
    setIsSuccess(false);
    setIsAnimating(false);
    setIsSubmitting(false);
    setShowHint(false);
    setTimeLeft(currentDiff === 'hard' ? 30 : 20);
    setScorePopup(null);
    startTimeRef.current = Date.now();
  }, [stats, problem]);
  const handleDifficultyChange = async (val: DifficultyLevel) => {
    if (!stats || isSubmitting || isAnimating || isSuccess || isSyncing) return;
    const previous = stats.difficulty;
    // Optimistic UI update
    setStats({ ...stats, difficulty: val });
    setIsSyncing(true);
    // Immediate reset using the new level to avoid stale problem generation
    nextProblem(val);
    try {
      await api<StudentStats>(`/api/student/${userId}/settings`, {
        method: 'PATCH',
        body: JSON.stringify({ difficulty: val })
      });
      toast.success(`MISSION PARAMETERS: ${val.toUpperCase()}`);
    } catch (e) {
      setStats({ ...stats, difficulty: previous });
      nextProblem(previous);
      toast.error("Tactical sync failed");
    } finally { 
      setIsSyncing(false); 
    }
  };
  const handleExportData = () => {
    if (!stats?.sessionLogs || stats.sessionLogs.length === 0) {
      toast.error("No data logs available for core dump");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats.sessionLogs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `nexus_core_dump_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("DATA CORE DUMP COMPLETE");
  };
  useEffect(() => {
    isMounted.current = true;
    fetchStats();
    return () => {
      isMounted.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchStats]);
  useEffect(() => {
    if (isTimed && !isSuccess && !isSubmitting && !isSyncing) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimed, problem, isSuccess, isSubmitting, isSyncing]);
  const checkAnswer = async () => {
    if (!answer || isSuccess || isAnimating || isSubmitting || isSyncing) return;
    const numericAnswer = parseInt(answer);
    const correct = numericAnswer === problem.num1 + problem.num2;
    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    const solveLog: SolveLog = {
      id: crypto.randomUUID(),
      num1: problem.num1,
      num2: problem.num2,
      userAnswer: numericAnswer,
      isCorrect: correct,
      timeTaken,
      difficulty: stats?.difficulty || 'easy',
      hintUsed: showHint,
      streakAtTime: stats?.streak || 0,
      timestamp: Date.now()
    };
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
      setMissionHistory(prev => [{
        id: crypto.randomUUID(),
        problem: `${problem.num1} + ${problem.num2} = ${numericAnswer}`,
        points,
        multiplier,
        timeTaken: Math.round(timeTaken),
        timestamp: Date.now()
      }, ...prev].slice(0, 10));
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      try {
        const updated = await api<StudentStats>(`/api/student/${userId}/progress`, {
          method: 'POST',
          body: JSON.stringify({ isCorrect: true, points, solveLog })
        });
        if (isMounted.current) {
          setStats(updated);
          setTimeout(() => nextProblem(), 2500);
        }
      } catch (e) { console.error(e); setIsSubmitting(false); }
    } else {
      setIsShaking(true);
      setTimeout(() => { if (isMounted.current) setIsShaking(false); }, 500);
      setMistakes(prev => {
        const newMistakes = prev + 1;
        if (newMistakes >= 2) setShowHint(true);
        return newMistakes;
      });
      try {
        const updated = await api<StudentStats>(`/api/student/${userId}/progress`, {
          method: 'POST',
          body: JSON.stringify({ isCorrect: false, solveLog })
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
  return (
    <LazyMotion features={domAnimation}>
      <div className={cn("min-h-screen energy-grid-bg bg-background text-foreground transition-all duration-700", isSuccess && "bg-indigo-950/20")}>
        <LayoutGroup>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
              <Button variant="ghost" onClick={() => navigate('/')} className="rounded-xl border border-transparent hover:border-white/10" disabled={isAnimating || isSubmitting || isSyncing}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Exit
              </Button>
              <div className="flex items-center gap-4 bg-black/60 backdrop-blur-2xl px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex items-center space-x-3 px-2">
                  <Switch id="data-mode" checked={dataMode} onCheckedChange={setDataMode} />
                  <Label htmlFor="data-mode" className="font-black text-[10px] uppercase cursor-pointer flex items-center gap-2">
                    <Database className="w-3 h-3 text-indigo-400" /> Data
                  </Label>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center space-x-3 px-2">
                  <Switch id="turbo-mode" checked={isTimed} onCheckedChange={setIsTimed} disabled={isSuccess} />
                  <Label htmlFor="turbo-mode" className="font-black text-[10px] uppercase cursor-pointer flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> Turbo
                  </Label>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <DifficultySelector variant="compact" value={stats?.difficulty || 'easy'} onValueChange={handleDifficultyChange} disabled={isSuccess || isAnimating || isSyncing} />
                  {isSyncing && <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />}
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-2 font-black text-indigo-400 text-[10px] uppercase px-2">
                  <TrendingUp className="w-4 h-4" />{stats?.streak ?? 0}
                </div>
              </div>
            </div>
            <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-12 items-start", isShaking && "animate-shake")}>
              <div className="lg:col-span-7 space-y-10">
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  {problem.num1 <= 10 && problem.num2 <= 10 ? (
                    <>
                      <TenFrame id="frame-1" value={showHint && hintStrategy.visualCues.bridgeActive ? 10 : problem.num1} color="indigo" label="BANK A" isSuccess={isSuccess} startIndex={0} />
                      <div className="text-4xl font-black text-white/10">+</div>
                      <TenFrame id="frame-2" value={showHint && hintStrategy.visualCues.bridgeActive ? breakdown.remainder : problem.num2} color="orange" label="BANK B" isSuccess={isSuccess} startIndex={showHint && hintStrategy.visualCues.bridgeActive ? 10 : problem.num1} />
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
                {dataMode && <AnalyticsPanel logs={stats?.sessionLogs || []} onExport={handleExportData} className="animate-fade-in" />}
              </div>
              <div className="lg:col-span-5 space-y-8">
                <div className="text-center relative">
                  <AnimatePresence>
                    {scorePopup && (
                      <motion.div initial={{ opacity: 0, y: 20, scale: 0.5 }} animate={{ opacity: 1, y: -150, scale: 2 }} exit={{ opacity: 0, scale: 3 }} className="absolute left-1/2 -translate-x-1/2 text-7xl font-black text-green-400 z-50 pointer-events-none italic">
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
                    {isTimed && !isSuccess && !isSyncing && <CircularTimer timeLeft={timeLeft} totalTime={stats?.difficulty === 'hard' ? 30 : 20} className="scale-110" />}
                    {isSyncing && <div className="w-24 h-24 flex items-center justify-center bg-black/20 rounded-full border-2 border-dashed border-indigo-500/40 animate-pulse"><RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" /></div>}
                  </div>
                  <AnimatePresence>
                    {showHint && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 bg-indigo-500/10 border-2 border-indigo-500/20 rounded-2xl text-left backdrop-blur-md mb-8 relative group shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                        <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 fill-current" /> {hintStrategy.title}</p>
                        <p className="text-lg font-bold leading-tight mb-4">{hintStrategy.description}</p>
                        <div className="space-y-2">{hintStrategy.steps.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm font-medium text-white/80">
                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black">{idx + 1}</div>{step}
                          </div>
                        ))}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-4">
                  <div className="relative group">
                    <div className={cn("absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20", (answer.length > 0 || isAnimating) && "opacity-60 power-pulse", isSuccess && "from-green-500 to-emerald-600 opacity-100")} />
                    <div className="relative flex gap-4">
                      <div className="relative flex-1">
                        <Input type="number" inputMode="numeric" value={answer} onChange={(e) => { if (!isSuccess && !isAnimating && !isSubmitting && !isSyncing && e.target.value.length <= 3) setAnswer(e.target.value.replace(/^0+/, '') || '0'); }} placeholder="?" className={cn("text-7xl h-32 text-center rounded-2xl border-4 transition-all font-black italic bg-black/90 input-power-core no-spinner", isSuccess ? "border-green-500 text-green-400" : "border-white/10 text-glow-primary")} onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer(); }} disabled={isSuccess || isAnimating || isSyncing} autoFocus />
                      </div>
                      <Button size="lg" onClick={checkAnswer} className={cn("h-32 px-12 rounded-2xl text-3xl font-black italic transition-all", isSuccess ? "bg-green-500 text-white" : "btn-gradient")} disabled={isSuccess || isAnimating || isSyncing || !answer}>
                        {isSubmitting && !isSuccess ? <Loader2 className="w-8 h-8 animate-spin" /> : isSuccess ? <CheckCircle2 className="w-12 h-12" /> : "ENGAGE"}
                      </Button>
                    </div>
                  </div>
                  <MissionLog history={missionHistory} className="h-64" />
                  <div className="grid grid-cols-3 gap-3">{[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "DEL"].map((num) => (
                    <Button key={String(num)} variant="outline" className={cn("h-16 text-2xl font-black rounded-xl border-white/5 bg-black/40 hover:bg-indigo-600", num === "C" && "text-red-400")} onClick={() => {
                      if (num === "C") setAnswer('');
                      else if (num === "DEL") setAnswer(answer.slice(0, -1));
                      else if (answer.length < 3) setAnswer((answer + num).replace(/^0+/, '') || '0');
                    }} disabled={isSuccess || isAnimating || isSyncing}>{num === "C" ? <RotateCcw className="w-5 h-5" /> : num === "DEL" ? <Delete className="w-5 h-5" /> : num}</Button>
                  ))}</div>
                </div>
              </div>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </LazyMotion>
  );
}