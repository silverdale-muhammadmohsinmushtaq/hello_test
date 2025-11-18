# Odoo Playwright Automation Framework

## Overview

This framework provides stable, reliable Playwright automation for Odoo UAT and QA testing. It solves the common problem of flaky tests caused by incorrect selectors by implementing a multi-strategy selector approach with automatic fallbacks.

## Key Features

✅ **Multi-Strategy Selectors** - Automatically tries multiple selector strategies  
✅ **Automatic Retries** - Handles temporary failures  
✅ **Odoo-Specific Helpers** - Built-in support for Odoo forms, menus, and fields  
✅ **Stable Element Finding** - Waits for elements to be ready and stable  
✅ **Human-Independent** - No technical knowledge required to run tests  
✅ **Self-Healing** - Automatically tries alternative selectors  

## Installation

```bash
npm install
npx playwright install
```

## Usage

### Basic Test Structure

```javascript
const { test } = require('@playwright/test');
const { OdooHelpers } = require('./playwright-helpers');

test('My test', async ({ page }) => {
  const odoo = new OdooHelpers(page);
  
  // Login
  await odoo.login('username', 'password', 'https://odoo-server.com');
  
  // Navigate
  await odoo.navigateToMenu(['Sales', 'Products']);
  
  // Interact
  await odoo.createNew();
  await odoo.fillFormField('name', 'Test Product');
  await odoo.saveForm();
});
```

### Using StableElementFinder Directly

```javascript
const { StableElementFinder } = require('./playwright-helpers');

const finder = new StableElementFinder(page);

// Find element with multiple selector strategies
await finder.clickElement({
  testId: 'save-button',      // Most stable
  role: 'button',             // Role-based
  text: 'Save',               // Text-based
  css: 'button.btn-primary'   // CSS fallback
}, {
  description: 'Save button',
  timeout: 10000,
  retries: 3
});
```

## Environment Variables

Set these in your environment or `.env` file:

```bash
ODOO_SERVER_URL=https://your-odoo-server.com
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
```

## Running Tests

```bash
# Run all tests
npm test

# Run in headed mode (see browser)
npm run test:headed

# Debug mode (step through tests)
npm run test:debug

# UI mode (interactive)
npm run test:ui
```

## How It Solves Selector Problems

### Problem: Single Selector Fails
**Before:**
```javascript
await page.click('button.btn-primary'); // Breaks if CSS changes
```

**After:**
```javascript
await finder.clickElement({
  testId: 'save-button',
  role: 'button',
  text: 'Save',
  css: 'button.btn-primary'
}); // Tries all strategies automatically
```

### Problem: Element Not Ready
**Before:**
```javascript
await page.click('button'); // Fails if page still loading
```

**After:**
```javascript
await odoo.waitForFormReady(); // Waits for Odoo to be ready
await finder.clickElement({ ... }); // Then interacts
```

### Problem: Flaky Tests
**Before:**
```javascript
// No retry logic - fails on temporary delays
await page.click('button');
```

**After:**
```javascript
// Automatic retries with delays
await finder.clickElement({ ... }, { retries: 3 });
```

## File Structure

```
.
├── playwright-helpers.js      # Core helper classes
├── playwright.config.js        # Playwright configuration
├── example-test.spec.js       # Example test
├── SELECTOR_BEST_PRACTICES.md # Detailed best practices
└── tests/                     # Your test files go here
```

## For BPS Team (Non-Technical Users)

### Running Tests

1. Open terminal in project folder
2. Run: `npm run test:headed`
3. Watch the browser - tests run automatically
4. Check results in terminal

### No Technical Knowledge Needed

- Tests automatically find elements using multiple strategies
- Tests automatically retry on failures
- Tests wait for pages to be ready
- Clear error messages if something fails

### If Test Fails

1. Check the error message - it tells you what element couldn't be found
2. Run in headed mode to see what's happening
3. Screenshots are saved automatically on failure
4. Contact technical team with error message and screenshot

## Best Practices

See `SELECTOR_BEST_PRACTICES.md` for detailed guidelines on:
- Selector priority order
- Waiting strategies
- Retry logic
- Odoo-specific considerations
- Common pitfalls to avoid

## Troubleshooting

### Test fails with "element not found"
- Check if element exists in browser DevTools
- Verify selector strategies in test
- Run in headed mode to see what's happening
- Check if page loaded completely

### Test is flaky (sometimes passes, sometimes fails)
- Increase timeout values
- Add more selector strategies
- Increase retry count
- Add explicit waits

### Element found but not clickable
- Element might be hidden or covered
- Use `scrollIntoViewIfNeeded()` (built into helpers)
- Check if element is in iframe
- Verify element is actually visible

## Support

For issues or questions:
1. Check `SELECTOR_BEST_PRACTICES.md`
2. Review example test in `example-test.spec.js`
3. Run tests in debug mode: `npm run test:debug`
