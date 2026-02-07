# UI Audit Overview - Lumio

## UI Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS (Utility-first)
- **Animations**: Framer Motion (High-energy, bouncy physics)
- **Components**: shadcn/ui (Modern, accessible base components)
- **Icons**: Lucide React
- **Themes**: Dark Mode supported via `ThemeProvider` and Tailwind `dark:` classes.

## Core UI Components
- **Navbar**: Floating glassmorphic design, centered on desktop. Uses `AnimatePresence` for mobile menu.
- **Hero**: Parallax mountains, drifting clouds, and animated greeting.
- **MascotDuck**: Simple SVG-based mascot with bouncy idle animation.
- **BouncyText**: Spring-based character/word reveals.
- **FloatingElements**: Decorative math symbols/shapes for background texture.

## Main Pages & Layouts
- **Home**: Landing page with Hero and Subjects sections.
- **Math Hub**: Central navigation for math topics with progress-based unlock logic.
- **Speed Drill**: Time-pressured practice mode with a focus on speed and accuracy.
- **Dashboard**: Analytical view of progress, streaks, and achievements.
- **Auth**: Playful login/signup screens with mascot integration.

## Framer Motion Usage
- Pervasive use of `motion.div`, `AnimatePresence`, and spring transitions.
- Key variants: `BouncyText`, `PageTransition`, and `AnimatedButton`.
- Mascot uses repeating `animate` loops for lifelike feel.

## Hero Component Location
- `src/components/layout/Hero.tsx`
- Integrated into `src/pages/HomePage.tsx`

## Audit Files
- `00-overview.md`: Summary of UI stack and structure.
- `01-priority-issues.md`: Ranked list of improvements (Revised).
- `02-hero-specific.md`: Deep dive into Hero animations and parallax.
- `03-deep-dive-learning.md`: Deep dive into the educational interface and game loop.
