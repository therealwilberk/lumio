import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from './Navbar';
import { PlayfulFloatingElements } from '@/components/ui/FloatingElements';
import { useNavigate } from 'react-router-dom';
import { MascotDuck } from '@/components/ui/MascotDuck';
import { BouncyText } from '@/components/ui/BouncyText';

export function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greetingMessage, setGreetingMessage] = useState('');
  const [timeMessage, setTimeMessage] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  // Use springs for smoother parallax
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const parallaxBack = useTransform(smoothScrollY, [0, 500], [0, 150]);
  const parallaxMid = useTransform(smoothScrollY, [0, 500], [0, 250]);
  const parallaxFront = useTransform(smoothScrollY, [0, 500], [0, 350]);

  const contentScale = useTransform(smoothScrollY, [0, 500], [1, 0.8]);
  const contentOpacity = useTransform(smoothScrollY, [0, 300], [1, 0]);

  useEffect(() => {
    // Set dynamic greeting based on time
    const hour = new Date().getHours();
    let greeting = '';
    let timeMsg = '';

    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 17) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    // Add progress-based messages
    if (user) {
      const progressMessages = [
        "Let's continue your learning journey!",
        "Ready to beat your high score?",
        "Time to master new skills!",
        "Let's make today count!",
        "Ready for math adventure? 🚀"
      ];
      timeMsg = progressMessages[Math.floor(Math.random() * progressMessages.length)];
    } else {
      timeMsg = "Ready for math adventure? 🚀";
    }

    setGreetingMessage(greeting);
    setTimeMessage(timeMsg);
  }, [user]);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors duration-500"
      style={{ height: '100vh' }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Floating Background Elements */}
      <PlayfulFloatingElements />

      {/* Drifting Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-40"
            style={{
              top: `${10 + i * 15}%`,
              left: `-10%`,
            }}
            animate={{
              x: ['0vw', '120vw'],
            }}
            transition={{
              duration: 40 + i * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 5,
            }}
          >
            <svg width="120" height="60" viewBox="0 0 120 60" fill="white">
              <path d="M20,40 Q20,20 40,20 Q45,10 60,10 Q75,10 80,20 Q100,20 100,40 Q100,55 80,55 L40,55 Q20,55 20,40 Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Mountain Background */}
      <div className="absolute inset-0">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-orange-200 dark:from-blue-900 dark:via-blue-800 dark:to-orange-300" />
        
        {/* Mountain layers - Parallax effect */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ y: parallaxBack }}
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
          style={{ y: parallaxMid }}
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
          style={{ y: parallaxFront }}
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
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-black/20 via-transparent to-transparent" />
      </div>


      {/* Mascot Duck */}
      <div className="absolute bottom-4 -right-4 md:bottom-10 md:right-10 z-20 pointer-events-auto">
        <MascotDuck className="w-32 h-32 md:w-48 md:h-48 drop-shadow-xl scale-x-[-1]" delay={0.8} />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-4xl mx-auto"
        style={{
          scale: contentScale,
          opacity: contentOpacity,
        }}
      >
        {/* Animated greeting */}
        <div className="mb-6">
          <BouncyText
            text={`${greetingMessage}, ${user?.username || 'Student'}!`}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight"
          />
        </div>

        {/* Dynamic subheading */}
        <div className="mb-12">
          <BouncyText
            text={timeMessage}
            delay={0.5}
            className="text-xl md:text-3xl font-medium text-gray-700 dark:text-gray-200 max-w-2xl mx-auto"
          />
        </div>

        {/* Call-to-action buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1.2
          }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0)", "0px 0px 20px rgba(59, 130, 246, 0.4)", "0px 0px 0px rgba(59, 130, 246, 0)"]
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity }
            }}
            className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-5 text-xl font-bold rounded-2xl transition-colors shadow-lg hover:shadow-pink-500/50"
            onClick={() => {
              if (user) {
                navigate('/math-hub');
              } else {
                const element = document.getElementById('subjects-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Let's Play!
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: -2 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/90 backdrop-blur-sm border-2 border-teal-400 text-teal-600 px-10 py-5 text-xl font-bold rounded-2xl transition-all hover:bg-white hover:shadow-teal-500/30 shadow-lg"
            onClick={() => navigate('/dashboard')}
          >
            Check My Progress
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
