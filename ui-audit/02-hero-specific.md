# Hero Component Deep Dive

**File**: `src/components/layout/Hero.tsx`

## Current Implementation Analysis

### 1. Parallax System
- Uses a `scrollY` state updated via scroll listener.
- **Layers**:
  - Sky gradient: Static.
  - Back Mountains: `parallaxOffset * 0.3`
  - Middle Mountains: `parallaxOffset * 0.5`
  - Front Mountains: `parallaxOffset * 0.7`
- **Issue**: The `scrollY` listener runs on every scroll event. While common, for a "game-like" app, we could use Framer Motion's `useScroll` and `useTransform` for smoother, hardware-accelerated parallax.

### 2. Animations
- **Clouds**: Drifting linearly across the screen. Effective but simple.
- **Greeting**: Uses `BouncyText` which has excellent spring physics (`stiffness: 250`, `damping: 12`).
- **Mascot**: `MascotDuck` floats in the bottom right with a subtle rotation/y-offset loop.
- **CTA Buttons**:
  - "Let's Play!" has a pulsing box-shadow animation.
  - Both buttons use `whileHover` and `whileTap` for tactile feedback.

### 3. Logic & UX
- **Dynamic Greeting**: Time-of-day based ("Good morning", etc.).
- **User Personalization**: Displays the username if logged in.
- **CTA Logic**:
  ```tsx
  onClick={() => {
    if (user) {
      navigate('/dashboard');
    } else {
      const element = document.getElementById('subjects-section');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }}
  ```
  - **Critique**: If a user is logged in, clicking "Let's Play!" takes them to the Dashboard (analytical), not the Math Hub (gamified). This breaks the "Play" metaphor.

## Animation & Interaction Gaps

1. **Entrance Sequence**:
   - Currently, everything fades in or bounces in somewhat independently.
   - **Opportunity**: A coordinated "hero entrance" where mountains rise, clouds drift in, and the mascot "jumps" into view would create much more energy on load.

2. **Mascot Engagement**:
   - The mascot is static in the corner.
   - **Opportunity**: The mascot could "point" towards the "Let's Play!" button or react when the user hovers over it.

3. **Background Depth**:
   - The mountains are flat SVG paths.
   - **Opportunity**: Adding subtle gradients or "shimmer" effects to the mountain peaks could enhance the premium feel.

4. **Floating Elements**:
   - `PlayfulFloatingElements` are present but their interaction with the parallax is minimal.
   - **Opportunity**: Bind floating element speed to the parallax layers to enhance the 3D depth effect.

## Code Snippet Critique

```tsx
// Current Parallax calculation
const parallaxOffset = scrollY * 0.5;
const scale = 1 - scrollY * 0.0005;
const opacity = Math.max(0, 1 - scrollY * 0.002);
```
*Suggestion*: Move this to `useTransform` to avoid React re-renders on every scroll pixel, which can cause the "flickering" reported by the user.

```tsx
// Mascot Placement
<div className="absolute bottom-4 -right-4 md:bottom-10 md:right-10 z-20 pointer-events-auto">
  <MascotDuck className="w-32 h-32 md:w-48 md:h-48 drop-shadow-xl scale-x-[-1]" delay={0.8} />
</div>
```
*Suggestion*: The mascot is flipped (`scale-x-[-1]`). We should ensure the SVG itself is oriented correctly or use a more descriptive prop.
