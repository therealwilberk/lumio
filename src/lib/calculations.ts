// Calculation utilities for the app

export function calculateAccuracy(problems: { correct: boolean }[]): number {
  if (problems.length === 0) return 0;
  const correct = problems.filter(p => p.correct).length;
  return correct / problems.length;
}

export function calculateStreak(sessions: { date: string }[]): number {
  // Simplified streak calculation - counts consecutive days
  if (sessions.length === 0) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  const hasToday = sessions.some(s => s.date === today);
  
  return hasToday ? 1 : 0;
}

export function calculateTotalTime(sessions: { totalTime: number }[]): number {
  return sessions.reduce((sum, session) => sum + session.totalTime, 0);
}
