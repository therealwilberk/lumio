# TODO: Centralize Remaining Hardcoded Values

Following Phase 1 of math logic centralization, the following areas still contain hardcoded values that should be moved to configuration files or environment variables.

## 1. UI & Notifications
- [ ] Move toast styles (colors, icons) from `src/lib/notifications.tsx` to a UI config.
- [ ] Move toast durations from `src/lib/notifications.tsx` to a UI config.
- [ ] Extract message templates for streaks and achievements for localization.

## 2. Backend (Worker)
- [ ] **High Priority**: Move `JWT_SECRET` from `worker/user-routes.ts` to environment variables.
- [ ] Move auth policy rules (minimum PIN length, username requirements) to a shared auth config.
- [ ] Move data retention limits (session log slice counts) to a worker config.
- [ ] Replace hardcoded mock data in dashboard API routes with actual logic or configurable test mocks.

## 3. Achievements
- [ ] Centralize milestone thresholds (10, 100, 500 problems).
- [ ] Centralize point rewards for achievements.
- [ ] Centralize performance goals (speed, accuracy).

## 4. Shared KPI Calculations
- [ ] Review remaining hardcoded weights in `shared/dashboard-calculations.ts` (e.g., radar chart point distribution).
