# Playwright Selector Best Practices for Odoo Testing

## Problem Statement
Playwright scripts fail frequently due to incorrect selectors. Elements are difficult to find or not found at all, making scripts unstable.

## Solution: Multi-Strategy Selector Approach

### Selector Priority Order (Most Stable to Least Stable)

1. **data-testid** (BEST) - Most stable, doesn't change with styling
   ```javascript
   { testId: 'save-button' } // Becomes [data-testid="save-button"]
   ```

2. **Role-based selectors** - Semantic and accessible
   ```javascript
   { role: 'button', text: 'Save' } // Uses getByRole()
   ```

3. **Text-based selectors** - Good for user-facing elements
   ```javascript
   { text: 'Save' } // Uses getByText()
   ```

4. **Label-based selectors** - Good for form fields
   ```javascript
   { label: 'Product Name' } // Uses getByLabel()
   ```

5. **CSS selectors** - Less stable but sometimes necessary
   ```javascript
   { css: 'button.btn-primary' }
   ```

6. **XPath** (LAST RESORT) - Most fragile, avoid if possible
   ```javascript
   { xpath: '//button[contains(@class, "btn-primary")]' }
   ```

## Implementation Strategy

### 1. Always Use Multiple Selector Strategies

**BAD:**
```javascript
await page.click('button.btn-primary'); // Single selector - fragile!
```

**GOOD:**
```javascript
await finder.clickElement({
  testId: 'save-button',
  role: 'button',
  text: 'Save',
  css: 'button.btn-primary'
}, { description: 'Save button' });
```

### 2. Use StableElementFinder Helper

The `StableElementFinder` class automatically tries multiple selectors in order:
- Tries each selector strategy sequentially
- Retries with delays if element not found
- Provides clear error messages
- Handles visibility checks

### 3. Wait Strategies

**Always wait for elements to be ready:**
```javascript
// Wait for form to be ready
await odoo.waitForFormReady();

// Wait for element to be stable (not moving)
await finder.waitForStable(selectors, { stableTime: 500 });
```

### 4. Retry Logic

Built into `StableElementFinder`:
- Default: 3 retries
- 1 second delay between retries
- Tries all selector strategies on each retry

### 5. Odoo-Specific Considerations

#### Form Fields
Odoo fields can be:
- Regular inputs
- Many2one fields (with autocomplete)
- Many2many fields (with tags)
- Date pickers
- Rich text editors

Use `odoo.fillFormField()` which handles all these cases.

#### Dynamic Content
Odoo loads content dynamically. Always:
```javascript
await page.waitForLoadState('networkidle');
await page.waitForSelector('.o_loading', { state: 'hidden' });
```

#### Menu Navigation
Odoo menus can be nested. Use:
```javascript
await odoo.navigateToMenu(['Sales', 'Products', 'Products']);
```

## Best Practices Checklist

- [ ] Always provide multiple selector strategies
- [ ] Use data-testid when possible (most stable)
- [ ] Prefer role-based selectors over CSS
- [ ] Wait for elements to be ready before interacting
- [ ] Use retry logic for flaky elements
- [ ] Scroll elements into view before interaction
- [ ] Wait for network idle after navigation
- [ ] Handle Odoo-specific loading states
- [ ] Use descriptive error messages
- [ ] Test in headed mode first for debugging

## Common Pitfalls to Avoid

1. **Single CSS selector** - Breaks when styles change
2. **No waiting** - Elements not ready when script runs
3. **Hardcoded XPath** - Most fragile selector type
4. **No retry logic** - Fails on temporary delays
5. **Ignoring loading states** - Interacts before page ready
6. **Not scrolling** - Element not in viewport
7. **Assuming element visibility** - Element exists but hidden

## Debugging Tips

1. **Run in headed mode** - See what's happening
2. **Use Playwright Inspector** - `npx playwright test --debug`
3. **Add screenshots** - See state when test fails
4. **Check console logs** - Odoo errors in browser console
5. **Slow down actions** - Use `slowMo` in config
6. **Verify selectors** - Use browser DevTools to test selectors

## Example: Complete Test Flow

```javascript
test('Create product', async ({ page }) => {
  const odoo = new OdooHelpers(page);
  
  // 1. Login
  await odoo.login(username, password, serverUrl);
  
  // 2. Navigate (waits for menu to be ready)
  await odoo.navigateToMenu(['Sales', 'Products']);
  
  // 3. Create new (waits for form to be ready)
  await odoo.createNew();
  
  // 4. Fill fields (handles all field types)
  await odoo.fillFormField('name', 'Test Product');
  await odoo.fillFormField('list_price', '100.00');
  
  // 5. Save (waits for save to complete)
  await odoo.saveForm();
  
  // 6. Verify (waits for success indicator)
  await expect(page.locator('.o_notification')).toBeVisible();
});
```

## Making Scripts Human-Independent

1. **Automatic retries** - No manual intervention needed
2. **Multiple selector fallbacks** - Handles UI changes
3. **Clear error messages** - Easy to understand failures
4. **Self-healing** - Tries alternatives automatically
5. **Comprehensive waiting** - Handles timing issues
6. **Stable helpers** - Reusable, tested code
