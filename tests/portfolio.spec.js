// @ts-check
const { test, expect } = require('@playwright/test');

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8080';

test.describe('Falltrades portfolio', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Falltrades/);
  });

  test('background is not blank white — CSS loaded', async ({ page }) => {
    const bg = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });

  test('hero heading is visible', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('terminal typewriter is present', async ({ page }) => {
    await expect(page.locator('#tw')).toBeAttached();
  });

  test('StellaSecret block has link', async ({ page }) => {
    await expect(page.locator('a[href="https://stellasecret.github.io"]')).toBeVisible();
  });

  test('cloud-example block links to GitHub', async ({ page }) => {
    await expect(page.locator('a[href*="cloud-example"]')).toBeVisible();
  });

  test('Engineering block links to /engineering/', async ({ page }) => {
    await expect(page.locator('a[href="/engineering/"]')).toBeVisible();
  });

  test('all external links have noopener', async ({ page }) => {
    const links = page.locator('a[target="_blank"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const rel = await links.nth(i).getAttribute('rel');
      expect(rel, `Link ${i} missing noopener`).toContain('noopener');
    }
  });

  test('theme toggle switches to light mode', async ({ page }) => {
    await page.locator('#themeToggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.locator('#themeToggle').click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme');
  });

  test('lang toggle switches between EN and FR', async ({ page }) => {
    const label = page.locator('#langLabel');
    const initial = await label.textContent();
    await page.locator('#langToggle').click();
    expect(await label.textContent()).not.toBe(initial);
    await page.locator('#langToggle').click();
    await expect(label).toHaveText(initial);
  });

  test('lang toggle updates hero heading', async ({ page }) => {
    const h1 = page.locator('h1');
    const before = await h1.textContent();
    await page.locator('#langToggle').click();
    expect(await h1.textContent()).not.toBe(before);
  });

  test('footer is visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });
});
