import { describe, it, expect } from 'vitest';
import { generateProblem } from '../lib/math-utils';
import { DIVISION_LIMITS } from '../../shared/math-config';
import { calculateTopicProgress } from '../lib/progression';

describe('Division Problem Generation', () => {
  it('should generate problems within Easy range', () => {
    const limits = DIVISION_LIMITS.easy;
    for (let i = 0; i < 100; i++) {
      const { num1: dividend, num2: divisor } = generateProblem('division', 'easy');
      expect(dividend).toBeGreaterThanOrEqual(limits.minDividend);
      expect(dividend).toBeLessThanOrEqual(limits.maxDividend);
      expect(divisor).toBeGreaterThanOrEqual(limits.minDivisor);
      expect(divisor).toBeLessThanOrEqual(limits.maxDivisor);
      expect(dividend).toBeGreaterThanOrEqual(divisor);
    }
  });

  it('should generate problems within Hard range', () => {
    const limits = DIVISION_LIMITS.hard;
    for (let i = 0; i < 100; i++) {
      const { num1: dividend, num2: divisor } = generateProblem('division', 'hard');
      expect(dividend).toBeGreaterThanOrEqual(limits.minDividend);
      expect(dividend).toBeLessThanOrEqual(limits.maxDividend);
      expect(divisor).toBeGreaterThanOrEqual(limits.minDivisor);
      expect(divisor).toBeLessThanOrEqual(limits.maxDivisor);
      expect(dividend).toBeGreaterThanOrEqual(divisor);
    }
  });
});

describe('Division Unlock Logic', () => {
  it('should remain locked if multiplication progress is below 80%', () => {
    const mockStats = {
      totalScore: 279, // Multi progress = (279-200)/100 = 79%
      totalSolved: 50,
      streak: 5,
      accuracy: 90,
      level: 5
    } as any;

    const progress = calculateTopicProgress(mockStats);
    const division = progress.find(p => p.id === 'division');
    expect(division?.isUnlocked).toBe(false);
  });

  it('should unlock when multiplication progress reaches 80%', () => {
    const mockStats = {
      totalScore: 280, // Multi progress = (280-200)/100 = 80%
      totalSolved: 50,
      streak: 5,
      accuracy: 90,
      level: 5
    } as any;

    const progress = calculateTopicProgress(mockStats);
    const division = progress.find(p => p.id === 'division');
    expect(division?.isUnlocked).toBe(true);
  });
});
