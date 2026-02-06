# Test Gap Analysis - Core Math Features

## 1. Identified Core Math Features

### A. Calculations (`src/lib/calculations.ts`)
- **Accuracy**: Calculates the percentage of correct problems.
- **Streak**: Intended to calculate consecutive days of practice.
- **Total Time**: Aggregates practice time across sessions.

### B. Math Utilities (`src/lib/math-utils.ts`)
- **Strategy Generation**: Determines the best mental math strategy (Counting, Bridge to Ten, Decomposition) based on the numbers.
- **Problem Generation**: Generates math problems within a specific sum range.
- **Problem Categorization**: Categorizes problems into Foundation, Bridge, or Decomposition.
- **Performance Summary**: Aggregates performance data by category.

### C. Progression Logic (`src/pages/math/MathHubPage.tsx`)
- **Unlock System**: Logic that determines if a topic (e.g., Subtraction) is unlocked based on previous topic progress (80% threshold).

---

## 2. Review of Existing Tests

- **`src/__tests__/calculations.test.ts`**:
    - Tests `calculateAccuracy` with a simple array.
    - Tests `calculateStreak` with a mock array (Current implementation only checks for 'today').
    - Tests `calculateTotalTime` with a few sessions.

**Overall Coverage Status**: Minimal. Core logic in `math-utils.ts` and progression logic is currently untested.

---

## 3. Identified Gaps

### High Priority (Business Logic)
1. **Streak Accuracy**: The current `calculateStreak` implementation is a placeholder that only checks if the user practiced today. It needs to correctly count consecutive days backwards from today/yesterday.
2. **Unlock Thresholds**: The 80% unlock logic is hardcoded in a UI component. This should be verified with tests to ensure topics unlock exactly when requirements are met.
3. **Problem Generation Constraints**: Ensure `generateProblem` consistently respects the `maxSum` and correctly handles the `exclude` parameter to avoid immediate repetition.
4. **Performance Summary Aggregation**: Verify that `calculatePerformanceSummary` correctly handles various log sizes and categorizes problems accurately.

### Technical Edge Cases
1. **Empty States**: How do calculations behave with empty problem arrays or session logs? (Current tests cover some, but not all).
2. **Floating Point Precision**: Accuracy calculations should be resilient to floating point issues if they ever arise (though simple division is usually fine).
3. **Large Datasets**: `calculatePerformanceSummary` should be efficient even with a large number of logs.
4. **Invalid Inputs**: Handling of `null`, `undefined`, or malformed session/problem objects in utility functions.

---

## 4. Proposed Test Cases (Phase 2)

### Unit Tests
- `calculations.ts`:
    - `calculateStreak`: Test with 0, 1, 5 consecutive days. Test with gaps between days. Test with practice only in the past.
    - `calculateAccuracy`: Test with 0 problems, 100% correct, 0% correct.
- `math-utils.ts`:
    - `getHintStrategy`: Test transitions between 'count', 'make-ten', and 'decompose'.
    - `generateProblem`: Test distribution and range enforcement over 1000 iterations.
    - `calculatePerformanceSummary`: Test with mixed categories and verify accuracy/avgTime math.

### Integration Tests
- **Practice Flow**: Generate a problem -> Simulate correct/wrong answer -> Update session logs -> Recalculate stats -> Verify unlock state.
