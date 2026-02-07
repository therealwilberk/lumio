import { describe, it, expect } from 'vitest';
import { calculatePerformanceMetrics } from '@shared/dashboard-calculations';
import { generateProblem } from '@/lib/math-utils';
import { SPEED_BENCHMARKS, PROBLEM_LIMITS } from '@shared/math-config';
import type { Problem } from '@shared/types';

describe('Level-Aware Configuration', () => {
  describe('calculatePerformanceMetrics', () => {
    const mockProblems: Problem[] = [
      {
        id: '1',
        timeSpent: 4, // 4 seconds
        correct: true,
        sessionId: 's1',
        subject: 'math',
        topic: 'addition',
        question: '2+2',
        correctAnswer: 4,
        userAnswer: 4,
        hintsUsed: 0,
        timestamp: new Date()
      } as Problem
    ];

    it('calculates higher speed score for easy level than hard level with same time (4s)', () => {
      const easyMetrics = calculatePerformanceMetrics(mockProblems, 0, 'easy');
      const hardMetrics = calculatePerformanceMetrics(mockProblems, 0, 'hard');

      // For easy: (15 - 4) / 12 * 100 = 91.6 -> 92
      // For hard: (5 - 4) / 4 * 100 = 25
      expect(easyMetrics.speed).toBeGreaterThan(hardMetrics.speed);
      expect(easyMetrics.speed).toBe(92);
      expect(hardMetrics.speed).toBe(25);
    });

    it('returns 0 speed if time exceeds benchmark max', () => {
      const slowProblems: Problem[] = [{ ...mockProblems[0], timeSpent: 20 }];
      const metrics = calculatePerformanceMetrics(slowProblems, 0, 'medium');
      expect(metrics.speed).toBe(0);
    });

    it('caps speed at 100 if time is very fast', () => {
      const fastProblems: Problem[] = [{ ...mockProblems[0], timeSpent: 0.5 }];
      const metrics = calculatePerformanceMetrics(fastProblems, 0, 'hard');
      expect(metrics.speed).toBe(100);
    });
  });

  describe('generateProblem', () => {
    it('respects easy problem limits (max 10)', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generateProblem('easy');
        expect(problem.num1 + problem.num2).toBeLessThanOrEqual(PROBLEM_LIMITS.easy.max);
        expect(problem.num1).toBeGreaterThanOrEqual(PROBLEM_LIMITS.easy.min);
      }
    });

    it('respects hard problem limits (max 100)', () => {
      let foundLarge = false;
      for (let i = 0; i < 100; i++) {
        const problem = generateProblem('hard');
        const sum = problem.num1 + problem.num2;
        expect(sum).toBeLessThanOrEqual(PROBLEM_LIMITS.hard.max);
        expect(problem.num1).toBeGreaterThanOrEqual(PROBLEM_LIMITS.hard.min);
        if (sum > 20) foundLarge = true;
      }
      expect(foundLarge).toBe(true); // Ensure it's actually generating harder problems
    });

    it('maintains backward compatibility with number parameter', () => {
      const problem = generateProblem(50);
      expect(problem.num1 + problem.num2).toBeLessThanOrEqual(50);
    });
  });
});
