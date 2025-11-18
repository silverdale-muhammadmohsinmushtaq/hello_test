# Robust Playwright Framework for Odoo UAT/QA Automation

## Problem Statement

The original Playwright scripts were failing frequently due to:
- **Wrong selectors** being used
- **Elements not being found** reliably
- **Difficulty for non-technical BPS team** to maintain

## Solution Overview

This framework provides a **human-independent**, robust automation solution with:

1. **Multi-Strategy Selector System**: Automatically tries multiple selector strategies with fallbacks
2. **Intelligent Element Finding**: Uses data-testid → role → text → CSS → XPath priority
3. **Automatic Retries**: Built-in retry logic for all element interactions
4. **HTML Element Storage**: Tracks all interacted elements for debugging
5. **Odoo-Specific Helpers**: Pre-built utilities for common Odoo operations
6. **Stable Interactions**: Proper waits, scrolls, and validation

## Key Features

### 1. Selector Strategy (`selector-strategy.js`)

- **Priority-based selection**: Tries most reliable selectors first
- **Automatic fallbacks**: If one strategy fails, tries the next
- **Element validation**: Verifies elements are visible and interactable
- **Retry mechanism**: Automatically retries with exponential backoff

### 2. Element Helpers (`element-helpers.js`)

- **Robust interactions**: Click, fill, select with proper waits
- **Automatic scrolling**: Scrolls elements into view before interaction
- **State validation**: Checks if elements are enabled/visible
- **Error handling**: Clear error messages when actions fail

### 3. HTML Storage (`html-storage.js`)

- **Automatic tracking**: Stores HTML of all interacted elements
- **Debugging reports**: Generates HTML reports showing all interactions
- **Timestamp tracking**: Records when each interaction occurred
- **Selector logging**: Logs which selectors were used

### 4. Odoo Helpers (`odoo-helpers.js`)

- **Login automation**: Handles Odoo login with database selection
- **Menu navigation**: Navigate through Odoo menus easily
- **Form interactions**: Fill Odoo forms with smart field finding
- **Notification handling**: Wait for and verify Odoo notifications

## Installation

```bash
npm install
```

## Quick Start

### 1. Configure Environment

Copy `.env.example` to `.env` and fill in your Odoo details:

```env
ODOO_URL=https://your-odoo-server.com
ODOO_USER=admin
ODOO_PASSWORD=admin
ODOO_DATABASE=your_database
```

### 2. Create a Test

Use the template in `tests/example-odoo-test.spec.js` or create your own:

```javascript
const { test, expect } = require('@playwright/test');
const { PlaywrightUtils } = require('../playwright-utils');

test('My Odoo Test', async ({ page }) => {
  const utils = new PlaywrightUtils(page, 'my-test');
  
  // Login
  await utils.odooHelpers.login(
    process.env.ODOO_URL,
    process.env.ODOO_USER,
    process.env.ODOO_PASSWORD
  );
  
  // Your test steps here
  await utils.odooHelpers.navigateToMenu('Sales > Orders');
  await utils.odooHelpers.fillFormField('Customer', 'Test Customer');
  await utils.odooHelpers.clickButton('Save');
  
  // Save element storage
  await utils.saveElementStorage();
});
```

### 3. Run Tests

```bash
# Run in headed mode (see browser)
npm run test:headed

# Run specific test
npx playwright test tests/your-test.spec.js --headed

# Debug mode
npm run test:debug
```

## Selector Strategy Priority

The framework tries selectors in this order:

1. **data-testid** - Most reliable, if available
2. **Role + Name** - ARIA role with accessible name
3. **Text Content** - Visible text on the page
4. **Label** - Form field labels
5. **Placeholder** - Input placeholders
6. **CSS Selector** - Traditional CSS selectors
7. **XPath** - Last resort

## Usage Examples

### Finding and Clicking Elements

```javascript
// Multiple strategies - framework tries all until one works
await utils.elementHelpers.click({
  testId: 'save-button',           // Try first
  role: 'button',                   // Fallback 1
  text: 'Save',                     // Fallback 2
  css: 'button.btn-primary',        // Fallback 3
});
```

### Filling Form Fields

```javascript
// Smart field finding
await utils.elementHelpers.fill({
  label: 'Customer Name',           // Try label first
  placeholder: 'Enter customer',    // Fallback to placeholder
  css: 'input[name="customer"]',    // Fallback to CSS
}, 'John Doe');
```

### Odoo-Specific Operations

```javascript
// Login
await utils.odooHelpers.login(url, user, password, {
  database: 'my_database'
});

// Navigate menu
await utils.odooHelpers.navigateToMenu('Sales > Orders > Quotations');

// Fill Odoo form field
await utils.odooHelpers.fillFormField('Customer', 'Test Corp');

// Click Odoo button
await utils.odooHelpers.clickButton('Save');

// Wait for notification
const notification = await utils.odooHelpers.waitForNotification('Record saved');
```

## Element Storage

All interacted elements are automatically stored:

```javascript
// Automatically stored during interactions
await utils.elementHelpers.click({ text: 'Save' });

// Save to files
await utils.saveElementStorage({ format: 'both' }); // Saves JSON and HTML

// View in: element-storage/ folder
```

## Best Practices

1. **Always use ElementHelpers**: Don't use `page.locator()` directly
2. **Provide multiple selector options**: Give framework options to try
3. **Use OdooHelpers for Odoo operations**: Pre-built, tested methods
4. **Save element storage**: Helps debug when tests fail
5. **Run in headed mode first**: See what's happening
6. **Review HTML reports**: Understand what elements were found

## Troubleshooting

### Elements Not Found

1. Check element storage HTML report
2. Verify element exists on page
3. Check if timing is the issue (framework handles this)
4. Try providing more selector options

### Tests Fail Intermittently

1. Framework includes retries - check retry count
2. Increase timeouts if needed
3. Check network conditions
4. Verify Odoo server stability

### Selectors Keep Changing

The framework handles this automatically with multiple fallback strategies. If still failing:
1. Use more generic selectors (text, role)
2. Avoid CSS selectors that depend on DOM structure
3. Consider adding data-testid attributes to Odoo

## Configuration

Edit `playwright.config.js` to adjust:
- Timeouts
- Retry counts
- Browser settings
- Screenshot/video options

## File Structure

```
workspace/
├── playwright-utils/          # Framework core
│   ├── selector-strategy.js   # Smart element finding
│   ├── element-helpers.js     # Element interactions
│   ├── html-storage.js        # Element tracking
│   ├── odoo-helpers.js        # Odoo utilities
│   └── index.js               # Main export
├── tests/                      # Test files
│   └── example-odoo-test.spec.js
├── element-storage/            # Generated reports
├── playwright.config.js        # Configuration
├── package.json                # Dependencies
├── BPS_TEAM_GUIDE.md          # BPS team guide
└── QA_ASSISTANT_PROMPT.md     # Prompt template
```

## For BPS Team

See `BPS_TEAM_GUIDE.md` for a non-technical guide on using this framework.

## For QA Assistant (Cursor)

See `QA_ASSISTANT_PROMPT.md` for the prompt template to use when creating tests.

## Benefits

✅ **Human-Independent**: Runs reliably without manual intervention  
✅ **Self-Healing**: Automatically tries multiple strategies  
✅ **Debuggable**: Stores HTML of all interactions  
✅ **Stable**: Proper waits, retries, and validation  
✅ **Easy to Use**: Simple API for common operations  
✅ **Odoo-Optimized**: Pre-built helpers for Odoo-specific tasks  

## Next Steps

1. Install dependencies: `npm install`
2. Configure `.env` file
3. Review example test
4. Use QA Assistant prompt to create your tests
5. Run tests and review element storage reports

---

**This framework solves the selector reliability problem by using multiple fallback strategies and intelligent element finding, making it human-independent and suitable for non-technical teams.**
