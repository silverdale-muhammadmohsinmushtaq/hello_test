# Quick Reference Guide for BPS Team

## Running Tests (Simple Steps)

### 1. Open Terminal
- Navigate to project folder: `cd /workspace`

### 2. Run Tests
```bash
npm run test:headed
```

This will:
- Open a browser window
- Run all tests automatically
- Show you what's happening
- Display results in terminal

### 3. Check Results
- ✅ Green = Test passed
- ❌ Red = Test failed
- Screenshots saved automatically on failure

## Common Commands

```bash
# Run all tests (see browser)
npm run test:headed

# Run specific test file
npx playwright test tests/my-test.spec.js --headed

# Debug mode (step through tests)
npm run test:debug
```

## What to Do If Test Fails

1. **Read the error message** - It tells you what went wrong
2. **Check the screenshot** - Saved in `test-results/` folder
3. **Note the test name** - Which test failed
4. **Contact technical team** - Share error message and screenshot

## Understanding Error Messages

### "Element not found"
- Element might have changed
- Page might not have loaded
- **Action:** Check screenshot, contact technical team

### "Timeout"
- Page took too long to load
- Element didn't appear in time
- **Action:** Check if Odoo server is running

### "Test failed"
- Something didn't work as expected
- **Action:** Check error details, share with technical team

## What You DON'T Need to Do

❌ Don't modify test code  
❌ Don't fix selectors  
❌ Don't understand technical details  
❌ Don't debug scripts  

## What the System Does Automatically

✅ Finds elements using multiple strategies  
✅ Retries on failures  
✅ Waits for pages to load  
✅ Handles timing issues  
✅ Takes screenshots on failure  

## Getting Help

1. Check error message
2. Look at screenshot
3. Note test name
4. Contact technical team with:
   - Test file name
   - Error message
   - Screenshot (if available)

## Tips

- **Run in headed mode** - Always use `--headed` to see what's happening
- **Be patient** - Tests wait for pages to load
- **Check results** - Look for green checkmarks
- **Save errors** - Copy error messages for technical team

## Example Session

```bash
$ npm run test:headed

Running 3 tests using 1 worker

  ✓ tests/create-product.spec.js:5:3 › Create Product › Create new product (45s)
  ✓ tests/edit-product.spec.js:5:3 › Edit Product › Update product price (38s)
  ✗ tests/delete-product.spec.js:5:3 › Delete Product › Remove product (52s)

  2 passed (2m 15s)
  1 failed (52s)
```

In this example:
- 2 tests passed ✅
- 1 test failed ❌
- Check `test-results/` folder for screenshot of failed test
