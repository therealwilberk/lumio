import { describe, it, expect } from 'vitest';
import { 
  calculateAccuracy, 
  calculateStreak, 
  calculateTotalTime 
} from '@/lib/calculations';

describe('Progress Calculations', () => {
  it('calculates accuracy correctly', () => {
    const problems = [
      { correct: true },
      { correct: true },
      { correct: false },
      { correct: true },
    ];

    const accuracy = calculateAccuracy(problems);
    expect(accuracy).toBe(0.75); // 3/4 = 75%
  });

  describe('calculateStreak', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const dayBefore = new Date(Date.now() - 172800000).toISOString().split('T')[0];
    const fourDaysAgo = new Date(Date.now() - 345600000).toISOString().split('T')[0];

    it('returns 0 for no sessions', () => {
      expect(calculateStreak([])).toBe(0);
    });

    it('counts 1 day streak for today only', () => {
      expect(calculateStreak([{ date: today }])).toBe(1);
    });

    it('counts 1 day streak for yesterday only', () => {
      expect(calculateStreak([{ date: yesterday }])).toBe(1);
    });

    it('counts multi-day streaks', () => {
      const sessions = [
        { date: today },
        { date: yesterday },
        { date: dayBefore }
      ];
      expect(calculateStreak(sessions)).toBe(3);
    });

    it('breaks streak when there is a gap', () => {
      const sessions = [
        { date: today },
        { date: yesterday },
        // Gap here
        { date: fourDaysAgo }
      ];
      expect(calculateStreak(sessions)).toBe(2);
    });

    it('returns 0 when no practice today or yesterday', () => {
      const sessions = [
        { date: dayBefore }
      ];
      expect(calculateStreak(sessions)).toBe(0);
    });
  });

  it('calculates total practice time', () => {
    const sessions = [
      { totalTime: 300 }, // 5 minutes
      { totalTime: 420 }, // 7 minutes
      { totalTime: 180 }, // 3 minutes
    ];

    const totalTime = calculateTotalTime(sessions);
    expect(totalTime).toBe(900); // 15 minutes total
  });
});
