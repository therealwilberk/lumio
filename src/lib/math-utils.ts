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
  // Strategy: Count All (Sums <= 10)
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
  // Logic: Only suggest Make Ten if the first number is larger (nearer to 10) for better visual sense
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
  // Strategy: Decomposition (Larger numbers)
  return {
    type: 'decompose',
    title: 'BREAK IT DOWN',
    description: 'Split the numbers into Tens and Ones to simplify the mission.',
    steps: [
      n1 >= 10 ? `Keep the 10 from ${n1}` : `Start with ${n1}`,
      `Add the remaining pieces together`,
      `Finally, combine your sub-total with the 10s`
    ],
    visualCues: { pulseAddend1: true, pulseAddend2: true, bridgeActive: false }
  };
}
export function isBridgeThroughTen(n1: number, n2: number): boolean {
  return n1 > 0 && n1 < 10 && n2 > 0 && n2 < 10 && (n1 + n2) > 10;
}
export function generateProblem(maxSum: number = 20): { num1: number, num2: number } {
  const MAX_RETRY = 20;
  let attempts = 0;
  while (attempts < MAX_RETRY) {
    attempts++;
    const shouldBridge = Math.random() > 0.4;
    let n1: number;
    let n2: number;
    if (shouldBridge && maxSum >= 11) {
      // Aim for 8+5, 7+6 style problems
      n1 = Math.floor(Math.random() * 4) + 6; // 6-9
      n2 = Math.floor(Math.random() * 8) + 2; // 2-9
      if (isBridgeThroughTen(n1, n2) && (n1 + n2) <= maxSum) {
        return { num1: n1, num2: n2 };
      }
    } else {
      n1 = Math.floor(Math.random() * 9) + 2; // 2-10
      n2 = Math.floor(Math.random() * 9) + 1; // 1-9
      if ((n1 + n2) <= maxSum) {
        // Ensure num1 is the larger one for better visual Ten-Frame consistency
        return n1 >= n2 ? { num1: n1, num2: n2 } : { num1: n2, num2: n1 };
      }
    }
  }
  // Safe fallback
  return { num1: 5, num2: 4 };
}