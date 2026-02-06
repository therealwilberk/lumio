import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BrainCircuit, Target, BookOpen, Calculator, TrendingUp, Award } from 'lucide-react';
import { Hero } from '@/components/layout/Hero';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Subjects Section */}
      <section id="subjects-section" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              Explore Subjects
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master fundamental math skills through engaging, interactive challenges designed for Grade 6 students.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calculator,
                title: "Addition",
                description: "Master addition with fun challenges",
                color: "blue",
                available: true,
                path: "/math/addition"
              },
              {
                icon: Calculator,
                title: "Subtraction",
                description: "Build confidence with subtraction",
                color: "green",
                available: false,
                path: "#"
              },
              {
                icon: Calculator,
                title: "Multiplication",
                description: "Learn multiplication patterns",
                color: "purple",
                available: false,
                path: "#"
              },
              {
                icon: Calculator,
                title: "Division",
                description: "Conquer division step by step",
                color: "orange",
                available: false,
                path: "#"
              }
            ].map((subject, index) => (
              <motion.div
                key={subject.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all rounded-2xl p-6 h-full ${
                  subject.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
                onClick={() => subject.available && navigate(subject.path)}
              >
                <div className={`w-16 h-16 bg-${subject.color}-100 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                  <subject.icon className={`h-8 w-8 text-${subject.color}-600`} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{subject.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
                
                {subject.available ? (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Start Learning
                  </Button>
                ) : (
                  <div className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg text-center text-sm">
                    Coming Soon
                  </div>
                )}
              </div>
              {!subject.available && (
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Soon
                  </div>
                </div>
              )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Students Love Lumio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our gamified approach makes learning math fun and effective.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Personalized Learning",
                description: "Adaptive challenges that grow with your child's skill level and learning pace.",
                stats: "95% improvement rate"
              },
              {
                icon: BrainCircuit,
                title: "Real-time Feedback",
                description: "Instant insights help students understand concepts and learn from mistakes.",
                stats: "Instant responses"
              },
              {
                icon: Award,
                title: "Achievement System",
                description: "Earn badges, streaks, and rewards that motivate continued learning.",
                stats: "50+ achievements"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-xl transition-all"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                  {feature.stats}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-12 rounded-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Begin Your Math Adventure?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students discovering the joy of mathematics through interactive learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <ArrowRight className="h-5 w-5" />
                Get Started Free
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-xl transition-all"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}