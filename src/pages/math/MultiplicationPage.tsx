import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { MascotDuck } from '@/components/ui/MascotDuck';
import { celebrate } from '@/components/ui/Celebration';
import { generateProblem as generateMathProblem } from '@/lib/math-utils';
import { Spotlight } from '@/components/ui/spotlight';
import { Meteors } from '@/components/ui/meteors';
import {
  ArrowLeft,
  Calculator,
  RotateCcw,
  Trophy,
  Flame,
  Target,
  CheckCircle,
  XCircle,
  Zap,
  BookOpen
} from 'lucide-react';

interface Problem {
  num1: number;
  num2: number;
  answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: MultiplicationStep[];
}

interface MultiplicationStep {
  label: string;
  calc: string;
  value: number;
}

export function MultiplicationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'sad'>('idle');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isProblemComplete, setIsProblemComplete] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const inputRef = useRef<HTMLInputElement>(null);

  const generateSteps = (num1: number, num2: number): MultiplicationStep[] => {
    const steps: MultiplicationStep[] = [];
    const n1Str = num1.toString();
    const len = n1Str.length;

    for (let i = 0; i < len; i++) {
      const digit = parseInt(n1Str[len - 1 - i]);
      const placeValue = Math.pow(10, i);
      const value = digit * placeValue;
      const stepValue = value * num2;

      let label = "Multiply Ones";
      if (i === 1) label = "Multiply Tens";
      if (i === 2) label = "Multiply Hundreds";

      steps.push({
        label,
        calc: `${value} × ${num2}`,
        value: stepValue
      });
    }

    // Add final sum step if more than one partial product
    if (steps.length > 1) {
      steps.push({
        label: "Final Sum",
        calc: steps.map(s => s.value).join(" + "),
        value: num1 * num2
      });
    }

    return steps;
  };

  const generateNewProblem = () => {
    const { num1, num2 } = generateMathProblem('multiplication', difficulty);
    const steps = generateSteps(num1, num2);

    setCurrentProblem({
      num1,
      num2,
      answer: num1 * num2,
      difficulty,
      steps
    });

    setCurrentStepIndex(0);
    setUserAnswer('');
    setShowFeedback(null);
    setIsProblemComplete(false);
    setMascotMood('idle');
    setStartTime(Date.now());

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    generateNewProblem();
  }, [difficulty]);

  const handleSubmit = async () => {
    if (!currentProblem || !userAnswer.trim()) return;

    const answer = parseInt(userAnswer);
    const step = currentProblem.steps[currentStepIndex];
    const isLastStep = currentStepIndex === currentProblem.steps.length - 1;

    if (answer === step.value) {
      setShowFeedback('correct');
      setMascotMood('happy');
      celebrate('correct');

      if (isLastStep) {
        setIsProblemComplete(true);
        setCorrectAnswers(prev => prev + 1);
        setTotalAttempts(prev => prev + 1);
        setScore(prev => prev + (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20));
        setStreak(prev => prev + 1);

        // Save progress
        saveProgress(true);
      } else {
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
          setUserAnswer('');
          setShowFeedback(null);
          setMascotMood('idle');
          inputRef.current?.focus();
        }, 1000);
      }
    } else {
      setShowFeedback('wrong');
      setMascotMood('sad');
      setStreak(0);
      setTotalAttempts(prev => prev + 1);

      if (isLastStep) {
        saveProgress(false);
      }

      setTimeout(() => {
        setShowFeedback(null);
        setMascotMood('idle');
        setUserAnswer('');
        inputRef.current?.focus();
      }, 1000);
    }
  };

  const saveProgress = async (isCorrect: boolean) => {
    if (!user || !currentProblem) return;

    try {
      await api(`/api/student/${user.id}/progress`, {
        method: 'POST',
        body: JSON.stringify({
          isCorrect,
          points: isCorrect ? (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20) : 0,
          solveLog: {
            id: crypto.randomUUID(),
            num1: currentProblem.num1,
            num2: currentProblem.num2,
            operation: 'multiplication',
            userAnswer: currentProblem.answer,
            isCorrect,
            timeTaken: Date.now() - startTime,
            difficulty: currentProblem.difficulty,
            timestamp: Date.now()
          }
        })
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleNextProblem = () => {
    generateNewProblem();
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

  return (
    <div className="min-h-screen w-full bg-slate-950 antialiased relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12 pt-24 relative z-10">
        {/* Navigation Actions */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/math')} className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Math Hub
          </Button>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/math/speed-drill')} className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 rounded-xl flex items-center gap-2">
              <Zap className="h-4 w-4" /> Speed Drill
            </Button>
          </div>
        </motion.div>

        {/* Stats Header */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 p-4 flex flex-col items-center">
            <Flame className="h-5 w-5 text-orange-500 mb-1" />
            <span className="text-2xl font-bold text-white">{streak}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Streak</span>
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 p-4 flex flex-col items-center">
            <Target className="h-5 w-5 text-green-500 mb-1" />
            <span className="text-2xl font-bold text-white">{accuracy}%</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 p-4 flex flex-col items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mb-1" />
            <span className="text-2xl font-bold text-white">{score}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Points</span>
          </Card>
        </div>

        {/* Main Game Board */}
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
              <Meteors number={20} />

              <div className="text-center pb-8 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500/20 rounded-2xl">
                    <Calculator className="h-8 w-8 text-purple-400" />
                  </div>
                  <h1 className="text-3xl font-black text-white uppercase tracking-tight">Multiplication!</h1>
                </div>

                <div className="flex justify-center gap-3 mb-10">
                  {[
                    { id: 'easy', label: 'Seed', color: 'bg-green-400', icon: '🌱' },
                    { id: 'medium', label: 'Sprout', color: 'bg-yellow-400', icon: '🌿' },
                    { id: 'hard', label: 'Oak', color: 'bg-orange-500', icon: '🌳' }
                  ].map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDifficulty(level.id as any)}
                      className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl font-bold transition-all ${
                        difficulty === level.id ? `${level.color} text-white shadow-lg ring-4 ring-white/10` : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{level.icon}</span>
                      <span className="text-xs uppercase tracking-wider">{level.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {currentProblem && (
                <div className="space-y-8 relative z-10">
                  {/* Vertical Problem Display */}
                  <div className="flex flex-col items-end max-w-[200px] mx-auto text-5xl font-black text-white tracking-[0.5em] pr-4">
                    <div className="mb-2">{currentProblem.num1}</div>
                    <div className="flex items-center gap-4 border-b-4 border-white pb-2 w-full justify-end">
                      <span className="text-3xl text-slate-500">×</span>
                      {currentProblem.num2}
                    </div>

                    {/* Partial Products Reveal */}
                    <div className="w-full mt-4 space-y-4">
                      {currentProblem.steps.map((step, idx) => (
                        <AnimatePresence key={idx}>
                          {idx <= currentStepIndex && (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between w-full"
                            >
                              <div className="text-right flex-1 tabular-nums">
                                {idx < currentStepIndex || isProblemComplete ? (
                                  <span className="text-purple-400">{step.value}</span>
                                ) : (
                                  <span className="text-slate-600">?</span>
                                )}
                              </div>
                              <div className="text-[10px] font-bold text-slate-500 tracking-normal ml-4 whitespace-nowrap">
                                {step.label}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      ))}
                    </div>
                  </div>

                  {/* Input and Guidance */}
                  <div className="text-center space-y-4">
                    {!isProblemComplete ? (
                      <div className="space-y-6">
                        <div className="text-lg font-bold text-purple-400 uppercase tracking-widest animate-pulse">
                          {currentProblem.steps[currentStepIndex].label}
                        </div>
                        <div className="text-2xl font-bold text-slate-400">
                          {currentProblem.steps[currentStepIndex].calc} = ?
                        </div>
                        <div className="flex justify-center relative">
                          <input
                            ref={inputRef}
                            type="number"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="?"
                            className="text-5xl font-black text-center w-64 h-24 bg-slate-800 border-4 border-purple-500/30 rounded-[2rem] text-white focus:outline-none focus:ring-8 focus:ring-purple-500/20 transition-all no-spinner"
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            autoFocus
                          />
                          <div className="absolute -right-20 -bottom-10 hidden lg:block">
                            <MascotDuck mood={mascotMood} className="w-40 h-40" />
                          </div>
                        </div>
                        <Button
                          onClick={handleSubmit}
                          disabled={!userAnswer.trim()}
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-12 py-6 text-xl font-black rounded-2xl shadow-xl hover:scale-105 transition-transform"
                        >
                          Check Answer
                        </Button>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex flex-col items-center gap-2 text-green-400 text-3xl font-black">
                          <CheckCircle className="h-16 w-16" />
                          <span>AMAZING! 🎉</span>
                        </div>
                        <div className="text-xl font-bold text-slate-400">
                          {currentProblem.num1} × {currentProblem.num2} = {currentProblem.answer}
                        </div>
                        <Button
                          onClick={handleNextProblem}
                          className="bg-white text-slate-900 px-12 py-6 text-xl font-black rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                        >
                          Next Problem <RotateCcw className="h-6 w-6" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
