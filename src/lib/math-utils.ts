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
 */
export function isBridgeThroughTen(n1: number, n2: number): boolean {
  return n1 < 10 && (n1 + n2) > 10;
}
/**
 * Generates an addition problem.
 * Occasionally prioritizes bridge-through-10 problems for strategy practice.
 */
export function generateProblem(maxSum: number = 20) {
  const shouldBridge = Math.random() > 0.4; // 60% chance to aim for bridge
  let n1: number;
  let n2: number;
  if (shouldBridge && maxSum >= 11) {
    // Try to find a bridging problem
    n1 = Math.floor(Math.random() * 4) + 6; // 6, 7, 8, 9
    n2 = Math.floor(Math.random() * 8) + 2; // 2-9
    // Ensure it bridges and doesn't exceed maxSum
    if (!isBridgeThroughTen(n1, n2) || (n1 + n2) > maxSum) {
      return generateProblem(maxSum);
    }
  } else {
    n1 = Math.floor(Math.random() * 9) + 2;
    n2 = Math.floor(Math.random() * 9) + 2;
    if (n1 + n2 > maxSum) return generateProblem(maxSum);
  }
  return { num1: n1, num2: n2 };
}