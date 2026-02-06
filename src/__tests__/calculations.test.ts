import { describe, it, expect } from 'vitest';

// Import your calculation functions
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

  it('calculates streak correctly', () => {
    const sessions = [
      { date: '2026-02-01' },
      { date: '2026-02-02' },
      { date: '2026-02-03' },
      // Gap here
      { date: '2026-02-06' },
    ];

    const streak = calculateStreak(sessions);
    expect(streak).toBe(1); // Only today counts
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
