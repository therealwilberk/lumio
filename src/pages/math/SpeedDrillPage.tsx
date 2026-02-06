import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { celebrate } from '@/components/ui/Celebration';
import { StreakCounter } from '@/components/ui/StreakCounter';
import { showNotification } from '@/lib/notifications';
import { TimerRing } from '@/components/speed-drill/TimerRing';
import { 
  ArrowLeft, 
  Zap, 
  Target, 
  Trophy, 
  RotateCcw, 
  Timer,
  Flame,
  ChevronRight,
  Clock,
  Star
} from 'lucide-react';

interface Problem {
  question: string;
  answer: number;
  num1: number;
  num2: number;
}

interface DrillResult {
  drillId: string;
  userId: string;
  topic: string;
  range: string;
  date: string;
  totalTime: number;
  problems: {
    question: string;
    answer: number;
    userAnswer: number;
    timeSpent: number;
    correct: boolean;
  }[];
  accuracy: number;
  averageTime: number;
  bestStreak: number;
}

interface PreviousAttempt {
  drillId: string;
  date: string;
  totalTime: number;
  accuracy: number;
  averageTime: number;
  bestStreak: number;
}

export function SpeedDrillPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Game state
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [problemStartTime, setProblemStartTime] = useState<number>(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [drillResult, setDrillResult] = useState<DrillResult | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState<PreviousAttempt[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const TOTAL_PROBLEMS = 20;
  const PROBLEM_RANGE = { min: 1, max: 10 };

  // Generate problems
  const generateProblems = () => {
    const newProblems: Problem[] = [];
    for (let i = 0; i < TOTAL_PROBLEMS; i++) {
      const num1 = Math.floor(Math.random() * (PROBLEM_RANGE.max - PROBLEM_RANGE.min + 1)) + PROBLEM_RANGE.min;
      const num2 = Math.floor(Math.random() * (PROBLEM_RANGE.max - PROBLEM_RANGE.min + 1)) + PROBLEM_RANGE.min;
      newProblems.push({
        question: `${num1} + ${num2} = ?`,
        answer: num1 + num2,
        num1,
        num2
      });
    }
    return newProblems;
  };

  // Start drill
  const startDrill = () => {
    const newProblems = generateProblems();
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setUserAnswer('');
    setStartTime(Date.now());
    setCurrentTime(0);
    setProblemStartTime(Date.now());
    setStreak(0);
    setBestStreak(0);
    setGameState('playing');
    setShowFeedback(null);
    setDrillResult(null);
    
    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Update timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setCurrentTime(Date.now() - startTime);
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, startTime]);

  // Handle answer submission
  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    const currentProblem = problems[currentProblemIndex];
    const timeSpent = (Date.now() - problemStartTime) / 1000;
    
    if (answer === currentProblem.answer) {
      // Correct answer - trigger confetti!
      celebrate('correct');
      
      // Show toast notification for streak milestones
      const newStreak = streak + 1;
      if (newStreak === 5) {
        showNotification('streak', '5 in a row! Keep it up! 🔥');
      } else if (newStreak === 10) {
        showNotification('streak', 'Amazing! 10 streak! 🚀');
      } else if (newStreak === 20) {
        showNotification('achievement', 'Incredible! 20 streak! 🏆');
      }
      
      setShowFeedback('correct');
      setStreak(streak + 1);
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1);
      }
      
      // Auto-advance after short delay
      setTimeout(() => {
        if (currentProblemIndex < problems.length - 1) {
          setCurrentProblemIndex(currentProblemIndex + 1);
          setUserAnswer('');
          setProblemStartTime(Date.now());
          setShowFeedback(null);
          inputRef.current?.focus();
        } else {
          // Complete drill
          completeDrill();
        }
      }, 200);
    } else {
      // Wrong answer
      setShowFeedback('wrong');
      setStreak(0);
      
      // Shake animation and clear input
      setTimeout(() => {
        setShowFeedback(null);
        setUserAnswer('');
        inputRef.current?.focus();
      }, 300);
    }
  };

  // Complete drill
  const completeDrill = () => {
    const totalTime = (Date.now() - startTime) / 1000;
    const correctAnswers = problems.filter((p, index) => {
      const answer = parseInt(userAnswer);
      return p.answer === answer;
    }).length;
    
    const accuracy = correctAnswers / problems.length;
    const averageTime = totalTime / problems.length;
    
    const result: DrillResult = {
      drillId: `drill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user?.id || 'anonymous',
      topic: 'addition',
      range: '1-10',
      date: new Date().toISOString(),
      totalTime,
      problems: problems.map((p, index) => ({
        question: p.question,
        answer: p.answer,
        userAnswer: parseInt(userAnswer),
        timeSpent: 0, // Would track actual time per problem
        correct: p.answer === parseInt(userAnswer)
      })),
      accuracy,
      averageTime,
      bestStreak
    };
    
    setDrillResult(result);
    setGameState('complete');
    
    // Celebrate completion!
    celebrate('completion');
    showNotification('success', `Challenge complete! ${Math.round(result.accuracy * 100)}% accuracy! 🎉`);
    
    // Save to backend
    saveDrillResult(result);
    
    // Load previous attempts for comparison
    loadPreviousAttempts();
  };

  // Save drill result
  const saveDrillResult = async (result: DrillResult) => {
    try {
      await api('/api/drill/save', {
        method: 'POST',
        body: JSON.stringify(result)
      });
    } catch (error) {
      console.error('Failed to save drill result:', error);
    }
  };

  // Load previous attempts
  const loadPreviousAttempts = async () => {
    try {
      const attempts = await api<PreviousAttempt[]>(`/api/drill/attempts/${user?.id}`);
      setPreviousAttempts(attempts.slice(-5)); // Keep last 5 attempts
    } catch (error) {
      console.error('Failed to load previous attempts:', error);
    }
  };

  // Get performance badge
  const getPerformanceBadge = (totalTime: number) => {
    if (totalTime < 30) return { text: 'Lightning Fast!', color: 'text-yellow-500', icon: Zap };
    if (totalTime < 45) return { text: 'Speed Star!', color: 'text-blue-500', icon: Star };
    if (totalTime < 60) return { text: 'Getting Quick!', color: 'text-green-500', icon: Target };
    return { text: 'Keep Practicing!', color: 'text-gray-500', icon: Clock };
  };

  // Get timer color based on time
  const getTimerColor = () => {
    const timeLeft = 60 - currentTime;
    if (timeLeft > 30) return 'stroke-green-500';
    if (timeLeft > 15) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentProblem = problems[currentProblemIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12 pt-24">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl p-12 rounded-3xl max-w-md mx-auto">
              <div className="text-center space-y-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Lightning Round! ⚡
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  How fast can you solve 20 math problems? Let's find out!
                </p>
                
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Numbers:</strong> {PROBLEM_RANGE.min} to {PROBLEM_RANGE.max}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Problems:</strong> {TOTAL_PROBLEMS}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Mission:</strong> Get faster at adding 1-10!
                  </div>
                </div>
                
                <Button
                  onClick={startDrill}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Zap className="h-5 w-5" />
                  Start!
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/math')}
                  className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 text-lg font-semibold rounded-xl transition-all"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {(gameState === 'playing' || gameState === 'complete') && (
          <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            {gameState === 'playing' && currentProblem && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
              >
                {/* Timer and Progress */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex flex-col items-center">
                    <TimerRing elapsedMs={currentTime} />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Time</p>
                  </div>
                  
                  {/* Problem Counter */}
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                      {currentProblemIndex + 1}
                      <span className="text-gray-400 dark:text-gray-500">/{TOTAL_PROBLEMS}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Problems</p>
                  </div>
                  
                  {/* Best Streak */}
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold text-orange-500">
                      {bestStreak}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Best Streak</p>
                  </div>
                </div>

                {/* Problem Display */}
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl p-8 rounded-2xl mb-8">
                  <div className="text-center">
                    <div 
                      className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-8"
                      style={{ fontSize: '100px' }}
                    >
                      {currentProblem.question}
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {showFeedback === 'correct' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1] }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 bg-green-500 rounded-2xl"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      {showFeedback === 'wrong' && (
                        <motion.div
                          initial={{ opacity: 0, x: 0 }}
                          animate={{ opacity: [0, 1, 1, 0], x: [0, -10, 10, -10, 0] }}
                          exit={{ opacity: 0, x: 0 }}
                          className="absolute inset-0 bg-red-500 rounded-2xl"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSubmit();
                          }
                        }}
                        className="w-32 text-4xl font-bold text-center bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500"
                        placeholder="?"
                        disabled={showFeedback !== null}
                      />
                    </div>
                  </div>
                </Card>

                {/* Streak Display */}
                <div className="text-center">
                  <StreakCounter count={streak} size="lg" />
                </div>
              </motion.div>
            )}

            {gameState === 'complete' && drillResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
              >
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl p-12 rounded-3xl">
                  <div className="text-center space-y-6">
                    {/* Trophy */}
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Trophy className="h-10 w-10 text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Challenge Complete!
                    </h2>
                    
                    {/* Stats */}
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Time Spent:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatTime(drillResult.totalTime)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">How Many Right:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {Math.round(drillResult.accuracy * 100)}% ({Math.round(drillResult.accuracy * TOTAL_PROBLEMS)}/{TOTAL_PROBLEMS})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Avg Time Per Problem:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {drillResult.averageTime.toFixed(2)}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Best Streak:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {drillResult.bestStreak}
                        </span>
                      </div>
                    </div>
                    
                    {/* Performance Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
                      {(() => {
                        const badge = getPerformanceBadge(drillResult.totalTime);
                        const Icon = badge.icon;
                        return (
                          <>
                            <Icon className="h-5 w-5 text-white" />
                            <span className="font-bold text-white">{badge.text}</span>
                          </>
                        );
                      })()}
                    </div>
                    
                    {/* Previous Attempts Comparison */}
                    {previousAttempts.length > 0 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <p className="font-medium mb-2">Your Past Runs:</p>
                        <div className="space-y-1">
                          {previousAttempts.map((attempt, index) => (
                            <div key={attempt.drillId} className="flex justify-between text-xs">
                              <span>{new Date(attempt.date).toLocaleDateString()}</span>
                              <span>{formatTime(attempt.totalTime)}</span>
                              <span>{Math.round(attempt.accuracy * 100)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={startDrill}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Try Again
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => navigate('/math')}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl transition-all"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
