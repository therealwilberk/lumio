## 2025-05-15 - [Accessibility Polish for Icon-Only Buttons]
**Learning:** Icon-only buttons (like password visibility toggles or game controls) are completely opaque to screen readers without explicit `aria-label` attributes. In educational apps for kids, providing this context is crucial for inclusivity.
**Action:** Always check for icon-only buttons and add dynamic `aria-label` attributes (e.g., "Show/Hide PIN") to communicate state and purpose.

## 2025-05-15 - [Testing Ambiguity with ARIA Labels]
**Learning:** Adding `aria-label` to buttons can cause existing tests that use broad regex (e.g., `/pin/i`) to fail if the new label also matches the regex, leading to "multiple elements found" errors.
**Action:** Use strict regex (e.g., $/^pin$/i`) in tests when selecting elements by label to avoid accidental matches with nearby buttons or helper text.

## 2025-05-15 - [Educational Context in ARIA Labels]
**Learning:** For interactive educational elements (like a math answer input), a generic placeholder like "?" is insufficient. A dynamic `aria-label` that restates the problem provides much-needed context for screen reader users.
**Action:** Use dynamic labels like `aria-label={"Answer for " + question}` for primary task inputs in learning modules.
