# Hero Spline Overhaul

**Version:** v1.2.0
**Created:** 2026-02-07
**Status:** ✅ Completed

---

## Summary

- Updated `Hero.tsx` to feature a new Spline-powered 3D hero scene that responds to hover/click.
- Switched hero layout to a responsive overlay on top of a full-bleed Spline background.
- Kept existing greeting, time-based messaging, and CTA flows while visually integrating the Lumio robot hero.

## Implementation Notes

- **Spline Integration**
  - Using `@splinetool/react-spline` (already installed in `package.json`).
  - Scene URL: `https://prod.spline.design/klTLt6ZkUI5HCFwO/scene.splinecode`.
  - Wrapped in a responsive container with `aspect-[4/3]` on small screens and `aspect-[16/10]` on medium+.

- **Layout & Responsiveness**
  - Spline now fills the entire hero area as the visual foreground, with a subtle gradient overlay for text readability.
  - Desktop: text is left-aligned in an overlay column; the rest of the hero is interactive Spline space.
  - Mobile: text and CTAs remain centered while Spline runs full-screen behind them.

- **Styling & Background**
  - Removed previous background beams, sparkles, floating elements, mascot duck, and scroll indicator.
  - Added dark gradient overlays and stronger text/button drop-shadows to preserve readability over the Spline scene.

- **Interactivity**
  - Adjusted pointer-events so that the hero overlay does not block Spline mouse tracking.
  - Buttons and key UI elements remain clickable while the rest of the hero surface is available to the Spline runtime.

- **Mobile Composition**
  - Added a responsive wrapper around the Spline canvas to slightly scale and shift the scene on small screens.
  - Ensures the Lumio robot is fully visible on Android/phone viewports instead of being cropped at the top or bottom.

## Next Steps

- Run `bun run dev` and visually QA hero on:
  - Small mobile viewport
  - Tablet (landscape)
  - Desktop wide
- Confirm performance and interaction feel for the Spline scene.
