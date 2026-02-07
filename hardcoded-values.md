# Lumio Hardcoded Values Audit

This document lists hardcoded values, "magic numbers", and policy constants identified in the Lumio codebase (specifically `src/lib/`, `shared/`, and `worker/`). These values are candidates for moving to a configuration file or environment variables to allow for easier tuning of game balance, difficulty, and app behavior.

## Math & Problem Generation

| File | Line | Current Value | Description | Why Configurable |
| :--- | :--- | :--- | :--- | :--- |
| `src/lib/math-utils.ts` | 18 | `10` | Base for "Bridge to Ten" logic | Allow bridging to other bases or adjusting strategy. |
| `src/lib/math-utils.ts` | 24 | `10` | sum <= 10 for 'Foundation' category | Redefine what constitutes a "Foundation" level problem. |
| `src/lib/math-utils.ts` | 69 | `50` | `MAX_RETRY` for problem generation | Performance/stability tuning for complex constraints. |
| `src/lib/math-utils.ts` | 73 | `2` | Minimum operand value (Math.random range) | Control minimum difficulty. |
| `src/lib/math-utils.ts` | 76 | `0.2` | Minimum sum ratio relative to `maxSum` | Ensure generated problems aren't too easy (e.g., 1+1 when maxSum is 100). |
| `src/lib/math-utils.ts` | 82 | `1.5` | Fallback divisor for `maxSum` | Tune fallback problem difficulty when generation fails. |
| `src/lib/math-utils.ts` | 85 | `10` | Category threshold for 'Foundation' | Consistent categorization across the app. |
| `src/lib/math-utils.ts` | 86 | `20` | Category threshold for 'Bridge' | Adjust difficulty curve. |

## Progression & Mastery

| File | Line | Current Value | Description | Why Configurable |
| :--- | :--- | :--- | :--- | :--- |
| `src/lib/progression.ts` | 10 | `80` | `TOPIC_UNLOCK_THRESHOLD` | Change mastery requirement for unlocking new topics (e.g., 90% for harder courses). |
| `src/lib/progression.ts` | 17 | `100` | Points divisor for Addition progress | Adjust progression speed/scale. |
| `src/lib/progression.ts` | 21 | `100` | Points subtraction for Subtraction progress | Adjust progression speed/scale. |
| `src/lib/progression.ts` | 25 | `200` | Points subtraction for Multiplication progress | Adjust progression speed/scale. |
| `src/lib/progression.ts` | 29 | `300` | Points subtraction for Division progress | Adjust progression speed/scale. |
| `src/lib/progression.ts` | 36, 42, 48, 54 | `20` | Progress points per level | Fine-tune level granularity (currently 5 levels per topic). |

## Dashboard & KPI Calculations

| File | Line | Current Value | Description | Why Configurable |
| :--- | :--- | :--- | :--- | :--- |
| `src/lib/calculations.ts` | 16, 30 | `86400000` | Milliseconds in a day | Standard constant, but could be adjusted for "grace periods" (e.g., 36-hour window for streaks). |
| `shared/dashboard-calculations.ts` | 20 | `3600` | Seconds in hour | Standard time conversion. |
| `shared/dashboard-calculations.ts` | 21 | `60` | Seconds in minute | Standard time conversion. |
| `shared/dashboard-calculations.ts` | 62 | `1000 * 60 * 60 * 24` | Milliseconds in a day | Streak calculation consistency. |
| `shared/dashboard-calculations.ts` | 116 | `90` | Default days for activity heatmap | Change default reporting period for student history. |
| `shared/dashboard-calculations.ts` | 155 | `10` | Speed benchmark (10s = 0 points) | Tune what counts as "fast" vs "slow" for Grade 6 students. |
| `shared/dashboard-calculations.ts` | 155 | `8` | Speed range (10 - 2 = 8s) | Adjust the sensitivity of the speed metric. |
| `shared/dashboard-calculations.ts` | 161 | `30` | Consistency benchmark (30 day streak) | Adjust expectations for regular practice. |
| `shared/dashboard-calculations.ts` | 161 | `50` | Consistency base points/weight | Balance consistency against speed/accuracy in radar chart. |

## Achievements

*Note: `shared/achievements.ts` contains numerous hardcoded values for game balance.*

| File | Description | Values | Why Configurable |
| :--- | :--- | :--- | :--- |
| `shared/achievements.ts` | Milestone Thresholds | 10, 100, 500 problems | Adjust "grind" requirements for students. |
| `shared/achievements.ts` | Achievement Points | 25, 50, 100, 200, ... 1500 | Rebalance the "economy" of the game. |
| `shared/achievements.ts` | Speed Goals | 5s, 3s | Set realistic speed goals for different age groups. |
| `shared/achievements.ts` | Accuracy Goals | 95%, 100% | Adjust difficulty of performance achievements. |
| `shared/achievements.ts` | Streak Goals | 3, 7, 14, 30, 60 days | Match user retention targets. |
| `shared/achievements.ts` | Time of Day | 8am, 8pm | Define "Early Bird" and "Night Owl" based on local norms. |

## UI & Notifications

| File | Line | Current Value | Description | Why Configurable |
| :--- | :--- | :--- | :--- | :--- |
| `src/lib/notifications.tsx` | 14-50 | (Colors/Icons) | Background colors and emojis for toast types | Brand tuning and localization. |
| `src/lib/notifications.tsx` | 15-51 | (Durations) | Toast display durations (2-3s) | Adjust UX for readability/distraction. |
| `src/lib/notifications.tsx` | 76, 81, 86, 91 | (Styles) | Border radius, padding, font size | Global UI consistency. |
| `src/lib/notifications.tsx` | 104 | `${count} streak!` | Streak message template | Localization and personality tuning. |
| `src/lib/notifications.tsx` | 106 | `Achievement unlocked: ${name}!` | Achievement message template | Localization. |

## Backend & API (Worker)

| File | Line | Current Value | Description | Why Configurable |
| :--- | :--- | :--- | :--- | :--- |
| `worker/entities.ts` | 39, 323 | `100` | Session log slice limit | Balance between history depth and storage performance. |
| `worker/user-routes.ts` | 13 | `'lumio-secret-key...'` | JWT Secret | **Security**: Must be moved to environment variables. |
| `worker/user-routes.ts` | 32 | `24 * 60 * 60 * 1000` | Token expiration (24h) | Security vs convenience policy. |
| `worker/user-routes.ts` | 51, 55, 59, 63 | 3, 20, 4 | Auth validation rules | Policy for username/PIN length. |
| `worker/user-routes.ts` | 240-251 | (Mock Data) | Hardcoded `speedTrend` data | Needs real implementation; candidates for test mocks. |
| `worker/user-routes.ts` | 252-257 | (Mock Data) | Hardcoded `topicMastery` data | Needs real implementation; candidates for test mocks. |

## System & Infrastructure

| File | Line | Current Value | Description | Why Configurable |
| :--- | :--- | :--- | :--- | :--- |
| `src/lib/errorReporter.ts` | 128 | `5000` | Deduplication window (ms) | Optimize error reporting noise vs capturing rapid failures. |
| `src/lib/errorReporter.ts` | 129 | `60000` | Cleanup interval (ms) | Memory management vs history retention. |
| `src/lib/errorReporter.ts` | 284 | `10` | `maxQueueSize` for errors | Buffer size for client-side error reporting. |
