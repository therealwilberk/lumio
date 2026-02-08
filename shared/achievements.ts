import type { Achievement } from '@shared/types';

// ============================================
// MILESTONE ACHIEVEMENTS
// ============================================

export const MILESTONE_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_steps',
        name: 'First Steps',
        emoji: '👣',
        description: 'Solved your first 10 problems',
        category: 'milestone',
        criteria: { totalProblems: 10 },
        points: 50
    },
    {
        id: 'getting_started',
        name: 'Getting Started',
        emoji: '🌱',
        description: 'Completed first practice session',
        category: 'milestone',
        criteria: { sessions: 1 },
        points: 25
    },
    {
        id: 'century_club',
        name: 'Century Club',
        emoji: '💯',
        description: 'Solved 100 problems',
        category: 'milestone',
        criteria: { totalProblems: 100 },
        points: 200
    },
    {
        id: 'half_thousand',
        name: 'Half Thousand',
        emoji: '🎉',
        description: 'Solved 500 problems',
        category: 'milestone',
        criteria: { totalProblems: 500 },
        points: 500
    },
    {
        id: 'math_master',
        name: 'Math Master',
        emoji: '🎓',
        description: 'Completed all 4 math operations',
        category: 'milestone',
        criteria: {
            topics: ['addition', 'subtraction', 'multiplication', 'division'],
            completionPercent: 100
        },
        points: 1000
    }
];

// ============================================
// PERFORMANCE ACHIEVEMENTS
// ============================================

export const PERFORMANCE_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'speed_demon',
        name: 'Speed Demon',
        emoji: '⚡',
        description: 'Average time under 5 seconds (50 problems)',
        category: 'performance',
        criteria: {
            minProblems: 50,
            maxAvgTime: 5
        },
        points: 300
    },
    {
        id: 'lightning_fast',
        name: 'Lightning Fast',
        emoji: '⚡⚡',
        description: 'Average time under 3 seconds (50 problems)',
        category: 'performance',
        criteria: {
            minProblems: 50,
            maxAvgTime: 3
        },
        points: 500
    },
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        emoji: '✨',
        description: '100% accuracy on 50 consecutive problems',
        category: 'performance',
        criteria: {
            consecutiveCorrect: 50
        },
        points: 400
    },
    {
        id: 'ace_student',
        name: 'Ace Student',
        emoji: '🌟',
        description: '95% accuracy across 100 problems',
        category: 'performance',
        criteria: {
            minProblems: 100,
            minAccuracy: 95
        },
        points: 350
    },
    {
        id: 'perfect_ten',
        name: 'Perfect 10',
        emoji: '⭐',
        description: 'Get 10 problems correct in a row',
        category: 'performance',
        criteria: {
            consecutiveCorrect: 10
        },
        points: 100
    }
];

// ============================================
// STREAK ACHIEVEMENTS
// ============================================

export const STREAK_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'daily_learner',
        name: 'Daily Learner',
        emoji: '📅',
        description: 'Practice 3 days in a row',
        category: 'streak',
        criteria: { streak: 3 },
        points: 75
    },
    {
        id: 'week_warrior',
        name: 'Week Warrior',
        emoji: '🔥',
        description: '7-day practice streak',
        category: 'streak',
        criteria: { streak: 7 },
        points: 150
    },
    {
        id: 'two_week_champion',
        name: 'Two Week Champion',
        emoji: '🔥🔥',
        description: '14-day practice streak',
        category: 'streak',
        criteria: { streak: 14 },
        points: 300
    },
    {
        id: 'month_master',
        name: 'Month Master',
        emoji: '🔥🔥🔥',
        description: '30-day practice streak',
        category: 'streak',
        criteria: { streak: 30 },
        points: 750
    },
    {
        id: 'unstoppable',
        name: 'Unstoppable',
        emoji: '🚀',
        description: '60-day practice streak',
        category: 'streak',
        criteria: { streak: 60 },
        points: 1500
    }
];

// ============================================
// SPECIAL ACHIEVEMENTS
// ============================================

export const SPECIAL_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'early_bird',
        name: 'Early Bird',
        emoji: '🌅',
        description: 'Practice before 8am',
        category: 'special',
        criteria: { timeOfDay: 'before', hour: 8 },
        points: 50
    },
    {
        id: 'night_owl',
        name: 'Night Owl',
        emoji: '🦉',
        description: 'Practice after 8pm',
        category: 'special',
        criteria: { timeOfDay: 'after', hour: 20 },
        points: 50
    },
    {
        id: 'weekend_warrior',
        name: 'Weekend Warrior',
        emoji: '🎮',
        description: 'Practice on both Saturday and Sunday',
        category: 'special',
        criteria: { weekendPractice: true },
        points: 100
    },
    {
        id: 'comeback_kid',
        name: 'Comeback Kid',
        emoji: '💪',
        description: 'Return after 7+ day break',
        category: 'special',
        criteria: { returnAfterBreak: 7 },
        points: 150
    },
    {
        id: 'addition-master',
        name: 'Addition Master',
        emoji: '🏆',
        description: 'Get 50 correct in Addition with 90% accuracy',
        category: 'special',
        criteria: {
            topic: 'addition',
            correct: 50,
            accuracy: 90
        },
        points: 250
    },
    {
        id: 'subtraction-master',
        name: 'Subtraction Expert',
        emoji: '🛡️',
        description: 'Get 40 correct in Subtraction with 85% accuracy',
        category: 'special',
        criteria: {
            topic: 'subtraction',
            correct: 40,
            accuracy: 85
        },
        points: 250
    },
    {
        id: 'multiplication-master',
        name: 'Multiplication Wizard',
        emoji: '🪄',
        description: 'Get 60 correct in Multiplication with 88% accuracy',
        category: 'special',
        criteria: {
            topic: 'multiplication',
            correct: 60,
            accuracy: 88
        },
        points: 250
    },
    {
        id: 'division-master',
        name: 'Division Master',
        emoji: '➗',
        description: 'Get 50 correct in Division with 85% accuracy',
        category: 'special',
        criteria: {
            topic: 'division',
            correct: 50,
            accuracy: 85
        },
        points: 250
    }
];

// ============================================
// ALL ACHIEVEMENTS
// ============================================

export const ALL_ACHIEVEMENTS: Achievement[] = [
    ...MILESTONE_ACHIEVEMENTS,
    ...PERFORMANCE_ACHIEVEMENTS,
    ...STREAK_ACHIEVEMENTS,
    ...SPECIAL_ACHIEVEMENTS
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
    return ALL_ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return ALL_ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * Calculate total possible points
 */
export function getTotalPossiblePoints(): number {
    return ALL_ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0);
}
