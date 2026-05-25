import { test, expect } from '@playwright/test';

test('User Login Test', async ({ page }) => {

  await page.goto('http://localhost:5173/login');

  await page.fill('input[type="email"]', 'ankit@gmail.com');

  await page.fill('input[type="password"]', '654321');

  await page.click('button[type="submit"]');

  await page.waitForTimeout(2000);

  await expect(page).toHaveURL(/dashboard|home/i);

});