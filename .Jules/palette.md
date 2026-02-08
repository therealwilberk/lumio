## 2025-05-15 - [Form Validation Feedback]
**Learning:** In gamified apps for younger users (like Grade 6), a disabled submit button without immediate visual explanation of the requirements can lead to frustration and perceived "brokenness". Providing a real-time checklist for field requirements (like PIN length and character type) significantly improves the onboarding experience.
**Action:** Always pair disabled submit buttons with clear, dynamic requirement checklists for complex inputs (PINs, passwords, usernames).

## 2025-05-15 - [Accessibility for Math Inputs]
**Learning:** Numeric inputs in educational games often rely on visual context (brackets, brackets, layout) that screen readers cannot easily interpret. Adding explicit `aria-label` attributes like "Your answer" ensures that the task is clear to students using assistive technologies.
**Action:** Use `aria-label` on all task-related inputs, even if they have placeholders, to provide clear instruction for screen reader users.
