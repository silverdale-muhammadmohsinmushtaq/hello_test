# Integration Guide: Stable Playwright Framework

## Overview

This guide explains how to integrate the stable Playwright framework into your existing Cursor-based QA automation workflow.

## Problem Solved

**Before:** Playwright scripts fail frequently due to:
- Wrong selectors being chosen
- Elements not found
- Flaky tests requiring manual fixes
- BPS team unable to run tests independently

**After:** Stable, reliable scripts with:
- Multiple selector strategies (automatic fallbacks)
- Built-in retry logic
- Odoo-specific helpers
- Human-independent operation

## Integration Steps

### Step 1: Install Dependencies

```bash
cd /workspace
npm install
npx playwright install chromium
```

### Step 2: Update Your QA Assistant Prompt

Use the updated prompt template from `QA_ASSISTANT_PROMPT_TEMPLATE.md` when instructing Cursor to create Playwright scripts.

**Key Changes:**
- Always use `OdooHelpers` and `StableElementFinder`
- Mandatory multi-strategy selectors
- Never use single CSS selectors
- Always wait for readiness

### Step 3: Create Test Directory

```bash
mkdir -p tests
```

Your test files will go in the `tests/` directory.

### Step 4: Provide Context to Cursor

When asking Cursor to create tests, ensure:

1. **Reference the helpers:**
   ```
   Use the OdooHelpers and StableElementFinder classes from playwright-helpers.js
   ```

2. **Specify selector requirements:**
   ```
   Always use multiple selector strategies for every element interaction
   ```

3. **Specify the spec file:**
   ```
   Write the test in tests/my-test.spec.js
   ```

### Step 5: Run Tests

```bash
# Run in headed mode (see browser)
npm run test:headed

# Debug mode (step through)
npm run test:debug
```

## Workflow Integration

### Current Workflow

1. Provide Task Titan details to Cursor
2. Cursor creates Playwright scripts
3. Scripts fail due to wrong selectors ❌
4. Manual fixes required ❌

### New Workflow

1. Provide Task Titan details to Cursor
2. **Cursor uses helpers and multi-strategy selectors** ✅
3. Scripts are stable and reliable ✅
4. BPS team can run independently ✅

## Example: Complete Task Flow

### Input to Cursor

```
Task Description: Create a new product in Odoo
Manual Test Scripts:
  1. Navigate to Sales > Products > Products
  2. Click Create button
  3. Fill Product Name: "Test Product"
  4. Fill Sale Price: "100.00"
  5. Click Save
  6. Verify success message appears

Odoo Server: https://odoo.example.com
Username: admin
Password: admin123
Spec File: tests/create-product.spec.js
```

### Expected Output from Cursor

```javascript
const { test, expect } = require('@playwright/test');
const { OdooHelpers } = require('../playwright-helpers');

test.describe('Create Product', () => {
  let odoo;

  test.beforeEach(async ({ page }) => {
    odoo = new OdooHelpers(page);
    await odoo.login('admin', 'admin123', 'https://odoo.example.com');
  });

  test('Create new product with name and price', async ({ page }) => {
    // Navigate using menu path
    await odoo.navigateToMenu(['Sales', 'Products', 'Products']);
    
    // Create new record
    await odoo.createNew();
    
    // Fill form fields (uses multiple selector strategies internally)
    await odoo.fillFormField('name', 'Test Product');
    await odoo.fillFormField('list_price', '100.00');
    
    // Save form
    await odoo.saveForm();
    
    // Verify success
    await expect(page.locator('.o_notification')).toBeVisible({ timeout: 10000 });
  });
});
```

## Key Benefits

### For Cursor AI
- Clear guidelines on selector usage
- Reusable helper classes
- Consistent script structure
- Less guesswork, more reliability

### For BPS Team
- Scripts work without manual fixes
- Clear error messages
- Can run tests independently
- No technical knowledge required

### For QA Process
- Faster test creation
- More reliable tests
- Less maintenance
- Better coverage

## Troubleshooting

### Cursor Still Creates Single Selectors

**Solution:** Be explicit in your prompt:
```
CRITICAL: Use OdooHelpers class for all interactions. 
NEVER use page.click() or page.fill() directly.
ALWAYS use odoo.fillFormField() or odoo.clickButton().
```

### Tests Still Fail

**Check:**
1. Are helpers imported correctly?
2. Are multiple selector strategies provided?
3. Are waits in place?
4. Run in headed mode to see what's happening

### Elements Not Found

**Solution:** Add more selector strategies:
```javascript
await finder.clickElement({
  testId: 'button-id',
  role: 'button',
  text: 'Button Text',
  css: 'button.class-name',
  xpath: '//button[@class="class-name"]'
}, { description: 'Clear description here' });
```

## Best Practices

1. **Always use helpers** - Don't bypass OdooHelpers
2. **Multiple selectors** - Always provide fallbacks
3. **Wait for readiness** - Use waitForFormReady()
4. **Test in headed mode** - See what's happening
5. **Clear descriptions** - Help debug failures
6. **Retry logic** - Built into helpers, use it

## Migration from Old Scripts

### Old Script Pattern
```javascript
await page.goto('https://odoo.com');
await page.fill('input[name="login"]', 'admin');
await page.fill('input[name="password"]', 'admin');
await page.click('button[type="submit"]');
await page.click('button:has-text("Create")');
await page.fill('input[name="name"]', 'Product');
```

### New Script Pattern
```javascript
const odoo = new OdooHelpers(page);
await odoo.login('admin', 'admin', 'https://odoo.com');
await odoo.navigateToMenu(['Sales', 'Products']);
await odoo.createNew();
await odoo.fillFormField('name', 'Product');
await odoo.saveForm();
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Review helper classes
3. ✅ Update QA assistant prompt
4. ✅ Create first test with Cursor
5. ✅ Run test in headed mode
6. ✅ Verify stability
7. ✅ Train BPS team on running tests

## Support

- See `SELECTOR_BEST_PRACTICES.md` for detailed guidelines
- See `example-test.spec.js` for code examples
- See `README_AUTOMATION.md` for usage instructions
