# Workflow Checklist: Generating Test Scripts

## Pre-Flight Checklist

Before you start, make sure:

- [ ] Framework files are in place
- [ ] `FIXED_QA_PROMPT.md` exists and is readable
- [ ] `tests/` directory exists (`mkdir -p tests`)
- [ ] Playwright is installed (`npm install && npx playwright install`)
- [ ] You have all Task Titan details ready

## Generation Workflow

### Phase 1: Setup (5 minutes)

```
□ Open Cursor IDE
□ Navigate to workspace directory
□ Open new chat/conversation
□ Have FIXED_QA_PROMPT.md ready to copy
```

### Phase 2: Provide Instructions (2 minutes)

```
□ Copy entire content from FIXED_QA_PROMPT.md
□ Paste into Cursor chat
□ Send message
```

### Phase 3: Provide Task Details (3 minutes)

```
□ Task Description: [your description]
□ Manual Test Scripts: [your test steps]
□ Problem Statement: [your problem]
□ Description: [your description]
□ User Story: [your user story]
□ Odoo Server: [your server URL]
□ Odoo User: [your username]
□ Odoo Password: [your password]
□ Spec File: tests/[your-filename].spec.js
```

**Send all this information to Cursor**

### Phase 4: Generate Script (Wait for Cursor)

```
□ Type: "Go Ahead QA Assistant"
□ Wait for Cursor to:
  - Use browser feature to explore
  - Generate Playwright script
  - Write to your spec file
```

### Phase 5: Review Generated Code (5 minutes)

Check the generated script has:

```
□ Uses input[name="..."] for form fields
□ Uses getByRole('button', { name: '...' }) for buttons
□ Uses getByRole('menuitem', { name: '...' }) for menus
□ Has waitForLoadState('networkidle') after navigation
□ Has waitForLoadState('networkidle') after login
□ Has waitForLoadState('networkidle') after menu clicks
□ Has waitForLoadState('networkidle') after Save
□ Code is simple and readable
□ No complex CSS selectors (.btn-primary)
□ No XPath selectors (//button[...])
```

### Phase 6: Test Execution (5 minutes)

```
□ Run: npx playwright test tests/[your-file].spec.js --headed
□ Watch browser window
□ Verify all steps execute correctly
□ Check test passes ✅
```

### Phase 7: Fix Issues (if needed)

If test fails:

```
□ Note the error message
□ Identify which element failed
□ Ask Cursor: "The selector for [element] failed. 
   Use browser feature to inspect it again and fix."
□ Re-run test
□ Repeat until test passes
```

## Success Criteria

Your test script is ready when:

- ✅ Test runs without errors
- ✅ All steps execute correctly
- ✅ Test passes consistently (run 2-3 times)
- ✅ Code uses correct selectors (name attributes, getByRole)
- ✅ Proper waits are in place

## Quick Reference

### Files to Use

| File | Purpose |
|------|---------|
| `FIXED_QA_PROMPT.md` | Copy this prompt to Cursor |
| `correct-approach-example.spec.js` | Reference for good code |
| `STEP_BY_STEP_GUIDE.md` | Detailed instructions |
| `QUICK_START.md` | 5-minute quick start |

### Key Commands

```bash
# Create tests directory
mkdir -p tests

# Run single test
npx playwright test tests/my-test.spec.js --headed

# Run all tests
npx playwright test --headed

# Debug mode
npx playwright test tests/my-test.spec.js --debug
```

### What to Tell Cursor

**If selectors are wrong:**
```
"Use browser feature to inspect [element name] and use the name attribute or getByRole"
```

**If test is too fast:**
```
"Add waitForLoadState('networkidle') after navigation and form submissions"
```

**If code is too complex:**
```
"Keep code simple, use direct Playwright methods like page.locator() and page.getByRole()"
```

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Wrong selectors | Remind Cursor to use browser feature |
| Element not found | Ask Cursor to inspect again |
| Test too fast | Add more waits |
| Complex code | Ask for simpler code |
| CSS classes used | Ask to use name attributes or getByRole |

## Next Steps After Success

1. ✅ Test script works
2. ✅ Document any special requirements
3. ✅ Share with BPS team
4. ✅ Add to test suite
5. ✅ Run regularly in CI/CD (optional)
