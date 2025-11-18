# ACTION REQUIRED: Fix Your Tests Now

## 🚨 Your Tests Are Failing - Here's How to Fix

### Problem: All tests timeout at `waitForLoadState('networkidle')`

## ⚡ Quick Fix (5 minutes)

### Step 1: Open Your Test File
```bash
processes/purchasedeposite.spec.js
```

### Step 2: Find and Replace (Do this for ALL occurrences)

**Find:**
```javascript
await page.waitForLoadState('networkidle');
```

**Replace with:**
```javascript
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(2000);
```

### Step 3: Fix Login Pattern

**Find your beforeEach login code (around line 10-18):**

**Replace this:**
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto(SERVER_URL);
  await page.waitForLoadState('networkidle');
  
  await page.locator('input[name="login"]').fill(USERNAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForLoadState('networkidle'); // ❌ This times out
});
```

**With this:**
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto(SERVER_URL);
  await page.waitForLoadState('domcontentloaded'); // ✅
  await page.waitForTimeout(2000); // ✅
  
  await page.locator('input[name="login"]').fill(USERNAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();
  
  // ✅ Wait for element that appears after login
  await page.waitForSelector('.o_main_navbar, .o_menu_apps', { timeout: 30000 });
  await page.waitForTimeout(2000); // ✅
});
```

### Step 4: Fix Menu Search (around line 200)

**Find:**
```javascript
const menuSearch = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
await menuSearch.click();
```

**Replace with:**
```javascript
// Option 1: Navigate directly (if menu is visible)
await page.getByRole('menuitem', { name: 'Purchase' }).click();
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(1500);

// OR Option 2: Wait for search first
await page.waitForSelector('input[type="search"]', { state: 'visible', timeout: 30000 });
await page.locator('input[type="search"]').first().click();
await page.waitForTimeout(500);
await page.getByRole('option', { name: 'Purchase' }).click();
```

### Step 5: Test

```bash
npx playwright test processes/purchasedeposite.spec.js --headed --workers 1
```

## ✅ Should Work Now!

## 📚 For More Details

- **Complete fix guide**: `HOW_TO_FIX_EXISTING_TESTS.md`
- **Waiting patterns**: `ODOO_WAITING_PATTERNS.md`
- **Working example**: `fixed-login-example.spec.js`

## 🔮 For Future Tests

Use `UPDATED_QA_PROMPT.md` instead of the old prompt. It ensures:
- ✅ Complete scenario execution first
- ✅ Testing and fixing after writing
- ✅ Correct waiting patterns

---

## Summary

**The Fix:**
1. Replace `networkidle` → `domcontentloaded` + `waitForTimeout(2000)`
2. Fix login: Use `waitForSelector('.o_main_navbar')` after login
3. Fix menu: Use direct navigation or wait for search properly

**That's it!** Your tests should pass now. ✅
