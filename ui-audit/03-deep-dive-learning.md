# Deep Dive: Learning Interface & Game Loop

This audit focuses on the core educational experience: `AdditionPage` and `SpeedDrillPage`.

## 1. Addition Page (Regular Practice)
**File**: `src/pages/math/AdditionPage.tsx`

### Current State
- **Structure**: Uses a 2/3 layout with a large card for the problem and a 1/3 sidebar for stats.
- **Visuals**: Very "clean" but bordering on "sterile." The background is a subtle gradient, but the content area is dominated by white cards.
- **Interactions**: Standard input field. The feedback (Correct/Oops) is text-based with small icons.

### Gaps & Improvements
- **Problem Display**: The numbers are just large text.
    - *Whimsy Fix*: Use "Digit Blocks" or "Math Monsters" that hold the numbers.
- **Feedback Energy**: When a user gets a question right, there should be more "celebration."
    - *Whimsy Fix*: Trigger small particle bursts (using `Celebration.tsx`) directly around the answer box, not just a state change in the card.
- **Difficulty Selection**: Currently uses standard small buttons.
    - *Whimsy Fix*: Make these large, colorful toggles with icons (e.g., a "Seed" for easy, a "Sprout" for medium, an "Oak" for hard).

## 2. Speed Drill (Lightning Round)
**File**: `src/pages/math/SpeedDrillPage.tsx`

### Current State
- **Structure**: Center-aligned layout. Timer on top, problem in the middle, input below.
- **Visuals**: Higher energy than the Addition page due to the timer ring and orange accents.
- **The "Floating" Issue**: The layout elements (Timer, Counter, Streak) are spread thin at the top, while the problem card sits alone in the middle. This creates a lot of "dead space" that makes the UI feel unanchored.

### Gaps & Improvements
- **Cohesion**: The timer, problem, and progress should be part of a single "Console" or "HUD" (Heads-Up Display).
    - *Whimsy Fix*: Wrap the game area in a frame that looks like a game device or a futuristic tablet.
- **Streak Feedback**: Streaks are shown with the `StreakCounter`.
    - *Whimsy Fix*: As the streak grows, the background or the HUD could "heat up" (e.g., subtle orange glow increasing in intensity).
- **Input Lag/Focus**: Using a standard input relies on the system keyboard.
    - *Whimsy Fix*: On mobile, a custom numeric keypad would prevent the keyboard from pushing the entire UI up, which often causes the "weird floating" feel as elements shift unexpectedly.

## 3. Dark Mode Consistency
Across both pages, the dark mode implementation relies on `dark:` classes.
- **Issue**: Some components like `Card` or `Input` use default shadcn dark styles which are very "gray/black."
- **Opportunity**: Use "Midnight Blue" or "Deep Space" colors for dark mode to maintain the "Lumio" brand energy rather than falling back to standard dark gray.
- **Flicker**: The `PageTransition` component needs to ensure the background color is set on the body or a root wrapper to prevent white flashes during transition between dark-themed pages.
