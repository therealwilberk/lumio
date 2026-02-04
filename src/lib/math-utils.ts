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
  const needs = Math.max(0, 10 - n1);
  const remainder = Math.max(0, n2 - needs);
  return { needs, remainder };
}
export function getHintStrategy(n1: number, n2: number): HintStrategy {
  const sum = n1 + n2;
  if (sum <= 10) {
    return {
      type: 'count',
      title: 'COUNT THE GEMS',
      description: 'Since the total is 10 or less, we can count every gem one by one!',
      steps: [`Start with ${n1}`, `Count ${n2} more`],
      visualCues: { pulseAddend1: true, pulseAddend2: true, bridgeActive: false }
    };
  }
  if (n1 < 10 && n2 < 10 && sum > 10) {
    const { needs, remainder } = getMakeTenBreakdown(n1, n2);
    return {
      type: 'make-ten',
      title: 'BRIDGE TO TEN',
      description: `Fill up the first frame to make a solid 10. It's much easier to add once you have a full set!`,
      steps: [
        `${n1} needs ${needs} more to make 10`,
        `Take ${needs} from Bank B`,
        `Bank B has ${remainder} left over`,
        `Now add 10 + ${remainder} = ${sum}`
      ],
      visualCues: { pulseAddend1: false, pulseAddend2: false, bridgeActive: true }
    };
  }
  const t1 = Math.floor(n1 / 10) * 10;
  const o1 = n1 % 10;
  const t2 = Math.floor(n2 / 10) * 10;
  const o2 = n2 % 10;
  return {
    type: 'decompose',
    title: 'TACTICAL DECOMPOSITION',
    description: 'Split the numbers into Tens and Ones to simplify the calculation.',
    steps: [
      `Combine Tens: ${t1} + ${t2} = ${t1 + t2}`,
      `Combine Ones: ${o1} + ${o2} = ${o1 + o2}`,
      `Final Result: ${t1 + t2} + ${o1 + o2} = ${sum}`
    ],
    visualCues: { pulseAddend1: true, pulseAddend2: true, bridgeActive: false }
  };
}
export function isBridgeThroughTen(n1: number, n2: number): boolean {
  return n1 % 10 !== 0 && (n1 % 10 + n2 % 10) > 10;
}
export function generateProblem(maxSum: number = 20): { num1: number, num2: number } {
  const MAX_RETRY = 20;
  let attempts = 0;
  while (attempts < MAX_RETRY) {
    attempts++;
    const n1 = Math.floor(Math.random() * (maxSum - 2)) + 2;
    const n2 = Math.floor(Math.random() * (maxSum - n1)) + 1;
    if (n1 + n2 <= maxSum && n1 + n2 >= maxSum * 0.4) {
      return n1 >= n2 ? { num1: n1, num2: n2 } : { num1: n2, num2: n1 };
    }
  }
  return { num1: Math.floor(maxSum / 2), num2: Math.floor(maxSum / 3) };
}