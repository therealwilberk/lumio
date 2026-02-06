// Calculation utilities for the app

export function calculateAccuracy(problems: { correct: boolean }[]): number {
  if (problems.length === 0) return 0;
  const correct = problems.filter(p => p.correct).length;
  return correct / problems.length;
}

export function calculateStreak(sessions: { date: string }[]): number {
  if (sessions.length === 0) return 0;
  
  // Get unique sorted dates in descending order
  const uniqueDates = Array.from(new Set(sessions.map(s => s.date))).sort().reverse();

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // If the latest session wasn't today or yesterday, streak is 0
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  let currentDate = uniqueDates[0];

  for (let i = 0; i < uniqueDates.length; i++) {
    const sessionDate = uniqueDates[i];

    // Check if this date is exactly what we expect for a continuous streak
    const expectedDate = new Date(new Date(uniqueDates[0]).getTime() - streak * 86400000).toISOString().split('T')[0];

    if (sessionDate === expectedDate) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function calculateTotalTime(sessions: { totalTime: number }[]): number {
  return sessions.reduce((sum, session) => sum + session.totalTime, 0);
}
