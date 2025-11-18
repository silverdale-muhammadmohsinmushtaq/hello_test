# BPS Team Guide: Using Playwright Automation for Odoo Testing

## Overview

This guide is designed for the Business Process Specialist (BPS) team to use the automated Playwright testing framework for Odoo UAT and QA. The framework is designed to be **human-independent** and requires minimal technical knowledge.

## What This Framework Does

1. **Automatically finds elements** using multiple strategies (no need to worry about selectors)
2. **Handles dynamic content** and waits for elements to appear
3. **Stores HTML of all interacted elements** for debugging
4. **Retries failed actions** automatically
5. **Provides clear error messages** when something goes wrong

## Prerequisites

1. Node.js installed on your system
2. Access to the Odoo server
3. Valid Odoo credentials

## Setup (One-time)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Fill in your Odoo server details:
     ```
     ODOO_URL=https://your-odoo-server.com
     ODOO_USER=your_username
     ODOO_PASSWORD=your_password
     ODOO_DATABASE=your_database (optional)
     ```

## How to Use

### Step 1: Provide Task Titan Details

When you have a new task to test, provide the following information to the QA Assistant (Cursor):

1. **Task Description**
2. **Manual Test Scripts** (from Task Titan)
3. **Problem Statement**
4. **Description**
5. **User Story**
6. **Odoo Server link**
7. **Odoo user**
8. **Odoo password**
9. **Spec file path** (where the test script will be saved)

### Step 2: Let the QA Assistant Work

After providing all information, write: **"Go Ahead QA Assistant"**

The assistant will:
- Understand the task by exploring the Odoo interface
- Create Playwright test scripts
- Execute and test the scripts
- Fix any issues automatically
- Save the final scripts to your specified file

### Step 3: Run the Tests

Once the scripts are ready, run them using:

```bash
# Run tests in headed mode (you can see the browser)
npm run test:headed

# Or run specific test file
npx playwright test tests/your-test-file.spec.js --headed
```

### Step 4: Review Results

After tests run:
- **Test results** will be shown in the terminal
- **Screenshots** of failures will be saved automatically
- **Element storage reports** (HTML) will be saved in `element-storage/` folder
- **Test report** can be viewed with: `npm run test:report`

## Understanding Test Scripts

Even though you don't need to write scripts, understanding the structure helps:

### Basic Structure

```javascript
test('Test Name', async ({ page }) => {
  // Initialize utilities
  const utils = new PlaywrightUtils(page, 'test-name');
  
  // Login
  await utils.odooHelpers.login(url, user, password);
  
  // Perform actions
  await utils.odooHelpers.navigateToMenu('Menu > Submenu');
  await utils.odooHelpers.fillFormField('Field Name', 'Value');
  await utils.odooHelpers.clickButton('Save');
  
  // Verify results
  const notification = await utils.odooHelpers.waitForNotification();
});
```

### Common Actions

1. **Login:**
   ```javascript
   await utils.odooHelpers.login(url, username, password);
   ```

2. **Navigate to Menu:**
   ```javascript
   await utils.odooHelpers.navigateToMenu('Sales > Orders');
   ```

3. **Fill Form Field:**
   ```javascript
   await utils.odooHelpers.fillFormField('Customer Name', 'John Doe');
   ```

4. **Click Button:**
   ```javascript
   await utils.odooHelpers.clickButton('Save');
   ```

5. **Wait for Notification:**
   ```javascript
   await utils.odooHelpers.waitForNotification('Record saved');
   ```

## Troubleshooting

### Tests Fail Frequently

**Solution:** The framework automatically retries, but if failures persist:
1. Check if Odoo server is accessible
2. Verify credentials are correct
3. Check if the Odoo interface has changed
4. Review the element storage HTML reports to see what elements were found

### Elements Not Found

**Solution:** The framework uses multiple strategies to find elements:
- It tries data-testid first (most reliable)
- Falls back to role-based selectors
- Then text-based selectors
- Finally CSS/XPath

If elements still can't be found:
1. Check the element storage report to see what was attempted
2. Verify the element exists on the page
3. Check if there are timing issues (the framework handles this automatically)

### Scripts Are Too Slow

**Solution:** The framework includes delays for stability. If you need faster execution:
- Edit `playwright.config.js` and reduce `slowMo` value
- But be aware this may reduce reliability

## Best Practices

1. **Always run tests in headed mode first** to see what's happening
2. **Review element storage reports** if tests fail
3. **Keep test scripts simple** - let the framework handle complexity
4. **Use descriptive test names** that match your Task Titan
5. **One test = One user story** (when possible)

## Getting Help

If you encounter issues:

1. **Check the element storage HTML report** - it shows all elements the script tried to interact with
2. **Review test screenshots** - saved automatically on failure
3. **Check the terminal output** - error messages are descriptive
4. **Contact the technical team** with:
   - The test file that failed
   - The element storage HTML report
   - Screenshots (if any)

## File Structure

```
workspace/
├── playwright-utils/          # Framework utilities (don't modify)
│   ├── selector-strategy.js   # Smart element finding
│   ├── element-helpers.js     # Element interactions
│   ├── html-storage.js        # Element storage
│   ├── odoo-helpers.js        # Odoo-specific helpers
│   └── index.js               # Main export
├── tests/                      # Your test files go here
│   └── example-odoo-test.spec.js
├── element-storage/            # Generated HTML reports
├── playwright.config.js       # Playwright configuration
└── package.json               # Dependencies
```

## Summary

- **You don't need to write code** - the QA Assistant does it
- **You don't need to worry about selectors** - the framework finds elements automatically
- **Tests are stable** - automatic retries and smart waiting
- **Everything is logged** - element storage reports show what happened
- **Human-independent** - runs reliably without manual intervention

Just provide the Task Titan details and say "Go Ahead QA Assistant"!
