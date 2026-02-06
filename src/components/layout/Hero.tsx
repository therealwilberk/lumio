import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from './Navbar';

export function Hero() {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [greetingMessage, setGreetingMessage] = useState('');
  const [timeMessage, setTimeMessage] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Set dynamic greeting based on time
    const hour = new Date().getHours();
    let greeting = '';
    let timeMsg = '';

    if (hour < 12) {
      greeting = 'Good morning';
      timeMsg = 'Ready to start your day with some math?';
    } else if (hour < 17) {
      greeting = 'Good afternoon';
      timeMsg = 'Perfect time for some problem-solving!';
    } else {
      greeting = 'Good evening';
      timeMsg = 'Wind down with a fun math challenge?';
    }

    // Add progress-based messages
    if (user) {
      // You could fetch user stats here for more dynamic messages
      const progressMessages = [
        "Let's continue your learning journey!",
        "Ready to beat your high score?",
        "Time to master new skills!",
        "Let's make today count!"
      ];
      timeMsg = progressMessages[Math.floor(Math.random() * progressMessages.length)];
    }

    setGreetingMessage(greeting);
    setTimeMessage(timeMsg);
  }, [user]);

  // Parallax effect calculation
  const parallaxOffset = scrollY * 0.5;
  const scale = 1 - scrollY * 0.0005;
  const opacity = Math.max(0, 1 - scrollY * 0.002);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Mountain Background */}
      <div className="absolute inset-0">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-orange-200" />
        
        {/* Mountain layers - Parallax effect */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
        >
          {/* Back mountains */}
          <svg viewBox="0 0 1440 400" className="w-full h-64 md:h-80">
            <path
              d="M0,200 L240,100 L480,150 L720,80 L960,120 L1200,60 L1440,140 L1440,400 L0,400 Z"
              fill="#8B7CF6"
              opacity="0.6"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
        >
          {/* Middle mountains */}
          <svg viewBox="0 0 1440 400" className="w-full h-48 md:h-64">
            <path
              d="M0,250 L180,150 L360,200 L540,120 L720,180 L900,100 L1080,160 L1260,80 L1440,200 L1440,400 L0,400 Z"
              fill="#6366F1"
              opacity="0.7"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ transform: `translateY(${parallaxOffset * 0.7}px)` }}
        >
          {/* Front mountains */}
          <svg viewBox="0 0 1440 400" className="w-full h-40 md:h-56">
            <path
              d="M0,300 L200,200 L400,250 L600,180 L800,220 L1000,160 L1200,200 L1440,180 L1440,400 L0,400 Z"
              fill="#4F46E5"
              opacity="0.8"
            />
          </svg>
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
      </div>

      {/* Floating particles/shapes */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-4xl mx-auto"
        style={{
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {/* Animated greeting */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6"
        >
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-800 mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {greetingMessage}, {user?.username || 'Student'}!{' '}
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block"
            >
              👋
            </motion.span>
          </h1>
        </motion.div>

        {/* Dynamic subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {timeMessage}
        </motion.p>

        {/* Call-to-action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            onClick={() => {
              const element = document.getElementById('subjects-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Learning
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 px-8 py-4 text-lg font-semibold rounded-xl transition-all hover:bg-white hover:shadow-lg"
          >
            View Progress
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/80"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 right-10 z-10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-8 h-8 text-yellow-400/60" />
      </motion.div>

      <motion.div
        className="absolute top-32 left-10 z-10"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-6 h-6 text-blue-400/60" />
      </motion.div>
    </div>
  );
}
