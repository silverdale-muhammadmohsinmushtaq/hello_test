/**
 * FIXED EXAMPLE: Correct Odoo Login Pattern
 * 
 * This shows the CORRECT way to handle Odoo login and waiting
 * Key fixes:
 * 1. Use domcontentloaded + waitForTimeout instead of networkidle
 * 2. Wait for specific elements after login
 * 3. Add proper timeouts for Odoo stabilization
 */

const { test, expect } = require('@playwright/test');

const SERVER_URL = 'https://your-odoo-server.com';
const USERNAME = 'admin';
const PASSWORD = 'admin';

test.describe('Fixed Odoo Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // ✅ CORRECT: Use domcontentloaded + timeout instead of networkidle
    await page.goto(SERVER_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Wait for Odoo to initialize
    
    // Login
    await page.locator('input[name="login"]').fill(USERNAME);
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: 'Log in' }).click();
    
    // ✅ CORRECT: Wait for specific element that appears after login
    // Don't use networkidle - it times out in Odoo
    await page.waitForSelector('.o_main_navbar, .o_menu_apps', { timeout: 30000 });
    await page.waitForTimeout(2000); // Extra wait for Odoo to stabilize
  });

  test('Example: Navigate and interact', async ({ page }) => {
    // ✅ CORRECT: Use domcontentloaded + timeout for menu navigation
    await page.getByRole('menuitem', { name: 'Sales' }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    
    await page.getByRole('menuitem', { name: 'Products' }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    
    // ✅ CORRECT: Wait for form view before interacting
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForSelector('.o_form_view', { timeout: 30000 });
    await page.waitForTimeout(1000);
    
    // Fill form
    await page.waitForSelector('input[name="name"]', { state: 'visible', timeout: 30000 });
    await page.locator('input[name="name"]').fill('Test Product');
    
    // ✅ CORRECT: Wait for loading to finish after Save
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('.o_loading', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000); // Wait for notification
    
    // Verify
    await expect(page.locator('.o_notification')).toBeVisible({ timeout: 10000 });
  });
});

/**
 * COMPARISON: Wrong vs Right
 * 
 * ❌ WRONG (causes timeouts):
 * await page.goto(SERVER_URL);
 * await page.waitForLoadState('networkidle'); // Times out!
 * 
 * await page.getByRole('button', { name: 'Log in' }).click();
 * await page.waitForLoadState('networkidle'); // Times out!
 * 
 * ✅ CORRECT (works reliably):
 * await page.goto(SERVER_URL);
 * await page.waitForLoadState('domcontentloaded');
 * await page.waitForTimeout(2000);
 * 
 * await page.getByRole('button', { name: 'Log in' }).click();
 * await page.waitForSelector('.o_main_navbar', { timeout: 30000 });
 * await page.waitForTimeout(2000);
 */
