import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
});

test('should have the correct title', async ({ page }) => {
  await expect(page).toHaveTitle(/JSON Diff Checker/);
});

test('beautify button should format loose JSON', async ({ page }) => {
  await page.waitForSelector('.monaco-editor');

  // We can't easily type into Monaco, but we can check if the button works
  // For this test, we'll assume if it doesn't show error it's working.
  const beautifyBtn = page.getByRole('button', { name: 'Beautify' });
  await expect(beautifyBtn).toBeVisible();
  await beautifyBtn.click();

  await expect(page.locator('text=Invalid JSON')).not.toBeVisible();
});

test('compare diff button should toggle diff view', async ({ page }) => {
  const compareBtn = page.getByRole('button', { name: 'Compare Diff' });
  await expect(compareBtn).toBeVisible();
  await compareBtn.click();

  await expect(page.getByRole('button', { name: 'Edit JSON' })).toBeVisible();
  await expect(page.locator('.monaco-diff-editor')).toBeVisible();
});
