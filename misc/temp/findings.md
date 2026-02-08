# Findings & Fixes during Subtraction and Multiplication Implementation

## Findings
1. **Math Logic Generality**: The initial `generateProblem` was specific to addition. Refactoring it to a generic implementation using a configuration-driven approach makes adding new operations (Multiplication, Division) significantly easier and less error-prone.
2. **Sequential Unlocking**: The current UI shows all subjects but locking them provides a better sense of progression. Implementing this required adding a `requirement` field to the `MathHubPage` data structure.
3. **UI Consistency**: Transitioning from `AdditionPage.tsx` to `SubtractionPage.tsx` revealed some minor styling inconsistencies (e.g., card background colors). All math pages have been standardized to use `slate-950` with high-quality glassmorphism.
4. **Multiplication Visualization**: For Grade 6, standard multiplication can be daunting. The "partial products" method implemented in `MultiplicationPage.tsx` provides a better scaffold for learning.
5. **Testing environment**: `bun test` continues to have issues with React/JSDOM in this environment. `npx vitest run` is the reliable alternative.

## Fixes Applied
- **Hardcoded Limits**: Removed hardcoded limits in `math-utils.ts` and moved them to `shared/math-config.ts`.
- **Navigation Flow**: Added proper routing for the new pages in `src/main.tsx`.
- **Mascot Reactivity**: Ensured the mascot reacts appropriately to correct/incorrect partial products in the multiplication flow.
- **Button nesting**: Fixed a potential `validateDOMNesting` issue in `MathHubPage.tsx` by ensuring interactive elements are not nested inside other buttons.
