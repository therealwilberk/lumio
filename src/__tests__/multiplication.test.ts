import { describe, it, expect } from 'vitest';
import { generateProblem } from '../lib/math-utils';
import { MULTIPLICATION_LIMITS } from '../../shared/math-config';

describe('Multiplication Problem Generation', () => {
  it('should generate problems within Easy range', () => {
    const limits = MULTIPLICATION_LIMITS.easy;
    for (let i = 0; i < 100; i++) {
      const { num1, num2 } = generateProblem('multiplication', 'easy');
      expect(num1).toBeGreaterThanOrEqual(limits.min1);
      expect(num1).toBeLessThanOrEqual(limits.max1);
      expect(num2).toBeGreaterThanOrEqual(limits.min2);
      expect(num2).toBeLessThanOrEqual(limits.max2);
    }
  });

  it('should generate problems within Hard range', () => {
    const limits = MULTIPLICATION_LIMITS.hard;
    for (let i = 0; i < 100; i++) {
      const { num1, num2 } = generateProblem('multiplication', 'hard');
      expect(num1).toBeGreaterThanOrEqual(limits.min1);
      expect(num1).toBeLessThanOrEqual(limits.max1);
      expect(num2).toBeGreaterThanOrEqual(limits.min2);
      expect(num2).toBeLessThanOrEqual(limits.max2);
    }
  });
});
