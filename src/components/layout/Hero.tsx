import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from './Navbar';
import { PlayfulFloatingElements } from '@/components/ui/FloatingElements';
import { useNavigate } from 'react-router-dom';
import { MascotDuck } from '@/components/ui/MascotDuck';
import { BouncyText } from '@/components/ui/BouncyText';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SparklesCore } from '@/components/ui/sparkles';
import Spline from '@splinetool/react-spline';

export function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greetingMessage, setGreetingMessage] = useState('');
  const [timeMessage, setTimeMessage] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  // Use springs for content fade/scale on scroll
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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

      {/* Aceternity Background Beams */}
      <BackgroundBeams className="absolute inset-0 z-0" />

      {/* Sparkles Layer */}
      <div className="absolute inset-0 w-full h-full z-0">
        <SparklesCore
          id="hero-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950" />

      {/* Floating Background Elements */}
      <PlayfulFloatingElements />


      {/* Mascot Duck */}
      <div className="absolute bottom-4 -right-4 md:bottom-10 md:right-10 z-20 pointer-events-auto">
        <MascotDuck className="w-32 h-32 md:w-48 md:h-48 drop-shadow-xl scale-x-[-1]" delay={0.8} />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 lg:px-12"
        style={{
          scale: contentScale,
          opacity: contentOpacity,
        }}
      >
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-14 lg:gap-20">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="mb-6">
              <BouncyText
                text={`${greetingMessage}, ${user?.username || 'Lumio explorer'}!`}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-50 md:text-gray-900 dark:text-white mb-4 tracking-tight"
              />
            </div>

            <div className="mb-8 md:mb-10">
              <BouncyText
                text={timeMessage}
                delay={0.5}
                className="text-lg sm:text-xl md:text-2xl font-medium text-gray-200 md:text-gray-200 dark:text-gray-200 max-w-xl mx-auto md:mx-0"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1.2
              }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1.5 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0px 0px 0px rgba(236, 72, 153, 0)",
                    "0px 0px 30px rgba(236, 72, 153, 0.6)",
                    "0px 0px 0px rgba(236, 72, 153, 0)",
                  ]
                }}
                transition={{
                  boxShadow: { duration: 2.4, repeat: Infinity }
                }}
                className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl transition-colors shadow-lg hover:shadow-pink-500/60"
                onClick={() => {
                  if (user) {
                    navigate('/math');
                  } else {
                    const element = document.getElementById('subjects-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Let's Play!
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, rotate: -1.5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white/90 backdrop-blur-sm border-2 border-teal-400 text-teal-600 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl transition-all hover:bg-white hover:shadow-teal-500/40 shadow-lg"
                onClick={() => navigate('/dashboard')}
              >
                Check My Progress
              </motion.button>
            </motion.div>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-xl aspect-[4/3] sm:aspect-[4/3] md:aspect-[16/10] rounded-3xl bg-slate-900/60 dark:bg-slate-900/80 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
              <Spline
                scene="https://prod.spline.design/klTLt6ZkUI5HCFwO/scene.splinecode"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
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
