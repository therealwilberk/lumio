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
/**
 * For addition like 8 + 5:
 * 8 needs 2 more to make 10.
 * 5 becomes 2 + 3.
 * Result: 10 + 3 = 13.
 */
export function getMakeTenBreakdown(n1: number, n2: number): MakeTenBreakdown {
  const needs = Math.max(0, 10 - n1);
  const remainder = Math.max(0, n2 - needs);
  return { needs, remainder };
}
/**
 * Analyzes the problem and returns a pedagogical strategy for mental math.
 */
export function getHintStrategy(n1: number, n2: number): HintStrategy {
  const sum = n1 + n2;
  // Strategy: Count All (Sums < 10)
  if (sum <= 10) {
    return {
      type: 'count',
      title: 'COUNT THE GEMS',
      description: 'Since the total is 10 or less, we can count every gem one by one!',
      steps: [`Start with ${n1}`, `Count ${n2} more`],
      visualCues: { pulseAddend1: true, pulseAddend2: true, bridgeActive: false }
    };
  }
  // Strategy: Make Ten (Single digits bridging 10)
  if (n1 < 10 && n2 < 10 && sum > 10) {
    const { needs, remainder } = getMakeTenBreakdown(n1, n2);
    return {
      type: 'make-ten',
      title: 'BRIDGE TO TEN',
      description: `Fill up the first frame to make a solid 10. It's much easier to add!`,
      steps: [
        `${n1} needs ${needs} to make 10`,
        `Bank B has ${remainder} left over`,
        `10 + ${remainder} = ${sum}`
      ],
      visualCues: { pulseAddend1: false, pulseAddend2: false, bridgeActive: true }
    };
  }
  // Strategy: Decomposition (Larger numbers)
  return {
    type: 'decompose',
    title: 'BREAK IT DOWN',
    description: 'Split the numbers into Tens and Ones to simplify the mission.',
    steps: [
      n1 >= 10 ? `Take 10 from ${n1}` : `Keep ${n1}`,
      `Add the remaining pieces`,
      `Combine back with the 10`
    ],
    visualCues: { pulseAddend1: true, pulseAddend2: true, bridgeActive: false }
  };
}
/**
 * Checks if a problem crosses the ten-boundary (e.g., 8 + 5 = 13)
 */
export function isBridgeThroughTen(n1: number, n2: number): boolean {
  return n1 > 0 && n1 < 10 && n2 > 0 && n2 < 10 && (n1 + n2) > 10;
}
/**
 * Generates an addition problem.
 */
export function generateProblem(maxSum: number = 20, attempts: number = 0): { num1: number, num2: number } {
  const MAX_RECURSION = 50;
  if (attempts > MAX_RECURSION) {
    return { num1: 5, num2: 5 };
  }
  const shouldBridge = Math.random() > 0.4;
  let n1: number;
  let n2: number;
  if (shouldBridge && maxSum >= 11) {
    n1 = Math.floor(Math.random() * 4) + 6;
    n2 = Math.floor(Math.random() * 8) + 2;
    if (!isBridgeThroughTen(n1, n2) || (n1 + n2) > maxSum) {
      return generateProblem(maxSum, attempts + 1);
    }
  } else {
    n1 = Math.floor(Math.random() * 9) + 2;
    n2 = Math.floor(Math.random() * 9) + 2;
    if (n1 + n2 > maxSum) {
      return generateProblem(maxSum, attempts + 1);
    }
  }
  return { num1: n1, num2: n2 };
}