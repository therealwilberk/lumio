# Prioritized UI Issues & Enhancements

This list ranks UI improvements by their impact on student engagement and overall app polish.

## High Priority (High ROI for Kids' Engagement)

1. **"Floating" Speed Drill UI & Spacing**
   - **Path**: `src/pages/math/SpeedDrillPage.tsx`
   - **Problem**: The game UI feels "disconnected" and "weirdly floating." Spacing between the timer, problem, and input is inconsistent. On mobile, the layout can feel cramped or misaligned.
   - **Fix**: Implement a more cohesive game container. Use a clear "Game Board" area. Improve vertical rhythm and ensure the input is always prominent and accessible.
   - **Impact**: Crucial for the primary game loop. Better spacing reduces cognitive load for kids during high-speed tasks.

2. **Static/Analytical Dashboard**
   - **Path**: `src/pages/DashboardPage.tsx`
   - **Problem**: Feels like a corporate SaaS dashboard. Charts are very analytical and lack the "whimsy" found in the Hero section.
   - **Fix**: Add more mascot interactions. Use playful progress bars instead of standard charts where possible. Introduce "celebratory" animations for reaching milestones.
   - **Impact**: Makes progress tracking feel like a reward rather than a report card.

3. **Inconsistent Dark Mode & Gradients**
   - **Path**: `src/components/layout/Hero.tsx`, `src/components/auth/LoginForm.tsx`
   - **Problem**: Some pages use hardcoded gradients that don't transition well to dark mode or cause "flickering" during theme switches.
   - **Fix**: Use CSS variables for gradients or Tailwind's `dark:` variants more consistently. Ensure background colors match the theme context perfectly.
   - **Impact**: Improves professional feel and accessibility for evening study sessions.

4. **Mascot Integration Gaps**
   - **Path**: `src/pages/math/MathHubPage.tsx`, `src/pages/math/AdditionPage.tsx`
   - **Problem**: The mascot is absent from key learning areas.
   - **Fix**: Add the mascot as a "tutor" or "cheerleader" in the Math Hub and during practice sessions.
   - **Impact**: Strengthens the brand and provides a friendly face for students to associate with learning.

## Medium Priority

5. **Redundant 'Progress' Tab**
   - **Path**: `src/components/layout/Navbar.tsx`
   - **Problem**: The 'Progress' tab is non-functional and duplicates the 'Dashboard''s purpose.
   - **Fix**: Remove the 'Progress' tab to declutter the navigation.
   - **Impact**: Simplifies the UI and avoids user frustration with dead links.

6. **Page Transition Flickering**
   - **Path**: `src/components/ui/PageTransition.tsx`
   - **Problem**: Visual flickering or "jumps" when navigating between pages.
   - **Fix**: Optimize Framer Motion `AnimatePresence` and ensure layout stability during transitions (e.g., setting fixed heights or using `mode="wait"`).
   - **Impact**: Smoother, "app-like" experience.

7. **Speed Drill Input Accessibility**
   - **Path**: `src/pages/math/SpeedDrillPage.tsx`
   - **Problem**: Standard HTML number input is boring and can be tricky on mobile.
   - **Fix**: Create a custom "Kids' Numpad" for the Speed Drill.
   - **Impact**: More game-like feel and better touch ergonomics.

## Low Priority (Polish)

8. **Hover State Consistency**
   - **Path**: Various components in `src/components/ui/`
   - **Problem**: Not all buttons/cards have satisfying hover/tap feedback.
   - **Fix**: Standardize on high-stiffness spring animations for all interactive elements.
   - **Impact**: Makes the UI feel responsive and "alive."

9. **Subject Card Content**
   - **Path**: `src/components/subjects/SubjectCard.tsx`
   - **Problem**: Descriptions are a bit text-heavy for Grade 6.
   - **Fix**: Use more icons or visual cues to describe subjects.
   - **Impact**: Faster scanning and more inviting cards.
