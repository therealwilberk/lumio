import React from 'react';import { Button } from '@/components/ui/button';import { useNavigate } from 'react-router-dom';import { motion } from 'framer-motion';import { ArrowRight, Sparkles, BrainCircuit, Target, BookOpen, Calculator, TrendingUp, Award } from 'lucide-react';import { Hero } from '@/components/layout/Hero';import { SubjectsSection } from '@/components/subjects/SubjectsSection';import { useAuth } from '@/hooks/useAuth';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Subjects Section */}
      <SubjectsSection />

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Lumio is Awesome! 🚀
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Math practice that feels like playing a game!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Challenges That Grow With You! 🌱",
                description: "Start easy and watch yourself get better every day. The more you play, the smarter you get!",
                stats: "Most kids improve in one week!"
              },
              {
                icon: BrainCircuit,
                title: "Know Right Away! ⚡",
                description: "Find out instantly if you got it right - no waiting around! Learn from your mistakes super fast!",
                stats: "Instant feedback!"
              },
              {
                icon: Award,
                title: "Collect Cool Badges! 🏆",
                description: "Earn awesome rewards as you level up. Show off your streaks and achievements to your friends!",
                stats: "50+ badges to unlock!"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
              >
                <feature.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full inline-block">
                  {feature.stats}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl p-12 rounded-3xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Become a Math Champion? 🎯
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of kids who are getting better at math every day. Your adventure starts now!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <ArrowRight className="h-5 w-5" />
                  Let's Go!
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 text-lg rounded-xl transition-all"
                >
                  Sign In
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}