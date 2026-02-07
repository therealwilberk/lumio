# Milestone: Hardcoded Values Audit & Centralization (Phase 1)

This milestone focused on auditing the codebase for hardcoded magic numbers and policy constants, and centralizing math logic and progression values into a unified configuration.

## 🛠️ Accomplishments
- **Comprehensive Audit**: Scanned `src/lib/`, `shared/`, and `worker/` for hardcoded values.
- **Documentation**: Created `hardcoded-values.md` listing all identified constants, their locations, and reasons for configurability.
- **Centralization (Phase 1)**: Created `shared/math-config.ts` to house all math and progression constants.
- **Refactoring**: Updated `math-utils.ts`, `calculations.ts`, `progression.ts`, and `shared/dashboard-calculations.ts` to consume centralized constants.
- **UI Stabilization**:
    - Fixed React hydration/validation error (nested `<button>`) in `MathHubPage.tsx`.
    - Fixed `TypeError` in `AnimatedTooltip` related to `getBoundingClientRect` access in async animation frames.
- **Testing**: Implemented `src/__tests__/config.test.ts` to verify that core logic respects the new configuration.

## 📈 Impact
- Improved maintainability: Game balance (difficulty, mastery thresholds, speed benchmarks) can now be adjusted in a single file.
- Increased reliability: Fixed critical UI crashes and DOM nesting errors detected during the dev server run.
- Roadmap: Established a clear TODO list for Phase 2 (UI styling, Backend secrets, and Achievements centralization).

## 🚀 Next Steps
- Implement Phase 2 of centralization (Backend secrets and UI config).
- Further decouple Achievement definitions from hardcoded criteria.
