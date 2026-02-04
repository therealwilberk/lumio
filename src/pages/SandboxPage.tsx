import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TenFrame } from '@/components/math/TenFrame';
import { NumberLine } from '@/components/math/NumberLine';
import { generateProblem, getMakeTenBreakdown } from '@/lib/math-utils';
import { api } from '@/lib/api-client';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
export function SandboxPage() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState(generateProblem());
  const [answer, setAnswer] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const userId = localStorage.getItem('nexus_user_id') || 'guest';
  const checkAnswer = async () => {
    const numericAnswer = parseInt(answer);
    const correct = numericAnswer === problem.num1 + problem.num2;
    if (correct) {
      setIsSuccess(true);
      setIsAnimating(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      await api(`/api/student/${userId}/progress`, { 
        method: 'POST', 
        body: JSON.stringify({ isCorrect: true }) 
      });
      setTimeout(() => {
        nextProblem();
      }, 3000);
    } else {
      setMistakes(m => m + 1);
      if (mistakes + 1 >= 2) setShowHint(true);
      await api(`/api/student/${userId}/progress`, { 
        method: 'POST', 
        body: JSON.stringify({ isCorrect: false }) 
      });
    }
  };
  const nextProblem = () => {
    setProblem(generateProblem());
    setAnswer('');
    setMistakes(0);
    setIsSuccess(false);
    setIsAnimating(false);
    setShowHint(false);
  };
  const breakdown = getMakeTenBreakdown(problem.num1, problem.num2);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="rounded-2xl">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
        </Button>
        <div className="text-xl font-bold text-muted-foreground">Level: Adding within 20</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Visualization Section */}
        <div className="space-y-8 order-2 lg:order-1">
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <TenFrame 
              value={showHint ? 10 : problem.num1} 
              color="bg-indigo-500" 
              label={showHint ? "Full 10" : `Value: ${problem.num1}`} 
            />
            <div className="text-4xl font-bold text-muted-foreground">+</div>
            <TenFrame 
              value={showHint ? breakdown.remainder : problem.num2} 
              color="bg-orange-500" 
              label={showHint ? "Leftover" : `Value: ${problem.num2}`} 
            />
          </div>
          <div className="bg-card p-6 rounded-3xl border shadow-sm">
            <NumberLine 
              target1={problem.num1} 
              target2={problem.num2} 
              isAnimating={isAnimating} 
            />
          </div>
        </div>
        {/* Input Section */}
        <div className="space-y-8 order-1 lg:order-2">
          <div className="text-center space-y-4">
            <h2 className="text-6xl font-black tracking-tighter">
              {problem.num1} + {problem.num2} = ?
            </h2>
            <AnimatePresence>
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-orange-50 text-orange-700 rounded-2xl border border-orange-200 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium leading-relaxed text-left">
                    Strategy: Make a 10 first! {problem.num1} needs {breakdown.needs} more to make 10. 
                    Then add the leftover {breakdown.remainder}.
                  </p>
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
              disabled={isSuccess}
            />
            <Button 
              size="lg" 
              onClick={checkAnswer} 
              className="h-20 w-32 rounded-3xl btn-gradient text-xl font-bold"
              disabled={isSuccess}
            >
              {isSuccess ? <CheckCircle2 className="w-8 h-8" /> : "Check"}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <Button
                key={num}
                variant="secondary"
                className="h-16 text-2xl font-bold rounded-2xl hover:bg-accent active:scale-95 transition-all"
                onClick={() => setAnswer(prev => prev + num)}
                disabled={isSuccess}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="destructive"
              className="h-16 text-2xl font-bold rounded-2xl active:scale-95 transition-all"
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