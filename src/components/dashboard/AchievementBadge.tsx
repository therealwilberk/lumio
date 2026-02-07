import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { Achievement } from '@shared/types';

interface AchievementBadgeProps {
    achievement: Achievement;
    unlocked: boolean;
    progress?: number; // 0-100 for locked badges
}

export function AchievementBadge({ achievement, unlocked, progress }: AchievementBadgeProps) {
    return (
        <motion.div
            whileHover={unlocked ? { scale: 1.05, rotate: 2 } : {}}
            className={`relative p-4 rounded-2xl text-center transition-all ${unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800/50 shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 grayscale opacity-75'
                }`}
        >
            {/* Badge Icon */}
            <div className={`text-4xl mb-2 ${unlocked ? 'scale-110' : 'opacity-50'}`}>
                {achievement.emoji}
            </div>

            {/* Badge Name */}
            <div className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-1">
                {achievement.name}
            </div>

            {/* Badge Description */}
            <div className="text-xs text-gray-600 dark:text-gray-400 leading-snug">
                {achievement.description}
            </div>

            {/* Points */}
            <div className={`text-xs font-bold mt-2 ${unlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`}>
                {achievement.points} pts
            </div>

            {/* Lock Icon for Locked Badges */}
            {!unlocked && (
                <div className="absolute top-2 right-2">
                    <Lock className="h-4 w-4 text-gray-400" />
                </div>
            )}

            {/* Progress Bar for Locked Badges */}
            {!unlocked && progress !== undefined && progress > 0 && (
                <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {progress}% complete
                    </div>
                </div>
            )}
        </motion.div>
    );
}

interface AchievementsGridProps {
    achievements: Achievement[];
    unlockedIds: string[];
    category?: Achievement['category'];
}

export function AchievementsGrid({ achievements, unlockedIds, category }: AchievementsGridProps) {
    const filteredAchievements = category
        ? achievements.filter(a => a.category === category)
        : achievements;

    const unlockedCount = filteredAchievements.filter(a => unlockedIds.includes(a.id)).length;

    return (
        <div>
            {/* Category Header */}
            {category && (
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                        {category} Badges
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {unlockedCount} of {filteredAchievements.length} unlocked
                    </p>
                </div>
            )}

            {/* Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAchievements.map((achievement) => (
                    <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        unlocked={unlockedIds.includes(achievement.id)}
                    />
                ))}
            </div>
        </div>
    );
}
