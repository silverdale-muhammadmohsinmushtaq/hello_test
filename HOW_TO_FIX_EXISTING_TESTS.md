# How to Fix Your Existing Failing Tests

## Your Current Problems

1. ✅ Tests timing out at `waitForLoadState('networkidle')`
2. ✅ Login not completing properly
3. ✅ Menu search not being found

## Quick Fix Guide

### Problem 1: Login Timeout

**Current (WRONG):**
```javascript
await page.goto(SERVER_URL);
await page.waitForLoadState('networkidle'); // ❌ Times out

await page.getByRole('button', { name: 'Log in' }).click();
await page.waitForLoadState('networkidle'); // ❌ Times out
```

**Fixed (CORRECT):**
```javascript
await page.goto(SERVER_URL);
await page.waitForLoadState('domcontentloaded'); // ✅
await page.waitForTimeout(2000); // ✅

await page.getByRole('button', { name: 'Log in' }).click();
await page.waitForSelector('.o_main_navbar, .o_menu_apps', { timeout: 30000 }); // ✅
await page.waitForTimeout(2000); // ✅
```

### Problem 2: Menu Search Not Found

**Current (WRONG):**
```javascript
const menuSearch = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
await menuSearch.click(); // ❌ Element not found
```

**Fixed (CORRECT):**

**Option 1: Use menu toggle button**
```javascript
// Click menu toggle first
await page.locator('.o_menu_toggle, button[aria-label*="menu" i]').click();
await page.waitForTimeout(500);

// Then search or navigate
await page.getByRole('menuitem', { name: 'Purchase' }).click();
```

**Option 2: Wait for search to be visible**
```javascript
await page.waitForSelector('input[type="search"]', { state: 'visible', timeout: 30000 });
await page.locator('input[type="search"]').first().click();
await page.waitForTimeout(500);
await page.getByRole('option', { name: 'Purchase' }).click();
```

**Option 3: Navigate directly without search**
```javascript
// If menu is visible, navigate directly
await page.getByRole('menuitem', { name: 'Purchase' }).click();
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(1500);
```

### Problem 3: All Navigation Timeouts

**Replace ALL instances of:**
```javascript
await page.waitForLoadState('networkidle'); // ❌
```

**With:**
```javascript
await page.waitForLoadState('domcontentloaded'); // ✅
await page.waitForTimeout(1500); // ✅ (adjust time as needed)
```

## Complete Fixed beforeEach Pattern

```javascript
test.beforeEach(async ({ page }) => {
  // ✅ FIXED: Use domcontentloaded + timeout
  await page.goto(SERVER_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  
  // Login
  await page.locator('input[name="login"]').fill(USERNAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();
  
  // ✅ FIXED: Wait for specific element after login
  await page.waitForSelector('.o_main_navbar, .o_menu_apps', { timeout: 30000 });
  await page.waitForTimeout(2000);
});
```

## Step-by-Step Fix Process

### Step 1: Find and Replace All `networkidle`

In your test file, find:
```javascript
waitForLoadState('networkidle')
```

Replace with:
```javascript
waitForLoadState('domcontentloaded')
await page.waitForTimeout(2000); // Add this line after
```

### Step 2: Fix Login Pattern

Find your login code and replace with the fixed pattern above.

### Step 3: Fix Menu Navigation

Replace menu search/navigation with direct menu clicks:
```javascript
// Instead of search, use direct navigation
await page.getByRole('menuitem', { name: 'Purchase' }).click();
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(1500);
```

### Step 4: Fix Form Actions

After Save/Create buttons:
```javascript
await page.getByRole('button', { name: 'Save' }).click();
// ✅ Wait for loading to finish
await page.waitForSelector('.o_loading', { state: 'hidden', timeout: 30000 }).catch(() => {});
await page.waitForTimeout(2000);
```

### Step 5: Test

Run your tests:
```bash
npx playwright test processes/purchasedeposite.spec.js --headed --workers 1
```

## Automated Fix Script

You can use find/replace in your editor:

**Find:**
```javascript
await page.waitForLoadState('networkidle');
```

**Replace with:**
```javascript
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(2000);
```

**Then manually fix:**
- Login pattern (use `waitForSelector` for navbar)
- Menu search (use direct menu navigation)
- Form actions (wait for `.o_loading` to disappear)

## Verification Checklist

After fixing, verify:

- [ ] No `waitForLoadState('networkidle')` in code
- [ ] Login uses `waitForSelector('.o_main_navbar')`
- [ ] All navigation uses `domcontentloaded` + `waitForTimeout`
- [ ] Menu navigation doesn't use search (or waits for search properly)
- [ ] Form actions wait for `.o_loading` to disappear
- [ ] Tests run without timeout errors

## Still Having Issues?

1. **Increase timeouts:**
   ```javascript
   await page.waitForTimeout(3000); // Increase from 2000 to 3000
   ```

2. **Add more specific waits:**
   ```javascript
   await page.waitForSelector('.o_form_view', { timeout: 30000 });
   ```

3. **Check element selectors:**
   - Use browser feature to verify selectors
   - Test in browser console: `document.querySelector('your-selector')`

4. **Run in debug mode:**
   ```bash
   npx playwright test --debug
   ```

## Reference Files

- `UPDATED_QA_PROMPT.md` - Use this for future test generation
- `ODOO_WAITING_PATTERNS.md` - All waiting patterns
- `fixed-login-example.spec.js` - Complete working example
