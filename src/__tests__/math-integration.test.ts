import { describe, it, expect } from 'vitest';
import { getProblemCategory, calculatePerformanceSummary } from '@/lib/math-utils';
import { calculateAccuracy } from '@/lib/calculations';

describe('Math Integration', () => {
  it('should complete a full practice cycle logic with deterministic data', () => {
    // 1. Simulate user solving specific problems (Deterministic)
    const sessionProblems = [
      { num1: 2, num2: 3, userAnswer: 5, isCorrect: true, timeTaken: 2 },   // Foundation (sum 5)
      { num1: 8, num2: 5, userAnswer: 13, isCorrect: true, timeTaken: 4 },  // Bridge (sum 13)
      { num1: 15, num2: 12, userAnswer: 0, isCorrect: false, timeTaken: 6 }, // Decomposition (sum 27)
    ];

    // 2. Verify categories
    expect(getProblemCategory(sessionProblems[0].num1 + sessionProblems[0].num2)).toBe('Foundation');
    expect(getProblemCategory(sessionProblems[1].num1 + sessionProblems[1].num2)).toBe('Bridge');
    expect(getProblemCategory(sessionProblems[2].num1 + sessionProblems[2].num2)).toBe('Decomposition');

    // 3. Calculate Accuracy
    const accuracy = calculateAccuracy(sessionProblems.map(p => ({ correct: p.isCorrect })));
    expect(accuracy).toBe(2 / 3);

    // 4. Calculate Performance Summary
    const summary = calculatePerformanceSummary(sessionProblems as any);

    const foundation = summary.find(s => s.name === 'Foundation');
    const bridge = summary.find(s => s.name === 'Bridge');
    const decomposition = summary.find(s => s.name === 'Decomposition');

    expect(foundation?.accuracy).toBe(100);
    expect(bridge?.accuracy).toBe(100);
    expect(decomposition?.accuracy).toBe(0);

    expect(foundation?.avgTime).toBe(2);
    expect(bridge?.avgTime).toBe(4);
    expect(decomposition?.avgTime).toBe(6);
  });
});
