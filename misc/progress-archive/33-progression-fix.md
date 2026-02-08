# Progress Report: Progression and Mastery Fixes

## Date: 2023-11-20 (Simulated)
## Task: Fix progress bar issues and per-topic tracking

### 1. Issues Identified
* **Progress Bleeding:** Addition mastery was using global `totalScore`, causing it to fill up when doing other topics.
* **Topic Registration:** Subtraction and other topics were not properly registering their specific progress because the backend only tracked a single `totalScore`.
* **Progression Speed:** Some topics (Multiplication/Division) were awarding too many points per problem, violating the slow progression requirement (~1-2% per problem).

### 2. Implementation Details

#### Configuration (`shared/math-config.ts`)
* Defined `TOPIC_SCORE_LIMITS` for each math topic (set to 100 for consistent 1 point = 1% mapping).
* Maintained legacy support for `ADDITION_SCORE_LIMIT`.

#### Backend (`worker/entities.ts`, `worker/user-routes.ts`)
* Added `topicScores` (Record<string, number>) to `StudentStats` to track points per topic independently.
* Updated `updateProgress` to accept a `topic` parameter and increment the appropriate topic score.
* Ensured `solveLog` includes the `topic` for better data granularity.

#### Frontend Logic (`src/lib/progression.ts`)
* Refactored `calculateTopicProgress` to use `topicScores` from the user stats.
* Implemented sequential unlock logic based on per-topic mastery (e.g., Subtraction unlocks at 80% Addition mastery).
* Added safeguards: clamping progress (0-100%) and rounding.
* Added legacy fallback to ensure existing users don't lose Addition progress.

#### Math Modules (`AdditionPage.tsx`, `SubtractionPage.tsx`, etc.)
* Standardized points awarded per correct answer:
  - Easy: 1 point (1%)
  - Medium: 2 points (2%)
  - Hard: 3 points (3%)
* Updated API calls to pass the correct `topic` ID.
* Fixed `solveLog` to record actual user answers in multi-step problems.

### 3. Verification Results
* **Unit Tests:** Updated `progression.test.ts`, `unlock.test.ts`, and `division.test.ts` to reflect the new logic. All passed.
* **UI Verification:** Playwright scripts confirmed:
  - Addition progress moves independently.
  - Subtraction remains at 0% while doing Addition.
  - Subtraction unlocks correctly at 80% Addition.
  - No crashes in any math page.

### 4. Next Steps
* Monitor user feedback on progression speed.
* Consider adding achievements for mastering entire topics.
