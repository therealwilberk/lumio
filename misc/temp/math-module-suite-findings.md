# Math Module Implementation & Future Improvements

## Implementation Overview
Successfully implemented Subtraction, Multiplication, and Division modules to complement the existing Addition module. Key features include:
- **Centralized Math Logic:** `generateProblem` in `math-utils.ts` handles all four operations based on difficulty level.
- **Pedagogical Visualizations:**
    - Multiplication uses a "Partial Products" vertical layout.
    - Division uses a "Guided Long Division" bracket layout with automated intermediate steps.
- **Progression System:** Sequential unlocking based on 80% mastery of the preceding topic.

## Potential Improvements & Fixes

### UI/UX
1. **Dynamic Scaling:** For very long division problems (e.g., Oak difficulty), the bracket might become quite tall. Implement a scrollable area or dynamic scaling for the division card.
2. **Keyboard Navigation:** While quotient digits can be entered via keyboard, adding explicit 'Enter' key support to trigger the "Check" action would improve the flow.
3. **Mascot Interaction:** Currently, the mascot reacts at the end of a problem. Adding intermediate "cheers" or "encouragement" for correct intermediate steps in multi-step problems (Multiplication/Division) would enhance engagement.
4. **Fractional Division:** Future expansion could include remainders as fractions (e.g., `4 1/2`) or decimal results.

### Logic
1. **Adaptive Difficulty:** Instead of manually selecting Seed/Sprout/Oak, the system could automatically adjust the difficulty based on a rolling average of accuracy and speed.
2. **Seed Determinism:** Adding a `seed` parameter to `generateProblem` would allow for reproducible problems (useful for challenges or classroom sync).

### Accessibility
1. **Screen Reader Support:** Ensure the long division bracket and partial products table are aria-labeled correctly so visually impaired students can follow the mathematical logic.
