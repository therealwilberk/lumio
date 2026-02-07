# Hero Spline Overhaul

**Version:** v1.0.0
**Created:** 2026-02-07
**Status:** ✅ Completed

---

## Summary

- Updated `Hero.tsx` to feature a new Spline-powered 3D hero scene that responds to hover/click.
- Switched hero layout to a responsive two-column design on desktop and stacked layout on mobile.
- Kept existing greeting, time-based messaging, and CTA flows while visually integrating the Lumio robot hero.

## Implementation Notes

- **Spline Integration**
  - Using `@splinetool/react-spline` (already installed in `package.json`).
  - Scene URL: `https://prod.spline.design/klTLt6ZkUI5HCFwO/scene.splinecode`.
  - Wrapped in a responsive container with `aspect-[4/3]` on small screens and `aspect-[16/10]` on medium+.

- **Layout & Responsiveness**
  - Desktop: text on the left, Spline canvas on the right (`md:flex-row`).
  - Mobile: Spline sits above the text (`flex-col-reverse`).
  - Buttons remain primary CTA for starting math play and checking progress.

- **Styling & Background**
  - Preserved background beams, sparkles, and playful floating elements for continuity.
  - Kept mascot duck in the bottom-right corner.

## Next Steps

- Run `bun run dev` and visually QA hero on:
  - Small mobile viewport
  - Tablet (landscape)
  - Desktop wide
- Confirm performance and interaction feel for the Spline scene.
