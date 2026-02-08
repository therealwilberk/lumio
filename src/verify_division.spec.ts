import { test, expect } from '@playwright/test';

test('verify division page and locked state', async ({ page }) => {
  // 1. Sign up
  await page.goto('http://localhost:3000/signup');
  const username = `testuser_${Date.now()}`;
  await page.fill('input[placeholder="Enter your username"]', username);
  await page.fill('input[placeholder="Enter your email"]', `${username}@example.com`);
  await page.fill('input[placeholder="Create a password"]', 'Password123!');
  await page.click('button:has-text("Create Account")');

  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard');

  // 2. Go to Math Hub and check locked state
  await page.goto('http://localhost:3000/math');
  await page.waitForSelector('text=Division');

  // Check if Division is locked
  const divisionCard = page.locator('div:has-text("Division")').last();
  await expect(divisionCard).toContainText('Locked');
  await page.screenshot({ path: 'verification/math_hub_division_locked.png', fullPage: true });

  // 3. Navigate directly to Division Page (bypass lock for testing)
  await page.goto('http://localhost:3000/math/division');
  await page.waitForSelector('h1:has-text("Division!")');

  // Take screenshot of initial state (Easy level)
  await page.screenshot({ path: 'verification/division_easy_initial.png', fullPage: true });

  // 4. Switch to Hard level for multi-digit division
  await page.click('button:has-text("Oak")');
  await page.waitForTimeout(500); // Wait for problem generation
  await page.screenshot({ path: 'verification/division_hard_multi_digit.png', fullPage: true });

  // 5. Try a wrong answer to see hint
  await page.fill('input[placeholder="?"]', '9');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  await page.fill('input[placeholder="?"]', '8'); // Second wrong
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  // Hint should be visible
  await expect(page.locator('text=Estimation:')).toBeVisible();
  await page.screenshot({ path: 'verification/division_hint_visible.png', fullPage: true });
});
