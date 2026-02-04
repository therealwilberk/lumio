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
export function generateProblem(maxSum: number = 20) {
  const num1 = Math.floor(Math.random() * 9) + 2; // 2-10
  const num2 = Math.floor(Math.random() * 9) + 2; // 2-10
  if (num1 + num2 > maxSum) return generateProblem(maxSum);
  return { num1, num2 };
}