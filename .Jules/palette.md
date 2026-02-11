## 2025-02-12 - [Accessibility: Icon-only buttons and matching labels]
**Learning:** Adding `aria-label` to icon-only buttons (like PIN visibility toggles) can make `getByLabelText` queries in tests ambiguous if they share keywords with the main input label.
**Action:** Use strict regex matchers like `/^pin$/i` in tests to distinguish between the input and its associated utility buttons.

## 2025-02-12 - [Vitest and Playwright conflicts]
**Learning:** Vitest may attempt to run Playwright `.spec.ts` files if not explicitly excluded, leading to module resolution errors for `@playwright/test`.
**Action:** Always ensure `**/*.spec.ts` is in the `exclude` list of `vitest.config.ts`.
