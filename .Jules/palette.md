# Palette's UX Journal

## 2024-05-23 - Focus State Visibility and ARIA Consistency
**Learning:** Icon-only buttons (like PIN toggles) and complex forms require explicit focus-visible rings and ARIA labels to ensure accessibility for keyboard and screen reader users. Simply relying on default focus styles can be insufficient in custom-styled glassmorphism or high-contrast themes.
**Action:** Always apply `focus-visible:ring-2` with context-aware colors to interactive elements and verify that every icon-only button has a descriptive `aria-label`.
