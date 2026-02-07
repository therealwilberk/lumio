import type { Session, Problem, DayActivity, PerformanceMetrics, SpeedSession } from '@shared/types';

// ============================================
// KPI CALCULATIONS
// ============================================

/**
 * Calculate total practice time from sessions
 */
export function calculateTotalPracticeTime(sessions: Session[]): number {
    return sessions.reduce((sum, s) => sum + s.totalTime, 0);
}

/**
 * Format practice time for display
 * @param seconds - Total seconds
 * @returns Formatted string like "2h 45m" or "45m"
 */
export function formatPracticeTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

/**
 * Calculate total number of problems
 */
export function calculateTotalProblems(problems: Problem[]): number {
    return problems.length;
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(problems: Problem[]): number {
    if (problems.length === 0) return 0;
    const correct = problems.filter(p => p.correct).length;
    return Math.round((correct / problems.length) * 100);
}

/**
 * Calculate current streak (consecutive days with practice)
 */
export function calculateStreak(sessions: Session[]): number {
    if (sessions.length === 0) return 0;

    // Get unique practice dates, sorted newest first
    const sortedDates = sessions
        .map(s => s.startTime.toDateString())
        .filter((date, i, arr) => arr.indexOf(date) === i)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let checkDate = new Date();

    for (const date of sortedDates) {
        const sessionDate = new Date(date);
        const diffDays = Math.floor((checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === streak) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Calculate weekly trend (this week vs last week)
 */
export function calculateWeeklyTrend(sessions: Session[], metric: 'time' | 'problems'): number {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setMilliseconds(-1);

    const thisWeekSessions = sessions.filter(s => s.startTime >= startOfThisWeek);
    const lastWeekSessions = sessions.filter(s =>
        s.startTime >= startOfLastWeek && s.startTime <= endOfLastWeek
    );

    let thisWeekValue = 0;
    let lastWeekValue = 0;

    if (metric === 'time') {
        thisWeekValue = calculateTotalPracticeTime(thisWeekSessions);
        lastWeekValue = calculateTotalPracticeTime(lastWeekSessions);
    } else {
        thisWeekValue = thisWeekSessions.reduce((sum, s) => sum + s.problems.length, 0);
        lastWeekValue = lastWeekSessions.reduce((sum, s) => sum + s.problems.length, 0);
    }

    if (lastWeekValue === 0) return 0;
    return Math.round(((thisWeekValue - lastWeekValue) / lastWeekValue) * 100);
}

// ============================================
// CHART DATA GENERATION
// ============================================

/**
 * Generate activity heatmap for last N days
 */
export function generateActivityHeatmap(problems: Problem[], days: number = 90): DayActivity[] {
    const heatmap: DayActivity[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayProblems = problems.filter(p =>
            p.timestamp.toISOString().split('T')[0] === dateStr
        );

        heatmap.push({
            date: dateStr,
            problemCount: dayProblems.length,
            practiceTime: dayProblems.reduce((sum, p) => sum + p.timeSpent, 0),
            subjects: [...new Set(dayProblems.map(p => p.subject))]
        });
    }

    return heatmap;
}

/**
 * Calculate performance metrics for radar chart
 */
export function calculatePerformanceMetrics(problems: Problem[], streak: number): PerformanceMetrics {
    if (problems.length === 0) {
        return {
            speed: 0,
            accuracy: 0,
            consistency: 0,
            problemSolving: 0,
            mentalMath: 0
        };
    }

    // Speed (benchmark: 10s is 0, 2s is 100)
    const avgTime = problems.reduce((sum, p) => sum + p.timeSpent, 0) / problems.length;
    const speed = Math.max(0, Math.min(100, (10 - avgTime) / 8 * 100));

    // Accuracy
    const accuracy = (problems.filter(p => p.correct).length / problems.length) * 100;

    // Consistency (based on streak and practice frequency)
    const consistency = Math.min(100, (streak / 30 * 50) + 50);

    // Problem Solving (% of correct problems)
    const problemSolving = accuracy; // Simplified for now

    // Mental Math (% solved without hints)
    const noHintProblems = problems.filter(p => p.hintsUsed === 0);
    const mentalMath = (noHintProblems.length / problems.length) * 100;

    return {
        speed: Math.round(speed),
        accuracy: Math.round(accuracy),
        consistency: Math.round(consistency),
        problemSolving: Math.round(problemSolving),
        mentalMath: Math.round(mentalMath)
    };
}

/**
 * Get speed trend for last N sessions
 */
export function getSpeedTrend(sessions: Session[], limit: number = 10): SpeedSession[] {
    const sortedSessions = sessions
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .slice(-limit);

    return sortedSessions.map((session, i) => {
        const sessionProblems = session.problems;
        const avgTime = sessionProblems.reduce((sum, p) => sum + p.timeSpent, 0) / sessionProblems.length;
        const accuracy = (sessionProblems.filter(p => p.correct).length / sessionProblems.length) * 100;

        return {
            sessionNumber: i + 1,
            date: session.startTime,
            avgTime: Math.round(avgTime * 10) / 10,
            accuracy: Math.round(accuracy),
            problemCount: sessionProblems.length
        };
    });
}

/**
 * Identify trouble spots (frequently missed problems)
 */
export function identifyTroubleSpots(problems: Problem[], limit: number = 5) {
    // Group problems by question
    const problemMap = new Map<string, { total: number; missed: number }>();

    problems.forEach(p => {
        const existing = problemMap.get(p.question) || { total: 0, missed: 0 };
        existing.total++;
        if (!p.correct) existing.missed++;
        problemMap.set(p.question, existing);
    });

    // Convert to array and calculate failure rate
    const troubleSpots = Array.from(problemMap.entries())
        .map(([question, stats]) => ({
            problem: question,
            missed: stats.missed,
            total: stats.total,
            failureRate: Math.round((stats.missed / stats.total) * 100)
        }))
        .filter(spot => spot.missed > 0) // Only problems that were missed
        .sort((a, b) => b.failureRate - a.failureRate) // Sort by failure rate
        .slice(0, limit);

    return troubleSpots;
}

// ============================================
// ACHIEVEMENT CHECKING
// ============================================

/**
 * Check if user meets achievement criteria
 */
export function checkAchievementCriteria(
    achievement: { criteria: Record<string, any> },
    userStats: {
        totalProblems: number;
        accuracy: number;
        streak: number;
        avgTime: number;
        sessions: Session[];
        problems: Problem[];
    }
): boolean {
    const { criteria } = achievement;

    // Total problems check
    if (criteria.totalProblems !== undefined) {
        if (userStats.totalProblems < criteria.totalProblems) return false;
    }

    // Streak check
    if (criteria.streak !== undefined) {
        if (userStats.streak < criteria.streak) return false;
    }

    // Accuracy with minimum problems
    if (criteria.minAccuracy !== undefined && criteria.minProblems !== undefined) {
        if (userStats.totalProblems < criteria.minProblems) return false;
        if (userStats.accuracy < criteria.minAccuracy) return false;
    }

    // Average speed check
    if (criteria.maxAvgTime !== undefined && criteria.minProblems !== undefined) {
        if (userStats.totalProblems < criteria.minProblems) return false;
        if (userStats.avgTime > criteria.maxAvgTime) return false;
    }

    // Consecutive correct
    if (criteria.consecutiveCorrect !== undefined) {
        let maxConsecutive = 0;
        let current = 0;

        for (const problem of userStats.problems) {
            if (problem.correct) {
                current++;
                maxConsecutive = Math.max(maxConsecutive, current);
            } else {
                current = 0;
            }
        }

        if (maxConsecutive < criteria.consecutiveCorrect) return false;
    }

    return true;
}
