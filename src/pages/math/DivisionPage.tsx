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
  Zap,
  HelpCircle
} from 'lucide-react';

interface DivisionStep {
  dividendPart: number;
  quotientDigit: number;
  multiplication: number;
  remainder: number;
  bringDown: number | null;
  displayIndex: number;
}

interface Problem {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: DivisionStep[];
}

export function DivisionPage() {
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
  const [showHint, setShowHint] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const generateSteps = (dividend: number, divisor: number): DivisionStep[] => {
    const steps: DivisionStep[] = [];
    const divStr = dividend.toString();
    let currentValStr = "";

    for (let i = 0; i < divStr.length; i++) {
      currentValStr += divStr[i];
      let currentVal = parseInt(currentValStr);

      if (currentVal < divisor && steps.length === 0 && i < divStr.length - 1) {
        continue;
      }

      const quotientDigit = Math.floor(currentVal / divisor);
      const multiplication = quotientDigit * divisor;
      const remainder = currentVal - multiplication;

      steps.push({
        dividendPart: currentVal,
        quotientDigit,
        multiplication,
        remainder,
        bringDown: i < divStr.length - 1 ? parseInt(divStr[i+1]) : null,
        displayIndex: i
      });

      currentValStr = remainder.toString();
    }
    return steps;
  };

  const generateNewProblem = () => {
    const { num1: dividend, num2: divisor } = generateMathProblem('division', difficulty);
    const steps = generateSteps(dividend, divisor);

    setCurrentProblem({
      dividend,
      divisor,
      quotient: Math.floor(dividend / divisor),
      remainder: dividend % divisor,
      difficulty,
      steps
    });

    setCurrentStepIndex(0);
    setUserAnswer('');
    setShowFeedback(null);
    setIsProblemComplete(false);
    setMascotMood('idle');
    setStartTime(Date.now());
    setWrongCount(0);
    setShowHint(false);

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    generateNewProblem();
  }, [difficulty]);

  const handleSubmit = async () => {
    if (!currentProblem || !userAnswer.trim()) return;

    const digit = parseInt(userAnswer);
    const step = currentProblem.steps[currentStepIndex];
    const isLastStep = currentStepIndex === currentProblem.steps.length - 1;

    if (digit === step.quotientDigit) {
      setShowFeedback('correct');
      setMascotMood('happy');
      celebrate('correct');
      setWrongCount(0);
      setShowHint(false);

      if (isLastStep) {
        setIsProblemComplete(true);
        setCorrectAnswers(prev => prev + 1);
        setTotalAttempts(prev => prev + 1);
        setScore(prev => prev + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 40));
        setStreak(prev => prev + 1);
        saveProgress(true);
      } else {
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
          setUserAnswer('');
          setShowFeedback(null);
          setMascotMood('idle');
          inputRef.current?.focus();
        }, 1500); // Longer delay to allow watching the animation
      }
    } else {
      setShowFeedback('wrong');
      setMascotMood('sad');
      setTotalAttempts(prev => prev + 1);
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);

      if (newWrongCount >= 2) {
        setShowHint(true);
      }

      if (newWrongCount >= 3) {
        // Auto-correct after 3 attempts to keep flow
        setUserAnswer(step.quotientDigit.toString());
        setTimeout(() => handleSubmit(), 1000);
      } else {
        setTimeout(() => {
          setShowFeedback(null);
          setMascotMood('idle');
          setUserAnswer('');
          inputRef.current?.focus();
        }, 1000);
      }
    }
  };

  const saveProgress = async (isCorrect: boolean) => {
    if (!user || !currentProblem) return;

    try {
      await api(`/api/student/${user.id}/progress`, {
        method: 'POST',
        body: JSON.stringify({
          isCorrect,
          points: isCorrect ? (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 40) : 0,
          solveLog: {
            id: crypto.randomUUID(),
            num1: currentProblem.dividend,
            num2: currentProblem.divisor,
            operation: 'division',
            userAnswer: currentProblem.quotient,
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
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded-xl flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" /> Hint
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
                  <div className="p-3 bg-blue-500/20 rounded-2xl">
                    <Calculator className="h-8 w-8 text-blue-400" />
                  </div>
                  <h1 className="text-3xl font-black text-white uppercase tracking-tight">Division!</h1>
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
                <div className="space-y-12 relative z-10 flex flex-col items-center min-h-[400px]">
                  {/* Long Division UI */}
                  <div className="relative font-mono text-4xl font-bold text-white tracking-widest flex flex-col items-end">

                    {/* Quotient Row */}
                    <div className="flex mb-1 pr-1">
                       {/* Padding to align with bracket */}
                       <div style={{ width: `${currentProblem.divisor.toString().length + 1}ch` }}></div>
                       {currentProblem.steps.map((step, idx) => (
                         <div key={idx} className="w-[1ch] text-center">
                            {idx < currentStepIndex || (isProblemComplete && idx <= currentStepIndex) ? (
                              <motion.span initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-blue-400">
                                {step.quotientDigit}
                              </motion.span>
                            ) : idx === currentStepIndex && !isProblemComplete ? (
                              <span className="text-slate-700 animate-pulse">?</span>
                            ) : null}
                         </div>
                       ))}
                       {isProblemComplete && currentProblem.remainder > 0 && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-4 text-green-400 flex text-2xl items-center">
                            R <span className="ml-2">{currentProblem.remainder}</span>
                         </motion.div>
                       )}
                    </div>

                    {/* Dividend Row with Bracket */}
                    <div className="flex items-center">
                       <div className="text-slate-400 mr-2">{currentProblem.divisor}</div>
                       <div className="border-l-4 border-t-4 border-white pt-2 px-2 flex">
                          {currentProblem.dividend.toString().split('').map((digit, idx) => {
                            const isCurrent = currentProblem.steps[currentStepIndex]?.displayIndex === idx;
                            const isPast = currentProblem.steps[currentStepIndex]?.displayIndex > idx;
                            return (
                              <span
                                key={idx}
                                className={`w-[1ch] text-center transition-colors duration-500 ${
                                  isCurrent ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : isPast ? 'text-slate-500' : 'text-white'
                                }`}
                              >
                                {digit}
                              </span>
                            );
                          })}
                       </div>
                    </div>

                    {/* Working Steps */}
                    <div className="w-full flex flex-col items-end mt-2 pr-2">
                       {currentProblem.steps.slice(0, isProblemComplete ? currentStepIndex + 1 : currentStepIndex + 1).map((step, idx) => (
                         <div key={idx} className="flex flex-col items-end w-full">
                            {/* Multiplication Row */}
                            {idx <= currentStepIndex && (idx < currentStepIndex || showFeedback === 'correct' || isProblemComplete) && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col items-end"
                              >
                                <div className="flex items-center">
                                  <span className="text-xl text-slate-500 mr-2">-</span>
                                  <span className="text-red-400">{step.multiplication}</span>
                                </div>
                                <div className="w-full h-1 bg-slate-700 my-1"></div>
                              </motion.div>
                            )}

                            {/* Remainder/Bring Down Row */}
                            {idx < currentStepIndex || (isProblemComplete && idx === currentStepIndex) ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex"
                              >
                                <span className="text-blue-400">{step.remainder}</span>
                                {step.bringDown !== null && (
                                  <motion.span
                                    initial={{ y: -40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-yellow-400"
                                  >
                                    {step.bringDown}
                                  </motion.span>
                                )}
                              </motion.div>
                            ) : null}
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Input and Guidance */}
                  <div className="text-center space-y-4 w-full max-w-sm">
                    {!isProblemComplete ? (
                      <div className="space-y-6">
                        {showHint && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl text-blue-300 font-bold"
                          >
                            Estimation: How many times does {currentProblem.divisor} fit into {currentProblem.steps[currentStepIndex].dividendPart}?
                          </motion.div>
                        )}

                        <div className="flex flex-col items-center gap-4">
                           <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                             Enter Next Quotient Digit
                           </div>
                           <div className="flex justify-center relative">
                            <input
                              ref={inputRef}
                              type="number"
                              value={userAnswer}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val.length <= 1) setUserAnswer(val);
                              }}
                              placeholder="?"
                              className="text-5xl font-black text-center w-32 h-24 bg-slate-800 border-4 border-blue-500/30 rounded-[2rem] text-white focus:outline-none focus:ring-8 focus:ring-blue-500/20 transition-all no-spinner"
                              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                              autoFocus
                            />
                            <div className="absolute -right-24 -bottom-10 hidden lg:block">
                              <MascotDuck mood={mascotMood} className="w-40 h-40" />
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleSubmit}
                          disabled={!userAnswer.trim()}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-12 py-6 text-xl font-black rounded-2xl shadow-xl hover:scale-105 transition-transform"
                        >
                          Check
                        </Button>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex flex-col items-center gap-2 text-green-400 text-3xl font-black">
                          <CheckCircle className="h-16 w-16" />
                          <span>CHAMPION! 🏆</span>
                        </div>
                        <div className="text-xl font-bold text-slate-400">
                          {currentProblem.dividend} ÷ {currentProblem.divisor} = {currentProblem.quotient} R {currentProblem.remainder}
                        </div>
                        <Button
                          onClick={generateNewProblem}
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
