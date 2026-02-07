# Dependency Audit - Subtraction Module Task

## Issues Found
1. **Missing Peer Dependencies for Spline**: The project uses `@splinetool/react-spline` in the Hero component, but it was not present in the environment's `node_modules`, causing the dev server to crash on startup.
   - **Fix**: Installed `@splinetool/react-spline` and `@splinetool/runtime`.
2. **Generic Math Logic**: Previously, `generateProblem` was hardcoded for addition.
   - **Fix**: Refactored `src/lib/math-utils.ts` to support multiple operations, improving maintainability for future modules (Multiplication/Division).

## Recommendations
- Ensure `package.json` includes all necessary Spline dependencies to prevent "Module not found" errors in new dev environments.
