# Testing Infrastructure

**Status:** ✅ Complete  
**Date:** February 6, 2026  
**Commit:** 14560d0  
**Type:** Infrastructure - Testing

---

## Overview

Lumio previously had no automated tests. This milestone establishes a solid testing foundation using Vitest and React Testing Library to catch bugs, ensure features work correctly, and maintain code quality as the codebase grows.

---

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| vitest | 4.0.18 | Test runner with Vite integration |
| @vitest/ui | 4.0.18 | Visual test UI |
| @testing-library/react | 16.3.2 | React component testing |
| @testing-library/jest-dom | 6.9.1 | Custom DOM matchers |
| @testing-library/user-event | 14.6.1 | User interaction simulation |
| jsdom | 28.0.0 | Browser environment |
| msw | 2.12.9 | Mock Service Worker for API mocking |

---

## Configuration Files

### vitest.config.ts
- Globals enabled for test functions
- jsdom environment for browser simulation
- Coverage with v8 provider
- Path aliasing (@/ -> src/)

### src/test/setup.ts
- jest-dom matchers integration
- localStorage mock
- window.matchMedia mock
- Automatic cleanup after each test

### src/test/utils.tsx
- Custom render with providers:
  - BrowserRouter for routing
  - AuthProvider for auth context
- Re-exports from @testing-library/react

---

## Test Files Created

### Example Tests
1. **auth.test.tsx** - Authentication flow tests
2. **calculations.test.ts** - Calculation utility tests
3. **speedDrill.test.tsx** - Speed drill component tests

### Mock Data
- **mockData.ts** - Test data for user, sessions, and progress

### Supporting Code
- **calculations.ts** - Calculation utilities
  - `calculateAccuracy()` - Percentage of correct answers
  - `calculateStreak()` - Consecutive days streak
  - `calculateTotalTime()` - Sum of session times

---

## NPM Scripts

```bash
# Run tests in watch mode
bun test

# Run tests with UI
bun test:ui

# Run tests once (for CI)
bun test:run

# Run with coverage report
bun test:coverage

# Run in watch mode
bun test:watch
```

---

## Testing Priorities

1. **Critical User Flows** - auth, speed drill, progress saving
2. **Core Calculations** - scoring, streak, accuracy
3. **UI Components** - buttons, cards, forms
4. **Integration** - API calls, data persistence
5. **E2E** - full user journeys

---

## Coverage Goals

| Category | Target |
|----------|--------|
| Critical paths | 90%+ |
| UI components | 70%+ |
| Utilities | 95%+ |
| Overall | 80%+ |

---

## Testing Best Practices

### DO:
- Test user behavior, not implementation
- Use accessible queries (getByRole, getByLabelText)
- Test edge cases (0, negative, very large numbers)
- Mock external dependencies
- Keep tests simple and focused
- Use descriptive test names

### DON'T:
- Test internal state directly
- Use getByClassName or CSS selectors
- Create brittle tests
- Test third-party libraries
- Have tests depend on each other

---

## Directory Structure

```
src/
├── __tests__/
│   ├── auth.test.tsx
│   ├── calculations.test.ts
│   └── speedDrill.test.tsx
├── test/
│   ├── setup.ts
│   ├── utils.tsx
│   ├── mockData.ts
│   └── jest-dom.d.ts
└── lib/
    └── calculations.ts
```

---

## Success Criteria

✅ All dependencies installed  
✅ Vitest configured and running  
✅ Example tests created and passing  
✅ Mock utilities in place  
✅ NPM scripts added  
✅ Coverage reporting enabled  
✅ Ready for CI/CD integration  

---

## Next Steps

- Write tests for critical user flows
- Add component tests for UI elements
- Achieve 80%+ coverage
- Integrate with CI/CD pipeline
- Document testing patterns for team

---

**Testing infrastructure COMPLETE!** Ready to catch bugs and ensure quality! 🧪✅
