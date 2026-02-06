import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic text-white">
            LUMIO<span className="text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.5)]">CORE</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 font-medium">
            Your journey to becoming a math wizard starts here.
          </p>
          <p className="text-lg text-blue-300/80">
            Gamified learning for Grade 6 students - Master math fundamentals with fun challenges!
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-bold rounded-xl transition-all transform hover:scale-105"
            onClick={() => navigate('/login')}
          >
            Start Learning
          </Button>
          <p className="text-blue-300/60 text-sm">
            Already have an account? <button onClick={() => navigate('/login')} className="text-blue-400 hover:text-blue-300 underline">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}