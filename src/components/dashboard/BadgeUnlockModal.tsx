import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Achievement } from '@shared/types';
import { Trophy, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BadgeUnlockModalProps {
    achievement: Achievement | null;
    isOpen: boolean;
    onClose: () => void;
}

export function BadgeUnlockModal({ achievement, isOpen, onClose }: BadgeUnlockModalProps) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!achievement) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="relative w-full max-w-md"
                    >
                        <Card className="bg-gradient-to-br from-yellow-100 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/20 border-4 border-yellow-400 dark:border-yellow-600 shadow-2xl overflow-hidden p-8 text-center relative">

                            {/* Background rays effect */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 -z-10 origin-center opacity-30"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent 0deg, #fcd34d 30deg, transparent 60deg, #fcd34d 90deg, transparent 120deg, #fcd34d 150deg, transparent 180deg, #fcd34d 210deg, transparent 240deg, #fcd34d 270deg, transparent 300deg, #fcd34d 330deg, transparent 360deg)'
                                }}
                            />

                            <div className="absolute top-2 right-2">
                                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-yellow-200/50 dark:hover:bg-yellow-800/50">
                                    <X className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
                                </Button>
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-6 flex justify-center"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-yellow-400/30 blur-xl rounded-full animate-pulse" />
                                    <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center text-6xl shadow-inner border-4 border-white/50 relative z-10">
                                        {achievement.emoji || <Trophy className="w-16 h-16 text-white" />}
                                    </div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                        className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full border-2 border-white shadow-lg"
                                    >
                                        <Star className="w-5 h-5 fill-current" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                                    Badge Unlocked!
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                                    {achievement.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                                    {achievement.description}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Button
                                    onClick={onClose}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg transform transition-transform hover:scale-105"
                                >
                                    Awesome! (+{achievement.points} XP)
                                </Button>
                            </motion.div>

                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
