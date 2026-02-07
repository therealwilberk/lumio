import {
  BRIDGE_BASE,
  FOUNDATION_MAX_SUM,
  BRIDGE_MAX_SUM,
  PROBLEM_LIMITS,
  MAX_PROBLEM_GENERATION_RETRIES,
  MIN_OPERAND_VALUE,
  MIN_SUM_RATIO,
  FALLBACK_DIVISOR
} from '@shared/math-config';
import { DifficultyLevel } from '@shared/types';

export interface MakeTenBreakdown {
  needs: number;
  remainder: number;
}
export type StrategyType = 'count' | 'make-ten' | 'decompose';
export interface HintStrategy {
  type: StrategyType;
  title: string;
  description: string;
  steps: string[];
  visualCues: {
    pulseAddend1: boolean;
    pulseAddend2: boolean;
    bridgeActive: boolean;
  };
}
export function getMakeTenBreakdown(n1: number, n2: number): MakeTenBreakdown {
  const needs = Math.max(0, BRIDGE_BASE - (n1 % BRIDGE_BASE === 0 ? BRIDGE_BASE : n1 % BRIDGE_BASE));
  const remainder = Math.max(0, n2 - needs);
  return { needs, remainder };
}
export function getHintStrategy(n1: number, n2: number): HintStrategy {
  const sum = n1 + n2;
  if (sum <= FOUNDATION_MAX_SUM) {
    return {
      type: 'count',
      title: 'PRECISION COUNTING',
      description: 'Since the total is small, we can count up from the first number.',
      steps: [`Start at ${n1}`, `Jump ${n2} more steps`],
      visualCues: { pulseAddend1: true, pulseAddend2: true, bridgeActive: false }
    };
  }
  if (n1 < BRIDGE_BASE && n2 < BRIDGE_BASE && sum > BRIDGE_BASE) {
    const { needs, remainder } = getMakeTenBreakdown(n1, n2);
    return {
      type: 'make-ten',
      title: 'BRIDGE TO TEN',
      description: `Filling up to ${BRIDGE_BASE} makes the math much faster!`,
      steps: [
        `${n1} needs ${needs} to make a full ${BRIDGE_BASE}`,
        `Take ${needs} from ${n2}`,
        `${n2} has ${remainder} left over`,
        `Final: ${BRIDGE_BASE} + ${remainder} = ${sum}`
      ],
      visualCues: { pulseAddend1: false, pulseAddend2: false, bridgeActive: true }
    };
  }
  const t1 = Math.floor(n1 / BRIDGE_BASE) * BRIDGE_BASE;
  const o1 = n1 % BRIDGE_BASE;
  const t2 = Math.floor(n2 / BRIDGE_BASE) * BRIDGE_BASE;
  const o2 = n2 % BRIDGE_BASE;
  const onesSum = o1 + o2;
  return {
    type: 'decompose',
    title: 'NEXUS DECOMPOSITION',
    description: 'Split the numbers into TENS and ONES to conquer large sums.',
    steps: [
      `Tens: ${t1} + ${t2} = ${t1 + t2}`,
      `Ones: ${o1} + ${o2} = ${onesSum}`,
      onesSum > BRIDGE_BASE ? `Bridge Ones: ${t1 + t2} + ${onesSum} = ${sum}` : `Total: ${t1 + t2} + ${onesSum} = ${sum}`
    ],
    visualCues: { pulseAddend1: true, pulseAddend2: true, bridgeActive: false }
  };
}
export function isBridgeThroughTen(n1: number, n2: number): boolean {
  return n1 % BRIDGE_BASE !== 0 && (n1 % BRIDGE_BASE + n2 % BRIDGE_BASE) > BRIDGE_BASE;
}
/**
 * Generate a math problem based on difficulty level or a specific max sum.
 * @param difficultyOrMaxSum - Difficulty level (easy, medium, hard) or a number for max sum.
 * @param exclude - Problem to exclude from generation.
 */
export function generateProblem(
  difficultyOrMaxSum: DifficultyLevel | number = 'medium',
  exclude?: { num1: number, num2: number }
): { num1: number, num2: number } {
  let min = MIN_OPERAND_VALUE;
  let max = BRIDGE_MAX_SUM;

  if (typeof difficultyOrMaxSum === 'number') {
    max = difficultyOrMaxSum;
  } else {
    const limits = PROBLEM_LIMITS[difficultyOrMaxSum];
    min = limits.min;
    max = limits.max;
  }

  const MAX_RETRY = MAX_PROBLEM_GENERATION_RETRIES;
  let attempts = 0;
  while (attempts < MAX_RETRY) {
    attempts++;
    const n1 = Math.floor(Math.random() * (max - min)) + min;
    const n2 = Math.floor(Math.random() * (max - n1)) + 1;
    const potential = n1 >= n2 ? { num1: n1, num2: n2 } : { num1: n2, num2: n1 };
    if (n1 + n2 <= max && n1 + n2 >= max * MIN_SUM_RATIO) {
      if (!exclude || (potential.num1 !== exclude.num1 || potential.num2 !== exclude.num2)) {
        return potential;
      }
    }
  }
  return { num1: Math.max(min, Math.floor(max / FALLBACK_DIVISOR)), num2: 1 };
}
export function getProblemCategory(sum: number): string {
  if (sum <= FOUNDATION_MAX_SUM) return 'Foundation';
  if (sum <= BRIDGE_MAX_SUM) return 'Bridge';
  return 'Decomposition';
}
export function calculatePerformanceSummary(logs: any[]) {
  if (!logs || logs.length === 0) {
    return [
      { name: 'Foundation', accuracy: 0, avgTime: 0, total: 0 },
      { name: 'Bridge', accuracy: 0, avgTime: 0, total: 0 },
      { name: 'Decomposition', accuracy: 0, avgTime: 0, total: 0 }
    ];
  }
  const summary: Record<string, { count: number; correct: number; totalTime: number }> = {
    'Foundation': { count: 0, correct: 0, totalTime: 0 },
    'Bridge': { count: 0, correct: 0, totalTime: 0 },
    'Decomposition': { count: 0, correct: 0, totalTime: 0 }
  };
  logs.forEach(log => {
    const sum = log.num1 + log.num2;
    const category = getProblemCategory(sum);
    if (summary[category]) {
      summary[category].count++;
      if (log.isCorrect) summary[category].correct++;
      summary[category].totalTime += log.timeTaken;
    }
  });
  return Object.entries(summary).map(([name, data]) => ({
    name,
    accuracy: data.count > 0 ? (data.correct / data.count) * 100 : 0,
    avgTime: data.count > 0 ? data.totalTime / data.count : 0,
    total: data.count
  }));
}