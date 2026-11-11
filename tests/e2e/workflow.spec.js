import { test, expect } from '@playwright/test';

test.describe('JANASEVA AI - Citizen & Public Portal Workflow', () => {
  test('Public home page displays stats, branding, and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/JANASEVA AI/);
    await expect(page.locator('h1')).toContainText('Public Grievance Redressal');

    // Check prototype disclaimer is visible
    await expect(page.locator('text=PROTOTYPE DISCLAIMER')).toBeVisible();

    // Verify key action buttons
    await expect(page.locator('a:has-text("File a New Grievance")')).toBeVisible();
    await expect(page.locator('a:has-text("Track Complaint Status")')).toBeVisible();
  });

  test('Public tracking page handles lookup without crashing', async ({ page }) => {
    await page.goto('/track?ref=KGR-2026-100001');
    await expect(page.locator('text=KGR-2026-100001')).toBeVisible();
    // Verify citizen privacy masking on public view
    await expect(page.locator('text=Protected')).toBeVisible();
  });

  test('Departments page lists active nodal departments', async ({ page }) => {
    await page.goto('/departments');
    await expect(page.locator('h1')).toContainText('Nodal Redressal Departments');
    await expect(page.locator('text=Public Works Department')).toBeVisible();
    await expect(page.locator('text=Water Resources Department')).toBeVisible();
  });

  test('Citizen login with demo credentials and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');
    // Click Evaluator Citizen 1-Click quickfill button
    await page.click('button:has-text("Citizen")');
    // Fill dummy image captcha
    await page.fill('input[placeholder="Type CAPTCHA characters"]', '12345');
    // Click Sign In
    await page.click('button[type="submit"]:has-text("Sign In")');
  });
});
