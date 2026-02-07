# Phase 6: Practice Pages Overhaul - Implementation Plan

**Date:** February 7, 2026  
**Branch:** `feature/phase-6-practice-pages-aceternity`  
**Status:** In Progress

---

## Overview

Phase 6 focuses on enhancing the practice pages (RegularPracticePage and SpeedDrillPage) with Aceternity UI components to create a more engaging and visually appealing learning experience.

---

## Components to Implement

### 1. Spotlight Effect
- **Purpose:** Dramatic lighting effect that follows cursor movement
- **Component:** `@/components/ui/spotlight.tsx`
- **Files:** RegularPracticePage.tsx, SpeedDrillPage.tsx
- **Placement:** Background of the main container, positioned to highlight the problem area

### 2. Meteors Effect
- **Purpose:** Animated meteor shower in problem card backgrounds
- **Component:** `@/components/ui/meteors.tsx`
- **Files:** RegularPracticePage.tsx, SpeedDrillPage.tsx
- **Placement:** Inside the problem card, behind the problem content

### 3. Animated Tooltips
- **Purpose:** Show point costs and hints on hover
- **Component:** `@/components/ui/animated-tooltip.tsx`
- **Files:** RegularPracticePage.tsx, SpeedDrillPage.tsx
- **Placement:** Wrap hint buttons and action buttons

---

## Implementation Steps

### Step 1: RegularPracticePage Overhaul

#### 1.1 Add Spotlight Effect
```tsx
// Import Spotlight
import { Spotlight } from '@/components/ui/spotlight';

// Add to the main container
<Spotlight
  className="-top-40 left-0 md:left-60 md:-top-20"
  fill="white"
/>
```

#### 1.2 Add Meteors to Problem Card
```tsx
// Import Meteors
import { Meteors } from '@/components/ui/meteors';

// Add inside the problem card
<Card className="bg-white dark:bg-gray-800 border-0 shadow-xl p-8 rounded-2xl mb-8 relative overflow-hidden">
  <Meteors number={20} />
  {/* Problem content */}
</Card>
```

#### 1.3 Add Animated Tooltips to Hints
```tsx
// Import AnimatedTooltip
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

// Wrap hint button
<AnimatedTooltip items={[{ name: "Hint", designation: "-5 points" }]}>
  <Button variant="outline" onClick={useHint}>
    <Lightbulb className="h-4 w-4" />
    💡 Hint
  </Button>
</AnimatedTooltip>
```

### Step 2: SpeedDrillPage Overhaul

#### 2.1 Add Spotlight Effect
Same placement as RegularPracticePage but positioned for the game board.

#### 2.2 Add Meteors to Game Board
Add Meteors component inside the game board container.

#### 2.3 Add Animated Tooltips
Wrap action buttons with AnimatedTooltip for point costs.

---

## Testing Checklist

### Visual Tests
- [ ] Spotlight effect follows cursor movement smoothly
- [ ] Meteors animate continuously without performance issues
- [ ] Animated Tooltips appear on hover with correct content
- [ ] Dark mode displays correctly for all effects
- [ ] Mobile responsive (effects work on touch devices)

### Functional Tests
- [ ] Problem solving flow works unchanged
- [ ] Hint functionality works with point deduction
- [ ] Answer validation works correctly
- [ ] Progress tracking works
- [ ] Timer and stats display correctly

### Performance Tests
- [ ] Animations run at 60fps
- [ ] No memory leaks during extended sessions
- [ ] Build completes without errors
- [ ] Bundle size increase is reasonable

---

## Success Criteria

✅ All practice pages use Aceternity components  
✅ Animations run smoothly (60fps)  
✅ Dark mode fully supported  
✅ Mobile responsive  
✅ All existing functionality preserved  
✅ All tests pass  
✅ Build completes without errors  
✅ Performance remains good

---

## Files to Modify

1. `/src/pages/math/RegularPracticePage.tsx`
2. `/src/pages/math/SpeedDrillPage.tsx`

## Components Already Installed

- ✅ `spotlight.tsx` - Spotlight effect
- ✅ `meteors.tsx` - Meteor shower animation
- ✅ `animated-tooltip.tsx` - Animated tooltip component

---

## Estimated Time

- RegularPracticePage: 1 hour
- SpeedDrillPage: 1 hour
- Testing: 30 minutes
- Documentation: 30 minutes

**Total:** 3 hours

---

## Commit Strategy

Commits will be made at these milestones:

1. `feat: phase 6 - add spotlight effect to regular practice page`
2. `feat: phase 6 - add meteors effect to regular practice page`
3. `feat: phase 6 - add animated tooltips to regular practice page`
4. `feat: phase 6 - add spotlight effect to speed drill page`
5. `feat: phase 6 - add meteors effect to speed drill page`
6. `feat: phase 6 - add animated tooltips to speed drill page`
7. `test: phase 6 - verify all animations and interactions`
8. `docs: complete phase 6 walkthrough and update progress archive`

---

## Notes

- Maintain all existing game logic and state management
- Ensure duck mascot remains visible
- Keep visual helpers (dot groups) functional
- Test thoroughly on mobile devices
- Verify dark mode contrast ratios
