## 2025-05-14 - [A11y: Descriptive Icon-Only Buttons]
**Learning:** Adding ARIA labels to icon-only buttons (like PIN toggles or theme switches) can cause test regressions if existing tests use broad case-insensitive regex (e.g., `/pin/i`) to find elements.
**Action:** Use strict regex (e.g., `/^pin$/i`) when selecting form inputs in tests to avoid ambiguity with newly added accessibility labels for surrounding interactive elements.
