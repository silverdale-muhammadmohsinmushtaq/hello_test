# Odoo-Specific Waiting Patterns

## The Problem

`waitForLoadState('networkidle')` times out in Odoo because:
- Odoo has continuous network activity (polling, updates)
- Network never becomes "idle"
- Tests fail with timeout errors

## Solution: Use These Patterns Instead

### 1. After Page Navigation

```javascript
// ❌ WRONG - Times out
await page.goto('https://odoo-server.com');
await page.waitForLoadState('networkidle');

// ✅ CORRECT - Works reliably
await page.goto('https://odoo-server.com');
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(2000); // Wait for Odoo to initialize
```

### 2. After Login

```javascript
// ❌ WRONG - Times out
await page.getByRole('button', { name: 'Log in' }).click();
await page.waitForLoadState('networkidle');

// ✅ CORRECT - Wait for specific element
await page.getByRole('button', { name: 'Log in' }).click();
// Wait for element that appears after login
await page.waitForSelector('.o_main_navbar, .o_menu_apps', { timeout: 30000 });
await page.waitForTimeout(2000); // Extra stabilization
```

### 3. After Menu Navigation

```javascript
// ❌ WRONG - Times out
await page.getByRole('menuitem', { name: 'Sales' }).click();
await page.waitForLoadState('networkidle');

// ✅ CORRECT - Wait for page structure
await page.getByRole('menuitem', { name: 'Sales' }).click();
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(1500); // Wait for menu to load
```

### 4. After Form Actions (Create, Save)

```javascript
// ❌ WRONG - Times out
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForLoadState('networkidle');

// ✅ CORRECT - Wait for loading to finish
await page.getByRole('button', { name: 'Save' }).click();
// Wait for loading indicator to disappear
await page.waitForSelector('.o_loading', { state: 'hidden', timeout: 30000 }).catch(() => {});
await page.waitForTimeout(2000); // Wait for notification
```

### 5. Before Interacting with Elements

```javascript
// ❌ WRONG - Element might not be ready
await page.locator('input[name="name"]').fill('Product');

// ✅ CORRECT - Wait for element first
await page.waitForSelector('input[name="name"]', { state: 'visible', timeout: 30000 });
await page.locator('input[name="name"]').fill('Product');
```

### 6. For Dynamic Content

```javascript
// ❌ WRONG - Page might not be ready
await page.getByRole('button', { name: 'Create' }).click();

// ✅ CORRECT - Wait for form to be ready
await page.getByRole('button', { name: 'Create' }).click();
await page.waitForSelector('.o_form_view', { timeout: 30000 });
await page.waitForTimeout(1000);
```

## Complete Login Pattern

```javascript
test.beforeEach(async ({ page }) => {
  // Navigate
  await page.goto(SERVER_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  
  // Login
  await page.locator('input[name="login"]').fill(USERNAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();
  
  // Wait for login success - use specific selector
  await page.waitForSelector('.o_main_navbar, .o_menu_apps', { timeout: 30000 });
  await page.waitForTimeout(2000); // Stabilization
});
```

## Complete Form Fill Pattern

```javascript
// Navigate to form
await page.getByRole('menuitem', { name: 'Menu' }).click();
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(1500);

// Create new
await page.getByRole('button', { name: 'Create' }).click();
await page.waitForSelector('.o_form_view', { timeout: 30000 });
await page.waitForTimeout(1000);

// Fill fields (wait for each if needed)
await page.waitForSelector('input[name="field1"]', { state: 'visible', timeout: 30000 });
await page.locator('input[name="field1"]').fill('value1');

await page.locator('input[name="field2"]').fill('value2');

// Save
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForSelector('.o_loading', { state: 'hidden', timeout: 30000 }).catch(() => {});
await page.waitForTimeout(2000);

// Verify
await expect(page.locator('.o_notification')).toBeVisible({ timeout: 10000 });
```

## Key Selectors for Odoo

Use these to detect when Odoo is ready:

```javascript
// After login - wait for navbar or menu
await page.waitForSelector('.o_main_navbar, .o_menu_apps', { timeout: 30000 });

// Form view ready
await page.waitForSelector('.o_form_view', { timeout: 30000 });

// List view ready
await page.waitForSelector('.o_list_view', { timeout: 30000 });

// Loading finished
await page.waitForSelector('.o_loading', { state: 'hidden', timeout: 30000 }).catch(() => {});

// Notification appeared
await page.waitForSelector('.o_notification', { timeout: 10000 });
```

## Timeout Guidelines

- **Page navigation**: 2000ms
- **Menu navigation**: 1500ms
- **Form actions**: 1000-2000ms
- **Element waits**: 30000ms (30 seconds)
- **Notification waits**: 10000ms (10 seconds)

## Common Patterns Summary

| Action | Wait Pattern |
|--------|-------------|
| After `goto()` | `domcontentloaded` + `waitForTimeout(2000)` |
| After login | `waitForSelector('.o_main_navbar')` + `waitForTimeout(2000)` |
| After menu click | `domcontentloaded` + `waitForTimeout(1500)` |
| After Create/Save | `waitForSelector('.o_loading', { state: 'hidden' })` + `waitForTimeout(2000)` |
| Before element interaction | `waitForSelector('element', { state: 'visible' })` |

## Remember

- ✅ Use `domcontentloaded` + `waitForTimeout` instead of `networkidle`
- ✅ Use `waitForSelector` for specific elements
- ✅ Add timeouts (1000-2000ms) for Odoo to stabilize
- ✅ Wait for loading indicators to disappear
- ❌ Never use `waitForLoadState('networkidle')` in Odoo
