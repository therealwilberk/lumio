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
  const needs = Math.max(0, 10 - (n1 % 10 === 0 ? 10 : n1 % 10));
  const remainder = Math.max(0, n2 - needs);
  return { needs, remainder };
}
export function getHintStrategy(n1: number, n2: number): HintStrategy {
  const sum = n1 + n2;
  if (sum <= 10) {
    return {
      type: 'count',
      title: 'PRECISION COUNTING',
      description: 'Since the total is small, we can count up from the first number.',
      steps: [`Start at ${n1}`, `Jump ${n2} more steps`],
      visualCues: { pulseAddend1: true, pulseAddend2: true, bridgeActive: false }
    };
  }
  if (n1 < 10 && n2 < 10 && sum > 10) {
    const { needs, remainder } = getMakeTenBreakdown(n1, n2);
    return {
      type: 'make-ten',
      title: 'BRIDGE TO TEN',
      description: `Filling up to 10 makes the math much faster!`,
      steps: [
        `${n1} needs ${needs} to make a full 10`,
        `Take ${needs} from ${n2}`,
        `${n2} has ${remainder} left over`,
        `Final: 10 + ${remainder} = ${sum}`
      ],
      visualCues: { pulseAddend1: false, pulseAddend2: false, bridgeActive: true }
    };
  }
  const t1 = Math.floor(n1 / 10) * 10;
  const o1 = n1 % 10;
  const t2 = Math.floor(n2 / 10) * 10;
  const o2 = n2 % 10;
  const onesSum = o1 + o2;
  return {
    type: 'decompose',
    title: 'NEXUS DECOMPOSITION',
    description: 'Split the numbers into TENS and ONES to conquer large sums.',
    steps: [
      `Tens: ${t1} + ${t2} = ${t1 + t2}`,
      `Ones: ${o1} + ${o2} = ${onesSum}`,
      onesSum > 10 ? `Bridge Ones: ${t1 + t2} + ${onesSum} = ${sum}` : `Total: ${t1 + t2} + ${onesSum} = ${sum}`
    ],
    visualCues: { pulseAddend1: true, pulseAddend2: true, bridgeActive: false }
  };
}
export function isBridgeThroughTen(n1: number, n2: number): boolean {
  return n1 % 10 !== 0 && (n1 % 10 + n2 % 10) > 10;
}
export function generateProblem(maxSum: number = 20, exclude?: { num1: number, num2: number }): { num1: number, num2: number } {
  const MAX_RETRY = 50;
  let attempts = 0;
  while (attempts < MAX_RETRY) {
    attempts++;
    const n1 = Math.floor(Math.random() * (maxSum - 2)) + 2;
    const n2 = Math.floor(Math.random() * (maxSum - n1)) + 1;
    const potential = n1 >= n2 ? { num1: n1, num2: n2 } : { num1: n2, num2: n1 };
    if (n1 + n2 <= maxSum && n1 + n2 >= maxSum * 0.3) {
      if (!exclude || (potential.num1 !== exclude.num1 || potential.num2 !== exclude.num2)) {
        return potential;
      }
    }
  }
  return { num1: Math.floor(maxSum / 1.5), num2: 1 };
}
export function getProblemCategory(sum: number): string {
  if (sum <= 10) return 'Foundation';
  if (sum <= 20) return 'Bridge';
  return 'Decomposition';
}
export function calculatePerformanceSummary(logs: any[]) {
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