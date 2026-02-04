export interface MakeTenBreakdown {
  needs: number;
  remainder: number;
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
 * Checks if a problem crosses the ten-boundary (e.g., 8 + 5 = 13)
 * Focuses on single-digit addends that bridge through 10.
 */
export function isBridgeThroughTen(n1: number, n2: number): boolean {
  return n1 > 0 && n1 < 10 && n2 > 0 && n2 < 10 && (n1 + n2) > 10;
}
/**
 * Generates an addition problem.
 * Includes a safety guard to prevent infinite recursion.
 */
export function generateProblem(maxSum: number = 20, attempts: number = 0): { num1: number, num2: number } {
  const MAX_RECURSION = 50;
  // Safety fallback if no solution is found within reasonable attempts
  if (attempts > MAX_RECURSION) {
    return { num1: 5, num2: 5 };
  }
  const shouldBridge = Math.random() > 0.4;
  let n1: number;
  let n2: number;
  if (shouldBridge && maxSum >= 11) {
    // Target common bridging pairs (6, 7, 8, 9)
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