import { test, expect } from '@playwright/test';

test.describe('Warp Logger', () => {
  test('should render the logger interface on /logger', async ({ page }) => {
    await page.goto('/logger');

    // Branding and Layout
    await expect(page.locator('h1').filter({ hasText: /Warp Logger/i })).toBeVisible();
    await expect(page.locator('text=Video Signal Input')).toBeVisible();
    await expect(page.locator('text=Timeline')).toBeVisible();
    await expect(page.locator('text=Tag Schema')).toBeVisible();
    await expect(page.locator('text=Event Manifest')).toBeVisible();

    // Check high contrast minimalist palette partially by checking presence of classes
    // and styles if possible, but mainly testing structural elements are visible.
    const body = page.locator('div.min-h-screen');
    await expect(body).toHaveClass(/bg-black/);
    await expect(body).toHaveClass(/text-white/);
  });

  test('should toggle play/pause via button and spacebar', async ({ page }) => {
    await page.goto('/logger');

    // Default state: Paused
    await expect(page.locator('text=STANDBY')).toBeVisible();
    const playButton = page.locator('button', { hasText: 'Play (Space)' });
    await expect(playButton).toBeVisible();

    // Click to Play
    await playButton.click();
    await expect(page.locator('text=LIVE')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Pause (Space)' })).toBeVisible();

    // Spacebar to Pause
    await page.keyboard.press('Space');
    await expect(page.locator('text=STANDBY')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Play (Space)' })).toBeVisible();
  });

  test('should log events via keyboard shortcuts', async ({ page }) => {
    await page.goto('/logger');

    // Click on the body to ensure window has focus
    await page.locator('body').click();

    // Press '1' for Play Action
    await page.keyboard.press('1');
    await expect(page.locator('.uppercase.font-sans', { hasText: 'Play Action' }).first()).toBeVisible();

    // Press '3' for Goal
    await page.keyboard.press('3');
    await expect(page.locator('.uppercase.font-sans', { hasText: 'Goal' }).first()).toBeVisible();

    // Check event manifest count (Header usually has something like "Event Manifest 2")
    const manifestHeader = page.locator('h2', { hasText: 'Event Manifest' });
    await expect(manifestHeader.locator('span').nth(1)).toHaveText('2 LOGS');
  });

  test('should trigger CSV download', async ({ page }) => {
    await page.goto('/logger');

    // Log an event
    await page.keyboard.press('1');

    // Intercept download
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button', { hasText: 'Export CSV' }).click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('warp_logger_events.csv');
  });
});
