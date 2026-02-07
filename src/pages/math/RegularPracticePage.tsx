import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import type { StudentStats } from '@shared/types';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { Spotlight } from '@/components/ui/spotlight';
import { Meteors } from '@/components/ui/meteors';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { MascotDuck } from '@/components/ui/MascotDuck';
import { celebrate } from '@/components/ui/Celebration';
import { DotGroup } from '@/components/ui/DotGroup';
import { Plus } from 'lucide-react';
import { 
  ArrowLeft, 
  Target, 
  Trophy, 
  RotateCcw, 
  Timer,
  Flame,
  Lightbulb,
  Settings,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';

interface Problem {
  question: string;
  answer: number;
  num1: number;
  num2: number;
  level: number;
  hint?: string;
}

interface Level {
  level: number;
  name: string;
  range: { min: number; max: number };
  description: string;
  hint?: string;
}

interface PracticeSession {
  level: number;
  score: number;
  streak: number;
  problemsSolved: number;
  timeSpent: number;
  correctAnswers: number;
  hintsUsed: number;
}

export function RegularPracticePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Game state
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'sad'>('idle');
  const [session, setSession] = useState<PracticeSession>({
    level: 1,
    score: 0,
    streak: 0,
    problemsSolved: 0,
    timeSpent: 0,
    correctAnswers: 0,
    hintsUsed: 0
  });
  
  // Settings
  const [showVisualHelpers, setShowVisualHelpers] = useState(true);
  const [problemStartTime, setProblemStartTime] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Level definitions
  const levels: Level[] = [
    {
      level: 1,
      name: "Getting Started",
      range: { min: 1, max: 5 },
      description: "Simple addition with small numbers",
      hint: "Try grouping into tens"
    },
    {
      level: 2,
      name: "Building Confidence",
      range: { min: 1, max: 10 },
      description: "Master basic addition",
      hint: "Show breakdown: 12+8 = 10+2+8 = 10+10 = 20"
    },
    {
      level: 3,
      name: "Growing Skills",
      range: { min: 10, max: 15 },
      description: "Medium difficulty addition",
      hint: "Highlight dots in groups of 10"
    },
    {
      level: 4,
      name: "Making Tens",
      range: { min: 15, max: 25 },
      description: "Learn the making tens strategy",
      hint: "Look for numbers that make 10"
    },
    {
      level: 5,
      name: "Advanced Addition",
      range: { min: 20, max: 50 },
      description: "Challenge yourself with bigger numbers"
    }
  ];

  const currentLevel = levels[session.level - 1];

  // Generate problem based on level
  const generateProblem = (level: Level): Problem => {
    const { min, max } = level.range;
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    
    return {
      question: `${num1} + ${num2} = ?`,
      answer: num1 + num2,
      num1,
      num2,
      level: level.level,
      hint: level.hint
    };
  };

  // Start practice session
  const startPractice = () => {
    const newProblem = generateProblem(currentLevel);
    setCurrentProblem(newProblem);
    setUserAnswer('');
    setProblemStartTime(Date.now());
    setSessionStartTime(Date.now());
    setSession({
      ...session,
      problemsSolved: 0,
      correctAnswers: 0,
      hintsUsed: 0,
      score: 0,
      streak: 0,
      timeSpent: 0
    });
    setGameState('playing');
    setShowFeedback(null);
    setShowHint(false);
    
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
        setSession(prev => ({
          ...prev,
          timeSpent: (Date.now() - sessionStartTime) / 1000
        }));
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, sessionStartTime]);

  // Handle answer submission
  const handleSubmit = () => {
    if (!currentProblem || !userAnswer.trim()) return;
    
    const answer = parseInt(userAnswer);
    const timeSpent = (Date.now() - problemStartTime) / 1000;
    const isCorrect = answer === currentProblem.answer;
    
    if (isCorrect) {
      // Calculate points
      let points = 10;
      if (timeSpent < 10) points += 5; // Time bonus
      
      celebrate('correct');
      setMascotMood('happy');
      setShowFeedback('correct');
      setSession(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1,
        problemsSolved: prev.problemsSolved + 1,
        correctAnswers: prev.correctAnswers + 1,
        timeSpent: prev.timeSpent + timeSpent
      }));
      
      // Auto-advance after short delay
      setTimeout(() => {
        setMascotMood('idle');
        nextProblem();
      }, 1000);
    } else {
      // Wrong answer
      setMascotMood('sad');
      setShowFeedback('wrong');
      setSession(prev => ({
        ...prev,
        streak: 0,
        problemsSolved: prev.problemsSolved + 1,
        timeSpent: prev.timeSpent + timeSpent
      }));
      
      // Shake animation and clear input
      setTimeout(() => {
        setMascotMood('idle');
        setShowFeedback(null);
        setUserAnswer('');
        inputRef.current?.focus();
      }, 500);
    }
  };

  // Next problem
  const nextProblem = () => {
    const newProblem = generateProblem(currentLevel);
    setCurrentProblem(newProblem);
    setUserAnswer('');
    setProblemStartTime(Date.now());
    setShowFeedback(null);
    setShowHint(false);
    setMascotMood('idle');
    inputRef.current?.focus();
  };

  // Use hint
  const useHint = () => {
    if (!showHint && currentProblem?.hint) {
      setShowHint(true);
      setSession(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 5), // Cost 5 points
        hintsUsed: prev.hintsUsed + 1
      }));
    }
  };

  // Level progression
  const nextLevel = () => {
    if (session.level < levels.length) {
      setSession(prev => ({
        ...prev,
        level: prev.level + 1
      }));
      startPractice();
    }
  };

  // Get timer color
  const getTimerColor = () => {
    const timePerProblem = session.problemsSolved > 0 ? session.timeSpent / session.problemsSolved : 0;
    if (timePerProblem < 10) return 'bg-green-500';
    if (timePerProblem < 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 overflow-hidden relative">
      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12 pt-24 flex flex-col items-center">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full"
          >
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl p-12 rounded-3xl max-w-md mx-auto">
              <div className="text-center space-y-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-8 w-8 text-white" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Regular Practice
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Progress through levels and master addition at your own pace.
                </p>
                
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Current Level:</strong> {currentLevel.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Range:</strong> {currentLevel.range.min}-{currentLevel.range.max}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Progress:</strong> {session.score} points
                  </div>
                </div>
                
                <Button
                  onClick={startPractice}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Target className="h-5 w-5" />
                  Start Practice
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/math')}
                  className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 text-lg font-semibold rounded-xl transition-all"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Math Hub
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {gameState === 'playing' && currentProblem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            {/* Level and Score Header */}
            <div className="flex justify-between items-center mb-8 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                <span className="font-medium">Level {session.level}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium">Score: {session.score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  <span className="font-medium">🔥: {session.streak}</span>
                </div>
              </div>
            </div>

            {/* Timer Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-all duration-300 ${getTimerColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((session.problemsSolved / 20) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Problem Display */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl p-8 rounded-2xl mb-8 relative overflow-hidden">
              <Meteors number={20} />
              <div className="relative z-10">
                <div className="text-center">
                  <div 
                    className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
                  >
                  {currentProblem.question}
                </div>
                
                {/* Visual Helpers */}
                {showVisualHelpers && currentProblem && (
                  <div className="flex justify-center gap-12 mb-8 relative z-10">
                    <DotGroup
                      count={currentProblem.num1}
                      color="blue"
                      minRows={Math.max(Math.ceil(currentProblem.num1/5), Math.ceil(currentProblem.num2/5))}
                    />
                    <div className="flex items-center">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <DotGroup
                      count={currentProblem.num2}
                      color="purple"
                      minRows={Math.max(Math.ceil(currentProblem.num1/5), Math.ceil(currentProblem.num2/5))}
                    />
                  </div>
                )}
                
                <AnimatePresence mode="wait">
                  {showFeedback === 'correct' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1] }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl"
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  {showFeedback === 'wrong' && (
                    <motion.div
                      initial={{ opacity: 0, x: 0 }}
                      animate={{ opacity: [0, 1, 1, 0], x: [0, -10, 10, -10, 0] }}
                      exit={{ opacity: 0, x: 0 }}
                      className="absolute inset-0 border-2 border-red-500 rounded-2xl"
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
                    className="w-32 text-2xl font-bold text-center bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500"
                    placeholder="?"
                    disabled={showFeedback !== null}
                  />
                </div>
              </div>
            </div>
            </Card>

            {/* Mascot positioned relative to Game Board */}
            <div className="absolute -bottom-6 -right-6 hidden lg:block">
              <MascotDuck mood={mascotMood} className="w-40 h-40" />
            </div>

            {/* Hint and Settings */}
            <div className="flex justify-center gap-4 mb-8">
              <AnimatedTooltip items={[{ id: 1, name: "Hint", designation: "-5 points", image: "" }]}>
                <Button
                  variant="outline"
                  onClick={useHint}
                  disabled={showHint || session.score < 5}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lightbulb className="h-4 w-4" />
                  💡 Hint
                  {showHint && <span className="text-xs ml-2">(-5 pts)</span>}
                </Button>
              </AnimatedTooltip>
              
              <AnimatedTooltip items={[{ id: 2, name: "Settings", designation: "Toggle helpers", image: "" }]}>
                <Button
                  variant="outline"
                  onClick={() => setShowVisualHelpers(!showVisualHelpers)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  <Settings className="h-4 w-4" />
                  ⚙️ Settings
                </Button>
              </AnimatedTooltip>
            </div>

            {/* Hint Display */}
            <AnimatePresence>
              {showHint && currentProblem.hint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 mb-8 text-center"
                >
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    💡 {currentProblem.hint}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer.trim() || showFeedback !== null}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-8 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Check Answer
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {gameState === 'complete' && (
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
                  Practice Complete!
                </h2>
                
                {/* Stats */}
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Level:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {session.level} - {currentLevel.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Score:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {session.score} points
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {session.problemsSolved > 0 ? Math.round((session.correctAnswers / session.problemsSolved) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Best Streak:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {session.streak} 🔥
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {Math.round(session.timeSpent)}s
                    </span>
                  </div>
                </div>
                
                {/* Performance Message */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                  <Zap className="h-5 w-5 text-white" />
                  <span className="font-bold text-white">
                    {session.score >= 100 ? 'Excellent!' : session.score >= 50 ? 'Great Job!' : 'Keep Practicing!'}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  {session.level < levels.length ? (
                    <Button
                      onClick={nextLevel}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                      Next Level
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={startPractice}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Practice Again
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/math')}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl transition-all"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Math Hub
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
