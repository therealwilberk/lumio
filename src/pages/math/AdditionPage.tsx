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
  BrainCircuit
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
      
      // Save progress to backend
      saveProgress(true, difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3);
    } else {
      setStreak(0);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Time: <span className="font-semibold">{formatTime(sessionTime)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Score: <span className="font-semibold text-blue-600">{score}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Problem Area */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-8">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Calculator className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Addition Practice
                  </CardTitle>
                </div>
                
                {/* Difficulty Selector */}
                <div className="flex justify-center gap-2 mb-6">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDifficulty(level)}
                      className={`capitalize ${
                        difficulty === level 
                          ? level === 'easy' ? 'bg-green-500 hover:bg-green-600' : 
                            level === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                            'bg-red-500 hover:bg-red-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {currentProblem && (
                  <>
                    {/* Problem Display */}
                    <motion.div
                      key={`${currentProblem.num1}-${currentProblem.num2}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
                        {currentProblem.num1} + {currentProblem.num2} = ?
                      </div>
                    </motion.div>

                    {/* Answer Input */}
                    <div className="flex justify-center">
                      <Input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Your answer"
                        className="text-2xl text-center w-48 h-16 text-lg font-semibold"
                        disabled={showResult}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !showResult) {
                            handleSubmit();
                          }
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    {!showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center"
                      >
                        <Button
                          onClick={handleSubmit}
                          disabled={!userAnswer.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Check Answer
                        </Button>
                      </motion.div>
                    )}

                    {/* Result Feedback */}
                    <AnimatePresence>
                      {showResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="text-center space-y-4"
                        >
                          <div className={`flex items-center justify-center gap-3 text-2xl font-bold ${
                            isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {isCorrect ? (
                              <>
                                <CheckCircle className="h-8 w-8" />
                                <span>Correct!</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-8 w-8" />
                                <span>Not quite!</span>
                              </>
                            )}
                          </div>
                          
                          <div className="text-lg text-gray-600">
                            {isCorrect 
                              ? `Great job! +${difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3} points`
                              : `The answer is ${currentProblem.answer}`
                            }
                          </div>

                          <Button
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
                          >
                            Next Problem
                            <RotateCcw className="h-4 w-4 ml-2" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Streak Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Current Streak</CardTitle>
                <Target className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-orange-500">{streak}</div>
              <p className="text-sm text-gray-600">Problems in a row</p>
            </Card>

            {/* Accuracy Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Accuracy</CardTitle>
                <BrainCircuit className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500">{accuracy}%</div>
              <p className="text-sm text-gray-600">{correctAnswers}/{totalAttempts} correct</p>
            </Card>

            {/* Session Stats */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Session Stats</CardTitle>
                <Timer className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Problems</span>
                  <span className="font-semibold">{totalAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time</span>
                  <span className="font-semibold">{formatTime(sessionTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Points</span>
                  <span className="font-semibold text-blue-600">{score}</span>
                </div>
              </div>
            </Card>

            {/* Motivational Message */}
            {streak >= 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl text-center"
              >
                <Sparkles className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Amazing!</div>
                <div className="text-sm">{streak} problem streak!</div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
