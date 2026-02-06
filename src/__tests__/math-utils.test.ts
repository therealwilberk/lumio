import { describe, it, expect, vi } from 'vitest';
import {
  getMakeTenBreakdown,
  getHintStrategy,
  isBridgeThroughTen,
  generateProblem,
  getProblemCategory,
  calculatePerformanceSummary
} from '@/lib/math-utils';

describe('Math Utilities', () => {
  describe('getMakeTenBreakdown', () => {
    it('calculates needs and remainder correctly', () => {
      // 8 + 5: 8 needs 2 to make 10, remainder is 3
      expect(getMakeTenBreakdown(8, 5)).toEqual({ needs: 2, remainder: 3 });
      // 7 + 6: 7 needs 3 to make 10, remainder is 3
      expect(getMakeTenBreakdown(7, 6)).toEqual({ needs: 3, remainder: 3 });
      // 10 + 5: 10 needs 0 (or 10? let's see implementation)
      // Implementation: const needs = Math.max(0, 10 - (n1 % 10 === 0 ? 10 : n1 % 10));
      // 10 % 10 is 0, so needs = 10 - 10 = 0. Correct.
      expect(getMakeTenBreakdown(10, 5)).toEqual({ needs: 0, remainder: 5 });
    });
  });

  describe('isBridgeThroughTen', () => {
    it('identifies bridging problems', () => {
      expect(isBridgeThroughTen(8, 5)).toBe(true);  // 8+5=13 > 10
      expect(isBridgeThroughTen(2, 3)).toBe(false); // 2+3=5 < 10
      expect(isBridgeThroughTen(10, 5)).toBe(false); // 10 is multiple of 10
      expect(isBridgeThroughTen(18, 5)).toBe(true); // 8+5=13 > 10
    });
  });

  describe('getHintStrategy', () => {
    it('returns count strategy for small sums', () => {
      const strategy = getHintStrategy(3, 4);
      expect(strategy.type).toBe('count');
      expect(strategy.steps).toContain('Start at 3');
    });

    it('returns make-ten strategy for bridging single digits', () => {
      const strategy = getHintStrategy(8, 5);
      expect(strategy.type).toBe('make-ten');
      expect(strategy.steps).toContain('8 needs 2 to make a full 10');
    });

    it('returns decompose strategy for larger numbers', () => {
      const strategy = getHintStrategy(15, 12);
      expect(strategy.type).toBe('decompose');
      expect(strategy.title).toBe('NEXUS DECOMPOSITION');
    });
  });

  describe('generateProblem', () => {
    it('respects maxSum', () => {
      for (let i = 0; i < 100; i++) {
        const { num1, num2 } = generateProblem(20);
        expect(num1 + num2).toBeLessThanOrEqual(20);
      }
    });

    it('respects exclude parameter', () => {
      const exclude = { num1: 10, num2: 5 };
      for (let i = 0; i < 100; i++) {
        const problem = generateProblem(20, exclude);
        expect(problem).not.toEqual(exclude);
      }
    });
  });

  describe('getProblemCategory', () => {
    it('categorizes correctly', () => {
      expect(getProblemCategory(5)).toBe('Foundation');
      expect(getProblemCategory(15)).toBe('Bridge');
      expect(getProblemCategory(25)).toBe('Decomposition');
    });
  });

  describe('calculatePerformanceSummary', () => {
    it('handles empty logs', () => {
      const summary = calculatePerformanceSummary([]);
      expect(summary).toHaveLength(3);
      expect(summary[0].total).toBe(0);
    });

    it('calculates metrics correctly', () => {
      const logs = [
        { num1: 2, num2: 3, isCorrect: true, timeTaken: 2 }, // Foundation
        { num1: 8, num2: 5, isCorrect: true, timeTaken: 4 }, // Bridge
        { num1: 8, num2: 5, isCorrect: false, timeTaken: 6 }, // Bridge
      ];
      const summary = calculatePerformanceSummary(logs);

      const foundation = summary.find(s => s.name === 'Foundation');
      const bridge = summary.find(s => s.name === 'Bridge');

      expect(foundation?.accuracy).toBe(100);
      expect(foundation?.avgTime).toBe(2);
      expect(bridge?.accuracy).toBe(50);
      expect(bridge?.avgTime).toBe(5);
    });
  });
});
