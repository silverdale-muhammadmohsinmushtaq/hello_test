/**
 * Example Playwright Test for Odoo
 * Demonstrates stable selector strategies and best practices
 */

const { test, expect } = require('@playwright/test');
const { OdooHelpers } = require('./playwright-helpers');

test.describe('Odoo Task Automation Example', () => {
  let odoo;
  let page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    odoo = new OdooHelpers(page);
    
    // Login
    const serverUrl = process.env.ODOO_SERVER_URL || 'https://your-odoo-server.com';
    const username = process.env.ODOO_USERNAME || 'admin';
    const password = process.env.ODOO_PASSWORD || 'admin';
    
    await odoo.login(username, password, serverUrl);
  });

  test('Example: Create and verify record', async () => {
    // Navigate to menu
    await odoo.navigateToMenu(['Sales', 'Products', 'Products']);
    
    // Create new record
    await odoo.createNew();
    
    // Fill form fields with multiple selector strategies
    await odoo.fillFormField('name', 'Test Product');
    await odoo.fillFormField('list_price', '100.00');
    
    // Save
    await odoo.saveForm();
    
    // Verify success message or record creation
    await expect(page.locator('.o_notification')).toBeVisible({ timeout: 10000 });
  });

  test('Example: Using StableElementFinder directly', async () => {
    const { StableElementFinder } = require('./playwright-helpers');
    const finder = new StableElementFinder(page);
    
    // Example: Find element with multiple selector strategies
    const button = await finder.clickElement(
      {
        // Try these selectors in order:
        testId: 'save-button',           // 1. data-testid (most stable)
        role: 'button',                  // 2. Role-based
        text: 'Save',                    // 3. Text content
        css: 'button.btn-primary',        // 4. CSS selector
        xpath: '//button[contains(@class, "btn-primary")]' // 5. XPath (last resort)
      },
      {
        description: 'Save button',
        timeout: 10000,
        retries: 3
      }
    );
    
    expect(button).toBeTruthy();
  });
});
