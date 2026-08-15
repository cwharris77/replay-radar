import { expect, test } from '@playwright/test';

test.describe('Trends page', () => {
  test('redirects unauthenticated visitors to login', async ({ page }) => {
    await page.goto('/trends');

    await expect(page).toHaveURL(/\/login\?callbackUrl=.*%2Ftrends$/);
    await expect(page.getByRole('heading', { name: 'Replay Radar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue with Spotify' })).toBeVisible();
  });
});
