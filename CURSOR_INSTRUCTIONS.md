# Instructions for Cursor: How to Generate Reliable Playwright Scripts

## The Problem

When generating Playwright scripts, Cursor often creates wrong selectors that fail. This document provides clear instructions to generate correct, reliable selectors.

## Step-by-Step Process

### 1. Use Browser Feature to Explore

**ALWAYS start by using browser feature:**
- Navigate to the Odoo page
- Manually perform the steps
- Observe the UI behavior
- Note any loading states or dynamic content

### 2. Inspect Each Element Before Writing Selector

**For EVERY element you need to interact with:**

1. **Right-click on the element** in browser
2. **Select "Inspect" or "Inspect Element"**
3. **Look at the HTML attributes:**
   - Does it have a `name` attribute? → Use that (BEST)
   - Does it have an `id` attribute? → Use that if unique
   - Does it have `data-*` attributes? → Use those
   - What is the element type? → Use getByRole() if appropriate

### 3. Selector Priority List

**Use selectors in this order (most reliable first):**

1. **name attribute** (BEST for Odoo forms)
   ```javascript
   await page.locator('input[name="field_name"]')
   ```

2. **id attribute** (if unique and stable)
   ```javascript
   await page.locator('#element-id')
   ```

3. **getByRole with name** (for buttons, links, etc.)
   ```javascript
   await page.getByRole('button', { name: 'Save' })
   ```

4. **data attributes**
   ```javascript
   await page.locator('[data-name="value"]')
   ```

5. **getByText** (only if text is unique)
   ```javascript
   await page.getByText('Unique Text')
   ```

6. **CSS class** (LAST RESORT - often changes)
   ```javascript
   await page.locator('.class-name')
   ```

### 4. Odoo-Specific Patterns

#### Form Fields
**ALWAYS use name attribute:**
```javascript
// GOOD ✅
await page.locator('input[name="name"]').fill('Product Name');
await page.locator('input[name="list_price"]').fill('100.00');
await page.locator('textarea[name="description"]').fill('Description');

// BAD ❌
await page.locator('.o_field_char input').fill('Product Name');
```

#### Buttons
**Use getByRole with button text:**
```javascript
// GOOD ✅
await page.getByRole('button', { name: 'Save' }).click();
await page.getByRole('button', { name: 'Create' }).click();

// BAD ❌
await page.locator('button.btn-primary').click();
```

#### Menu Items
**Use getByRole with menu item text:**
```javascript
// GOOD ✅
await page.getByRole('menuitem', { name: 'Sales' }).click();
await page.getByRole('menuitem', { name: 'Products' }).click();

// BAD ❌
await page.locator('a:has-text("Sales")').click();
```

#### Links
**Use getByRole:**
```javascript
// GOOD ✅
await page.getByRole('link', { name: 'View Details' }).click();
```

### 5. Always Wait Properly

**After every navigation:**
```javascript
await page.goto('https://odoo-server.com');
await page.waitForLoadState('networkidle'); // ALWAYS add this
```

**After every action that loads content:**
```javascript
await page.getByRole('menuitem', { name: 'Sales' }).click();
await page.waitForLoadState('networkidle'); // Wait for page to load
```

**Before interacting with elements:**
```javascript
// If element might not be ready
await page.waitForSelector('input[name="name"]', { state: 'visible' });
await page.locator('input[name="name"]').fill('Value');
```

**After form submissions:**
```javascript
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForLoadState('networkidle'); // Wait for save to complete
await page.waitForTimeout(1000); // Extra wait for Odoo notifications
```

### 6. Test Selectors in Browser Console

**Before writing the selector in code, test it:**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Test the selector:
   ```javascript
   document.querySelector('input[name="name"]')
   // Should return exactly ONE element
   ```

4. If it returns null or multiple elements, try a different selector

### 7. Code Structure Template

```javascript
const { test, expect } = require('@playwright/test');

test('Test name', async ({ page }) => {
  // 1. Navigate and login
  await page.goto('SERVER_URL');
  await page.waitForLoadState('networkidle');
  
  await page.locator('input[name="login"]').fill('USERNAME');
  await page.locator('input[name="password"]').fill('PASSWORD');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForLoadState('networkidle');
  
  // 2. Navigate to target page
  await page.getByRole('menuitem', { name: 'Menu' }).click();
  await page.waitForLoadState('networkidle');
  
  // 3. Perform actions
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForLoadState('networkidle');
  
  await page.locator('input[name="field1"]').fill('value1');
  await page.locator('input[name="field2"]').fill('value2');
  
  // 4. Save and verify
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  await expect(page.locator('.o_notification')).toBeVisible();
});
```

## Common Mistakes to Avoid

### ❌ Mistake 1: Using CSS Classes
```javascript
// BAD - CSS classes change
await page.locator('.btn-primary').click();
```
```javascript
// GOOD - Use role and text
await page.getByRole('button', { name: 'Save' }).click();
```

### ❌ Mistake 2: Not Waiting
```javascript
// BAD - Element might not be ready
await page.click('button');
```
```javascript
// GOOD - Wait for page to load
await page.waitForLoadState('networkidle');
await page.getByRole('button', { name: 'Save' }).click();
```

### ❌ Mistake 3: Using XPath
```javascript
// BAD - XPath is fragile
await page.locator('//button[@class="btn-primary"]').click();
```
```javascript
// GOOD - Use name or role
await page.getByRole('button', { name: 'Save' }).click();
```

### ❌ Mistake 4: Complex Selectors
```javascript
// BAD - Too complex, breaks easily
await page.locator('div.form-group > div.input-wrapper > input.form-control').fill('value');
```
```javascript
// GOOD - Simple name attribute
await page.locator('input[name="field_name"]').fill('value');
```

### ❌ Mistake 5: Assuming Element Visibility
```javascript
// BAD - Element might be hidden
await page.locator('input').fill('value');
```
```javascript
// GOOD - Wait for visibility
await page.waitForSelector('input[name="field"]', { state: 'visible' });
await page.locator('input[name="field"]').fill('value');
```

## Checklist for Every Script

When generating a Playwright script, ensure:

- [ ] Used browser feature to explore the page
- [ ] Inspected each element before writing selector
- [ ] Used name attributes for form fields
- [ ] Used getByRole() for buttons and links
- [ ] Added waitForLoadState('networkidle') after navigation
- [ ] Added waits before interactions if needed
- [ ] Tested selectors in browser console
- [ ] Code is simple and readable
- [ ] No complex CSS selectors
- [ ] No XPath selectors

## Debugging Tips

If a selector doesn't work:

1. **Use browser feature to inspect again**
   - Right-click → Inspect
   - Check if element has name attribute
   - Check if element is actually visible

2. **Test selector in console**
   ```javascript
   document.querySelector('your-selector')
   ```

3. **Try alternative selector**
   - If name doesn't work, try getByRole
   - If getByRole doesn't work, try getByText
   - Always test in console first

4. **Add more waits**
   - Element might not be ready yet
   - Add waitForSelector before interaction
   - Add waitForLoadState after navigation

5. **Check if element is in iframe**
   - Some Odoo elements might be in iframes
   - Use page.frameLocator() if needed

## Summary

**Key Principles:**
1. **Use browser feature** to inspect elements
2. **Use name attributes** for form fields (most reliable)
3. **Use getByRole()** for buttons and links
4. **Always wait** for pages to load
5. **Keep it simple** - avoid complex selectors
6. **Test selectors** in browser console first

**Remember:** The goal is to generate simple, reliable selectors that work consistently. Don't overcomplicate it.
