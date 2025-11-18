/**
 * Example Odoo Test Script Template
 * 
 * This is a template showing how to use the Playwright utilities
 * for Odoo testing. Replace with your actual test scenarios.
 */

const { test, expect } = require('@playwright/test');
const { PlaywrightUtils } = require('../playwright-utils');

test.describe('Odoo UAT Test', () => {
  let utils;
  let page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    utils = new PlaywrightUtils(page, 'odoo-uat-test');
  });

  test.afterEach(async () => {
    // Save element storage after each test
    await utils.saveElementStorage({ format: 'both' });
    utils.clearStorage();
  });

  test('Example: Login and perform task', async () => {
    // Configuration
    const ODOO_URL = process.env.ODOO_URL || 'https://your-odoo-server.com';
    const ODOO_USER = process.env.ODOO_USER || 'admin';
    const ODOO_PASSWORD = process.env.ODOO_PASSWORD || 'admin';
    const ODOO_DATABASE = process.env.ODOO_DATABASE || null;

    // Step 1: Login
    await utils.odooHelpers.login(ODOO_URL, ODOO_USER, ODOO_PASSWORD, {
      database: ODOO_DATABASE,
    });

    // Step 2: Navigate to menu (example)
    // await utils.odooHelpers.navigateToMenu('Sales > Orders');

    // Step 3: Wait for form to load
    // await utils.odooHelpers.waitForFormLoad();

    // Step 4: Fill form fields (example)
    // await utils.odooHelpers.fillFormField('Customer', 'Test Customer');
    // await utils.odooHelpers.fillFormField('Product', 'Test Product');

    // Step 5: Click button (example)
    // await utils.odooHelpers.clickButton('Save');

    // Step 6: Verify notification (example)
    // const notification = await utils.odooHelpers.waitForNotification('success');
    // expect(notification).toContain('success');

    // Example of using element helpers directly
    // await utils.elementHelpers.click({
    //   text: 'Create',
    //   role: 'button',
    // });

    // Example of using selector strategy directly
    // const locator = await utils.selectorStrategy.findElementWithRetry({
    //   text: 'Some Element',
    //   role: 'button',
    // });
    // await locator.click();

    // Add your test assertions here
    expect(page.url()).not.toContain('/web/login');
  });
});
