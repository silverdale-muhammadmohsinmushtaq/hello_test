/**
 * CORRECT APPROACH: Simple, Direct Playwright Code
 * 
 * This example shows the RIGHT way to write Playwright scripts for Odoo.
 * Key principles:
 * 1. Use browser feature to inspect elements
 * 2. Use name attributes for form fields
 * 3. Use getByRole() for buttons/links
 * 4. Always wait for page loads
 * 5. Keep it simple - no complex abstractions
 */

const { test, expect } = require('@playwright/test');

test('Example: Create Product (Correct Approach)', async ({ page }) => {
  // STEP 1: Navigate and login
  // Use browser feature to inspect login form, find name attributes
  await page.goto('https://odoo-server.com');
  await page.waitForLoadState('networkidle'); // Always wait after navigation
  
  // Login form fields - use name attributes (most reliable)
  await page.locator('input[name="login"]').fill('admin');
  await page.locator('input[name="password"]').fill('admin');
  
  // Login button - use getByRole (more reliable than CSS)
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForLoadState('networkidle'); // Wait for login to complete
  
  // STEP 2: Navigate to target page
  // Use browser feature to inspect menu, use getByRole for menu items
  await page.getByRole('menuitem', { name: 'Sales' }).click();
  await page.waitForLoadState('networkidle');
  
  await page.getByRole('menuitem', { name: 'Products' }).click();
  await page.waitForLoadState('networkidle');
  
  // STEP 3: Create new record
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForLoadState('networkidle');
  
  // STEP 4: Fill form fields
  // Use browser feature to inspect form, find name attributes
  await page.locator('input[name="name"]').fill('Test Product');
  await page.locator('input[name="list_price"]').fill('100.00');
  
  // For many2one fields (dropdowns), might need special handling
  // Use browser feature to see how Odoo renders it
  // Usually: click field, type, wait for dropdown, select option
  await page.locator('input[name="categ_id"]').click();
  await page.locator('input[name="categ_id"]').fill('All');
  await page.waitForTimeout(500); // Wait for dropdown
  await page.getByRole('option', { name: 'All / Saleable' }).click();
  
  // STEP 5: Save
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Extra wait for Odoo notification
  
  // STEP 6: Verify success
  await expect(page.locator('.o_notification')).toBeVisible();
});

test('Example: Edit Record (Correct Approach)', async ({ page }) => {
  // Login (same as above)
  await page.goto('https://odoo-server.com');
  await page.waitForLoadState('networkidle');
  await page.locator('input[name="login"]').fill('admin');
  await page.locator('input[name="password"]').fill('admin');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForLoadState('networkidle');
  
  // Navigate
  await page.getByRole('menuitem', { name: 'Sales' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('menuitem', { name: 'Products' }).click();
  await page.waitForLoadState('networkidle');
  
  // Click on first product in list
  // Use browser feature to inspect list structure
  // Usually: first row, click on name link
  await page.locator('tbody tr').first().locator('td').first().click();
  await page.waitForLoadState('networkidle');
  
  // Edit field
  await page.locator('input[name="list_price"]').clear();
  await page.locator('input[name="list_price"]').fill('150.00');
  
  // Save
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Verify
  await expect(page.locator('.o_notification')).toContainText('saved');
});

/**
 * KEY DIFFERENCES FROM WRONG APPROACH:
 * 
 * ❌ WRONG:
 * - await page.locator('.btn-primary').click(); // CSS class - breaks when styles change
 * - await page.locator('//button[@class="btn"]').click(); // XPath - fragile
 * - await page.click('button'); // Too generic, might click wrong button
 * - No waits after navigation
 * 
 * ✅ CORRECT:
 * - await page.getByRole('button', { name: 'Save' }).click(); // Role + text - stable
 * - await page.locator('input[name="field"]').fill('value'); // Name attribute - stable
 * - await page.waitForLoadState('networkidle'); // Always wait after navigation
 * - await page.waitForSelector('selector', { state: 'visible' }); // Wait before interaction
 */
