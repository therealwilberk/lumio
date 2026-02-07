import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import type { StudentStats, SolveLog } from '@shared/types';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { DigitBlock } from '@/components/ui/DigitBlock';
import { MascotDuck } from '@/components/ui/MascotDuck';
import { celebrate } from '@/components/ui/Celebration';
import { Spotlight } from '@/components/ui/spotlight';
import { Meteors } from '@/components/ui/meteors';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { 
  Calculator, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  TrendingUp, 
  Timer, 
  Target,
  ArrowLeft,
  Sparkles,
  BrainCircuit,
  Zap,
  BookOpen,
  Trophy,
  Flame,
  Star
} from 'lucide-react';

interface Problem {
  num1: number;
  num2: number;
  answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function AdditionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [sessionTime, setSessionTime] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showFeedback, setShowFeedback] = useState(false);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'sad'>('idle');

  // Generate random addition problem
  const generateProblem = () => {
    let num1: number, num2: number;
    
    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 10;
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 100) + 20;
        num2 = Math.floor(Math.random() * 100) + 20;
        break;
    }
    
    setCurrentProblem({
      num1,
      num2,
      answer: num1 + num2,
      difficulty
    });
    setUserAnswer('');
    setShowResult(false);
    setShowFeedback(false);
  };

  // Initialize first problem
  useEffect(() => {
    generateProblem();
  }, [difficulty]);

  // Update session time
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Handle answer submission
  const handleSubmit = () => {
    if (!currentProblem || !userAnswer.trim()) return;
    
    const answer = parseInt(userAnswer);
    const correct = answer === currentProblem.answer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setShowFeedback(true);
    setTotalAttempts(totalAttempts + 1);
    
    if (correct) {
      setScore(score + (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3));
      setStreak(streak + 1);
      setCorrectAnswers(correctAnswers + 1);
      setMascotMood('happy');
      celebrate('correct');
      
      // Save progress to backend
      saveProgress(true, difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3);
    } else {
      setStreak(0);
      setMascotMood('sad');
      saveProgress(false, 0);
    }
  };

  // Save progress to backend
  const saveProgress = async (isCorrect: boolean, points: number) => {
    if (!user) return;
    
    const solveLog: SolveLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      num1: currentProblem!.num1,
      num2: currentProblem!.num2,
      userAnswer: parseInt(userAnswer),
      isCorrect,
      timeTaken: Date.now() - startTime,
      difficulty: currentProblem!.difficulty,
      hintUsed: false,
      streakAtTime: streak,
      timestamp: Date.now()
    };

    try {
      await api(`/api/student/${user.id}/progress`, {
        method: 'POST',
        body: JSON.stringify({ isCorrect, points, solveLog })
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Handle next problem
  const handleNext = () => {
    setMascotMood('idle');
    generateProblem();
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate accuracy
  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

  return (
    <div className="min-h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Spotlight effect for Phase 6 */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12 pt-24 relative z-10">
        {/* Navigation Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/math')}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Math Hub
          </Button>
          
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/math/speed-drill')}
              className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 rounded-xl flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Speed Drill
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/math/regular-practice')}
              className="border-green-500/50 text-green-500 hover:bg-green-500/10 rounded-xl flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Practice
            </Button>
          </div>
        </motion.div>

        {/* Symmetrical Stats Header */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <AnimatedTooltip items={[{ id: 1, name: "Streak", designation: `${streak} in a row!` }]}>
            <div className="bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex flex-col items-center">
              <Flame className="h-5 w-5 text-orange-500 mb-1" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{streak}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Streak</span>
            </div>
          </AnimatedTooltip>

          <AnimatedTooltip items={[{ id: 2, name: "Accuracy", designation: `${accuracy}% of answers correct` }]}>
            <div className="bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex flex-col items-center">
              <Target className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{accuracy}%</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Accuracy</span>
            </div>
          </AnimatedTooltip>

          <AnimatedTooltip items={[{ id: 3, name: "Points", designation: `${score} points earned this session` }]}>
            <div className="bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex flex-col items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mb-1" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{score}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Points</span>
            </div>
          </AnimatedTooltip>
        </div>

        {/* Main Content Area - Symmetrical */}
        <div className="max-w-2xl mx-auto">
          {/* Problem Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border-4 border-blue-100 dark:border-blue-900/30 shadow-2xl rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
              {/* Meteors for Phase 6 */}
              <Meteors number={20} />

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-bl-[4rem]" />

              <div className="text-center pb-8 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                    <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    Adding Numbers!
                  </h1>
                </div>
                
                {/* Whimsical Difficulty Selector */}
                <div className="flex justify-center gap-3 mb-10">
                  {[
                    { id: 'easy', label: 'Seed', color: 'bg-green-400 hover:bg-green-500', icon: '🌱' },
                    { id: 'medium', label: 'Sprout', color: 'bg-yellow-400 hover:bg-yellow-500', icon: '🌿' },
                    { id: 'hard', label: 'Oak', color: 'bg-orange-500 hover:bg-orange-600', icon: '🌳' }
                  ].map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDifficulty(level.id as any)}
                      className={`
                        flex flex-col items-center gap-1 px-5 py-3 rounded-2xl font-bold transition-all
                        ${difficulty === level.id
                          ? `${level.color} text-white shadow-lg ring-4 ring-white dark:ring-gray-800`
                          : 'bg-slate-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <span className="text-2xl">{level.icon}</span>
                      <span className="text-xs uppercase tracking-wider">{level.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-10 relative z-10">
                {currentProblem && (
                  <>
                    {/* Whimsical Problem Display */}
                    <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
                      <DigitBlock digit={currentProblem.num1} color="teal" />
                      <div className="text-4xl md:text-6xl font-black text-gray-400">+</div>
                      <DigitBlock digit={currentProblem.num2} color="pink" />
                      <div className="text-4xl md:text-6xl font-black text-gray-400">=</div>
                      <div className="w-20 h-24 md:w-28 md:h-32 rounded-3xl border-4 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-4xl font-black text-gray-300">
                        ?
                      </div>
                    </div>

                    {/* Answer Input */}
                    <div className="flex justify-center relative">
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="?"
                        className="text-5xl font-black text-center w-48 h-24 bg-slate-50 dark:bg-gray-900 border-4 border-blue-200 dark:border-blue-800 rounded-[2rem] text-gray-900 dark:text-white focus:outline-none focus:ring-8 focus:ring-blue-500/20 transition-all no-spinner"
                        disabled={showResult}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !showResult) {
                            handleSubmit();
                          }
                        }}
                        autoFocus
                      />

                      {/* Mascot integrated into practice area */}
                      <div className="absolute -right-12 -bottom-12 hidden lg:block">
                        <MascotDuck mood={mascotMood} className="w-40 h-40" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    {!showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSubmit}
                          disabled={!userAnswer.trim()}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-12 py-5 text-2xl font-black rounded-2xl shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Check It!
                        </motion.button>
                      </motion.div>
                    )}

                    {/* Result Feedback */}
                    <AnimatePresence>
                      {showResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="text-center space-y-6"
                        >
                          <div className={`flex flex-col items-center gap-2 text-3xl font-black ${
                            isCorrect ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {isCorrect ? (
                              <>
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <CheckCircle className="h-16 w-16" />
                                </motion.div>
                                <span>You got it! 🎉</span>
                              </>
                            ) : (
                              <>
                                <motion.div
                                  animate={{ x: [0, -10, 10, -10, 0] }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <XCircle className="h-16 w-16" />
                                </motion.div>
                                <span>Oops! Try again! 💪</span>
                              </>
                            )}
                          </div>
                          
                          <div className="text-xl font-bold text-gray-500 dark:text-gray-400">
                            {isCorrect 
                              ? `Great job! You earned ${difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3} points!`
                              : `The correct answer was ${currentProblem.answer}`
                            }
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 text-xl font-black rounded-2xl shadow-lg transition-all flex items-center gap-3 mx-auto"
                          >
                            Next One!
                            <RotateCcw className="h-6 w-6" />
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Time Display at Bottom */}
          <div className="mt-8 text-center text-gray-400 font-medium">
            Session Time: {formatTime(sessionTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
