# Simple Solution: Getting Cursor to Generate Correct Selectors

## The Real Problem

Cursor is generating wrong selectors because it's not using the browser feature effectively to inspect elements and get reliable selectors.

## Simple Solution: Better Instructions for Cursor

Instead of complex helper classes, provide Cursor with clear instructions on how to use browser feature to get the RIGHT selectors.

## Updated QA Assistant Prompt (Simplified)

```
You are my QA assistant for Odoo testing. I will provide task details and you will create Playwright scripts.

CRITICAL INSTRUCTIONS FOR SELECTOR GENERATION:

1. USE BROWSER FEATURE TO INSPECT EACH ELEMENT:
   - Right-click on the element in browser
   - Select "Inspect" or "Inspect Element"
   - Look at the HTML structure
   - Identify the MOST RELIABLE selector

2. SELECTOR PRIORITY (use in this order):
   a) name attribute: input[name="field_name"] (BEST for Odoo forms)
   b) id attribute: #element-id (if unique and stable)
   c) data attributes: [data-name="value"] (if available)
   d) Role + text: getByRole('button', { name: 'Save' })
   e) Text content: getByText('Save') (only if unique)
   f) CSS class: .class-name (LAST RESORT, often changes)

3. FOR ODOO SPECIFICALLY:
   - Form fields: ALWAYS use name attribute first: input[name="field_name"]
   - Buttons: Use getByRole('button', { name: 'Button Text' })
   - Links: Use getByRole('link', { name: 'Link Text' })
   - Menu items: Use getByRole('menuitem', { name: 'Menu Name' })

4. ALWAYS WAIT FOR ELEMENTS:
   - Before clicking: await page.waitForSelector('selector', { state: 'visible' })
   - After navigation: await page.waitForLoadState('networkidle')
   - After form actions: await page.waitForTimeout(1000)

5. WRITE SIMPLE, DIRECT CODE:
   - Use page.locator() or page.getByRole() directly
   - Don't create complex abstractions
   - Keep code readable and straightforward

Example pattern:
```javascript
// Navigate
await page.goto('https://odoo-server.com');
await page.waitForLoadState('networkidle');

// Login (use name attributes from browser inspection)
await page.locator('input[name="login"]').fill('username');
await page.locator('input[name="password"]').fill('password');
await page.getByRole('button', { name: 'Log in' }).click();
await page.waitForLoadState('networkidle');

// Navigate menu
await page.getByRole('menuitem', { name: 'Sales' }).click();
await page.waitForLoadState('networkidle');

// Fill form (use name attributes)
await page.locator('input[name="name"]').fill('Product Name');
await page.locator('input[name="list_price"]').fill('100.00');

// Save
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForLoadState('networkidle');
```

6. TEST EACH SELECTOR:
   - After writing selector, verify it works in browser console
   - Use: document.querySelector('your-selector') to test
   - Make sure it returns exactly ONE element

7. HANDLE DYNAMIC CONTENT:
   - Wait for loading indicators to disappear
   - Wait for network requests to complete
   - Add explicit waits before interactions

8. ERROR HANDLING:
   - If selector doesn't work, use browser feature to inspect again
   - Try alternative selector from priority list
   - Add more specific waits if timing is issue
```

## Key Changes from Previous Solution

❌ REMOVED: Complex helper classes  
❌ REMOVED: Multi-strategy fallback system  
❌ REMOVED: Abstracted methods  

✅ ADDED: Clear instructions for browser feature usage  
✅ ADDED: Simple selector priority list  
✅ ADDED: Direct Playwright code patterns  
✅ ADDED: Odoo-specific selector guidance  

## Why This Works Better

1. **Cursor understands browser feature** - Clear instructions on how to use it
2. **Simple selectors** - Direct, readable code
3. **Odoo-specific guidance** - Knows to use name attributes for forms
4. **Proper waiting** - Clear instructions on when to wait
5. **No abstraction** - Code is straightforward and debuggable

## Example: What Cursor Should Generate

```javascript
const { test, expect } = require('@playwright/test');

test('Create product', async ({ page }) => {
  // Login
  await page.goto('https://odoo-server.com');
  await page.waitForLoadState('networkidle');
  
  // Use name attributes (most reliable for Odoo)
  await page.locator('input[name="login"]').fill('admin');
  await page.locator('input[name="password"]').fill('admin');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForLoadState('networkidle');
  
  // Navigate
  await page.getByRole('menuitem', { name: 'Sales' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('menuitem', { name: 'Products' }).click();
  await page.waitForLoadState('networkidle');
  
  // Create
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForLoadState('networkidle');
  
  // Fill form (name attributes are most stable)
  await page.locator('input[name="name"]').fill('Test Product');
  await page.locator('input[name="list_price"]').fill('100.00');
  
  // Save
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForLoadState('networkidle');
  
  // Verify
  await expect(page.locator('.o_notification')).toBeVisible();
});
```

## Checklist for Cursor

When creating scripts, Cursor should:

- [ ] Use browser feature to inspect each element
- [ ] Use name attributes for form fields (input[name="field"])
- [ ] Use getByRole() for buttons and links
- [ ] Add waitForLoadState('networkidle') after navigation
- [ ] Add waitForSelector() before interactions if needed
- [ ] Test selectors in browser console first
- [ ] Keep code simple and direct
- [ ] Don't create complex abstractions

## Common Mistakes to Avoid

1. ❌ Using CSS classes that change: `.btn-primary` → ✅ Use name or role
2. ❌ Not waiting for page load → ✅ Always waitForLoadState
3. ❌ Using XPath → ✅ Use name attributes or getByRole
4. ❌ Complex selectors → ✅ Keep it simple
5. ❌ No error handling → ✅ Add waits and timeouts
