import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from './Navbar';
import { useNavigate } from 'react-router-dom';
import { BouncyText } from '@/components/ui/BouncyText';
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black transition-colors duration-500"
      style={{ height: '100vh' }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Full-bleed Spline background */}
      <div className="absolute inset-0 z-0">
        <Spline
          scene="https://prod.spline.design/klTLt6ZkUI5HCFwO/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        {/* Overlay gradient to keep text readable */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 md:bg-gradient-to-r md:from-black/75 md:via-black/30 md:to-black/10" />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center px-6 md:px-10 lg:px-16 pointer-events-none"
        style={{
          scale: contentScale,
          opacity: contentOpacity,
        }}
      >
        <div className="w-full max-w-6xl flex flex-col gap-10 md:gap-0 md:flex-row md:items-center md:justify-between pointer-events-none">
          {/* Text + CTAs */}
          <div className="w-full md:w-1/2 text-center md:text-left mb-4 md:mb-0 pointer-events-auto">
            <div className="mb-6">
              <BouncyText
                text={`${greetingMessage}, ${user?.username || 'Lumio explorer'}!`}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              />
            </div>

            <div className="mb-8 md:mb-10">
              <BouncyText
                text={timeMessage}
                delay={0.5}
                className="text-lg sm:text-xl md:text-2xl font-medium text-gray-100 max-w-xl mx-auto md:mx-0 drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]"
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
                className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl transition-colors shadow-lg hover:shadow-pink-500/60 drop-shadow-[0_6px_18px_rgba(0,0,0,0.75)]"
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
                className="w-full sm:w-auto bg-white/95 backdrop-blur-sm border-2 border-teal-400 text-teal-700 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl transition-all hover:bg-white hover:shadow-teal-500/40 shadow-lg drop-shadow-[0_6px_18px_rgba(0,0,0,0.75)]"
                onClick={() => navigate('/dashboard')}
              >
                Check My Progress
              </motion.button>
            </motion.div>
          </div>
          {/* Empty spacer on desktop so text doesn't stretch full width */}
          <div className="hidden md:block md:w-1/2" />
        </div>
      </motion.div>
    </div>
  );
}
